import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { departments, productSlug } from "@/data/departments";
import { Shell } from "@/components/site/shell";

export const Route = createFileRoute("/")({ component: Home });

const doors = [
  { to: "/rental", title: "Rental", text: "Plant, vehicles, cranes and generators, with operators." },
  { to: "/shop", title: "Shop", text: "Glass and aluminium, tools, office support and building materials." },
  { to: "/procurement", title: "Procurement", text: "Materials and plant parts sourced for the job." },
  { to: "/about", title: "About us", text: "Who we are, who we work for, and how we work." },
] as const;

const clients = [
  { name: "PRASA", src: "/clients/prasa.svg", zoom: 1.1, caption: false },
  { name: "Steve Biko Academic Hospital", src: "/clients/biko.png", zoom: 1.08, caption: false },
  { name: "Dr George Mukhari Hospital", src: "/clients/mukhari.png", zoom: 1.08, caption: false },
  { name: "S.G. Lourens Nursing College", src: "/clients/lourens.png", zoom: 1.05, caption: false },
  { name: "Sefako Makgatho Health Sciences University", src: "/clients/sefako.png", zoom: 1.05, caption: false },
  { name: "SAPS", src: "/clients/saps.png", zoom: 1.2, caption: false },
  { name: "Fumani Game Lodge", src: "/clients/fumani.png", zoom: 1.12, caption: false },
  { name: "Nkangala TVET College", src: "/clients/nkangala.png", zoom: 1.15, caption: false },
  { name: "Khensani Restaurant", src: "/clients/khensani.png", zoom: 1.12, caption: false },
  { name: "Toyota McCarthy", src: "/clients/toyota.svg", zoom: 1.15, caption: false },
  { name: "Capotex Construction", src: "/clients/capotex.png", zoom: 1, caption: false },
];

const construction = departments.find((item) => item.id === "construction")!;

function scaleFor(distance: number) {
  if (distance < 130) return 1;
  if (distance < 320) return 1 - ((distance - 130) / 190) * 0.22;
  if (distance < 560) return 0.78 - ((distance - 320) / 240) * 0.26;
  return 0.52;
}

