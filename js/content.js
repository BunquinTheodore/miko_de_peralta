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
    bio: "Construction estimator with experience on luxury residential houses in Qatar: quantity take-offs, BOQs and BOMs, vendor coordination, and project scheduling, backed by an engineering degree.",
    photo: "img/miko.jpg",
    // from the résumé
    titles: ["Construction Estimator", "Quantity Takeoff Specialist", "Project Coordinator"],
    summary: "Petroleum Engineering graduate with freelance experience in residential construction quantity takeoffs, Bill of Quantities (BOQ) preparation, and remote pre-construction project coordination. Proficient in Bluebeam, PlanSwift, JobTread, and Procore, with additional experience in petroleum terminal operations, inventory monitoring, and operational leadership.",
  },
  words: ["MEASURE", "QUANTIFY", "PRICE", "SCHEDULE"],
  // home base; `markets` are where the estimated projects are
  location: {
    city: "Manila", country: "Philippines", lat: 14.6, lon: 121.0, tz: "Asia/Manila", tzLabel: "GMT+8", // TODO: confirm city
    note: "Open to relocation",
    markets: [
      { city: "Doha", country: "Qatar", lat: 25.29, lon: 51.53, tz: "Asia/Qatar", tzLabel: "GMT+3" },
    ],
  },
  education: {
    degree: "Bachelor of Science in Petroleum Engineering",
    short: "BS Petroleum Engineering",
    school: "Adamson University",
    place: "Manila, Philippines",
    years: "Aug 2019 to May 2025",
  },
  work: [
    { company: "Luxury Residential Projects", role: "Estimator", place: "Qatar", since: null, url: null,
      summary: "Take-offs, BOQs and BOMs, vendor pricing and schedules for luxury residential houses." },
    { company: "Porto Petroleum", role: "Operations Assistant", place: "Philippines", since: null, url: null,
      summary: "Terminal operations: inventory reconciliation, safety, and cross-functional coordination." },
  ],
  // "By the numbers" (résumé figures; approximate where the résumé says so)
  record: {
    head: "BY THE NUMBERS",
    stats: [
      { value: "12", unit: "", label: "Residential estimating projects", note: "Including luxury residential properties" },
      { value: "5,000", unit: "sqm", label: "Average project area", note: "Approximate, as reported" },
      { value: "10 to 30", unit: "", label: "Drawing sheets per project", note: "Reviewed for each take-off" },
      { value: "3", unit: "", label: "Pre-construction projects coordinated", note: "Residential, remote" },
      { value: "1 to 2", unit: "days", label: "Typical turnaround", note: "Depending on scope and complexity" },
    ],
  },
  // full résumé roles, newest first (the `work` rows above stay as the short summary)
  roles: [
    {
      title: "BOQ & Construction Estimator", subtitle: null, org: "Freelance", place: "Remote", period: "Aug 2026 to Present",
      highlights: [
        "Worked on quantity takeoff and Bill of Quantities (BOQ) assignments across 12 residential construction projects, including luxury residential properties.",
        "Reviewed approximately 10 to 30 drawing sheets per project to support quantity measurement and pre-construction documentation.",
        "Supported estimating assignments involving residential projects with an average reported floor area of approximately 5,000 sqm.",
        "Performed quantity takeoffs for interior finishes and components, including wall finishes, flooring, fixtures, lighting fixtures, joinery, cabinetry, and doors.",
        "Quantified wall cladding and other cladding-related scopes based on assigned project requirements.",
        "Used Bluebeam and PlanSwift to support drawing review, quantity measurement, and takeoff preparation.",
        "Delivered assigned estimating tasks within a typical 1 to 2 day turnaround, depending on project scope and complexity.",
        "Prepared quantity takeoff and BOQ deliverables to support residential pre-construction planning.",
      ],
    },
    {
      title: "Project Coordinator", subtitle: "Project Management Virtual Assistant", org: "Freelance", place: "Remote", period: "Aug 2026 to Present",
      highlights: [
        "Coordinated 3 residential pre-construction projects, supporting project schedules, task tracking, client communication, and deliverable management.",
        "Provided client updates and coordinated follow-ups to keep stakeholders informed of project progress and outstanding requirements.",
        "Coordinated with multiple subcontractors according to project scope and trade requirements, including plumbing, structural work, and sewer and water connections.",
        "Coordinated deliveries and scheduling requirements to support project activities and trade sequencing.",
        "Assisted with permit-related requirements and documentation as part of the pre-construction coordination process.",
        "Used JobTread and Procore to support project coordination, communication, and management workflows.",
        "Monitored deadlines and deliverables, supporting on-time delivery through scheduling, follow-ups, and stakeholder coordination.",
        "Managed revisions and client feedback as part of ongoing project communication and deliverable coordination.",
      ],
    },
    {
      title: "Operations Assistant", subtitle: null, org: "Porto Petroleum Inc.", place: "Sariaya, Quezon, Philippines", period: "Jan 2026 to Sep 2026",
      highlights: [
        "Promoted from Filler to Operations Assistant in approximately two months, reflecting demonstrated performance and operational capability.",
        "Served as Loading Master during multiple vessel-receiving operations involving approximately 10 million liters of motor gasoline.",
        "Monitored inventory across one 3,000,000-liter motor gasoline tank and two 50,000-liter ethanol additive tanks, recording product volume and temperature every shift.",
        "Conducted weekly and month-end inventory tallies to support inventory monitoring and reconciliation.",
        "Led team members during assigned shifts and served as the immediate supervisor during night shifts.",
        "Coordinated with surveyors, Safety Officers, logistics personnel, sales managers, and Accounting to support terminal operations.",
        "Prepared and released receipts, waybills, and withdrawal certificates, and coordinated Sales Order and account balance tallies with Accounting.",
        "Supervised pipeline commissioning activities and truck rescue and recovery operations involving trucks outside standard operating conditions.",
      ],
    },
  ],
  // résumé "Technical skills" groups (shown in the Scope scene after the toolkit)
  scopes: [
    { group: "Construction Estimating & Pre-Construction", items: ["Quantity Takeoff", "Bill of Quantities (BOQ)", "Bill of Materials (BOM)", "Residential Construction", "Luxury Residential Projects", "Construction Drawing Review", "Pre-Construction Documentation"] },
    { group: "Interior Finishes & Cladding", items: ["Wall Finishes", "Flooring", "Fixtures", "Lighting Fixtures", "Joinery and Cabinetry", "Doors", "Wall Cladding", "Other Cladding-Related Takeoffs"] },
    { group: "Project Coordination & Management", items: ["Project Scheduling and Task Tracking", "Client Communication", "Subcontractor Coordination", "Delivery Coordination", "Permit Coordination", "Document and Deliverable Management", "Revision and Feedback Management"] },
    { group: "Software", items: ["Bluebeam", "PlanSwift", "JobTread", "Procore", "AutoCAD", "Microsoft Office"] },
    { group: "Communication Platforms", items: ["Google Meet", "Zoom", "Slack", "WhatsApp", "Viber"] },
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
    "Prepared quantity take-offs for luxury residential houses in Qatar using Bluebeam, PlanSwift, and AutoCAD.",
    "Developed Bills of Quantities (BOQ) and Bills of Materials (BOM) in Microsoft Excel.",
    "Coordinated with vendors and suppliers on pricing and materials.",
    "Communicated with clients and project teams through Slack, WhatsApp, Viber, Telegram, Google Meet, and Zoom.",
    "Supported project scheduling with Gantt charts and S-curves using MS Project, JobTread, and Procore.",
  ],
  values: ["Accurate quantities", "Organized records", "Clear communication", "Practical problem-solving"],
  goals: ["Construction estimating", "Pre-construction", "Luxury residential projects", "Project scheduling"],
  // one entry per house layer; `primary` lists the item indexes drawn as the strongest skills
  skills: {
    roof: { part: "Roof", group: "Scheduling", items: ["Project Scheduling", "Gantt Charts", "S-Curves", "MS Project", "JobTread", "Procore"], primary: [0, 1, 2] },
    walls: { part: "Walls", group: "Quantity Take-Off", items: ["Quantity Take-Off", "Bluebeam", "PlanSwift", "Luxury Residential"], primary: [0, 1, 2] },
    windows: { part: "Windows", group: "Drawings & CAD", items: ["AutoCAD", "Drawing Review", "Plan Reading", "Microsoft Office"], primary: [0] },
    door: { part: "Door", group: "Communication", items: ["Client Communication", "Vendor Coordination", "Slack", "WhatsApp", "Viber", "Google Meet", "Zoom", "Telegram"], primary: [0, 1] },
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
  // market frames (one showcase scene each)
  showcases: [
    {
      field: "bone", title: ["Doha,", "Qatar"], accent: "Qatar", ghost: "QA",
      pitch: "Take-offs and BOQs for luxury residential houses in Qatar", steps: ["Drawings", "Take-off", "BOQ"],
      stack: "Bluebeam · PlanSwift · AutoCAD · Excel", badge: { big: "QA", small: "GMT+3" },
    },
  ],
  certs: [
    { title: "Six Sigma Yellow Belt", issuer: "Process improvement", url: null },
    { title: "OKR Fundamentals", issuer: "AICertified · OKRFC", url: null },
    { title: "BOSH Safety Officer 2", issuer: "Occupational safety", url: null },
    { title: "Google Project Management Certificate", issuer: "Coursera · In progress", url: null },
    { title: "BS Petroleum Engineering", issuer: "Adamson University", url: null },
  ],
  contact: {
    headline: "LET'S CONNECT",
    pitch: "Need a project coordinator to keep your teams, schedules, and deliverables aligned? Looking for support in project management or operations coordination? I'd be glad to connect.",
    links: [
      { label: "Email", value: "miko.q.deperalta@gmail.com", url: "mailto:miko.q.deperalta@gmail.com" },
      { label: "LinkedIn", value: "in/mikodeperalta", url: "https://www.linkedin.com/in/mikodeperalta" },
      { label: "Based in", value: "Philippines · Open to relocation", url: null },
    ],
  },
};
