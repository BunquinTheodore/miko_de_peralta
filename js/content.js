// All copy and data for the site. Values marked TODO were not supplied yet; nothing else needs to change.
export const CONTENT = {
  person: {
    lines: ["MIKO", "DE", "PERALTA"],
    first: "Miko",
    last: "De Peralta",
    full: "Miko Q. De Peralta",
    initials: "MDP",
    title: "Construction Estimator",
    tagline: "Engineering precision for luxury residential estimating.",
    bio: "Construction estimator with experience on luxury residential houses in Qatar and Chicago: quantity take-offs, BOQs and BOMs, vendor coordination, and project scheduling, backed by an engineering degree.",
    photo: "img/miko.jpg",
  },
  words: ["MEASURE", "QUANTIFY", "PRICE", "SCHEDULE"],
  // home base; `markets` are where the estimated projects are
  location: {
    city: "Manila", country: "Philippines", lat: 14.6, lon: 121.0, tz: "Asia/Manila", tzLabel: "GMT+8", // TODO: confirm city
    note: "Open to relocation",
    markets: [
      { city: "Doha", country: "Qatar", lat: 25.29, lon: 51.53, tz: "Asia/Qatar", tzLabel: "GMT+3" },
      { city: "Chicago", country: "USA", lat: 41.88, lon: -87.63, tz: "America/Chicago", tzLabel: "CST" },
    ],
  },
  education: {
    degree: "Bachelor of Science in Petroleum Engineering",
    short: "BS Petroleum Engineering",
    school: "Adamson University",
    place: "Manila, Philippines",
    years: null, // TODO: e.g. "2019 — 2023"
  },
  work: [
    { company: "Luxury Residential Projects", role: "Estimator", place: "Qatar · Chicago, USA", since: null, url: null,
      summary: "Take-offs, BOQs and BOMs, vendor pricing and schedules for luxury residential houses." },
    { company: "Porto Petroleum", role: "Operations Assistant", place: "Philippines", since: null, url: null,
      summary: "Terminal operations: inventory reconciliation, safety, and cross-functional coordination." },
  ],
  // "How I build an estimate"
  process: [
    { step: "Drawings", tool: "AutoCAD", text: "Reviewing plans and drawings for luxury residential houses" },
    { step: "Take-Off", tool: "Bluebeam · PlanSwift", text: "Measuring quantities from the drawings" },
    { step: "BOQ & BOM", tool: "Excel", text: "Structuring quantities into Bills of Quantities and Materials" },
    { step: "Vendors", tool: "Pricing & materials", text: "Coordinating with vendors and suppliers" },
    { step: "Schedule", tool: "Gantt & S-curve", text: "Planning in MS Project, JobTread, and Procore" },
  ],
  responsibilities: [
    "Prepared quantity take-offs for luxury residential houses in Qatar and Chicago using Bluebeam, PlanSwift, and AutoCAD.",
    "Developed Bills of Quantities (BOQ) and Bills of Materials (BOM) in Microsoft Excel.",
    "Coordinated with vendors and suppliers on pricing and materials.",
    "Communicated with clients and project teams through Slack, WhatsApp, Telegram, Google Meet, and Zoom.",
    "Supported project scheduling with Gantt charts and S-curves using MS Project, JobTread, and Procore.",
  ],
  values: ["Accurate quantities", "Organized records", "Clear communication", "Practical problem-solving"],
  goals: ["Construction estimating", "Pre-construction", "Luxury residential projects", "Project scheduling"],
  // one entry per house layer; `primary` lists the item indexes drawn as the strongest skills
  skills: {
    roof: { part: "Roof", group: "Scheduling", items: ["Project Scheduling", "Gantt Charts", "S-Curves", "MS Project", "JobTread", "Procore"], primary: [0, 1, 2] },
    walls: { part: "Walls", group: "Quantity Take-Off", items: ["Quantity Take-Off", "Bluebeam", "PlanSwift", "Luxury Residential"], primary: [0, 1, 2] },
    windows: { part: "Windows", group: "Drawings & CAD", items: ["AutoCAD", "Drawing Review", "Plan Reading", "Microsoft Office"], primary: [0] },
    door: { part: "Door", group: "Communication", items: ["Client Communication", "Vendor Coordination", "Slack", "WhatsApp", "Google Meet", "Zoom", "Telegram"], primary: [0, 1] },
    slab: { part: "Slab", group: "BOQ & BOM", items: ["Bills of Quantities", "Bills of Materials", "Microsoft Excel", "Vendor Pricing", "Organized Records"], primary: [0, 1, 2] },
    foundation: { part: "Foundation", group: "Engineering Base", items: ["Petroleum Engineering", "Terminal Operations", "Inventory Reconciliation", "Safety", "Cross-functional Coordination"], primary: [0, 3] },
  },
  // "How I can help"
  services: [
    { name: "Quantity Take-Off", text: "Measured quantities from luxury residential drawings in Bluebeam and PlanSwift.", field: "ink" },
    { name: "BOQ & BOM", text: "Bills of Quantities and Materials, structured and checkable in Excel.", field: "bone" },
    { name: "Vendor Coordination", text: "Pricing and materials coordinated with vendors and suppliers.", field: "sage" },
    { name: "Project Scheduling", text: "Gantt charts and S-curves in MS Project, JobTread, and Procore.", field: "ink" },
    { name: "Client Communication", text: "Clients and project teams kept aligned across Slack, WhatsApp, Meet, and Zoom.", field: "bone" },
    { name: "Engineering Base", text: "Petroleum Engineering degree plus terminal operations experience.", field: "sage" },
  ],
  // two market frames (showcase scenes)
  showcases: [
    {
      field: "bone", title: ["Doha,", "Qatar"], accent: "Qatar", ghost: "QA",
      pitch: "Take-offs and BOQs for luxury residential houses in Qatar", steps: ["Drawings", "Take-off", "BOQ"],
      stack: "Bluebeam · PlanSwift · AutoCAD · Excel", badge: { big: "QA", small: "GMT+3" },
    },
    {
      field: "ink", title: ["Chicago,", "USA"], accent: "USA", ghost: "US",
      pitch: "Estimates and schedules for luxury residential houses in Chicago", steps: ["BOM", "Vendors", "Schedule"],
      stack: "Excel · MS Project · JobTread · Procore", badge: { big: "US", small: "CST" },
    },
  ],
  certs: [
    { title: "Six Sigma Yellow Belt", issuer: "Process improvement", url: null },
    { title: "OKR Fundamentals", issuer: "AICertified · OKRFC", url: null },
    { title: "BOSH Safety Officer 2", issuer: "Occupational safety", url: null },
    { title: "BS Petroleum Engineering", issuer: "Adamson University", url: null },
  ],
  contact: {
    headline: "LET'S CONNECT",
    pitch: "Looking for an estimator, need a take-off or BOQ, or want to discuss a pre-construction role? I'd be glad to connect.",
    links: [
      { label: "Email", value: "deperalta.miko05@gmail.com", url: "mailto:deperalta.miko05@gmail.com" },
      { label: "LinkedIn", value: "in/mikodeperalta", url: "https://www.linkedin.com/in/mikodeperalta" },
      { label: "Based in", value: "Philippines · Open to relocation", url: null },
    ],
  },
};
