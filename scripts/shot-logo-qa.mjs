import puppeteer from "puppeteer-core";
import { mkdir, copyFile } from "fs/promises";

const MEDIA = "/cursor/stores/bc-72b16167-8846-4c27-859b-efcb7464f2d6/media";
const ART = "/opt/cursor/artifacts/screenshots";
await mkdir(MEDIA, { recursive: true });
await mkdir(ART, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: "new",
  args: ["--no-sandbox", "--window-size=390,844"],
  defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2 },
});
const page = await browser.newPage();

await page.goto("http://127.0.0.1:4317/welcome", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: `${MEDIA}/winged-logo-v2-welcome.png` });
await copyFile(`${MEDIA}/winged-logo-v2-welcome.png`, `${ART}/winged-logo-v2-welcome.png`);
console.log("winged-logo-v2-welcome.png");

await page.click('button[aria-label="QA pick mode"]');
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${MEDIA}/winged-qa-pick.png` });
await copyFile(`${MEDIA}/winged-qa-pick.png`, `${ART}/winged-qa-pick.png`);
console.log("winged-qa-pick.png");

await page.mouse.click(195, 380);
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: `${MEDIA}/winged-qa-ticket.png` });
await copyFile(`${MEDIA}/winged-qa-ticket.png`, `${ART}/winged-qa-ticket.png`);
console.log("winged-qa-ticket.png");

const body = await page.evaluate(() => document.body.innerText);
console.log("ticket open:", body.includes("New QA ticket"), "selector:", body.includes("Selector"));
console.log(body.slice(0, 900));

await browser.close();
