import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS planner_data (
      user_id VARCHAR(255) NOT NULL,
      key VARCHAR(255) NOT NULL,
      value JSONB,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, key)
    );
  `;
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    await ensureTable();
    const result = await sql`
      SELECT key, value FROM planner_data WHERE user_id = ${userId}
    `;
    
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("PG GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, key, value } = await req.json();

    if (!userId || !key) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await ensureTable();
    
    await sql`
      INSERT INTO planner_data (user_id, key, value, updated_at)
      VALUES (${userId}, ${key}, ${JSON.stringify(value)}::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, key)
      DO UPDATE SET 
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PG POST Error:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
