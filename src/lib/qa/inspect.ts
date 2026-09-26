/** Best-effort DOM + React fiber inspect helpers for QA pick mode. */

export type DebugSource = {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
};

export type InspectTarget = {
  tag: string;
  id: string | null;
  classes: string[];
  dataAttrs: Record<string, string>;
  text: string;
  ariaLabel: string | null;
  role: string | null;
  selector: string;
  cssPath: string;
  rect: { x: number; y: number; width: number; height: number };
  componentName: string | null;
  componentStack: string[];
  source: DebugSource | null;
  sourceLabel: string;
};

const QA_CHROME = "[data-qa-chrome]";

export function isQaChrome(el: Element | null): boolean {
  return !!el?.closest(QA_CHROME);
}

/** Deepest useful element under a point, skipping QA chrome. */
export function targetFromPoint(x: number, y: number): Element | null {
  const stack =
    typeof document.elementsFromPoint === "function"
      ? document.elementsFromPoint(x, y)
      : [document.elementFromPoint(x, y)].filter(Boolean);

  for (const el of stack) {
    if (!el || !(el instanceof Element)) continue;
    if (isQaChrome(el)) continue;
    if (el === document.documentElement || el === document.body) continue;
    return el;
  }
  return null;
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

export function buildUniqueSelector(el: Element): string {
  if (el.id) return `#${cssEscape(el.id)}`;

  const testId =
    el.getAttribute("data-testid") ||
    el.getAttribute("data-qa") ||
    el.getAttribute("data-component");
  if (testId) {
    const attr = el.getAttribute("data-testid")
      ? "data-testid"
      : el.getAttribute("data-qa")
        ? "data-qa"
        : "data-component";
    const sel = `[${attr}="${testId.replace(/"/g, '\\"')}"]`;
    if (document.querySelectorAll(sel).length === 1) return sel;
  }

  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node.nodeType === 1 && node !== document.body) {
    let part = node.tagName.toLowerCase();
    if (node.id) {
      parts.unshift(`#${cssEscape(node.id)}`);
      break;
    }
    const parent: Element | null = node.parentElement;
    if (parent) {
      const siblings = [...parent.children].filter(
        (c) => c.tagName === node!.tagName
      );
      if (siblings.length > 1) {
        const idx = siblings.indexOf(node) + 1;
        part += `:nth-of-type(${idx})`;
      }
    }
    parts.unshift(part);
    node = parent;
    if (parts.length > 8) break;
  }
  return parts.join(" > ");
}

export function buildCssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node.nodeType === 1 && parts.length < 6) {
    let part = node.tagName.toLowerCase();
    if (node.classList.length) {
      part +=
        "." +
        [...node.classList]
          .slice(0, 3)
          .map((c) => cssEscape(c))
          .join(".");
    }
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(" > ");
}

type Fiber = {
  type?: unknown;
  elementType?: unknown;
  return?: Fiber | null;
  _debugSource?: DebugSource;
  _debugOwner?: Fiber | null;
  memoizedProps?: Record<string, unknown>;
};

function getFiber(el: Element): Fiber | null {
  const key = Object.keys(el).find(
    (k) =>
      k.startsWith("__reactFiber$") ||
      k.startsWith("__reactInternalInstance$") ||
      k.startsWith("__reactContainer$")
  );
  if (!key) return null;
  return (el as unknown as Record<string, Fiber>)[key] ?? null;
}

function fiberName(fiber: Fiber | null | undefined): string | null {
  if (!fiber) return null;
  const t = fiber.type ?? fiber.elementType;
  if (!t) return null;
  if (typeof t === "string") return t;
  if (typeof t === "function") {
    const fn = t as { displayName?: string; name?: string };
    return fn.displayName || fn.name || null;
  }
  if (typeof t === "object" && t !== null) {
    const obj = t as { displayName?: string; name?: string; render?: { name?: string } };
    return obj.displayName || obj.name || obj.render?.name || null;
  }
  return null;
}

function walkFiberSource(start: Fiber | null): {
  source: DebugSource | null;
  componentName: string | null;
  stack: string[];
} {
  const stack: string[] = [];
  let source: DebugSource | null = null;
  let componentName: string | null = null;
  let fiber: Fiber | null = start;

  while (fiber) {
    const name = fiberName(fiber);
    if (name && name[0] === name[0]?.toUpperCase() && !stack.includes(name)) {
      stack.push(name);
      if (!componentName) componentName = name;
    }
    if (!source && fiber._debugSource?.fileName) {
      source = fiber._debugSource;
    }
    fiber = fiber._debugOwner ?? fiber.return ?? null;
    if (stack.length > 12) break;
  }

  return { source, componentName, stack };
}

function collectDataAttrs(el: Element): Record<string, string> {
  const out: Record<string, string> = {};
  for (const attr of el.attributes) {
    if (attr.name.startsWith("data-")) {
      out[attr.name] = attr.value;
    }
  }
  return out;
}

function textSnippet(el: Element): string {
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.slice(0, 120);
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  return text.slice(0, 120);
}

function formatSource(source: DebugSource | null, componentName: string | null): string {
  if (source?.fileName) {
    const file = source.fileName.replace(/^.*\/(src|app)\//, "$1/");
    return `${file}:${source.lineNumber}${
      source.columnNumber ? `:${source.columnNumber}` : ""
    }`;
  }
  if (componentName) return `component:${componentName}`;
  return "unknown (prod build — selector only)";
}

export function inspectElement(el: Element): InspectTarget {
  const rect = el.getBoundingClientRect();
  const fiber = getFiber(el);
  const { source, componentName, stack } = walkFiberSource(fiber);

  // Prefer nearest data-component attribute up the tree
  const dataComponent =
    el.closest("[data-component]")?.getAttribute("data-component") || null;

  const name = dataComponent || componentName;

  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    classes: [...el.classList],
    dataAttrs: collectDataAttrs(el),
    text: textSnippet(el),
    ariaLabel: el.getAttribute("aria-label"),
    role: el.getAttribute("role"),
    selector: buildUniqueSelector(el),
    cssPath: buildCssPath(el),
    rect: {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    componentName: name,
    componentStack: stack,
    source,
    sourceLabel: formatSource(source, name),
  };
}

export function viewportPercents(x: number, y: number) {
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;
  return {
    xPct: Math.round((x / w) * 1000) / 10,
    yPct: Math.round((y / h) * 1000) / 10,
  };
}
