const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "../dist");
const projects = require("../data/projects");
const config = require("../vercel.json");
const csp = config.headers[0].headers.find(
  (h) => h.key === "Content-Security-Policy",
).value;
let pages = 0,
  refs = 0;
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((x) =>
      x.isDirectory() ? walk(path.join(dir, x.name)) : path.join(dir, x.name),
    );
}
for (const file of walk(root).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  pages++;
  assert(
    !/Micro-Frontend|API Gateway|Autonomous RAG|Kubernetes|Terraform|service_role|ghp_/.test(
      html,
    ),
    file,
  );
  const isRedirect = /http-equiv="refresh"/.test(html);
  if (!isRedirect) {
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file);
    assert(html.includes('<main id="main"'));
    assert(html.includes('rel="canonical"'));
    for (const match of html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    )) {
      JSON.parse(match[1]);
      assert(
        csp.includes(
          "'sha256-" +
            crypto.createHash("sha256").update(match[1]).digest("base64") +
            "'",
        ),
      );
    }
  }
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (!url.startsWith("/") && !url.startsWith("#")) continue;
    const u = new URL(
      url,
      "https://www.s4muelxl.com/" + path.relative(root, file),
    );
    let target = path.join(root, decodeURIComponent(u.pathname));
    if (u.pathname.endsWith("/")) target = path.join(target, "index.html");
    assert(fs.existsSync(target), `${file}: missing ${url}`);
    if (u.hash && target.endsWith(".html")) {
      assert(
        fs.readFileSync(target, "utf8").includes(`id="${u.hash.slice(1)}"`),
        `missing anchor ${url}`,
      );
    }
    refs++;
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g))
    assert(
      /alt="[^"]+"/.test(img[0]) &&
        /width=/.test(img[0]) &&
        /height=/.test(img[0]),
      "Image dimensions/alt",
    );
}
for (const p of projects.filter((p) => p.private)) assert.equal(p.github, null);
assert(!fs.existsSync(path.join(root, "skill.md")));
assert(!fs.existsSync(path.join(root, "data")));
assert(!fs.existsSync(path.join(root, "scripts")));
assert(!csp.includes("unsafe-inline"));
assert(
  fs
    .readFileSync(path.join(root, "assets/curriculo_samuel_alves_dev_v2.pdf"))
    .subarray(0, 5)
    .toString() === "%PDF-",
);
assert(fs.statSync(path.join(root, "script.js")).size < 5000);
assert(fs.statSync(path.join(root, "style.css")).size < 25000);
console.log(
  `PASS: ${pages} HTML pages; ${refs} internal links/assets/anchors; JSON-LD hashes; private repos; PDF signature; public-only output; JS/CSS budgets.`,
);
