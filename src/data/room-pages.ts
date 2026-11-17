export type RoomPage = {
  id: string;
  part: "Profile" | "Company papers";
  title: string;
  description: string;
};

/** Drop a file in storage/profile named {id}.pdf, .jpg, .jpeg, .png or .webp. */
export const roomPages: RoomPage[] = [
  { id: "cover", part: "Profile", title: "Cover", description: "The front of the company profile." },
  { id: "background", part: "Profile", title: "Background", description: "How the company started, and what it is trying to do." },
  { id: "services", part: "Profile", title: "Construction", description: "Building, engineering, glazing, horticulture and medical supply." },
  { id: "supply", part: "Profile", title: "Shop", description: "Glass and aluminium, tools, office support and building materials." },
  { id: "hire", part: "Profile", title: "Rental", description: "Plant, power tools and temporary road signs." },
  { id: "people", part: "Profile", title: "People", description: "The team, and why clients stay." },
  { id: "sheq", part: "Profile", title: "SHEQ", description: "Safety, health, environment and quality." },
  { id: "structure", part: "Profile", title: "Structure", description: "How the company is organised." },
  { id: "clients", part: "Profile", title: "Clients", description: "Who we work for, and the law the work follows." },
  { id: "references", part: "Profile", title: "References", description: "Work already done, and who to speak to." },
  { id: "offices", part: "Profile", title: "Offices", description: "Head office, the postal address and the regions." },
  { id: "ck2", part: "Company papers", title: "CK2", description: "Close corporation founding statement." },
  { id: "sars", part: "Company papers", title: "SARS", description: "Tax clearance from the South African Revenue Service." },
  { id: "csd", part: "Company papers", title: "CSD", description: "Central Supplier Database registration." },
  { id: "coida", part: "Company papers", title: "COIDA", description: "Compensation for Occupational Injuries and Diseases." },
  { id: "sagga", part: "Company papers", title: "SAGGA", description: "SAGGA registration." },
  { id: "labour", part: "Company papers", title: "Electrical registration", description: "Electrical registration with the Department of Employment and Labour." },
  { id: "cidb", part: "Company papers", title: "CIDB", description: "Construction Industry Development Board grading." },
];
