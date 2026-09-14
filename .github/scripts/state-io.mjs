import { readFileSync, writeFileSync, renameSync, rmSync } from "node:fs";
import { randomUUID } from "node:crypto";

// Only an absent file is an initial state. Corruption and permission failures
// must stop the writer, preserving the original data for recovery.
export function readJSON(path, fallback, valid = () => true){
  let raw;
  try { raw = readFileSync(path, "utf8"); }
  catch (error){ if (error.code === "ENOENT") return fallback; throw error; }
  const value = JSON.parse(raw);
  if (!valid(value)) throw new Error(`Invalid persisted state: ${path}`);
  return value;
}

export const hasArray = key => value => value != null && Array.isArray(value[key]);
export const hasSeries = value => value != null && value.series != null &&
  typeof value.series === "object" && !Array.isArray(value.series) &&
  Object.values(value.series).every(Array.isArray);

// A sibling temporary file keeps rename on the same filesystem. Readers see
// either the complete previous file or the complete replacement.
export function writeAtomic(path, text){
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporary, text, { encoding: "utf8", flag: "wx" });
    renameSync(temporary, path);
  } finally { rmSync(temporary, { force: true }); }
}
