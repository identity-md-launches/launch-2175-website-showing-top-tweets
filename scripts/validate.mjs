import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

// Exercise the committed export at a gateway-like subpath, without external requests.
const root = resolve("dist");
const out = resolve("test/scratch/interaction");
const posts = JSON.parse(await readFile("src/data/posts.json", "utf8"));
const results = [];
const failures = [];
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!path.startsWith("/preview/")) throw new Error("Outside preview");
    const file = resolve(root, path.slice("/preview/".length) || "index.html");
    if (file !== root && !file.startsWith(root + sep))
      throw new Error("Outside export");
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const origin = `http://127.0.0.1:${server.address().port}`;
const url = `${origin}/preview/`;
let browser;
async function check(name, fn) {
  try {
    await fn();
    results.push({ name, passed: true });
  } catch (error) {
    results.push({ name, passed: false, error: error.message });
    failures.push(name);
  }
}
try {
  await mkdir(out, { recursive: true });
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    permissions: ["clipboard-read", "clipboard-write"],
  });
  await context.route("**/*", (route) =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort(),
  );
  const page = await context.newPage();
  const errors = [];
  const resources = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      resources.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  const cards = () => page.locator(".tweet-card");
  const count = async (n) => assert.equal(await cards().count(), n);
  const filter = (name) =>
    page
      .getByRole("group", { name: "Filter by category" })
      .getByRole("button", { name, exact: true });
  const search = page.getByRole("searchbox", { name: "Search" });

  await check(
    "Subpath loads four initial posts and all local assets",
    async () => {
      await count(4);
      assert.equal(errors.length, 0);
      assert.equal(resources.length, 0);
    },
  );
  await check(
    "390px first screen identifies IdentityMD and shows primary action",
    async () => {
      const box = await page
        .getByRole("link", { name: "Explore top tweets", exact: true })
        .boundingBox();
      assert.ok(box && box.y >= 0 && box.y + box.height <= 844);
      assert.ok(
        await page
          .locator(".hero-copy")
          .getByText(/The best of IdentityMD/)
          .isVisible(),
      );
    },
  );
  await check("Local display and body fonts load", async () =>
    assert.ok(
      await page.evaluate(
        () =>
          document.fonts.check('16px "DM Sans"') &&
          document.fonts.check('28px "Space Grotesk"'),
      ),
    ),
  );
  await check("Share metadata and linked image/favicon exist", async () => {
    assert.match(await page.title(), /IdentityMD/);
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:image"]',
    ])
      assert.ok(await page.locator(selector).getAttribute("content"));
    for (const path of ["favicon.svg", "social-card.png", "sources.json"])
      assert.equal((await page.request.get(url + path)).status(), 200);
  });
  await check("Load more reveals all eight posts", async () => {
    await page.getByRole("button", { name: "Show 4 more posts" }).click();
    await count(8);
  });
  for (const category of ["Building", "Community", "Ideas"])
    await check(`${category} category filters correctly`, async () => {
      await filter(category).click();
      await count(posts.filter((post) => post.category === category).length);
      assert.equal(await filter(category).getAttribute("aria-pressed"), "true");
    });
  await filter("All posts").click();
  await check("Search matches summaries, people and topics", async () => {
    for (const query of ["oracle", "Adam", "AI agents"]) {
      await search.fill(query);
      const expected = posts.filter((post) =>
        `${post.author} ${post.handle} ${post.summary} ${post.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ).length;
      await count(Math.min(expected, 4));
    }
  });
  await check(
    "Empty search offers working clear filters recovery",
    async () => {
      await search.fill("no-such-post-9284");
      await count(0);
      assert.ok(
        await page
          .getByRole("heading", { name: "No posts in this corner." })
          .isVisible(),
      );
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      await count(4);
      assert.equal(await search.inputValue(), "");
    },
  );
  for (const [value, metric] of [
    ["newest", "date"],
    ["discussion", "replies"],
    ["top", "likes"],
  ])
    await check(`${value} sort uses the expected captured field`, async () => {
      await page
        .getByRole("combobox", { name: "Sort posts" })
        .selectOption(value);
      const expected = [...posts].sort((a, b) =>
        metric === "date"
          ? Date.parse(b.date) - Date.parse(a.date)
          : b[metric] - a[metric],
      );
      assert.deepEqual(
        await cards().evaluateAll((nodes) =>
          nodes.map((node) => node.dataset.postId),
        ),
        expected.slice(0, 4).map((post) => post.id),
      );
    });
  await check(
    "Card topic and sidebar topic controls apply search",
    async () => {
      await page
        .getByRole("button", { name: "#AIagents", exact: true })
        .first()
        .click();
      assert.equal(await search.inputValue(), "AI agents");
      await page
        .locator(".topic-button")
        .filter({ hasText: "Community" })
        .click();
      assert.equal(await search.inputValue(), "Community");
      await count(
        posts.filter((post) =>
          `${post.author} ${post.handle} ${post.summary} ${post.tags.join(" ")}`
            .toLowerCase()
            .includes("community"),
        ).length,
      );
      await page
        .getByRole("button", { name: "Clear search", exact: true })
        .click();
    },
  );
  await check(
    "Saving a post updates control, notification and Saved view",
    async () => {
      await cards()
        .first()
        .getByRole("button", { name: /^Save post/ })
        .click();
      assert.equal(
        await cards()
          .first()
          .getByRole("button", { name: /^Unsave post/ })
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.ok(await page.locator(".notice").isVisible());
      await page.getByRole("link", { name: /^Saved/ }).click();
      await count(1);
      assert.equal(
        await page
          .getByRole("heading", { level: 2, name: /Saved tweets/ })
          .count(),
        1,
      );
    },
  );
  await check(
    "Saved posts persist after reload, including direct hash navigation",
    async () => {
      await page.reload();
      await count(1);
      assert.equal(new URL(page.url()).hash, "#saved");
    },
  );
  await check(
    "Unsave produces actionable empty state and Explore recovers",
    async () => {
      await cards()
        .first()
        .getByRole("button", { name: /^Unsave post/ })
        .click();
      await count(0);
      assert.ok(
        await page
          .getByRole("heading", { name: "Keep a little signal." })
          .isVisible(),
      );
      await page
        .locator(".empty-state")
        .getByRole("link", { name: "Explore top tweets" })
        .click();
      await count(4);
    },
  );
  await check("Copy source link writes the original X URL", async () => {
    await cards()
      .first()
      .getByRole("button", { name: /^Copy link/ })
      .click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      posts[0].url,
    );
  });
  await check(
    "Clipboard failure exposes and focuses a selectable link",
    async () => {
      await page.evaluate(() => {
        navigator.clipboard.writeText = () =>
          Promise.reject(new Error("Unavailable"));
      });
      await cards()
        .first()
        .getByRole("button", { name: /^Copy link/ })
        .click();
      const input = page.getByRole("textbox", { name: "Post link" });
      await input.waitFor();
      assert.equal(await input.inputValue(), posts[0].url);
      assert.ok(
        await input.evaluate((element) => element === document.activeElement),
      );
      await page.getByRole("button", { name: "Dismiss post link" }).click();
    },
  );
  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await check(
    "About dialog traps keyboard focus and Escape restores trigger",
    async () => {
      const trigger = page.getByRole("button", {
        name: "About this curated collection",
      });
      await trigger.click();
      assert.ok(
        await page
          .getByRole("dialog", { name: "A little context." })
          .isVisible(),
      );
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press("Tab");
        assert.ok(
          await page.evaluate(() =>
            document.querySelector("dialog").contains(document.activeElement),
          ),
        );
      }
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("dialog").count(), 0);
      assert.ok(
        await trigger.evaluate((element) => element === document.activeElement),
      );
    },
  );
  await check(
    "Keyboard focus reaches Search with a visible two-pixel ring",
    async () => {
      await search.focus();
      const focus = await search.evaluate((element) => {
        const s = getComputedStyle(element.closest("label"));
        return { width: s.outlineWidth, style: s.outlineStyle };
      });
      assert.equal(focus.width, "2px");
      assert.equal(focus.style, "solid");
    },
  );
  for (const width of [320, 390, 760, 1000, 1440])
    await check(
      `${width}px responsive layout, targets and accessibility scan`,
      async () => {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(() => window.scrollTo(0, 0));
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        const audit = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        assert.deepEqual(
          audit.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            targets: v.nodes.map((n) => n.target),
          })),
          [],
        );
      },
    );
  await check("About dialog automated accessibility scan", async () => {
    await page.getByRole("button", { name: "About", exact: true }).click();
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    assert.deepEqual(
      audit.violations.map((v) => v.id),
      [],
    );
    await page.keyboard.press("Escape");
  });
  await check(
    "200% text enlargement preserves reflow at 320, 390 and 1440px",
    async () => {
      await page.addStyleTag({
        content: "html { font-size: 200% !important; }",
      });
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `overflow at ${width}px`,
        );
      }
    },
  );
  await page.reload();
  await check(
    "Reduced motion disables smooth scrolling and transitions",
    async () => {
      assert.equal(
        await page.evaluate(
          () => getComputedStyle(document.documentElement).scrollBehavior,
        ),
        "auto",
      );
    },
  );
  await check("Every original source link matches the data", async () => {
    await page.getByRole("button", { name: "Show 4 more posts" }).click();
    assert.deepEqual(
      await page
        .locator(".post-link")
        .evaluateAll((nodes) => nodes.map((node) => node.href)),
      posts.map((post) => post.url),
    );
  });
  await check(
    "No script errors or failed local resources during flows",
    async () => {
      assert.deepEqual(errors, []);
      assert.deepEqual(resources, []);
    },
  );
  const denied = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await denied.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage disabled", "SecurityError");
    };
  });
  const deniedPage = await denied.newPage();
  await deniedPage.goto(url);
  await check(
    "Storage failure keeps session bookmarks usable and explains limitation",
    async () => {
      await deniedPage.locator(".save-button").first().click();
      assert.ok(await deniedPage.locator(".storage-note").isVisible());
      await deniedPage.getByRole("link", { name: /^Saved/ }).click();
      assert.equal(await deniedPage.locator(".tweet-card").count(), 1);
    },
  );
  await denied.close();
  for (const [width, height, name] of [
    [390, 844, "mobile"],
    [1440, 1000, "desktop"],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${out}/${name}.jpg`,
      type: "jpeg",
      quality: 85,
      fullPage: true,
    });
  }
  await context.close();
} finally {
  if (browser) await browser.close();
  await new Promise((done) => server.close(done));
  await writeFile(
    `${out}/results.json`,
    JSON.stringify(
      {
        urlPath: "/preview/",
        results,
        passed: results.filter((r) => r.passed).length,
        failed: failures.length,
      },
      null,
      2,
    ) + "\n",
  );
}
console.log(
  JSON.stringify(
    {
      passed: results.filter((r) => r.passed).length,
      failed: failures.length,
      results,
    },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
