import { useMemo, useState } from "react";
import type { Product } from "@/data/departments";
import { shelfPrice } from "@/data/departments";
import { extrusionFinishes, findFinish, glassLimit, windowSystems } from "@/data/windows";

function money(amount: number) {
  const [whole, frac] = amount.toFixed(2).split(".");
  return `R ${whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}.${frac}`;
}

function glassThickness(name: string) {
  return Number((name.match(/(\d+(?:\.\d+)?)\s*mm/i) || [])[1] || 0);
}

export function WindowStudio({
  systemId: initialId,
  glasses,
  image,
  colourName,
  onAdd,
}: {
  systemId: string;
  glasses: Product[];
  image: string;
  colourName?: string;
  onAdd: (name: string) => void;
}) {
  const [systemId, setSystemId] = useState(initialId);
  const system = windowSystems.find((item) => item.id === systemId) ?? windowSystems[0];
  const [width, setWidth] = useState(system.minW === system.maxW ? system.minW : Math.round((system.minW + system.maxW) / 2 / 100) * 100);
  const [height, setHeight] = useState(system.minH);
  const [panes, setPanes] = useState(system.panes);
  const [colour, setColour] = useState(colourName || extrusionFinishes[0].colours[0].name);
  const [glassName, setGlassName] = useState("");

  const paneArea = (Math.max(width, 1) / 1000) * (Math.max(height, 1) / 1000) / Math.max(panes, 1);
  const windowGlasses = useMemo(
    () =>
      glasses
        .filter((glass) => glassThickness(glass.name) >= 4)
        .sort((a, b) => Number(a.name !== "4mm Clear Float Glass") - Number(b.name !== "4mm Clear Float Glass")),
    [glasses],
  );
  const choices = useMemo(
    () =>
      windowGlasses.map((glass) => ({
        glass,
        rule: glassLimit(glass.name, paneArea, Boolean(system.safetyOnly)),
      })),
    [windowGlasses, paneArea, system.safetyOnly],
  );
  const picked = choices.find((choice) => choice.glass.name === glassName && choice.rule.ok) ?? choices.find((choice) => choice.rule.ok);
  const finish = findFinish(colour);
  const lightFrame = Boolean(finish && "light" in finish && finish.light) || colour === "White" || colour === "Natural anodised" || colour === "Mill finish";
  const outside = width < system.minW || width > system.maxW || height < system.minH || height > system.maxH;
  const glassCost = picked?.glass.material ? picked.glass.material * paneArea * Math.max(panes, 1) : 0;

  return (
    <div className="relative min-h-80 overflow-hidden bg-black">
      <img src={system.image || image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="relative grid gap-4 p-4 text-white sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#e7b7bc]">WINDOW</p>
          <h2 className="mt-1 text-2xl font-bold">{system.name}</h2>
          <p className="mt-3 text-sm text-white/80">
            {width || "—"} × {height || "—"} mm · {panes} pane{panes === 1 ? "" : "s"} · {colour}
          </p>
          <p className="mt-1 text-sm text-white/80">{picked ? picked.glass.name : "Choose a glass that fits this pane"}</p>
          <p className="mt-4 text-sm">
            {glassCost ? `Glass ${money(glassCost)} cut to size. Frame price still to be confirmed.` : "Frame and glass price still to be confirmed."}
          </p>
          <div className="mt-4 border border-white/20 p-3" style={{ background: lightFrame ? "#bdbdbd" : "#f7f7f7" }}>
            <svg viewBox="0 0 220 150" className="mx-auto h-36 w-full">
              <rect x="30" y="28" width="160" height="100" fill={finish?.swatch ?? "#8c6239"} />
              <rect x="48" y="44" width="124" height="68" fill="#d4ebf8" />
              <path d="M48 44 L110 112 L172 44" fill="none" stroke="#c4473a" strokeWidth="1.4" strokeDasharray="5 4" />
            </svg>
          </div>
        </div>
        <div className="grid gap-2">
          <label className="grid gap-1 text-xs font-semibold tracking-wide text-[#e7b7bc]">
            SYSTEM
            <select
              value={system.id}
              onChange={(event) => {
                const next = windowSystems.find((item) => item.id === event.target.value);
                if (!next) return;
                setSystemId(next.id);
                setPanes(next.panes);
                setWidth(next.minW);
                setHeight(next.minH);
                setGlassName("");
              }}
              className="border border-white/30 bg-black/50 px-3 py-2 text-sm font-medium text-white"
            >
              {windowSystems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="grid gap-1 text-xs font-semibold tracking-wide text-[#e7b7bc]">
              WIDTH MM
              <input
                type="number"
                min={200}
                value={width}
                onChange={(event) => setWidth(Number(event.target.value))}
                className="border border-white/30 bg-black/50 px-2 py-2 text-sm text-white"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold tracking-wide text-[#e7b7bc]">
              HEIGHT MM
              <input
                type="number"
                min={200}
                value={height}
                onChange={(event) => setHeight(Number(event.target.value))}
                className="border border-white/30 bg-black/50 px-2 py-2 text-sm text-white"
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold tracking-wide text-[#e7b7bc]">
              PANES
              <input
                type="number"
                min={1}
                max={10}
                value={panes}
                onChange={(event) => setPanes(Math.max(1, Number(event.target.value)))}
                className="border border-white/30 bg-black/50 px-2 py-2 text-sm text-white"
              />
            </label>
          </div>
          <p className={"text-xs " + (outside ? "text-[#ffb4a8]" : "text-white/70")}>
            {outside
              ? `Outside the standard range of ${system.minW}–${system.maxW} mm wide and ${system.minH}–${system.maxH} mm high. We can still price a special.`
              : `Standard extrusion range ${system.minW}–${system.maxW} mm wide, ${system.minH}–${system.maxH} mm high.`}
          </p>
          <div className="grid gap-2">
            <p className="text-xs font-semibold tracking-wide text-[#e7b7bc]">EXTRUSION COLOUR</p>
            {extrusionFinishes.map((group) => (
              <div key={group.group}>
                <p className="text-[10px] font-semibold tracking-widest text-white/50">{group.group.toUpperCase()}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {group.colours.map((item) => {
                    const chosen = colour === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setColour(item.name)}
                        className={"flex w-16 flex-col items-center gap-1 text-[10px] font-semibold " + (chosen ? "text-white" : "text-white/70")}
                      >
                        <span
                          className={"h-8 w-8 border " + (chosen ? "border-[#e7b7bc] ring-2 ring-[#e7b7bc]" : "border-white/40")}
                          style={{ background: item.swatch }}
                        />
                        {item.name.replace(" anodised", "").replace(" finish", "")}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <label className="grid gap-1 text-xs font-semibold tracking-wide text-[#e7b7bc]">
            GLASS FROM 4 MM
            <select
              value={picked?.glass.name ?? ""}
              onChange={(event) => setGlassName(event.target.value)}
              className="border border-white/30 bg-black/50 px-3 py-2 text-sm font-medium text-white"
            >
              {choices.map(({ glass, rule }) => (
                <option key={glass.name} value={glass.name} disabled={!rule.ok}>
                  {glass.name}
                  {rule.ok ? "" : ` — ${rule.note}`}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-white/80">{picked ? picked.rule.note : "No glass on the list is allowed at this pane size."}</p>
          {picked?.glass.material ? <p className="text-xs text-white/70">{shelfPrice(picked.glass)} / m² cut to size.</p> : null}
          <button
            type="button"
            disabled={!picked || width < 200 || height < 200}
            onClick={() =>
              onAdd(
                `${system.name} · ${width} × ${height} mm · ${panes} pane${panes === 1 ? "" : "s"} · ${colour} · ${picked?.glass.name}`,
              )
            }
            className="bg-[#9b4e5c] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Add this window
          </button>
        </div>
      </div>
    </div>
  );
}
