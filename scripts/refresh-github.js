// Optional, explicit build-time snapshot. No credentials, no runtime dependency.
const fs = require("node:fs");
const path = require("node:path");
(async () => {
  const response = await fetch(
    "https://api.github.com/users/s4muelxl/repos?sort=updated&per_page=100",
    {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(12000),
    },
  );
  if (!response.ok) throw new Error("GitHub HTTP " + response.status);
  const data = await response.json();
  const allow = new Set([
    "saberx",
    "bmi9.lol",
    "receipt-generator-py",
    "projeto-1-calculadora-simples",
  ]);
  const repos = data
    .filter(
      (r) => allow.has(r.name) && r.private === false && !r.fork && !r.archived,
    )
    .map((r) => ({
      name: r.name,
      language: r.language,
      updated_at: r.updated_at,
    }));
  if (!repos.length)
    throw new Error("Empty public snapshot; retaining existing data");
  fs.writeFileSync(
    path.join(__dirname, "../data/github-public.json"),
    JSON.stringify({ fetched_at: new Date().toISOString(), repos }, null, 2) +
      "\n",
  );
  console.log("Updated public repository snapshot:", repos.length);
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
