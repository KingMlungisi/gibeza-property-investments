import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { departments } from "@/data/departments";

type Entry =
  | { kind: "product"; label: string }
  | { kind: "link"; label: string; to: "/office" | "/construction" | "/shop" | "/procurement" | "/rental" | "/about" | "/contact"; hash?: string };

type Menu = { label: string; entries: { heading: "Products" | "Shop" | "Gallery"; items: Entry[] }[] };

const menus: Menu[] = [
  ...departments.map((department) => ({
    label: department.label,
    entries: [
      {
        heading: "Products" as const,
        items: department.groups.flatMap((group) =>
          group.products.map((product) => ({ kind: "product" as const, label: product.name })),
        ),
      },
      {
        heading: "Shop" as const,
        items: [{ kind: "link" as const, label: "Open shop", to: department.to, hash: "shop" }],
      },
      {
        heading: "Gallery" as const,
        items: [{ kind: "link" as const, label: "Open gallery", to: department.to, hash: "gallery" }],
      },
    ],
  })),
  {
    label: "About us",
    entries: [
      { heading: "Products", items: [{ kind: "link", label: "Products", to: "/about", hash: "products" }] },
      { heading: "Shop", items: [{ kind: "link", label: "Shop", to: "/about", hash: "shop" }] },
      { heading: "Gallery", items: [{ kind: "link", label: "Gallery", to: "/about", hash: "gallery" }] },
    ],
  },
  {
    label: "Contact us",
    entries: [
      { heading: "Products", items: [{ kind: "product", label: "General enquiry" }] },
      { heading: "Shop", items: [{ kind: "link", label: "Shop", to: "/shop" }] },
      { heading: "Gallery", items: [{ kind: "link", label: "Gallery", to: "/about", hash: "gallery" }] },
    ],
  },
];

export function SectionMenus({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect?: (name: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!bar.current?.contains(event.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={bar} className="flex flex-wrap items-center gap-2">
      {menus.map((menu, index) => {
        const isOpen = open === menu.label;
        const alignRight = index > 4;
        return (
          <div key={menu.label} className="relative">
            <button
              type="button"
              aria-expanded={isOpen}
              className={
                "inline-flex items-center gap-1 px-3 py-2 text-sm font-medium " +
                (isOpen ? "text-orange" : "text-ink hover:text-orange")
              }
              onClick={() => setOpen(isOpen ? null : menu.label)}
            >
              {menu.label}
              <ChevronDown className="size-4" aria-hidden="true" />
            </button>
            {isOpen ? (
              <div
                className={
                  "absolute top-full z-50 mt-1 max-h-96 w-64 overflow-y-auto border border-line bg-card p-3 shadow-lg " +
                  (alignRight ? "right-0" : "left-0")
                }
              >
                {menu.entries.map((entry) => (
                  <div key={entry.heading} className="mb-3 last:mb-0">
                    <p className="text-xs font-semibold tracking-widest text-muted">{entry.heading.toUpperCase()}</p>
                    <ul className="mt-1">
                      {entry.items.map((item) => (
                        <li key={item.label}>
                          {item.kind === "product" ? (
                            onSelect ? (
                              <button
                                type="button"
                                className={
                                  "block w-full py-2 text-left text-sm " +
                                  (selected === item.label ? "font-semibold text-orange" : "text-ink hover:text-orange")
                                }
                                onClick={() => {
                                  onSelect(item.label);
                                  setOpen(null);
                                }}
                              >
                                {item.label}
                              </button>
                            ) : (
                              <Link
                                to="/contact"
                                search={{ item: item.label === "General enquiry" ? "" : item.label }}
                                className="block py-2 text-sm text-ink hover:text-orange"
                                onClick={() => setOpen(null)}
                              >
                                {item.label}
                              </Link>
                            )
                          ) : (
                            <Link
                              to={item.to}
                              hash={item.hash}
                              className="block py-2 text-sm text-ink hover:text-orange"
                              onClick={() => setOpen(null)}
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
