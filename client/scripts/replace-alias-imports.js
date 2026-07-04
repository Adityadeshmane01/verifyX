import fs from "fs";
import path from "path";

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else if (full.endsWith(".jsx") || full.endsWith(".js")) files.push(full);
  }
  return files;
}

const root = path.join(process.cwd(), "src");
const files = walk(root);
for (const f of files) {
  let src = fs.readFileSync(f, "utf8");
  const updated = src.replace(/from \"@\/(.*?)\"/g, (m, p1) => {
    const target = path.join(root, p1);
    let rel = path.relative(path.dirname(f), target);
    if (!rel.startsWith(".")) rel = "./" + rel;
    rel = rel.replace(/\\/g, "/");
    return `from "${rel}"`;
  });
  if (updated !== src) {
    fs.writeFileSync(f, updated, "utf8");
    console.log("updated imports in:", f);
  }
}
console.log(`Processed ${files.length} files`);
