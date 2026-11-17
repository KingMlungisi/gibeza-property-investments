import { useId, useRef, useState } from "react";

const VIEW = "/photos/hort-lawn.jpg";

export function openingKind(name: string) {
  if (/top light|side light/i.test(name)) return null;
  if (/top hung/i.test(name)) return "top" as const;
  if (/side hung/i.test(name)) return "side" as const;
  if (/fold/i.test(name)) return "fold" as const;
  if (/patio|sliding door|slide door|side slide/i.test(name)) return "slide" as const;
  if (/hinged|classic|cape victorian|full pane/i.test(name)) return "door" as const;
  return null;
}

function Frame({ kind, ajar, colour }: { kind: NonNullable<ReturnType<typeof openingKind>>; ajar: boolean; colour: string }) {
  const clip = useId().replace(/:/g, "");
  const swing = kind === "top" ? `rotate(-12 100 46)` : `rotate(-18 46 100)`;
  const slide = kind === "slide" ? 40 : kind === "fold" ? 22 : 0;
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <rect width="200" height="200" fill="#f7f7f7" />
      <rect x="24" y="24" width="152" height="152" fill={colour} />
      <clipPath id={clip}>
        <rect x="42" y="42" width="116" height="116" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {ajar ? (
          <image href={VIEW} x="42" y="42" width="116" height="116" preserveAspectRatio="xMidYMid slice" />
        ) : (
          <rect x="42" y="42" width="116" height="116" fill="#d4ebf8" />
        )}
      </g>
      {kind === "fold" ? (
        <g>
          <rect x={42 - (ajar ? slide : 0)} y="42" width="54" height="116" fill="none" stroke={colour} strokeWidth="7" />
          <rect x={104 + (ajar ? slide : 0)} y="42" width="54" height="116" fill="none" stroke={colour} strokeWidth="7" />
        </g>
      ) : (
        <g transform={ajar && kind !== "slide" ? swing : undefined}>
          <rect x={42 + (ajar && kind === "slide" ? slide : 0)} y="42" width="116" height="116" fill="none" stroke={colour} strokeWidth="7" />
        </g>
      )}
    </svg>
  );
}

export function SashSlider({ kind, colour }: { kind: NonNullable<ReturnType<typeof openingKind>>; colour: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.5);

  function place(clientX: number) {
    const rect = box.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(0.92, Math.max(0.08, (clientX - rect.left) / rect.width)));
  }

  return (
    <div ref={box} className="relative aspect-square w-full overflow-hidden bg-[#f7f7f7]">
      <Frame kind={kind} ajar colour={colour} />
      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${(1 - pos) * 100}% 0 0)` }}>
        <Frame kind={kind} ajar={false} colour={colour} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${pos * 100}%` }} />
      <div
        className="absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none place-items-center rounded-full border border-ink bg-white text-xs font-semibold text-ink shadow"
        style={{ left: `${pos * 100}%` }}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) place(event.clientX);
        }}
      >
        ↔
      </div>
    </div>
  );
}
