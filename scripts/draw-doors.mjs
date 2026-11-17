import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { jaridaDoors } = require("/tmp/doors.cjs");

const out = "/workspace/public/doors";
mkdirSync(out, { recursive: true });

function slug(code) {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function svg(item) {
  const size = 400;
  const pad = 62;
  const aspect = item.width / item.height;
  let w;
  let h;
  if (aspect > 1) {
    w = size - pad * 2;
    h = w / aspect;
  } else {
    h = size - pad * 2;
    w = h * aspect;
  }
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  const band = 11;
  const wx = x - band;
  const wy = y - band;
  const ww = w + band * 2;
  const wh = h + band * 2;
  const frame = Math.max(16, Math.min(w, h) * 0.1);
  const mullion = frame * 0.55;
  const frameColor = "#8c6239";
  const innerX = x + frame;
  const innerY = y + frame;
  const innerW = w - frame * 2;
  const innerH = h - frame * 2;
  const glass = [];
  const marks = [];

  function pane(px, py, pw, ph) {
    glass.push(`<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${pw.toFixed(1)}" height="${ph.toFixed(1)}" fill="#d4ebf8" stroke="${frameColor}" stroke-width="${Math.max(3, mullion).toFixed(1)}"/>`);
    return { x: px, y: py, w: pw, h: ph };
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
    const span = Math.min(p.w * 0.34, 26);
    const cx = p.x + p.w / 2;
    const x1 = dir > 0 ? cx - span / 2 : cx + span / 2;
    const x2 = dir > 0 ? cx + span / 2 : cx - span / 2;
    marks.push(
      `<path d="M${x1.toFixed(1)} ${cy.toFixed(1)} H${x2.toFixed(1)} M${(x2 - dir * 6).toFixed(1)} ${(cy - 4).toFixed(1)} L${x2.toFixed(1)} ${cy.toFixed(1)} L${(x2 - dir * 6).toFixed(1)} ${(cy + 4).toFixed(1)}" fill="none" stroke="#c4473a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }

  const leaves = item.leaves;
  const pw = innerW / leaves;

  if (item.kind === "patio" && item.slide) {
    const pattern = item.slide;
    for (let i = 0; i < pattern.length; i += 1) {
      const p = pane(innerX + i * pw, innerY, pw, innerH);
      if (pattern[i] === "X") arrow(p, i < pattern.length / 2 ? 1 : -1);
    }
  } else if (item.kind === "toplight") {
    for (let i = 0; i < leaves; i += 1) pane(innerX + i * pw, innerY, pw, innerH);
  } else if (item.kind === "sidelight") {
    pane(innerX, innerY, innerW, innerH);
  } else {
    const rails = item.kind === "cape" ? 3 : item.kind === "classic" ? 2 : 1;
    for (let i = 0; i < leaves; i += 1) {
      const ph = innerH / rails;
      let door;
      for (let r = 0; r < rails; r += 1) {
        const p = pane(innerX + i * pw, innerY + r * ph, pw, ph);
        if (r === 0) door = p;
      }
      if (item.kind !== "toplight") {
        const hinge = leaves === 1 || i < leaves / 2 ? "left" : "right";
        sideHung(door, hinge);
      }
    }
  }

  const yDim = Math.max(22, y - 18);
  const xDim = Math.max(18, x - 22);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#f7f7f7"/>
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

for (const item of jaridaDoors) {
  writeFileSync(`${out}/${slug(item.code)}.svg`, svg(item));
}
console.log("wrote", jaridaDoors.length);
