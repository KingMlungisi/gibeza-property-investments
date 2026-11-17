export type Trade = "civil" | "electrical" | "mechanical" | "glazing" | "lighting";

export const email = "mcsidu@gmail.com";

export const offices = [
  {
    name: "Head office",
    lines: ["332 Zone HH, Soshanguve", "Pretoria, Gauteng", "0152"],
  },
  {
    name: "Vereeniging",
    lines: ["12 Jan Hettema Street", "Unitas Park, Gauteng", "1943"],
  },
  {
    name: "Kuruman",
    lines: ["41 Boikhutso Street", "Mothibistad, Northern Cape", "8460"],
  },
  {
    name: "uPhongolo",
    lines: ["B845 Sikhosana Street", "Ncotshane, KwaZulu-Natal", "3170"],
  },
];

export const postal = "Duplex 9, 38 Basuin Crescent, Pretorius Park, Garsfontein, 0081";

export const services: {
  id: Trade;
  title: string;
  image: string;
  summary: string;
  points: string[];
}[] = [
  {
    id: "civil",
    title: "Civil works",
    image: "/photos/civil.jpg",
    summary: "Building, finishes and the road work around a site.",
    points: [
      "General building",
      "Roof replace and repair, paint, plaster, plumbing and tiling",
      "Road signs, markings, speed humps and guard rails",
    ],
  },
  {
    id: "electrical",
    title: "Electrical",
    image: "/photos/electrical.jpg",
    summary: "Domestic and industrial power, solar and access.",
    points: [
      "Electrical maintenance, domestic and industrial",
      "Geysers and solar power",
      "CCTV, access control, gate motors and security fencing",
    ],
  },
  {
    id: "mechanical",
    title: "Mechanical",
    image: "/photos/mechanical.jpg",
    summary: "Installations and maintenance on an active site.",
    points: [
      "Mechanical installations alongside the build",
      "Domestic and industrial mechanical maintenance",
      "Worked with the electrical and civil trades on the same job",
    ],
  },
  {
    id: "glazing",
    title: "Glazing",
    image: "/photos/glazing.jpg",
    summary: "Wispeco-trained shopfronts, doors and showers.",
    points: [
      "Shopfronts and windows",
      "Sliding doors, standard and automated",
      "Foldable doors, showers, entrances and access",
    ],
  },
  {
    id: "lighting",
    title: "Lighting",
    image: "/photos/lighting.jpg",
    summary: "Site, security and commercial facade lighting.",
    points: [
      "Interior and exterior lighting",
      "Yard and security lighting",
      "Entrance and facade lighting",
    ],
  },
];

export const projects: {
  title: string;
  place: string;
  trade: Trade;
  image: string;
  note: string;
}[] = [
  {
    title: "Dealership boardroom",
    place: "Pretoria",
    trade: "civil",
    image: "/photos/boardroom.jpg",
    note: "Refurbishment, maintenance and plumbing.",
  },
  {
    title: "Estate maintenance",
    place: "Residential",
    trade: "civil",
    image: "/photos/residential.jpg",
    note: "Ongoing maintenance on residential property.",
  },
  {
    title: "Road markings",
    place: "Public works",
    trade: "civil",
    image: "/photos/roads.jpg",
    note: "Markings, speed humps and guard rails.",
  },
  {
    title: "Shopfront glazing",
    place: "Retail",
    trade: "glazing",
    image: "/photos/glazing.jpg",
    note: "Aluminium shopfronts, windows and doors.",
  },
  {
    title: "Power and solar",
    place: "Commercial",
    trade: "electrical",
    image: "/photos/electrical.jpg",
    note: "Distribution, solar and access control.",
  },
  {
    title: "Yard lighting",
    place: "Industrial",
    trade: "lighting",
    image: "/photos/yard-light.jpg",
    note: "Security and site lighting.",
  },
  {
    title: "Plant and generators",
    place: "Site",
    trade: "mechanical",
    image: "/photos/mechanical.jpg",
    note: "Mobile generators and plant on hire.",
  },
  {
    title: "Facade lighting",
    place: "Commercial",
    trade: "lighting",
    image: "/photos/lighting.jpg",
    note: "Entrance lighting on a commercial front.",
  },
];

export const otherGroups = [
  {
    title: "Supply",
    points: [
      "Commercial and residential glass: fire resistant, safety, intruder-resistant, acoustic and ColourVue",
      "Garden tools, power tools, drills, saws and grinders",
      "Printers: HP, Brother, Lexmark, Canon and Samsung",
      "Office, school and tertiary stationery",
      "Cleaning equipment and SABS-approved chemicals",
    ],
  },
  {
    title: "Rental",
    points: [
      "Yellow plant: trucks, mixers and forklifts, with operators when required",
      "Pickups, cars and trailers",
      "Power tools, scaffolding and cranes",
      "Plant hire",
      "2-phase and 3-phase mobile generators",
    ],
  },
  {
    title: "Plant rebuilds",
    points: [
      "Drill rig repair and rebuilds, drifter and rotary head rebuilds",
      "Air ends, track frames, final drives and pump-drive gearboxes",
      "Engines, track rollers and tracks",
      "New and reconditioned starters, alternators and electrical harnesses",
    ],
  },
  {
    title: "Admin, grounds and marketing",
    points: [
      "Grass cutting, landscaping and horticulture",
      "Printing services and machine leases",
      "IT, computers, accessories and software support",
      "Cleaning services and office furniture, supplied, installed and removed",
      "Concept, digital marketing, branding, print and media",
    ],
  },
];
