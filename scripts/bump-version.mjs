#!/usr/bin/env node
/**
 * Increment version.json build number by 1.
 * Invoked from .githooks/pre-commit before each commit.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const versionPath = path.join(root, "version.json");

function readBuild() {
  if (!fs.existsSync(versionPath)) {
    return { build: 0 };
  }
  const raw = fs.readFileSync(versionPath, "utf8");
  const data = JSON.parse(raw);
  const build = Number(data?.build);
  return { build: Number.isFinite(build) && build >= 0 ? build : 0 };
}

const prev = readBuild();
const next = prev.build + 1;
const payload = { build: next };
fs.writeFileSync(versionPath, `${JSON.stringify(payload, null, 4)}\n`, "utf8");
console.log(`version.json build: ${prev.build} -> ${next}`);
