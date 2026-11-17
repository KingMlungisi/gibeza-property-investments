import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { departments, productSlug, type Department } from "@/data/departments";
import { PageHead, Shell } from "@/components/site/shell";

function findItem(department: Department, name: string) {
  for (const group of department.groups) {
    const product = group.products.find((item) => item.name === name);
    if (product) return product;
  }
  return department.groups[0].products[0];
}

export function DepartmentPage({ id }: { id: Department["id"] }) {
  const department = departments.find((item) => item.id === id) ?? departments[0];
  const first = department.groups[0].products[0].name;
  const [active, setActive] = useState(first);
  const product = findItem(department, active);

  const hash = useRouterState({ select: (state) => state.location.hash });

  useEffect(() => {
    const slug = hash.replace(/^#/, "");
    if (!slug) return;
    for (const group of department.groups) {
      if (productSlug(group.title) === slug) {
        setActive(group.products[0].name);
        document.getElementById(slug)?.scrollIntoView({ block: "start" });
        return;
      }
      const match = group.products.find((item) => productSlug(item.name) === slug);
      if (match) setActive(match.name);
    }
  }, [department, hash]);

  return (
    <Shell>
      {department.id === "construction" ? (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-xs font-semibold tracking-widest text-orange">CONSTRUCTION</p>
          <h1 className="mt-2 text-3xl font-bold">Six sections for the work.</h1>
          <p className="mt-3 max-w-2xl text-muted">{department.lede}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {department.groups.map((group) => (
              <Link
                key={group.title}
                to="/construction"
                hash={productSlug(group.title)}
                className="relative flex min-h-36 items-end overflow-hidden"
              >
                <img src={group.cover ?? group.products[0]?.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="relative p-4 text-lg font-bold leading-tight text-white">{group.title}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : department.id === "rental" ? null : (
        <PageHead kicker={department.kicker} title={department.title} lede={department.lede} />
      )}
      {department.id === "construction" ? null : (
      <section id="products" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Products</h2>
        <div className="mt-8 grid gap-8">
          {department.groups.map((group) => (
            <div key={group.title} id={productSlug(group.title)} className="scroll-mt-36">
              <p className="text-xs font-semibold tracking-widest text-muted">{group.title.toUpperCase()}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.products.map((item) => {
                  const on = item.name === product.name;
                  return (
                    <button
                      key={item.name}
                      id={productSlug(item.name)}
                      type="button"
                      onClick={() => setActive(item.name)}
                      className={
                        "rounded-full border px-4 py-2 text-sm font-medium " +
                        (on ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink hover:border-ink")
                      }
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}
      {department.id === "construction" ? null : (
      <section id="shop" className="border-t border-line bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Shop</h2>
            <h3 className="mt-4 text-2xl font-bold">{product.name}</h3>
            <p className="mt-2 text-muted">{product.detail}</p>
          </div>
          <img src={product.image} alt="" className="h-72 w-full object-cover" />
        </div>
      </section>
      )}
      {department.id === "construction" ? null : (
      <section id="gallery" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Gallery</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {department.gallery.map((shot) => (
            <figure key={shot.caption} className="border border-line bg-card">
              <img src={shot.src} alt="" className="h-48 w-full object-cover" />
              <figcaption className="p-4 text-sm text-muted">{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      )}
    </Shell>
  );
}
