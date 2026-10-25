// Dev-only layout audit. Paste into the console (or evaluate it) on a running page, then call
//   __audit()            -> every scene at its rest/settled frame
//   __audit("name", 1.5) -> one scene at one time
// It reports visible text boxes that overlap each other or sit outside the stage's safe margin.
// Text inside an [aria-hidden="true"] subtree (ghost letters, decorative labels) is ignored.
(() => {
  const MARGIN = 40;   // stage px a text box may come to the edge of the frame
  const MIN_AREA = 16; // ignore hairline touches

  const visible = (el, root) => {
    let op = 1;
    for (let n = el; n && n !== root.parentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      op *= Number(cs.opacity);
      if (n.getAttribute?.("aria-hidden") === "true") return false;
    }
    return op > 0.08;
  };

  // Line boxes of display type are much taller than the letters, so measure the ink: each rendered line's
  // box is narrowed to the glyphs' actual ascent/descent (canvas TextMetrics, same font and tracking).
  const ctx = document.createElement("canvas").getContext("2d");
  function inkBoxes(t, el) {
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
    let s = t.textContent.trim();
    if (cs.textTransform === "uppercase") s = s.toUpperCase();
    const m = ctx.measureText(s);
    const range = document.createRange();
    range.selectNodeContents(t);
    return [...range.getClientRects()].filter((r) => r.width >= 1 && r.height >= 1).map((r) => {
      const scale = r.height / (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent || r.height);
      const base = r.top + m.fontBoundingBoxAscent * scale;
      return { left: r.left, right: r.right, top: base - m.actualBoundingBoxAscent * scale, bottom: base + m.actualBoundingBoxDescent * scale };
    });
  }

  function textBoxes(root, k, ox, oy) {
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      if (!t.textContent.trim()) continue;
      const el = t.parentElement;
      if (!el || el.closest("style, script") || !visible(el, root)) continue;
      for (const r of inkBoxes(t, el)) out.push({ el, text: t.textContent.trim().slice(0, 40),
        x0: (r.left - ox) * k, y0: (r.top - oy) * k, x1: (r.right - ox) * k, y1: (r.bottom - oy) * k });
    }
    return out;
  }
  // the same text drawn twice on top of itself (e.g. a coloured copy revealed by a clip) is one label
  const twin = (a, b) => a.text === b.text && Math.abs(a.x0 - b.x0) < 2 && Math.abs(a.y0 - b.y0) < 2;

  function auditScene(s, sec) {
    __seek(s.slug, sec);
    const stage = document.getElementById("stage"), sr = stage.getBoundingClientRect();
    const W = stage.offsetWidth, H = stage.offsetHeight, k = W / sr.width;
    const boxes = textBoxes(s.root, k, sr.left, sr.top);
    const issues = [];
    for (const b of boxes) {
      if (b.x0 < MARGIN || b.y0 < MARGIN || b.x1 > W - MARGIN || b.y1 > H - MARGIN)
        issues.push(`edge  "${b.text}" [${b.x0 | 0},${b.y0 | 0} → ${b.x1 | 0},${b.y1 | 0}]`);
    }
    // text spilling out of the bordered box (pill, card, chip) that holds it
    for (const b of boxes) {
      for (let n = b.el; n && n !== s.root; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (!["Top", "Right", "Bottom", "Left"].some((e) => parseFloat(cs[`border${e}Width`]) > 0 && cs[`border${e}Style`] !== "none")) continue;
        const r = n.getBoundingClientRect();
        const x0 = (r.left - sr.left) * k, x1 = (r.right - sr.left) * k, y0 = (r.top - sr.top) * k, y1 = (r.bottom - sr.top) * k;
        if (b.x0 < x0 - 1 || b.x1 > x1 + 1 || b.y0 < y0 - 1 || b.y1 > y1 + 1)
          issues.push(`spill "${b.text}" out of its box by ${Math.max(x0 - b.x0, b.x1 - x1, y0 - b.y0, b.y1 - y1) | 0}px`);
        break;
      }
    }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (a.el === b.el || twin(a, b)) continue;
      const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
      if (w > 0 && h > 0 && w * h > MIN_AREA) issues.push(`overlap "${a.text}" × "${b.text}" (${w | 0}x${h | 0})`);
    }
    return { slug: s.slug, sec: +sec.toFixed(2), texts: boxes.length, issues };
  }

  window.__audit = (slug, sec) => {
    const list = window.__shots.filter((s) => !slug || s.slug === slug);
    // settled frame: the rest point if any, else just before the outgoing iris
    return list.map((s) => auditScene(s, sec ?? (s.rest ? (s.restAt ?? s.dur * 0.55) : Math.max(0, s.dur - 0.6))))
      .filter((r) => slug || r.issues.length);
  };
})();
