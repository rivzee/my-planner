import { useState } from "react";

interface AISuggesterProps {
  type: "mingguan" | "tahunan";
  contextData: any;
  onAdd: (text: string) => void;
  accentColor?: string;
  buttonLabel?: string;
}

export default function AISuggester({ type, contextData, onAdd, accentColor = "var(--theme-accent)", buttonLabel = "✨ Rekomendasi AI" }: AISuggesterProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-suggester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, contextData }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuggestions(data.suggestions || []);
      setAddedItems({});
    } catch (err: any) {
      setError(err.message || "Gagal mendapatkan rekomendasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={fetchSuggestions}
        disabled={loading}
        style={{
          background: loading ? "var(--theme-surface-2)" : `rgba(from ${accentColor} 0.1)`, // fallback to low opacity
          color: loading ? "var(--theme-muted)" : accentColor,
          border: `1px solid ${loading ? "transparent" : accentColor}`,
          borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600,
          cursor: loading ? "wait" : "pointer", transition: "all 0.2s",
          width: "100%", textAlign: "center", display: "block"
        }}
      >
        {loading ? "Menganalisa..." : buttonLabel}
      </button>

      {error && <div style={{ color: "var(--theme-coral)", fontSize: 12, marginTop: 8 }}>{error}</div>}

      {suggestions.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {suggestions.map((suggestion, idx) => (
            <div key={idx} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10,
              background: "var(--theme-surface)", border: "1px solid var(--theme-border)",
              borderRadius: 8, padding: "10px 12px"
            }}>
              <span style={{ fontSize: 13, color: "var(--theme-ink)", lineHeight: 1.5, flex: 1 }}>{suggestion}</span>
              <button
                onClick={() => {
                  onAdd(suggestion);
                  setAddedItems(prev => ({ ...prev, [idx]: true }));
                }}
                disabled={addedItems[idx]}
                style={{
                  background: addedItems[idx] ? "transparent" : "var(--theme-surface-2)",
                  color: addedItems[idx] ? "var(--theme-muted)" : accentColor,
                  border: addedItems[idx] ? "1px solid var(--theme-border)" : `1px solid ${accentColor}`,
                  borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: 700,
                  cursor: addedItems[idx] ? "default" : "pointer"
                }}
              >
                {addedItems[idx] ? "✔" : "+ Tambah"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
