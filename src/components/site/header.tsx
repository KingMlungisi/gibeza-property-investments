import { Link } from "@tanstack/react-router";
import { ChevronDown, Moon, ShoppingBag, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { departments, productSlug, type Department } from "@/data/departments";
import { prefetchShopCatalogue } from "@/data/load-shop";
import { LogoMark } from "@/components/site/logo-mark";
import { useCart } from "@/lib/cart";

type MenuId = "construction" | "rental" | "shop";

export const tabs = [
  { label: "Construction", to: "/construction", menu: "construction" },
  { label: "Rental", to: "/rental", menu: "rental" },
  { label: "Shop", to: "/shop", menu: "shop" },
  { label: "Procurement", to: "/procurement", menu: null },
  { label: "About us", to: "/about", menu: null },
  { label: "Contact us", to: "/contact", menu: null },
] as const;

function sectionsFor(id: MenuId) {
  return departments.find((item) => item.id === id)?.groups ?? [];
}

function desktopHover() {
  return window.matchMedia("(min-width: 1280px)").matches;
}

function MenuLink({
  label,
  to,
  open,
  onOpen,
  onClose,
  dense,
}: {
  label: string;
  to: Department["to"];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  dense?: boolean;
}) {
  if (dense) {
    return (
      <span className="flex min-h-11 min-w-0 items-stretch overflow-hidden">
        <Link
          to={to}
          className="flex min-w-0 flex-1 items-center justify-center px-1 text-center text-sm font-medium leading-tight text-ink hover:text-orange night:text-[#f4f1ec]"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") onClose();
          }}
        >
          {label}
        </Link>
        <button
          type="button"
          className="grid w-11 shrink-0 place-items-center text-ink night:text-[#f4f1ec]"
          aria-expanded={open}
          aria-label={open ? `Close ${label}` : `Open ${label}`}
          onClick={() => (open ? onClose() : onOpen())}
        >
          <ChevronDown className={"size-4 " + (open ? "rotate-180" : "")} aria-hidden="true" />
        </button>
      </span>
    );
  }

  return (
    <Link
      to={to}
      hash=""
      className={
        "inline-flex items-center font-medium text-ink hover:text-orange night:text-[#f4f1ec] " +
        (dense ? "min-h-11 w-full justify-center gap-1 px-1 text-sm leading-tight" : "gap-1 py-2 text-sm")
      }
      aria-expanded={open}
      aria-haspopup="true"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && desktopHover()) onOpen();
      }}
      onClick={(event) => {
        event.preventDefault();
        if (open) onClose();
        else onOpen();
      }}
    >
      {label}
      <ChevronDown className={(dense ? "size-3.5 shrink-0 " : "size-4 ") + (open ? "rotate-180" : "")} aria-hidden="true" />
    </Link>
  );
}

function applyNight(night: boolean) {
  document.documentElement.classList.toggle("night", night);
  localStorage.setItem("gibeza-theme", night ? "night" : "light");
}

function ThemeSwitch() {
  const [night, setNight] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gibeza-theme");
    const next = saved ? saved === "night" : document.documentElement.classList.contains("night");
    setNight(next);
    applyNight(next);
    setReady(true);
  }, []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={night}
      aria-label={night ? "Night. Switch to day" : "Day. Switch to night"}
      onClick={() => {
        const next = !night;
        setNight(next);
        applyNight(next);
      }}
      className={
        "relative h-8 w-14 shrink-0 rounded-full border " +
        (ready ? "" : "invisible ") +
        (night ? "border-black/10 bg-[#eceae6]" : "border-white/25 bg-black")
      }
    >
      <span
        className={
          "absolute top-0.5 flex size-6 items-center justify-center rounded-full text-white shadow transition-transform " +
          (night ? "translate-x-7 bg-[#2a2a2a]" : "translate-x-0.5 bg-white text-orange")
        }
      >
        {night ? <Moon className="size-3.5 text-[#f4f1ec]" aria-hidden="true" /> : <Sun className="size-3.5 text-orange" aria-hidden="true" />}
      </span>
    </button>
  );
}

