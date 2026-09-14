#!/usr/bin/env node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateDb as decisions } from "./validate-decisions.mjs";
import { hasArray, hasSeries } from "./state-io.mjs";
import { validateFile as candidates } from "./validate-scout-candidates.mjs";
import { validateDb as actionItems } from "./validate-action-items.mjs";

// Rebase can produce syntactically valid text conflicts in single-line JSON,
// or a valid JSON object with incompatible fields. Check before publishing.
export function validateState(root = "state"){
  const errors = [];
  const contracts = {
    "price_history.json": hasSeries, "volume_history.json": hasSeries,
    "analysis_queue.json": v => hasArray("pending")(v) && hasArray("done")(v),
    "news_feed.json": hasArray("items"), "alerts.json": hasArray("active"),
    "push_subs.json": hasArray("subscriptions"), "push_sent.json": hasArray("keys"),
    "decisions.json": v => decisions(v).errors.length === 0,
    "scout_candidates.json": v => candidates(v).length === 0,
    "action_items.json": v => actionItems(v).length === 0
  };
  function walk(dir){
    for (const e of readdirSync(dir, { withFileTypes: true })){
      const path = join(dir, e.name);
      if (e.isDirectory()) { walk(path); continue; }
      if (!e.name.endsWith(".json")) continue;
      try {
        const value = JSON.parse(readFileSync(path, "utf8"));
        if (dir === root && contracts[e.name] && !contracts[e.name](value))
          errors.push(path + ": invalid state contract");
      } catch (error){ errors.push(path + ": " + error.message); }
    }
  }
  walk(root);
  return errors;
}

if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("validate-state.mjs")){
  const errors = validateState();
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log("State JSON and writer contracts OK.");
}