function Clients() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const root = trackRef.current;
      if (root) {
        const mid = window.innerWidth / 2;
        for (const el of root.querySelectorAll<HTMLElement>("[data-client]")) {
          const box = el.getBoundingClientRect();
          const distance = Math.abs(box.left + box.width / 2 - mid);
          const scale = scaleFor(distance);
          el.style.transform = `scale(${scale})`;
          el.style.zIndex = String(Math.round(scale * 100));
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const row = [...clients, ...clients];

  return (
    <section className="overflow-hidden border-y border-line bg-card py-28 md:py-36">
      <p className="text-center text-xs font-semibold tracking-widest text-orange">CLIENTS</p>
      <div className="mt-14 flex h-48 items-center">
        <div ref={trackRef} className="client-track flex w-max items-center gap-8">
          {row.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              data-client
              className="flex h-36 w-64 shrink-0 items-center justify-center overflow-hidden border border-line bg-white px-4"
            >
              {client.src ? (
                <span className="flex h-full w-full flex-col items-center justify-center">
                  <img
                    src={client.src}
                    alt={client.name}
                    className="max-h-24 max-w-full object-contain"
                    style={{ transform: `scale(${client.zoom})` }}
                  />
                  {client.caption ? <span className="mt-1 text-center text-[11px] font-semibold leading-tight text-ink">{client.name}</span> : null}
                </span>
              ) : (
                <p className="font-display text-2xl font-bold leading-tight text-ink">{client.name}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const HERO_W = 3584;
const HERO_H = 2016;

// Photo pixels of each crane tip. The phone only shows the centre crane.
const craneLamps = [
  { x: 710, y: 134, delay: "0.62s", side: true },
  { x: 1759, y: 237, delay: "0.62s", side: false },
  { x: 3094, y: 72, delay: "1.05s", side: true },
];

const buildingGlints = [{ x: 1688, y: 860, delay: "0.62s" }];

function Home() {
  return (
    <Shell>
      <section className="relative min-h-[92vh] overflow-hidden bg-[#141414] text-[#f4f1ec]">
        <img src="/photos/hero-day.jpg" alt="" className="hero-photo hero-day" />
        <img
          src="/photos/hero-night.jpg"
          alt="Cranes over a partly glazed commercial building"
          className="hero-photo hero-night"
        />
        <div className="hero-shade" />
        <svg
          viewBox={`0 0 ${HERO_W} ${HERO_H}`}
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="crane-lamp-fill">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="10%" stopColor="#fff" />
              <stop offset="32%" stopColor="#ff2412" />
              <stop offset="52%" stopColor="rgba(255,16,0,0.45)" />
              <stop offset="70%" stopColor="rgba(255,16,0,0)" />
            </radialGradient>
          </defs>
          {craneLamps.map((lamp) => (
            <circle
              key={`${lamp.x}-${lamp.y}`}
              className={lamp.side ? "crane-dot crane-side" : "crane-dot"}
              cx={lamp.x}
              cy={lamp.y}
              r="26"
              fill="url(#crane-lamp-fill)"
              style={{ animationDelay: lamp.delay }}
            />
          ))}
          <g className="crane-glint">
            {buildingGlints.map((lamp) => (
              <circle
                key={`${lamp.x}-${lamp.y}`}
                className="crane-dot"
                cx={lamp.x}
                cy={lamp.y}
                r="14"
                fill="url(#crane-lamp-fill)"
                style={{ animationDelay: lamp.delay }}
              />
            ))}
          </g>
        </svg>
        <div className="absolute top-0 right-0 z-[2] h-full w-3 bg-orange" aria-hidden="true" />
        <div className="relative z-[2] mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 py-24">
          <p className="text-sm font-semibold tracking-widest text-orange">GIBEZA PROPERTY INVESTMENTS</p>
          <p className="mt-4 max-w-2xl text-lg text-[#f4f1ec]/85">
            A facilities management company specializing in construction, turnkey solutions, civil and electrical works, glazing, plant hire and the supply around a site. Level 1 BBBEE.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/construction" className="bg-orange px-5 py-3 text-sm font-semibold text-white hover:bg-orange-deep">
              Construction
            </Link>
            <Link to="/contact" search={{ item: "" }} className="border border-white/40 px-5 py-3 text-sm font-semibold text-white">
              Contact us
            </Link>
          </div>
        </div>
      </section>
      <section className="border-b border-line bg-card">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {["BBBEE Level 1", "10+ years", "Wispeco-trained glazing", "SHEQ in the work"].map((item) => (
            <li key={item} className="bg-card px-4 py-8 text-sm font-semibold">
              {item}
            </li>
          ))}
        </ul>
      </section>
      <Clients />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-28">
        <p className="text-xs font-semibold tracking-widest text-orange">CONSTRUCTION</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">Six sections for the work.</h2>
        <div className="mt-8 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-8">
          {construction.groups.map((group) => (
            <Link
              key={group.title}
              to="/construction"
              hash={productSlug(group.title)}
              className="relative flex min-h-48 items-end overflow-hidden sm:min-h-72 lg:min-h-[28rem]"
            >
              <img
                src={group.cover ?? group.products[0].image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
              <span className="relative p-4 text-lg font-bold leading-tight text-white sm:p-8 sm:text-3xl">{group.title}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-t border-line">
        <ul className="mx-auto grid max-w-6xl gap-8 px-4 py-28 sm:grid-cols-2">
          {doors.map((door) => (
            <li key={door.to}>
              <Link to={door.to} className="flex min-h-56 flex-col justify-end border border-line bg-card p-8 hover:border-orange">
                <h2 className="text-3xl font-bold">{door.title}</h2>
                <p className="mt-3 max-w-md text-muted">{door.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
