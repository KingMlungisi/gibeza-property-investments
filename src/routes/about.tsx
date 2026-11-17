import { createFileRoute, Link } from "@tanstack/react-router";
import { departments } from "@/data/departments";
import { PageHead, PointList, Shell } from "@/components/site/shell";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <Shell>
      <PageHead
        kicker="ABOUT US"
        title="More than a decade of building and supply."
        lede="Gibeza Property Investments CC works for private clients, the public sector and mining. Level 1 BBBEE."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">How we work</h2>
          <p className="mt-3 text-sm text-muted">
            We try to sit above the standard the work already has to meet, through training, partnerships and the way a
            job is run.
          </p>
          <p className="mt-3 text-sm text-muted">
            Service, honesty and a hard line on corruption. SHEQ sits inside the business, aligned with ISO 9001, ISO
            14001 and ISO 45001.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold">Who we work for</h2>
          <PointList
            items={[
              "Private firms, hotels and estates",
              "Local to national government",
              "Mining",
              "Embassies and residential clients",
              "Developers, architects, contractors and consulting engineers",
            ]}
          />
        </div>
      </section>
      <section id="products" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold">Products</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {departments.map((department) => (
              <Link
                key={department.id}
                to={department.to}
                className="rounded-full border border-line bg-card px-4 py-2 text-sm font-medium hover:border-ink"
              >
                {department.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="shop" className="border-t border-line bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Shop</h2>
            <p className="mt-3 text-sm text-muted">
              Glass, tools, printers and stationery are on the Shop tab. Contract quantities are under Procurement.
              Plant goes out on the Rental tab.
            </p>
            <Link to="/shop" className="mt-6 inline-block text-sm font-semibold text-orange">
              Open the shop
            </Link>
          </div>
          <img src="/photos/glazing.jpg" alt="Aluminium shopfront glazing" className="h-64 w-full object-cover" />
        </div>
      </section>
      <section id="gallery" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Gallery</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["/photos/hero.jpg", "Site work."],
            ["/photos/civil.jpg", "Civil works."],
            ["/photos/glazing.jpg", "Glazing."],
            ["/photos/lighting.jpg", "Lighting."],
            ["/photos/boardroom.jpg", "Interior refurbishment."],
            ["/photos/roads.jpg", "Road markings."],
          ].map(([src, caption]) => (
            <figure key={caption} className="border border-line bg-card">
              <img src={src} alt="" className="h-48 w-full object-cover" />
              <figcaption className="p-4 text-sm text-muted">{caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </Shell>
  );
}
