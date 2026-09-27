import puppeteer from "puppeteer-core";
import { mkdir, copyFile } from "fs/promises";
import path from "path";

const BASE = "http://127.0.0.1:4317";
const MEDIA =
  "/cursor/stores/bc-72b16167-8846-4c27-859b-efcb7464f2d6/media";
const ARTIFACTS = "/opt/cursor/artifacts/screenshots";

async function save(page, name) {
  const file = `povi-accounts-${name}.png`;
  const dest = path.join(MEDIA, file);
  const art = path.join(ARTIFACTS, file);
  await page.screenshot({ path: dest, fullPage: false });
  await copyFile(dest, art);
  console.log("saved", dest);
}

async function clickIncludes(page, text) {
  const clicked = await page.evaluate((t) => {
    const nodes = Array.from(
      document.querySelectorAll("button, a, [role='button']")
    );
    const el = nodes.find((n) => (n.textContent || "").includes(t));
    if (!el) return false;
    el.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`Could not click: ${text}`);
}

async function fill(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 8000 });
  await page.focus(selector);
  await page.$eval(selector, (el) => {
    el.value = "";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.type(selector, value, { delay: 10 });
}

async function waitPath(page, fragment, timeout = 12000) {
  await page.waitForFunction(
    (f) => location.pathname.includes(f),
    { timeout },
    fragment
  );
}

async function clearStorage(page) {
  await page.goto(`${BASE}/welcome`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function main() {
  await mkdir(MEDIA, { recursive: true });
  await mkdir(ARTIFACTS, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=390,844"],
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2 },
  });
  const page = await browser.newPage();

  await clearStorage(page);

  // Splash
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 350));
  await save(page, "splash");

  await page.goto(`${BASE}/welcome`, { waitUntil: "networkidle0" });
  await save(page, "welcome");

  await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle0" });
  await save(page, "signup");

  const email = `lila.${Date.now()}@povi.app`;
  await fill(page, 'input[type="email"]', email);
  await fill(page, 'input[type="password"]', "TestPovi1");
  await clickIncludes(page, "Continue");
  await waitPath(page, "/auth/role");

  await clickIncludes(page, "I’m dating");
  await waitPath(page, "/onboarding/bachelor");
  await page.waitForFunction(() =>
    document.body.innerText.includes("I am a")
  );
  await save(page, "gender");

  await clickIncludes(page, "Continue");
  await fill(page, 'input[placeholder="First name"]', "Lila");
  await clickIncludes(page, "Continue");
  await fill(page, 'input[placeholder="City"]', "Tel Aviv");
  await clickIncludes(page, "Continue");

  await page.waitForFunction(() =>
    document.body.innerText.includes("Add your photos")
  );
  await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll("button")).filter((b) =>
      b.querySelector("img")
    );
    tiles.slice(0, 3).forEach((b) => b.click());
  });
  await new Promise((r) => setTimeout(r, 400));
  await save(page, "photos");

  await clickIncludes(page, "Continue");
  await page.waitForFunction(() =>
    document.body.innerText.includes("Answer 3 prompts")
  );
  const areas = await page.$$("textarea");
  const answers = [
    "Sunset patio + good wine",
    "Making friends laugh",
    "Honest texts",
  ];
  for (let i = 0; i < Math.min(3, areas.length); i++) {
    await areas[i].click({ clickCount: 3 });
    await areas[i].type(answers[i]);
  }
  await clickIncludes(page, "Continue");

  await page.waitForFunction(() =>
    document.body.innerText.includes("What are you into")
  );
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll("button")).filter(
      (b) =>
        !/continue|back|enter/i.test(b.textContent || "") &&
        (b.textContent || "").trim().length > 2 &&
        (b.textContent || "").trim().length < 30
    );
    chips.slice(0, 3).forEach((b) => b.click());
  });
  await clickIncludes(page, "Continue");

  await page.waitForFunction(() =>
    document.body.innerText.includes("Who are you open")
  );
  await clickIncludes(page, "Everyone");
  await clickIncludes(page, "Continue");

  await page.waitForFunction(() =>
    document.body.innerText.includes("Invite your Shark")
  );
  await clickIncludes(page, "Enter POVI");
  await waitPath(page, "/bachelor/discover");
  await new Promise((r) => setTimeout(r, 900));
  await save(page, "bachelor-home");

  // Shark flow
  await clearStorage(page);
  await page.goto(`${BASE}/auth/signup`, { waitUntil: "networkidle0" });
  await fill(page, 'input[type="email"]', `shark.${Date.now()}@povi.app`);
  await fill(page, 'input[type="password"]', "TestPovi1");
  await clickIncludes(page, "Continue");
  await waitPath(page, "/auth/role");
  await clickIncludes(page, "I’m matchmaking");
  await waitPath(page, "/onboarding/shark");

  // Shark step 0: name etc.
  await page.waitForSelector("input");
  const sharkInputs = await page.$$("input");
  // first text-like input for name
  for (const input of sharkInputs) {
    const type = await page.evaluate((el) => el.type, input);
    const ph = await page.evaluate((el) => el.placeholder || "", input);
    if (type === "text" || type === "" || /name/i.test(ph)) {
      await input.click({ clickCount: 3 });
      await input.type("Noa");
      break;
    }
  }
  // pick a photo tile if present
  await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll("button")).filter((b) =>
      b.querySelector("img")
    );
    if (tiles[0]) tiles[0].click();
  });
  await clickIncludes(page, "Continue");

  // Friend or Pro
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /friend/i.test(b.textContent || "")
    );
    if (btn) btn.click();
  });
  await clickIncludes(page, "Continue");

  // Wing role / onboarding pick
  await new Promise((r) => setTimeout(r, 300));
  await clickIncludes(page, "Continue");

  // Vibe questions
  await page.waitForFunction(() =>
    /vibe|magnetic|roast/i.test(document.body.innerText)
  );
  const vibeFields = await page.$$("textarea, input[type='text']");
  const vibe = [
    "Lights up every room",
    "Show up late",
    "Chaos with perfect timing",
  ];
  for (let i = 0; i < Math.min(3, vibeFields.length); i++) {
    await vibeFields[i].click({ clickCount: 3 });
    await vibeFields[i].type(vibe[i]);
  }
  await clickIncludes(page, "Continue").catch(() =>
    clickIncludes(page, "Enter")
  );
  // final button might say Enter POVI or Finish
  const pathNow = await page.evaluate(() => location.pathname);
  if (!pathNow.includes("/shark/swipe")) {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        /continue|enter|finish|start/i.test(b.textContent || "")
      );
      if (btn && !btn.disabled) btn.click();
    });
  }
  await waitPath(page, "/shark/swipe", 15000);
  await new Promise((r) => setTimeout(r, 900));
  await save(page, "shark-home");

  await browser.close();
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
