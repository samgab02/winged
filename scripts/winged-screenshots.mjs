import puppeteer from "puppeteer-core";
import { mkdir, copyFile } from "fs/promises";
import path from "path";

const BASE = "http://127.0.0.1:4317";
const MEDIA =
  "/cursor/stores/bc-72b16167-8846-4c27-859b-efcb7464f2d6/media";
const ARTIFACTS = "/opt/cursor/artifacts/screenshots";

async function save(page, name) {
  const file = `winged-rebrand-${name}.png`;
  const dest = path.join(MEDIA, file);
  await page.screenshot({ path: dest, fullPage: false });
  await copyFile(dest, path.join(ARTIFACTS, file));
  console.log("saved", dest);
}

async function clickIncludes(page, text) {
  const ok = await page.evaluate((t) => {
    const el = Array.from(
      document.querySelectorAll("button, a, [role='button']")
    ).find((n) => (n.textContent || "").includes(t));
    if (!el) return false;
    el.click();
    return true;
  }, text);
  if (!ok) throw new Error("missing " + text);
}

async function main() {
  await mkdir(MEDIA, { recursive: true });
  await mkdir(ARTIFACTS, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    headless: "new",
    args: ["--no-sandbox", "--window-size=390,844"],
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2 },
  });
  const page = await browser.newPage();
  await page.goto(`${BASE}/welcome`, { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 400));
  await save(page, "splash");

  await page.goto(`${BASE}/welcome`, { waitUntil: "networkidle0" });
  await save(page, "welcome");

  await page.goto(`${BASE}/auth/signin`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));
  await clickIncludes(page, "bachelor@winged.app");
  await page.waitForFunction(() =>
    location.pathname.includes("/bachelor/discover")
  );
  await new Promise((r) => setTimeout(r, 900));
  await save(page, "bachelor-warm");

  await page.goto(`${BASE}/auth/signin`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.removeItem("winged-auth-session-v1");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));
  await clickIncludes(page, "man@winged.app");
  await page.waitForFunction(() =>
    location.pathname.includes("/bachelor/discover")
  );
  await new Promise((r) => setTimeout(r, 900));
  await save(page, "bachelor-cool");

  await page.goto(`${BASE}/auth/signin`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.removeItem("winged-auth-session-v1");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));
  await clickIncludes(page, "wing@winged.app");
  await page.waitForFunction(() => location.pathname.includes("/wing/swipe"));
  await new Promise((r) => setTimeout(r, 900));
  await save(page, "wing-home");

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
