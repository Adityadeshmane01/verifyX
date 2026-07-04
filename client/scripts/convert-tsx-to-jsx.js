import fs from "fs";
import path from "path";
import { transformSync } from "@babel/core";

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

function convertFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const res = transformSync(src, {
    presets: [["@babel/preset-typescript"]],
    plugins: [["@babel/plugin-syntax-jsx"]],
    filename: file,
    // keep JSX syntax as-is so output remains .jsx
    babelrc: false,
    configFile: false,
  });
  if (!res || typeof res.code !== "string") {
    throw new Error(`Babel failed for ${file}`);
  }
  const out = file.replace(/\.tsx$/, ".jsx");
  fs.writeFileSync(out, res.code, "utf8");
  console.log("converted:", file, "->", out);
}

const root = path.join(process.cwd(), "src");
if (!fs.existsSync(root)) {
  console.error("expected to run from client directory (contains src/)");
  process.exit(1);
}

const files = walk(root);
if (!files.length) console.log("no .tsx files found");
for (const f of files) convertFile(f);

console.log(`Converted ${files.length} files.`);
