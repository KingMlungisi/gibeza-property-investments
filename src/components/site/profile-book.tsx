import { memo, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { PageFlip } from "page-flip/dist/js/page-flip.module.js";
import { LogoMark } from "@/components/site/logo-mark";
import { roomPages, type RoomPage } from "@/data/room-pages";

export function ProfileBook({ token, files }: { token: string; files: Record<string, "pdf" | "image"> }) {
  const flipRef = useRef<PageFlip | null>(null);
  const [page, setPage] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const [zoom, setZoom] = useState(920);
  const onFlip = useRef<(index: number) => void>(() => {});
  const onMode = useRef<(mode: string) => void>(() => {});
  onFlip.current = setPage;
  onMode.current = (mode) => setPortrait(mode === "portrait");

  useEffect(() => {
    flipRef.current?.update();
  }, [zoom]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        if (event.key === "ArrowRight") flipRef.current?.flipNext();
        if (event.key === "ArrowLeft") flipRef.current?.flipPrev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const right = portrait ? page : page + 1;
  const single = portrait || page === 0 || page >= roomPages.length - 1;
  const parts = ["Profile", "Company papers"] as const;

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <nav aria-label="Profile index" className="rounded-lg border border-line bg-card p-4 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <p className="text-xs font-semibold tracking-widest text-orange">INDEX</p>
        {parts.map((part) => (
          <div key={part} className="mt-4">
            <p className="text-xs font-semibold tracking-widest text-muted">{part.toUpperCase()}</p>
            <ul className="mt-2 space-y-1">
              {roomPages.map((item, index) =>
                item.part === part ? (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => flipRef.current?.flip(index)}
                      className={
                        "w-full rounded-md px-2 py-2 text-left " +
                        (index === page || (!single && index === right) ? "bg-ink text-paper" : "hover:bg-paper")
                      }
                    >
                      <span className="block text-sm font-semibold">{item.title}</span>
                      <span className={"mt-0.5 block text-xs " + (index === page || (!single && index === right) ? "text-paper/70" : "text-muted")}>
                        {item.description}
                      </span>
                    </button>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ))}
      </nav>
      <div>
        <div className="rounded-xl bg-[#1c1916] p-3 shadow-xl sm:p-5">
          <div className="mx-auto w-full min-w-0" style={{ width: "min(100%, " + zoom + "px)", maxWidth: "calc(100vw - 2rem)" }}>
            <FlipStage token={token} files={files} flipRef={flipRef} onFlip={onFlip} onMode={onMode} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[#f6f1e7]">
            <button type="button" onClick={() => flipRef.current?.flipPrev()} className="border border-white/20 px-4 py-2 text-sm font-semibold">
              Previous
            </button>
            <p className="text-sm">
              {single || !roomPages[right] ? page + 1 : `${page + 1}–${Math.min(right + 1, roomPages.length)}`} of {roomPages.length}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setZoom((value) => Math.max(640, value - 140))} className="border border-white/20 px-3 py-2 text-sm font-semibold">
                −
              </button>
              <button type="button" onClick={() => setZoom((value) => Math.min(1100, value + 140))} className="border border-white/20 px-3 py-2 text-sm font-semibold">
                +
              </button>
            </div>
            <button type="button" onClick={() => flipRef.current?.flipNext()} className="bg-orange px-4 py-2 text-sm font-semibold text-paper">
              Next
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {roomPages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => flipRef.current?.flip(index)}
                className={
                  "h-14 w-11 shrink-0 rounded-sm border text-[9px] leading-tight " +
                  (index === page || (!single && index === right) ? "border-orange bg-orange text-paper" : "border-white/20 bg-[#2a2622] text-[#f6f1e7]/80")
                }
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">Drag a corner to turn the page. The arrows do the same.</p>
      </div>
    </div>
  );
}

const FlipStage = memo(function FlipStage({
  token,
  files,
  flipRef,
  onFlip,
  onMode,
}: {
  token: string;
  files: Record<string, "pdf" | "image">;
  flipRef: RefObject<PageFlip | null>;
  onFlip: RefObject<(index: number) => void>;
  onMode: RefObject<(mode: string) => void>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let flip: PageFlip | null = null;
    const frame = window.requestAnimationFrame(() => {
      const pages = Array.from(host.querySelectorAll<HTMLElement>(".flip-page"));
      if (pages.length === 0 || !host.isConnected) return;
      const box = host.clientWidth || 360;
      const narrow = box < 720;
      const pageWidth = narrow ? Math.max(280, Math.floor(box)) : 460;
      const pageHeight = narrow ? Math.round(pageWidth * 1.35) : 640;
      flip = new PageFlip(host, {
        width: pageWidth,
        height: pageHeight,
        size: "stretch",
        minWidth: narrow ? pageWidth : 280,
        maxWidth: narrow ? pageWidth : 560,
        minHeight: narrow ? pageHeight : 390,
        maxHeight: narrow ? pageHeight : 780,
        showCover: true,
        drawShadow: true,
        flippingTime: 900,
        usePortrait: true,
        autoSize: true,
        maxShadowOpacity: 0.35,
        mobileScrollSupport: false,
        useMouseEvents: true,
        showPageCorners: true,
        disableFlipByClick: false,
        swipeDistance: 30,
      });
      flip.loadFromHTML(pages);
      flip.on("flip", (event) => onFlip.current(Number(event.data)));
      flip.on("changeOrientation", (event) => onMode.current(String(event.data)));
      flipRef.current = flip;
    });
    return () => {
      window.cancelAnimationFrame(frame);
      flip?.destroy();
      flipRef.current = null;
    };
  }, [flipRef, onFlip, onMode]);

  return (
    <div ref={hostRef}>
      {roomPages.map((item, index) => (
        <div key={item.id} className="flip-page bg-[#f6f1e7]" data-density="hard">
          <Sheet page={item} number={index + 1} token={token} kind={files[item.id]} edge={index % 2 === 0 ? "left" : "right"} />
        </div>
      ))}
    </div>
  );
});

function Sheet({
  page,
  number,
  token,
  kind,
  edge,
}: {
  page: RoomPage;
  number: number;
  token: string;
  kind?: "pdf" | "image";
  edge: "left" | "right";
}) {
  const src = kind ? `/api/room-file?id=${page.id}&token=${encodeURIComponent(token)}` : "";
  return (
    <article
      className={
        "relative flex h-full flex-col overflow-y-auto bg-[#f6f1e7] text-[#1a1714] " +
        (edge === "left" ? "lg:shadow-[inset_-18px_0_24px_-20px_rgba(0,0,0,0.45)]" : "lg:shadow-[inset_18px_0_24px_-20px_rgba(0,0,0,0.45)]")
      }
    >
      {kind === "image" ? (
        <img src={src} alt="" className="h-full h-full w-full object-contain" />
      ) : kind === "pdf" ? (
        <iframe title={page.title} src={src} className="h-full w-full flex-1 bg-white" />
      ) : (
        <ProfileSheet id={page.id} page={page} number={number} />
      )}
      {kind ? (
        <p className="absolute bottom-3 right-4 text-[10px] tracking-widest text-[#1a1714]/50">
          {String(number).padStart(2, "0")}
        </p>
      ) : null}
    </article>
  );
}

function ProfileSheet({ id, page, number }: { id: string; page: RoomPage; number: number }) {
  if (id === "cover") return <Cover />;
  if (id === "background") return <Background number={number} />;
  if (id === "services") return <Services number={number} />;
  if (id === "supply") return <ShopPage number={number} />;
  if (id === "hire") return <Hire number={number} />;
  if (id === "people") return <People number={number} />;
  if (id === "sheq") return <Sheq number={number} />;
  if (id === "structure") return <Structure number={number} />;
  if (id === "clients") return <Clients number={number} />;
  if (id === "references") return <References number={number} />;
  if (id === "offices") return <Offices number={number} />;
  return <Waiting page={page} number={number} />;
}

function Frame({
  kicker,
  title,
  number,
  children,
}: {
  kicker: string;
  title: string;
  number: number;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-1 flex-col p-7 sm:p-9">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-orange">{kicker}</p>
      <h2 className="mt-2 font-display text-[1.7rem] font-extrabold leading-none">{title}</h2>
      <div className="mt-4 text-[13px] leading-relaxed">{children}</div>
      <p className="mt-auto pt-6 text-[10px] tracking-[0.2em] text-[#1a1714]/40">{String(number).padStart(2, "0")}</p>
    </div>
  );
}

function Cover() {
  return (
    <div className="flex h-full flex-1 flex-col bg-[#141210] px-8 py-10 text-[#f6f1e7]">
      <LogoMark variant="day" className="logo-day h-28 rounded-md bg-[#f6f1e7] p-2" alt="" />
      <LogoMark variant="night" className="logo-night h-28" alt="" />
      <div className="mt-auto">
        <div className="mb-5 h-px w-16 bg-orange" />
        <p className="text-[11px] font-semibold tracking-[0.28em] text-orange">COMPANY PROFILE</p>
        <h2 className="mt-3 font-display text-[2rem] font-extrabold leading-[0.95] sm:text-[2.6rem]">
          Gibeza
          <br />
          Property
          <br />
          Investments
        </h2>
        <p className="mt-4 max-w-xs text-sm text-[#f6f1e7]/75">
          Building, engineering, glazing and supply. Close corporation. Level 1 BBBEE.
        </p>
      </div>
      <p className="mt-10 text-[10px] tracking-[0.2em] text-[#f6f1e7]/40">01</p>
    </div>
  );
}

function Background({ number }: { number: number }) {
  return (
    <Frame kicker="BACKGROUND" title="More than a decade of building and supply." number={number}>
      <p>
        Gibeza Property Investments CC was founded for construction, property development and the work that sits beside it: mining, civil and mechanical.
      </p>
      <p className="mt-3">
        The first years were in the private sector. Along the way the company started and ran projects for emerging contractors on government work. That record is now being taken into mining, the public sector, and contracts outside South Africa.
      </p>
      <p className="mt-5 font-semibold">What we aim for</p>
      <p className="mt-1">
        The trades already have standards. We try to sit above them, through training, partnerships and the way a job is run.
      </p>
      <p className="mt-3">
        Do the work properly, stay useful to the client, and mean service, honesty and integrity when we say them.
      </p>
    </Frame>
  );
}

function Services({ number }: { number: number }) {
  const groups = [
    ["Building, maintenance and renovations", "General building, roofs, paint, plaster, tiling and ongoing maintenance."],
    ["Civil and mechanical", "Road signs and markings, speed humps, guard rails, and mechanical work on the site."],
    ["Electrical and plumbing", "Domestic and industrial electrical, plumbing, geysers, solar, CCTV, access control and lighting."],
    ["Glazing", "Wispeco-trained shopfronts, windows, sliding and folding doors, showers and entrances."],
    ["Horticulture", "Grass cutting, landscaping and grounds care."],
    ["Medical devices and supply", "Devices and related supply for clinics, hospitals and other medical buyers."],
  ];
  return (
    <Frame kicker="CONSTRUCTION" title="Six sections. The work sits under each one." number={number}>
      <ul className="space-y-2.5">
        {groups.map(([title, text]) => (
          <li key={title}>
            <span className="font-semibold">{title}.</span> {text}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function ShopPage({ number }: { number: number }) {
  return (
    <Frame kicker="SHOP" title="Off the shelf, or ordered for the job." number={number}>
      <ul className="space-y-2.5">
        <li>
          <span className="font-semibold">Glass and aluminium.</span> Commercial and residential glass, including fire-resistant, safety, intruder-resistant, acoustic and ColourVue. Aluminium doors and frames.
        </li>
        <li>
          <span className="font-semibold">Tools and machines.</span> Garden tools, drills, chainsaws, pruners, mill cutters, mitre saws and grinders.
        </li>
        <li>
          <span className="font-semibold">Office support.</span> Printers, toners and cartridges, computers, peripherals, accessories, storage and software support. Stationery for the office, school and tertiary.
        </li>
        <li>
          <span className="font-semibold">Building and construction.</span> Materials for the build. Cleaning equipment, janitorial supplies and SABS-approved chemicals.
        </li>
      </ul>
      <p className="mt-4 text-[#1a1714]/70">Larger contract quantities are bought under Procurement, against the job.</p>
    </Frame>
  );
}

function Hire({ number }: { number: number }) {
  return (
    <Frame kicker="RENTAL" title="Hired for the duration of the job." number={number}>
      <p>An operator comes with the machine when the job needs one.</p>
      <ul className="mt-3 space-y-2.5">
        <li>
          <span className="font-semibold">Plant.</span> Trucks, mixers, forklifts, cranes, pickups, cars, trailers and scaffolding. Generators from small sets to 3-phase. Welding machines from small to industrial. Mobile offices.
        </li>
        <li>
          <span className="font-semibold">Power tools.</span> Electrical and cordless tools, pruners, mitre saws and angle grinders.
        </li>
        <li>
          <span className="font-semibold">Temporary road traffic signs.</span> Standard yellow signs, and the electronics that go with them.
        </li>
      </ul>
    </Frame>
  );
}

function People({ number }: { number: number }) {
  return (
    <Frame kicker="PEOPLE" title="A small company, trained for the work." number={number}>
      <p>
        The founder spent ten years in the public sector. Since 2018 that experience, and study through the Tshwane University of Technology and Unisa, has sat inside Gibeza.
      </p>
      <ul className="mt-3 space-y-2">
        <li>Sales consultants who stay available to the client.</li>
        <li>Vehicles and delivery staff, so an order arrives when it should.</li>
        <li>An office that stays open through the year.</li>
        <li>Staff trained in their own work, and affiliated where the law asks for it.</li>
      </ul>
      <p className="mt-4 font-semibold">Why clients stay</p>
      <p className="mt-1">
        We work with developers, architects, contractors and consulting engineers. Level 1 BBBEE. The legal formalities are kept. There is no room for corruption.
      </p>
    </Frame>
  );
}

function Sheq({ number }: { number: number }) {
  return (
    <Frame kicker="SHEQ" title="Safety, health, environment and quality sit inside the job." number={number}>
      <p>
        SHEQ is part of how the company works, not a file that is opened afterwards. The aim is to limit harm to people, the site and the surroundings, and to review the way it is done.
      </p>
      <ul className="mt-3 space-y-2">
        <li>Management systems aligned with ISO 9001, ISO 14001 and ISO 45001.</li>
        <li>The law as the minimum, and further measures where the site needs them.</li>
        <li>A safe workplace, with the information and training the crew needs.</li>
        <li>Subcontractors screened against the same safety standard.</li>
        <li>Performance watched, and improved.</li>
      </ul>
    </Frame>
  );
}

function Structure({ number }: { number: number }) {
  const rows = [
    ["Managing Director", ""],
    ["General Manager", ""],
    ["Administrative Officer", "Bidding office"],
    ["Accounts", "Bookkeeping"],
    ["Sales Manager", "Market manager and sales representatives"],
    ["Project Manager", "Operations manager"],
  ];
  return (
    <Frame kicker="STRUCTURE" title="How the company is organised." number={number}>
      <ul className="divide-y divide-[#1a1714]/10 border-y border-[#1a1714]/10">
        {rows.map(([role, under]) => (
          <li key={role} className="flex items-baseline justify-between gap-4 py-2.5">
            <span className="font-semibold">{role}</span>
            <span className="text-right text-[#1a1714]/65">{under}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function Clients({ number }: { number: number }) {
  return (
    <Frame kicker="CLIENTS" title="Private, public, mining and residential." number={number}>
      <ul className="space-y-1.5">
        <li>Private firms, dealerships, hotels, gyms, lodges and international companies.</li>
        <li>Local, district, metropolitan, provincial and national government, and state-owned entities.</li>
        <li>Mining.</li>
        <li>Embassies.</li>
        <li>Houses and residential estates.</li>
      </ul>
      <p className="mt-4">
        The work follows the Occupational Health and Safety Act, COIDA, the National Building Regulations, and the environmental and agricultural law that applies to grounds and chemical work.
      </p>
    </Frame>
  );
}

function References({ number }: { number: number }) {
  const items = [
    ["Bidvest McCarthy Toyota", "Titi Rantso", "Boardroom refurbishment, maintenance and plumbing.", "R460 000, plus emergency call-outs."],
    ["Realnet", "Nicolas Gouws", "Residential property maintenance.", "Ongoing, as and when."],
    ["JorudSolutions CC", "Matome Matjila", "Plant hire and road traffic management.", "R139 000."],
    ["City of Tshwane", "Johannes Msiza", "Electrical standby generator maintenance.", "R120 000."],
  ];
  return (
    <Frame kicker="REFERENCES" title="Work already done." number={number}>
      <ul className="space-y-3">
        {items.map(([client, person, job, value]) => (
          <li key={client}>
            <p className="font-semibold">{client}</p>
            <p className="text-[#1a1714]/75">
              {person}. {job} {value}
            </p>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function Offices({ number }: { number: number }) {
  const places = [
    ["Head office", "332 Zone HH, Soshanguve, Pretoria, 0152"],
    ["Postal", "Duplex 9, 38 Basuin Crescent, Pretorius Park, Garsfontein, 0081"],
    ["Vereeniging", "12 Jan Hettema Street, Unitas Park, 1943"],
    ["Kuruman", "41 Boikhutso Street, Mothibistad, 8460"],
    ["uPhongolo", "B845 Sikhosana Street, Ncotshane, 3170"],
  ];
  return (
    <Frame kicker="OFFICES" title="Where to find us." number={number}>
      <ul className="space-y-2.5">
        {places.map(([name, line]) => (
          <li key={name}>
            <span className="font-semibold">{name}.</span> {line}
          </li>
        ))}
      </ul>
      <p className="mt-5">mcsidu@gmail.com</p>
    </Frame>
  );
}

function Waiting({ page, number }: { page: RoomPage; number: number }) {
  return (
    <div className="flex h-full flex-1 flex-col p-8 sm:p-10">
      <p className="text-xs font-semibold tracking-widest text-orange">{page.part.toUpperCase()}</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold">{page.title}</h2>
      <p className="mt-4 text-sm leading-relaxed">{page.description}</p>
      <div className="mt-8 flex flex-1 items-center justify-center border border-dashed border-[#1a1714]/20">
        <p className="px-6 text-center text-sm text-[#1a1714]/50">This document will be placed here.</p>
      </div>
      <p className="mt-6 text-xs tracking-widest text-[#1a1714]/40">{String(number).padStart(2, "0")}</p>
    </div>
  );
}
