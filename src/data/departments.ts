import { shopMenu } from "./shop-menu";

export type Product = {
  name: string;
  detail: string;
  image: string;
  price?: string;
  material?: number;
  markup?: number;
  sheet?: number;
  frames?: string[];
  pending?: boolean;
  window?: string;
};

export type Department = {
  id: "office" | "construction" | "shop" | "procurement" | "rental";
  label: string;
  to: "/office" | "/construction" | "/shop" | "/procurement" | "/rental";
  kicker: string;
  title: string;
  lede: string;
  groups: { title: string; cover?: string; products: Product[] }[];
  gallery: { src: string; caption: string }[];
};

export function productSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function shelfPrice(product: { material?: number; markup?: number }) {
  const amount = (product.material ?? 0) * (1 + (product.markup ?? 0) / 100);
  const [whole, frac] = amount.toFixed(2).split(".");
  return `R ${whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}.${frac}`;
}

const officeImg = "/photos/boardroom.jpg";
const civil = "/photos/civil.jpg";
const electrical = "/photos/electrical.jpg";
const mechanical = "/photos/mechanical.jpg";
const glazing = "/photos/glazing.jpg";
const lighting = "/photos/lighting.jpg";
const roads = "/photos/roads.jpg";
const yard = "/photos/yard-light.jpg";
const house = "/photos/residential.jpg";
const medical = "/photos/medical.jpg";
const tools = "/photos/power-tools.jpg";

