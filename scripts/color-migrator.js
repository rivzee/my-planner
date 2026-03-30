const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'app');
const componentsPath = path.join(__dirname, '..', 'components');

const mappings = {
  "#F5F2ED": "var(--color-planner-bg)",
  "#FDFCFA": "var(--color-planner-surface)",
  "#1A1814": "var(--color-planner-ink)",
  "#2D5A3D": "var(--color-planner-accent)",
  "#C17D2A": "var(--color-planner-amber)",
  "#C45B3A": "var(--color-planner-coral)",
  "#2A4A7F": "var(--color-planner-blue)",
  "#8B8680": "var(--color-planner-muted)",
  "#E8E4DF": "var(--color-planner-border)"
};

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [hex, cssVar] of Object.entries(mappings)) {
        // Find exactly the string "#... " or '#... '
        // ignoring case
        const regexStr = hex;
        const re = new RegExp(`"${regexStr}"`, 'gi');
        if (re.test(content)) {
          content = content.replace(re, `"${cssVar}"`);
          changed = true;
        }
        const reSingle = new RegExp(`'${regexStr}'`, 'gi');
        if (reSingle.test(content)) {
          content = content.replace(reSingle, `'${cssVar}'`);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(dirPath);
processDir(componentsPath);
