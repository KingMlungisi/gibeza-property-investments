import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { jaridaWindows } = require("/tmp/windows.cjs");

const out = "/workspace/public/windows";
mkdirSync(out, { recursive: true });

function slug(code) {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function svg(item) {
  const vbW = 420;
  const vbH = 320;
  const maxW = 308;
  const maxH = 230;
  const aspect = item.width / item.height;
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  if (h < 132) h = 132;
  if (w < 132) w = 132;
  if (w > maxW) w = maxW;
  if (h > maxH) h = maxH;
  const x = (vbW - w) / 2;
  const y = 54 + (maxH - h) / 2;
  const frame = 13;
  const mullion = frame * 0.72;
  const frameColor = "#8c6239";
  const glass = [];
  const marks = [];

  const columns = item.shape.startsWith("4") ? 4 : item.shape.startsWith("3") ? 3 : item.shape.startsWith("2") ? 2 : 1;
  const portrait = item.height > item.width * 1.05;
  const openAll = item.shape.includes("all top hung") || item.shape.includes("both top hung");
  const innerX = x + frame;
  const innerY = y + frame;
  const innerW = w - frame * 2;
  const innerH = h - frame * 2;

  function pane(px, py, pw, ph) {
    glass.push(`<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${pw.toFixed(1)}" height="${ph.toFixed(1)}" fill="#d4ebf8" stroke="${frameColor}" stroke-width="${Math.max(3, mullion).toFixed(1)}"/>`);
    if (pw > 36 && ph > 28) {
      glass.push(`<text x="${(px + pw / 2).toFixed(1)}" y="${(py + ph / 2).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="#7aa3b8" font-family="Arial, sans-serif" font-size="11">CF04</text>`);
    }
    return { x: px, y: py, w: pw, h: ph };
  }

  function topHung(p) {
    marks.push(
      `<path d="M${p.x.toFixed(1)} ${p.y.toFixed(1)} L${(p.x + p.w / 2).toFixed(1)} ${(p.y + p.h).toFixed(1)} L${(p.x + p.w).toFixed(1)} ${p.y.toFixed(1)}" fill="none" stroke="#c4473a" stroke-width="1.6" stroke-dasharray="7 5"/>`,
    );
  }

  function sideHung(p, hinge) {
    const hingeX = hinge === "left" ? p.x : p.x + p.w;
    const latchX = hinge === "left" ? p.x + p.w : p.x;
    marks.push(
      `<path d="M${hingeX.toFixed(1)} ${p.y.toFixed(1)} L${latchX.toFixed(1)} ${(p.y + p.h / 2).toFixed(1)} L${hingeX.toFixed(1)} ${(p.y + p.h).toFixed(1)}" fill="none" stroke="#c4473a" stroke-width="1.6" stroke-dasharray="7 5"/>`,
    );
  }

  function arrow(p, dir) {
    const cy = p.y + p.h / 2;
    const span = Math.min(p.w * 0.36, 28);
    const cx = p.x + p.w / 2;
    const x1 = dir > 0 ? cx - span / 2 : cx + span / 2;
    const x2 = dir > 0 ? cx + span / 2 : cx - span / 2;
    marks.push(
      `<path d="M${x1.toFixed(1)} ${cy.toFixed(1)} H${x2.toFixed(1)} M${(x2 - dir * 7).toFixed(1)} ${(cy - 5).toFixed(1)} L${x2.toFixed(1)} ${cy.toFixed(1)} L${(x2 - dir * 7).toFixed(1)} ${(cy + 5).toFixed(1)}" fill="none" stroke="#c4473a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }

  if (item.type === "Side slide") {
    const pw = innerW / columns;
    for (let i = 0; i < columns; i += 1) {
      const p = pane(innerX + i * pw, innerY, pw, innerH);
      arrow(p, i % 2 === 0 ? 1 : -1);
    }
  } else if (item.type === "Side hung") {
    const pw = innerW / columns;
    for (let i = 0; i < columns; i += 1) {
      const p = pane(innerX + i * pw, innerY, pw, innerH);
      const opens = columns === 1 || (columns === 2 && i === 0) || (columns === 3 && i !== 1);
      if (opens) sideHung(p, i === columns - 1 && columns === 3 ? "right" : "left");
    }
  } else if (item.type === "Top hung" && columns === 2 && !openAll && (portrait || item.shape.includes("over a fixed"))) {
    const topH = innerH * 0.42;
    const top = pane(innerX, innerY, innerW, topH);
    pane(innerX, innerY + topH, innerW, innerH - topH);
    topHung(top);
  } else if (item.type === "Top hung" && portrait && openAll) {
    const ph = innerH / columns;
    for (let i = 0; i < columns; i += 1) {
      const p = pane(innerX, innerY + i * ph, innerW, ph);
      topHung(p);
    }
  } else {
    const pw = innerW / columns;
    const openAllRow = item.shape.includes("all top hung") || item.shape.includes("both top hung");
    for (let i = 0; i < columns; i += 1) {
      const p = pane(innerX + i * pw, innerY, pw, innerH);
      const opens = openAllRow || columns === 1 || (columns === 2 && i === 0);
      if (opens) topHung(p);
    }
  }

  const yDim = Math.max(22, y - 18);
  const xDim = Math.max(18, x - 22);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}">
  <rect width="${vbW}" height="${vbH}" fill="#f7f7f7"/>
  <line x1="${x.toFixed(1)}" y1="${yDim}" x2="${(x + w).toFixed(1)}" y2="${yDim}" stroke="#2f6fbe" stroke-width="1.2"/>
  <line x1="${x.toFixed(1)}" y1="${(yDim - 5).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(yDim + 5).toFixed(1)}" stroke="#2f6fbe" stroke-width="1.2"/>
  <line x1="${(x + w).toFixed(1)}" y1="${(yDim - 5).toFixed(1)}" x2="${(x + w).toFixed(1)}" y2="${(yDim + 5).toFixed(1)}" stroke="#2f6fbe" stroke-width="1.2"/>
  <text x="${(x + w / 2).toFixed(1)}" y="${(yDim - 6).toFixed(1)}" text-anchor="middle" fill="#2f6fbe" font-family="Arial, sans-serif" font-size="14">${item.width}</text>
  <line x1="${xDim}" y1="${y.toFixed(1)}" x2="${xDim}" y2="${(y + h).toFixed(1)}" stroke="#2f6fbe" stroke-width="1.2"/>
  <text x="${(xDim - 6).toFixed(1)}" y="${(y + h / 2).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="#2f6fbe" font-family="Arial, sans-serif" font-size="14" transform="rotate(-90 ${(xDim - 6).toFixed(1)} ${(y + h / 2).toFixed(1)})">${item.height}</text>
  <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${frameColor}"/>
  <line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${innerX.toFixed(1)}" y2="${innerY.toFixed(1)}" stroke="#6d4b2a" stroke-width="1"/>
  <line x1="${(x + w).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(innerX + innerW).toFixed(1)}" y2="${innerY.toFixed(1)}" stroke="#6d4b2a" stroke-width="1"/>
  <line x1="${x.toFixed(1)}" y1="${(y + h).toFixed(1)}" x2="${innerX.toFixed(1)}" y2="${(innerY + innerH).toFixed(1)}" stroke="#6d4b2a" stroke-width="1"/>
  <line x1="${(x + w).toFixed(1)}" y1="${(y + h).toFixed(1)}" x2="${(innerX + innerW).toFixed(1)}" y2="${(innerY + innerH).toFixed(1)}" stroke="#6d4b2a" stroke-width="1"/>
  ${glass.join("\n  ")}
  ${marks.join("\n  ")}
</svg>
`;
}

for (const item of jaridaWindows) {
  writeFileSync(`${out}/${slug(item.code)}.svg`, svg(item));
}
console.log("wrote", jaridaWindows.length);
