// Install the version hook without replacing a user's existing hook.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let hooks;
try {
  hooks = execFileSync("git", ["rev-parse", "--git-path", "hooks"], { cwd: root, encoding: "utf8" }).trim();
} catch {
  console.log("install-git-hooks: skip (not a git checkout)");
  process.exit(0);
}
const destination = path.resolve(root, hooks, "pre-commit");
const source = fs.readFileSync(path.join(root, ".githooks/pre-commit"));
if (fs.existsSync(destination)) {
  if (!fs.readFileSync(destination).equals(source)) {
    console.log("install-git-hooks: keeping existing pre-commit hook");
  }
} else {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, source, { flag: "wx", mode: 0o755 });
  console.log("install-git-hooks: installed pre-commit");
}