function BasketLink({ count }: { count: number }) {
  return (
    <Link to="/basket" className="relative inline-flex min-h-11 min-w-11 items-center justify-center text-ink hover:text-orange night:text-[#f4f1ec]" aria-label={count ? `Basket, ${count} items` : "Basket"}>
      <ShoppingBag className="size-5" aria-hidden="true" />
      {count > 0 ? (
        <span className="absolute -right-2 -top-0.5 grid min-w-4 place-items-center rounded-full bg-orange px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  useEffect(() => {
    prefetchShopCatalogue();
  }, []);
  const sections = openMenu ? sectionsFor(openMenu) : [];
  const panel =
    sections.length > 3 ? "xl:w-[46rem]" : sections.length === 3 ? "xl:w-[40rem]" : "xl:w-[28rem]";
  const grid =
    sections.length === 3 ? "grid-cols-2 sm:grid-cols-3" : sections.length > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";

  useEffect(() => {
    if (!openMenu) return;
    function close(event: MouseEvent) {
      if (!bar.current?.contains(event.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenu]);

  const item = (tab: (typeof tabs)[number], dense = false) =>
    tab.menu ? (
      <MenuLink
        key={tab.to}
        label={tab.label}
        to={tab.to}
        dense={dense}
        open={openMenu === tab.menu}
        onOpen={() => setOpenMenu(tab.menu)}
        onClose={() => setOpenMenu(null)}
      />
    ) : (
      <Link
        key={tab.to}
        to={tab.to}
        className={
          "font-medium text-ink hover:text-orange night:text-[#f4f1ec] " +
          (dense ? "flex min-h-11 w-full items-center justify-center px-1 text-sm leading-tight" : "py-2 text-sm")
        }
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setOpenMenu(null);
        }}
      >
        {tab.label}
      </Link>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white text-ink night:border-white/10 night:bg-black night:text-[#f4f1ec]">
      <div
        ref={bar}
        className="relative"
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse" && desktopHover()) setOpenMenu(null);
        }}
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-stretch xl:flex xl:items-center">
          <Link
            to="/"
            className="row-span-3 shrink-0 self-center xl:row-auto"
            aria-label="Gibeza Property Investments, home"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setOpenMenu(null);
            }}
          >
            <LogoMark variant="day" className="logo-day h-32 sm:h-48 xl:h-72" />
            <LogoMark variant="night" className="logo-night h-32 sm:h-48 xl:h-72" alt="" />
          </Link>
          <nav aria-label="Primary" className="grid min-w-0 grid-cols-2 xl:hidden">
            {tabs.map((tab) => item(tab, true))}
          </nav>
          <div className="row-span-3 flex flex-col items-center justify-center gap-2 px-1.5 xl:hidden">
            <ThemeSwitch />
            <BasketLink count={count} />
          </div>
          <div className="hidden min-w-0 flex-1 items-center pl-6 pr-4 xl:flex">
            <ThemeSwitch />
            <nav aria-label="Primary" className="ml-auto flex items-center gap-4">
              {tabs.map((tab) => item(tab))}
              <BasketLink count={count} />
            </nav>
          </div>
        </div>
        {openMenu ? (
          <div
            className={
              "absolute right-0 top-full z-50 w-full before:absolute before:-top-3 before:left-0 before:h-3 before:right-0 " +
              panel
            }
          >
            <div className={"grid max-h-[70vh] gap-2 overflow-y-auto rounded-lg border border-line bg-card p-3 text-ink shadow-lg sm:gap-3 " + grid}>
              {sections.map((section) => (
                <Link
                  key={section.title}
                  to={openMenu === "construction" ? "/construction" : openMenu === "rental" ? "/rental" : "/shop"}
                  hash={productSlug(section.title)}
                  className="relative block overflow-hidden rounded-md"
                  onClick={() => setOpenMenu(null)}
                >
                  <img src={section.cover ?? section.products[0]?.image} alt="" className="h-36 w-full object-cover sm:h-32" />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 p-2 text-xs font-semibold leading-snug text-white sm:p-2.5 sm:text-sm">{section.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
