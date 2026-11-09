import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const script = readFileSync("public/analytics.js", "utf8");

function loader(privacy: { doNotTrack?: string; globalPrivacyControl?: boolean }) {
  const appended: unknown[] = [];
  let idle: (() => void) | undefined;
  const window = { dataLayer: [] as unknown[], requestIdleCallback: (callback: () => void) => { idle = callback; } };
  const document = { currentScript: { dataset: { googleAnalyticsId: "G-EXAMPLE" } }, createElement: () => ({}), head: { appendChild: (element: unknown) => appended.push(element) } };
  runInNewContext(script, { window, document, navigator: privacy, URLSearchParams });
  return { appended, window, idle: () => idle?.() };
}

describe("deferred marketing analytics privacy", () => {
  it.each([{ doNotTrack: "1" }, { doNotTrack: "yes" }, { globalPrivacyControl: true }])("does not load a vendor script or queue page views when privacy is enabled: %j", (privacy) => {
    const result = loader(privacy);
    result.idle();
    expect(result.appended).toHaveLength(0);
    expect(result.window.dataLayer).toHaveLength(0);
  });
  it("rechecks privacy at idle before loading analytics", () => {
    const privacy = { globalPrivacyControl: false };
    const result = loader(privacy);
    privacy.globalPrivacyControl = true;
    result.idle();
    expect(result.appended).toHaveLength(0);
    expect(result.window.dataLayer).toHaveLength(0);
  });
  it("loads cookieless Ahrefs Web Analytics behind the same privacy gate", () => {
    const run = (privacy: { doNotTrack?: string; globalPrivacyControl?: boolean }, key = "9iTcM8k/OrHTgUuqCduLmA") => {
      const appended: Array<{ src?: string; async?: boolean; attributes: Record<string, string> }> = [];
      const window = { requestIdleCallback: (callback: () => void) => callback() };
      const document = {
        currentScript: { dataset: { ahrefsKey: key } },
        createElement: () => {
          const attributes: Record<string, string> = {};
          return { attributes, setAttribute: (name: string, value: string) => { attributes[name] = value; } };
        },
        head: { appendChild: (element: (typeof appended)[number]) => appended.push(element) },
      };
      runInNewContext(script, { window, document, navigator: privacy, URLSearchParams });
      return appended;
    };
    const [tag, ...rest] = run({});
    expect(rest).toHaveLength(0);
    expect(tag).toMatchObject({ src: "https://analytics.ahrefs.com/analytics.js", async: true, attributes: { "data-key": "9iTcM8k/OrHTgUuqCduLmA" } });
    expect(run({ doNotTrack: "1" })).toHaveLength(0);
    expect(run({ globalPrivacyControl: true })).toHaveLength(0);
    expect(run({}, "bad key\"><script>")).toHaveLength(0);
  });
  it("retains the existing deferred analytics behavior when permitted", () => {
    const result = loader({});
    expect(result.appended).toHaveLength(0);
    result.idle();
    expect(result.appended).toHaveLength(1);
    expect(result.window.dataLayer).toHaveLength(2);
  });
});