export const departments: Department[] = [
  {
    id: "office",
    label: "Office",
    to: "/office",
    kicker: "OFFICE",
    title: "Furniture, print, IT and grounds.",
    lede: "The office side of the company. Pick a product, see what the shop supplies, then the work.",
    groups: [
      {
        title: "Furniture and print",
        products: [
          { name: "Office furniture", detail: "Supplied, installed and removed.", image: officeImg },
          { name: "Printing and leases", detail: "Printers on lease and print runs for the office.", image: officeImg },
          { name: "Stationery", detail: "Office, school and tertiary stationery.", image: officeImg },
        ],
      },
      {
        title: "IT and support",
        products: [
          { name: "Computers and software", detail: "Machines, accessories and software support.", image: house },
          { name: "Office administration", detail: "Day-to-day office support alongside a contract.", image: house },
          { name: "Branding and print", detail: "Concept, branding, print and media when a job needs it.", image: house },
        ],
      },
      {
        title: "Cleaning and grounds",
        products: [
          { name: "Cleaning services", detail: "Cleaning equipment and SABS-approved chemicals.", image: house },
          { name: "Grass cutting", detail: "Landscaping and horticulture.", image: house },
          { name: "Janitorial supplies", detail: "Trolleys, mops, brooms, soaps and cloths.", image: house },
        ],
      },
    ],
    gallery: [
      { src: officeImg, caption: "Boardroom after a refurbishment." },
      { src: house, caption: "Residential property after maintenance." },
    ],
  },
  {
    id: "construction",
    label: "Construction",
    to: "/construction",
    kicker: "CONSTRUCTION",
    title: "Six sections. The work sits under each one.",
    lede: "Building, civil and mechanical, electrical and plumbing, glazing, horticulture, and medical supply.",
    groups: [
      {
        title: "Building, Maintenance & Renovations",
        cover: civil,
        products: [
          { name: "General building", detail: "New work, alterations and the full build, from set-out to handover.", image: civil, frames: [civil, "/photos/project-house.jpg", "/photos/site-frame.jpg", "/photos/build-general-b.jpg", "/photos/project-garage.jpg", "/photos/project-lounge.jpg", "/photos/residential.jpg", "/photos/site-lead.jpg", "/photos/hero.jpg"] },
          { name: "Foundations", detail: "Strip, pad and raft foundations, set out, reinforced and cast.", image: "/photos/build-foundations.jpg", frames: ["/photos/build-foundations.jpg", "/photos/build-foundations-b.jpg", "/photos/build-foundations-c.jpg", "/photos/found-slab.jpg", "/photos/site-earth.jpg", "/photos/site-trench.jpg", "/photos/civil-earth.jpg"] },
          { name: "Walls", detail: "Brick and blockwork, internal and external, including openings.", image: "/photos/build-walls.jpg", frames: ["/photos/build-walls.jpg", "/photos/build-walls-b.jpg", "/photos/build-walls-c.jpg", "/photos/site-walls.jpg"] },
          { name: "Plastering", detail: "Cement plaster on brickwork, inside and out, ready for paint.", image: "/photos/build-plaster.jpg", frames: ["/photos/build-plaster.jpg", "/photos/build-plaster-b.jpg"] },
          { name: "Rhinolite", detail: "Gypsum skim and joints, for a smooth wall or ceiling before paint.", image: "/photos/build-rhinolite.jpg", frames: ["/photos/build-rhinolite.jpg", "/photos/build-rhinolite-b.jpg", "/photos/work-studs.jpg", "/photos/work-rhinolite.jpg"] },
          { name: "Torch-on waterproofing", detail: "The membrane is heated with a gas torch and pressed onto the roof.", image: "/photos/wp-torch-on.jpg" },
          { name: "Flat roof waterproofing", detail: "A flat roof sealed with lapped membrane and turned up at the wall.", image: "/photos/wp-flat-roof.jpg" },
          { name: "Commercial roof waterproofing", detail: "Torch-on on a commercial building, including the laps and the upstand.", image: "/photos/wp-commercial.jpg" },
          { name: "Concrete roof waterproofing", detail: "A concrete roof coated and sealed, with the outlets left open.", image: "/photos/wp-concrete.jpg" },
          { name: "Parapet waterproofing", detail: "Membrane taken over the parapet and around the roof vents.", image: "/photos/wp-parapet.jpg" },
          { name: "Aluminium roof coating", detail: "A silver aluminium coating on a house flat roof, beside the tiles.", image: "/photos/wp-aluminium.jpg" },
          { name: "Roof coating", detail: "A light coating on a flat slab, with the joints sealed.", image: "/photos/wp-coating.jpg" },
          { name: "4mm waterproofing membrane", detail: "A 4mm membrane, the thickness most flat roofs are specified in.", image: "/photos/wp-4mm.jpg" },
          { name: "Torch-on laps", detail: "Membrane sheets lapped and sealed across a flat roof.", image: "/photos/wp-laps.jpg" },
          { name: "Completed flat roof", detail: "A finished membrane roof on a new house.", image: "/photos/wp-finished.jpg" },
          { name: "Roofing", detail: "Trusses, sheeting, tiles, flashings and roof repairs.", image: "/photos/build-roofing.jpg", frames: ["/photos/build-roofing.jpg", "/photos/build-roof-b.jpg", "/photos/build-roof-c.jpg", "/photos/work-roof.jpg", "/photos/roof-truss.jpg", "/photos/project-roof.jpg"] },
          { name: "Ceilings", detail: "Fixed and suspended ceilings, including board and brandering.", image: "/photos/build-ceiling.jpg", frames: ["/photos/build-ceiling.jpg", "/photos/build-ceiling-b.jpg", "/photos/build-ceiling-c.jpg", "/photos/work-ceiling.jpg"] },
          { name: "Painting", detail: "Prep, undercoat and finish, interior and exterior.", image: "/photos/build-paint.jpg", frames: ["/photos/build-paint.jpg", "/photos/build-paint-b.jpg", "/photos/build-paint-c.jpg", "/photos/work-paint.jpg"] },
          { name: "Tiling and epoxy floors", detail: "A seamless epoxy floor in a marble grey or a plain gloss grey, for gyms, spas, shops and factories. Floor and wall tiles where a tiled finish is the better fit.", image: "/photos/build-epoxy-marble.jpg", frames: ["/photos/build-epoxy-marble.jpg", "/photos/build-epoxy-metal.jpg", "/photos/build-epoxy-grey.jpg", "/photos/build-epoxy.jpg", "/photos/build-tiling.jpg", "/photos/build-tile-b.jpg", "/photos/build-tile-c.jpg"] },
          { name: "Paving", detail: "Driveways, walkways and yards in interlocking pavers.", image: "/photos/build-paving.jpg", frames: ["/photos/build-paving.jpg", "/photos/build-pave-b.jpg", "/photos/work-paving.jpg"] },
          { name: "Carpentry", detail: "Doors, frames, skirtings and built-in cupboards.", image: "/photos/build-carpentry.jpg", frames: ["/photos/build-carpentry.jpg", "/photos/build-wood-b.jpg", "/photos/build-wood-c.jpg", "/photos/work-carpentry.jpg", "/photos/work-door.jpg"] },
        ],
      },
      {
        title: "Civil and Mechanical Engineering",
        cover: "/photos/civil-roads.jpg",
        products: [
          {
            name: "Roads and stormwater",
            detail: "New work and rehabilitation: layerworks, surfacing, kerbs, stormwater, markings, speed humps and guard rails.",
            image: "/photos/civil-roads.jpg",
            frames: ["/photos/civil-roads.jpg", "/photos/roads.jpg", "/photos/civil-markings.jpg"],
          },
          {
            name: "Water and sanitation",
            detail: "Water and sewer lines, the manholes, and the tests the specification asks for.",
            image: "/photos/build-foundations-b.jpg",
            frames: ["/photos/build-foundations-b.jpg", "/photos/civil-earth.jpg", "/photos/site-pipes.jpg"],
          },
          {
            name: "Earthworks",
            detail: "Clear, cut, fill and compact platforms for roads and for buildings.",
            image: "/photos/civil-earth.jpg",
            frames: ["/photos/civil-earth.jpg", "/photos/site-earth.jpg", "/photos/site-trench.jpg"],
          },
          {
            name: "Concrete structures",
            detail: "Reinforced concrete for bases, frames and small structures, including the steel and the test cubes.",
            image: civil,
            frames: [civil, "/photos/build-foundations.jpg", "/photos/site-frame.jpg"],
          },
          {
            name: "Structural drawings",
            detail: "Plans, models and calculation notes for houses, commercial and industrial work. A registered professional signs them.",
            image: "/photos/civil-drawings.jpg",
            frames: ["/photos/civil-drawings.jpg", "/photos/residential.jpg", "/photos/project-house.jpg"],
          },
          {
            name: "Site supervision",
            detail: "The work on the ground: subcontractors, quality, safety and the programme.",
            image: "/photos/hero.jpg",
            frames: ["/photos/hero.jpg", "/photos/site-frame.jpg", "/photos/site-lead.jpg"],
          },
        ],
      },
      {
        title: "Electrical Engineering and Plumbing",
        cover: electrical,
        products: [
          { name: "Electrical maintenance", detail: "Domestic and industrial installations and maintenance.", image: "/photos/work-aircon.jpg" },
          { name: "Plumbing", detail: "Plumbing on the build and on maintenance contracts.", image: house },
          { name: "Geysers and solar", detail: "Hot water and solar power.", image: electrical },
          { name: "CCTV and access", detail: "CCTV, access control, gate motors and security fencing.", image: electrical },
          { name: "Lighting", detail: "Interior, exterior, yard, security and facade lighting.", image: lighting },
        ],
      },
      {
        title: "Architectural Glazing",
        cover: glazing,
        products: [
          { name: "Glass, windows and shopfronts", detail: "Residential and commercial glass, windows and Wispeco-trained shopfronts.", image: glazing },
          { name: "Doors", detail: "Sliding doors, standard and automated, and folding doors.", image: "/photos/work-door.jpg" },
          { name: "Showers and entrances", detail: "Showers, entrances and access.", image: glazing },
        ],
      },
      {
        title: "Horticultural Services",
        cover: "/photos/hort-entrance.jpg",
        products: [
          {
            name: "Garden services",
            detail: "Establishment and maintenance of beds, paths, planting, mulch and irrigation.",
            image: "/photos/hort-entrance.jpg",
            frames: ["/photos/hort-entrance.jpg", "/photos/hort-path.jpg", "/photos/hort-curve.jpg"],
          },
          {
            name: "Grass cutting",
            detail: "Scheduled cutting for large commercial grounds and private lawns.",
            image: "/photos/hort-lawn.jpg",
            frames: ["/photos/hort-lawn.jpg", "/photos/hort-strip.jpg", "/photos/hort-grass.jpg"],
          },
          {
            name: "Palm pruning",
            detail: "Dead fronds removed and the crown cleaned, with the palm retained.",
            image: "/photos/hort-palm.jpg",
          },
          {
            name: "Palm removal",
            detail: "Complete removal of the palm, including the root ball.",
            image: "/photos/hort-palm.jpg",
            pending: true,
          },
          {
            name: "Tree felling",
            detail: "Sectional felling where buildings, walls or overhead cables are close.",
            image: "/photos/hort-treebed.jpg",
            pending: true,
          },
          {
            name: "Tree and stump removal",
            detail: "The tree removed, and the stump ground or excavated so the area can be reinstated.",
            image: "/photos/hort-treebed.jpg",
            pending: true,
          },
        ],
      },
      {
        title: "Medical Devices & Supply",
        cover: medical,
        products: [
          { name: "Medical devices", detail: "Devices supplied to clinics, hospitals and other medical buyers.", image: medical },
          { name: "Clinical supply", detail: "Equipment and related supply for the medical industry.", image: medical },
        ],
      },
    ],
    gallery: [
      { src: civil, caption: "Building frame and road works." },
      { src: roads, caption: "Road markings." },
      { src: glazing, caption: "Shopfront glazing." },
      { src: electrical, caption: "Power and solar." },
      { src: yard, caption: "Yard lighting." },
      { src: lighting, caption: "Facade lighting." },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    to: "/shop",
    kicker: "SHOP",
    title: "Glass, aluminium, tools and building materials.",
    lede: "Counter supply. Hardware shows the catalogue price. Glass, windows and most profiles stay at R 0.00 until the Starfront list and the mark-up are loaded.",
    groups: shopMenu.map((item) => ({ title: item.title, cover: item.cover, products: [] })),
    gallery: [
      { src: glazing, caption: "Glass for shopfronts." },
      { src: officeImg, caption: "A finished interior." },
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    to: "/procurement",
    kicker: "PROCUREMENT",
    title: "Materials bought for the contract.",
    lede: "Sourced against a job, not picked up at the counter.",
    groups: [
      {
        title: "For a project",
        products: [
          { name: "Specialist glass", detail: "Glass supplied to a specification.", image: glazing },
          { name: "Tools to order", detail: "Power tools, fixings and site consumables.", image: mechanical },
          { name: "Shopfront materials", detail: "Aluminium and glazing materials for a contract.", image: glazing },
        ],
      },
      {
        title: "Plant parts",
        products: [
          { name: "Track rollers", detail: "New track rollers and tracks.", image: mechanical },
          { name: "Starters and alternators", detail: "New and reconditioned.", image: mechanical },
          { name: "Electrical harnesses", detail: "Harnesses and related plant spares.", image: electrical },
        ],
      },
    ],
    gallery: [
      { src: mechanical, caption: "Plant the parts are bought for." },
      { src: electrical, caption: "Electrical supply." },
    ],
  },
  {
    id: "rental",
    label: "Rental",
    to: "/rental",
    kicker: "RENTAL",
    title: "Plant and vehicles, with an operator when you need one.",
    lede: "Hire for the duration of the job.",
    groups: [
      {
        title: "Plant",
        cover: "/photos/plant-silent-35.jpg",
        products: [
          {
            name: "Silent 35 kVA",
            detail: "Silent diesel generator, 35 kVA, hired for the duration of the job.",
            image: "/photos/plant-silent-35.jpg",
          },
          {
            name: "Generator on trailer",
            detail: "A generator mounted on a trailer, ready to tow onto site.",
            image: "/photos/plant-gen-trailer.jpg",
          },
          {
            name: "1000 L diesel bowser",
            detail: "1000 litre diesel bowser for refuelling plant on site.",
            image: "/photos/plant-diesel-bowser.jpg",
          },
          {
            name: "Water bowser",
            detail: "A water bowser, hired with the diesel bowser when the site needs both.",
            image: "/photos/plant-water-bowser.jpg",
          },
          {
            name: "Container mobile office",
            detail: "A site office made from a container, hired for the duration of the job.",
            image: "/photos/plant-container-office.jpg",
          },
          {
            name: "7 kW gasoline generator",
            detail: "Wheeled petrol generator, 7 kW, for power on site.",
            image: "/photos/plant-gen-7kw.jpg",
          },
          {
            name: "Porta Pak",
            detail: "Saffire Porta Pak. A mobile cutting set on its own trolley.",
            image: "/photos/plant-portapak.jpg",
          },
          {
            name: "Mac Afric 50 L compressor",
            detail: "50 litre electric compressor, with hose, hired for the job.",
            image: "/photos/plant-compressor.jpg",
          },
          {
            name: "Walker H27i ride-on mower",
            detail: "Walker H27i ride-on mower for grounds around a site.",
            image: "/photos/plant-walker.jpg",
          },
          {
            name: "John Deere Z545R",
            detail: "John Deere Z545R ZTrak ride-on mower.",
            image: "/photos/plant-deere.jpg",
          },
        ],
      },
      {
        title: "Power tools",
        cover: tools,
        products: [
          { name: "Electrical power tools", detail: "Mains electrical tools on hire.", image: tools },
          { name: "Cordless power tools", detail: "Cordless tools on hire.", image: tools },
          { name: "Pruners", detail: "Pruners on hire.", image: tools },
          { name: "Mitre saws", detail: "Mitre saws on hire.", image: tools },
          { name: "Angle grinders", detail: "Angle grinders on hire.", image: tools },
        ],
      },
      {
        title: "Temporary road traffic signs",
        cover: roads,
        products: [
          { name: "Yellow temporary signs", detail: "Standard yellow temporary road traffic signs.", image: roads },
          { name: "Sign electronics", detail: "Electronics hired with the temporary signs.", image: roads },
        ],
      },
    ],
    gallery: [
      { src: mechanical, caption: "Generators and site plant." },
      { src: civil, caption: "Plant beside a build." },
    ],
  },
];

export function findProduct(name: string): { department: Department; product: Product } | null {
  for (const department of departments) {
    for (const group of department.groups) {
      const product = group.products.find((item) => item.name === name);
      if (product) return { department, product };
    }
  }
  return null;
}
