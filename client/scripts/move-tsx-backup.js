import fs from "fs";
import path from "path";

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else if (full.endsWith(".tsx")) files.push(full);
  }
  return files;
}

const root = path.join(process.cwd(), "src");
const backupRoot = path.join(process.cwd(), "ts_backup", "src");
if (!fs.existsSync(root)) {
  console.error("expected to run from client directory (contains src/)");
  process.exit(1);
}

const files = walk(root);
for (const f of files) {
  const rel = path.relative(root, f);
  const dest = path.join(backupRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(f, dest);
  console.log("moved:", f, "->", dest);
}
console.log(`Moved ${files.length} .tsx files to ts_backup/src`);
