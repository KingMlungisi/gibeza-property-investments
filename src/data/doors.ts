import type { Product } from "./departments";

export type CatalogueDoor = {
  code: string;
  type: string;
  width: number;
  height: number;
  shape: string;
  leaves: number;
  kind: "hinged" | "classic" | "cape" | "folding" | "patio" | "toplight" | "sidelight";
  slide?: string;
};

function hinged(kind: CatalogueDoor["kind"], type: string, widths: number[], prefix: (width: number) => string, shape: (width: number) => string): CatalogueDoor[] {
  return widths.map((width) => ({
    code: prefix(width),
    type,
    width,
    height: 2100,
    shape: shape(width),
    leaves: width <= 900 ? 1 : 2,
    kind,
  }));
}

const fullPane = hinged(
  "hinged",
  "Full pane hinged",
  [900, 1500, 1800],
  (width) => (width <= 900 ? "SHD0921" : `DHD${width / 100}21`),
  (width) => (width <= 900 ? "1 glass light, hinged" : "2 glass lights, both hinged"),
);

const classic = hinged(
  "classic",
  "Classic hinged",
  [900, 1500, 1800],
  (width) => `SCD${String(width / 100).padStart(2, "0")}21`,
  (width) => (width <= 900 ? "1 classic door, glazed upper light" : "2 classic doors, glazed upper lights"),
);

const cape = hinged(
  "cape",
  "Cape Victorian hinged",
  [900, 1500, 1800],
  (width) => `CVD${String(width / 100).padStart(2, "0")}21`,
  (width) => (width <= 900 ? "1 Cape Victorian door" : "2 Cape Victorian doors"),
);

const foldingLayouts: { panes: number; widths: number[]; note: string }[] = [
  { panes: 3, widths: [1800, 2100, 2400, 2700], note: "3 glass lights, folding" },
  { panes: 4, widths: [3000], note: "4 glass lights, folding 3+1" },
  { panes: 5, widths: [3600, 4200], note: "5 glass lights, folding" },
  { panes: 6, widths: [4800, 5400], note: "6 glass lights, folding 3+3" },
  { panes: 10, widths: [5600], note: "10 glass lights, folding 5+5" },
];

const folding: CatalogueDoor[] = foldingLayouts.flatMap((layout) =>
  layout.widths.flatMap((width) =>
    [2100, 2400].map((height) => ({
      code: `SFD${width / 100}${height === 2100 ? "21" : "24"}`,
      type: "Sliding folding",
      width,
      height,
      shape: layout.note,
      leaves: layout.panes,
      kind: "folding" as const,
    })),
  ),
);

function patio(pattern: string, widths: number[], shape: string): CatalogueDoor[] {
  return widths.map((width) => ({
    code: `SD${pattern}${width / 100}21`,
    type: "Patio sliding",
    width,
    height: 2100,
    shape,
    leaves: pattern.length,
    kind: "patio" as const,
    slide: pattern,
  }));
}

const patioDoors: CatalogueDoor[] = [
  ...patio("OX", [1500, 1800, 2100, 2400, 2700, 3000], "2 glass lights, one slides"),
  ...patio("OXX", [2700, 3000, 3600, 4200, 4500], "3 glass lights, two slide"),
  ...patio("OXXO", [3000, 3600, 4200, 4500, 4800, 6000], "4 glass lights, centre pair slides"),
  ...patio("OXXXXO", [4500, 5400, 6000], "6 glass lights, four slide"),
];

const topLightWidths = [1500, 1800, 2100, 2400, 2700, 3000, 3600];
const topLights: CatalogueDoor[] = [300, 600].flatMap((height) =>
  topLightWidths.map((width) => ({
    code: `TL${width / 100}${height === 300 ? "3" : "6"}`,
    type: "Top light",
    width,
    height,
    shape: width >= 2400 ? "2 glass lights, fixed over the door" : "1 glass light, fixed over the door",
    leaves: width >= 2400 ? 2 : 1,
    kind: "toplight" as const,
  })),
);

const sideLights: CatalogueDoor[] = [300, 600, 900].map((width) => ({
  code: `SL${width / 100}21`,
  type: "Side light",
  width,
  height: 2100,
  shape: "1 glass light, fixed beside the door",
  leaves: 1,
  kind: "sidelight" as const,
}));

export const jaridaDoors: CatalogueDoor[] = [...fullPane, ...classic, ...cape, ...folding, ...patioDoors, ...topLights, ...sideLights];

function doorArt(code: string) {
  const slug = code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `/doors/${slug}.svg`;
}

export function doorProducts(): Product[] {
  return jaridaDoors.map((item) => ({
    name: `${item.code} · ${item.type}`,
    detail: `${item.width} × ${item.height} mm. ${item.shape}. Clear toughened 6 mm, or clear 6.38 mm.`,
    image: doorArt(item.code),
    material: 0,
    markup: 0,
  }));
}
