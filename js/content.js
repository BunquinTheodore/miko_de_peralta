// All copy and data for the site. Every value comes from the résumé or the direct superior feedback.
export const CONTENT = {
  person: {
    lines: ["MIKO", "DE", "PERALTA"],
    first: "Miko",
    last: "De Peralta",
    full: "Miko Q. De Peralta",
    initials: "MDP",
    title: "Planning & Scheduling · Operations Coordination · Construction Estimating",
    tagline: "Plans, schedules and tracks work to deadline.",
    bio: "Organized operations professional: schedules in MS Project, cross department coordination at a petroleum terminal, and daily to month end reporting, plus construction estimating for residential projects.",
    photo: "img/miko.jpg",
    // from the résumé
    titles: ["Planning & Scheduling", "Operations Coordination", "Construction Estimating"],
    summary: "Organized operations professional who plans, schedules and tracks work to deadline, promoted to Operations Assistant within 8 weeks at a petroleum terminal. Experienced with schedules in MS Project, Gantt charts and S-curves, cross-department coordination, and daily to month-end reporting, plus drawing and quantity knowledge from residential construction estimating.",
    // phrases shown in bold inside the summary on the simple page (the film ignores this key)
    summaryEmphasis: ["plans, schedules and tracks work to deadline", "Operations Assistant within 8 weeks", "MS Project, Gantt charts and S-curves", "cross-department coordination", "residential construction estimating"],
  },
  words: ["PLAN", "SCHEDULE", "COORDINATE", "ESTIMATE"],
  // home base; `markets` are where the estimated projects are
  location: {
    city: "Makati", country: "Philippines", lat: 14.55, lon: 121.02, tz: "Asia/Manila", tzLabel: "GMT+8",
    note: "Contract and remote work",
    markets: [
      { city: "Qatar", country: "Estimating projects", lat: 25.29, lon: 51.53, tz: "Asia/Qatar", tzLabel: "GMT+3" },
    ],
  },
  education: {
    degree: "Bachelor of Science in Petroleum Engineering",
    short: "BS Petroleum Engineering",
    school: "Adamson University",
    place: "Manila, Philippines",
    years: "Aug 2019 to May 2025",
    certificate: { title: "Certificate, Oil & Gas Industry Operations and Markets", school: "Duke University", years: "Jun 2025 to Jul 2025" },
  },
  work: [
    { company: "Contract", role: "BOQ & Construction Estimator", place: "Remote", since: null, url: null,
      summary: "Takeoffs and BOQs for 12 residential projects, including luxury homes in Qatar." },
    { company: "Porto Petroleum Inc.", role: "Operations Assistant", place: "Sariaya, Quezon, Philippines", since: null, url: null,
      summary: "Daily coordination across 5 departments at a petroleum terminal, scheduling of rosters, loading, vessels and maintenance, and daily to month end reporting." },
  ],
  // "By the numbers" (résumé figures)
  record: {
    head: "BY THE NUMBERS",
    stats: [
      { value: "12", unit: "", label: "Residential estimating projects", note: "Including luxury homes in Qatar" },
      { value: "5,000", unit: "sqm", label: "Average project area", note: "Residential takeoffs and BOQs" },
      { value: "10 to 30", unit: "", label: "Drawing sheets per project", note: "Reviewed in Bluebeam and PlanSwift" },
      { value: "5", unit: "", label: "Departments coordinated daily", note: "Surveyors, Safety, Logistics, Sales, Accounting" },
      { value: "1 to 2", unit: "days", label: "Typical turnaround", note: "Dates set with clients, deliverables tracked" },
    ],
    // headline facts for the simple page About section
    facts: [
      { value: "12", label: "residential estimating projects" },
      { value: "5,000 sqm", label: "average project area" },
      { value: "5", label: "departments coordinated daily" },
      { value: "About 10 million", label: "liters of MOGAS received as Loading Master" },
      { value: "8 weeks", label: "to promotion at the terminal" },
    ],
  },
  // full résumé roles, newest first by end date shown in the film (the `work` rows above stay as the short summary)
  roles: [
    {
      title: "BOQ & Construction Estimator", subtitle: null, org: "Contract", place: "Remote", period: "Apr 2026 to Oct 2026", photo: "img/miko.jpg", photoAlt: "Portrait of Miko De Peralta", photoW: 480, photoH: 480,
      highlights: [
        "Delivered takeoffs and BOQs for 12 residential projects (avg. 5,000 sqm), including luxury homes in Qatar.",
        "Reviewed 10 to 30 drawing sheets per project in Bluebeam and PlanSwift.",
        "Measured wall finishes, flooring, fixtures, lighting, joinery, cabinetry, doors and wall cladding.",
        "Set turnaround dates with clients and tracked deliverables in a tracker, delivering within 1 to 2 days.",
      ],
    },
    {
      title: "Operations Assistant", subtitle: null, org: "Porto Petroleum Inc.", place: "Sariaya, Quezon, Philippines", period: "Jan 2026 to Sep 2026", photo: "img/vessel.jpg", photoAlt: "Miko in a hard hat on the deck of a tanker at Porto Petroleum", photoW: 480, photoH: 853,
      highlights: [
        "Coordinated daily across 5 departments: cargo figures with surveyors, safety with Safety Officers, product movement with Logistics, orders with Sales, and records with Accounting.",
        "Scheduled shift rosters, truck loading and dispatch, vessel arrivals and discharge, and maintenance inspections.",
        "Supervised night shifts, pipeline commissioning, and truck rescue and recovery operations.",
        "Loading Master for onshore and offshore vessel operations, receiving about 10 million liters of MOGAS with accurate received volumes.",
        "Recorded daily opening and closing volumes on 3 tanks (3.2M L MOGAS, 2 × 50,000 L ethanol) in Excel and Google Sheets for weekly and month end reconciliation.",
        "Prepared and released receipts, waybills and withdrawal certificates in Excel and Google Docs; reconciled Sales Orders and account balances with Accounting.",
        "Prepared daily shift reports, weekly head office reports and month end reports.",
        "Shipped receipts from the site office to head office every Monday, booking couriers and tracking deliveries.",
      ],
    },
  ],
  // résumé skills groups (shown in the Scope scene after the toolkit)
  scopes: [
    { group: "Planning", items: ["Scheduling", "MS Project", "Gantt & S-Curve", "Progress Reporting", "Deadline Tracking"] },
    { group: "Estimating", items: ["Quantity Takeoff", "BOQ & BOM", "Drawing Review", "Bluebeam", "PlanSwift", "AutoCAD"] },
    { group: "Operations", items: ["Inventory Tracking", "Reconciliation", "Documentation", "Shipping & Courier Logistics"] },
    { group: "Office", items: ["Excel", "Google Sheets", "Google Docs", "MS Office", "Slack", "WhatsApp", "Viber", "Google Meet", "Zoom"] },
  ],
  // rendered title of the process scene
  processHead: "HOW I WORK",
  process: [
    { step: "Plan", tool: "MS Project · Gantt · S-Curve", text: "Setting schedules and tracking progress against deadlines" },
    { step: "Coordinate", tool: "5 departments", text: "Daily coordination with surveyors, Safety, Logistics, Sales and Accounting" },
    { step: "Track", tool: "Excel · Google Sheets", text: "Recording volumes and deliverables for reconciliation" },
    { step: "Report", tool: "Daily · Weekly · Month end", text: "Shift reports, head office reports and month end reports" },
    { step: "Estimate", tool: "Bluebeam · PlanSwift", text: "Takeoffs and BOQs from residential drawings" },
  ],
  responsibilities: [
    "Scheduled shift rosters, truck loading and dispatch, vessel arrivals and discharge, and maintenance inspections.",
    "Coordinated daily across 5 departments, from surveyors and Safety Officers to Logistics, Sales and Accounting.",
    "Recorded daily tank volumes and reconciled them weekly and at month end.",
    "Prepared daily shift reports, weekly head office reports and month end reports.",
    "Delivered takeoffs and BOQs for residential projects in Bluebeam and PlanSwift within 1 to 2 days.",
  ],
  values: ["Accurate quantities", "Organized records", "Clear communication", "Attention to detail"],
  goals: ["Planning and scheduling", "Operations coordination", "Construction estimating", "Progress reporting"],
  // one entry per house layer; `primary` lists the item indexes drawn as the strongest skills
  skills: {
    roof: { part: "Roof", group: "Planning", items: ["Scheduling", "MS Project", "Gantt & S-Curve", "Progress Reporting", "Deadline Tracking"], primary: [0, 1, 2] },
    walls: { part: "Walls", group: "Estimating", items: ["Quantity Takeoff", "BOQ & BOM", "Bluebeam", "PlanSwift"], primary: [0, 1, 2] },
    windows: { part: "Windows", group: "Estimating", items: ["Drawing Review", "AutoCAD", "Bluebeam"], primary: [0] },
    door: { part: "Door", group: "Office", items: ["Excel", "Google Sheets", "Google Docs", "MS Office", "Slack", "WhatsApp", "Viber", "Google Meet", "Zoom"], primary: [0, 1] },
    slab: { part: "Slab", group: "Operations", items: ["Inventory Tracking", "Reconciliation", "Documentation", "Shipping & Courier Logistics"], primary: [0, 1, 2] },
    foundation: { part: "Foundation", group: "Education and Credentials", items: ["BS Petroleum Engineering", "Terminal Operations", "BOSH Safety Officer 2"], primary: [0, 1] },
  },
  // "How I can help"
  services: [
    { name: "Planning & Scheduling", text: "Schedules in MS Project with Gantt charts and S-curves.", field: "ink" },
    { name: "Operations Coordination", text: "Daily coordination across 5 departments at a petroleum terminal.", field: "bone" },
    { name: "Deadline Tracking", text: "Turnaround dates set with clients and deliverables tracked.", field: "sage" },
    { name: "Reports & Records", text: "Daily, weekly and month end reports, with Excel and Google Sheets reconciliation.", field: "ink" },
    { name: "Quantity Takeoff", text: "Takeoffs and BOQs from residential drawings in Bluebeam and PlanSwift.", field: "bone" },
    { name: "Engineering Base", text: "Petroleum Engineering degree plus terminal operations experience.", field: "sage" },
  ],
  // market frames (one showcase scene each)
  showcases: [
    {
      field: "bone", title: ["Residential,", "Qatar"], accent: "Qatar", ghost: "QA",
      pitch: "Takeoffs and BOQs for residential projects, including luxury homes in Qatar", steps: ["Drawings", "Takeoff", "BOQ"],
      stack: "Bluebeam · PlanSwift · AutoCAD", badge: { big: "QA", small: "GMT+3" },
    },
  ],
  // direct superior feedback, verbatim, attributed by role only
  feedback: [
    {
      role: "Porto Petroleum Terminal Manager", date: "July 2026",
      quote: "A good addition to the Porto, Sariaya operations team. He was able to pick up the role and responsibilities of the additional filler role immediately through help from colleagues and his drive to learn.",
    },
    {
      role: "Porto Petroleum Supervisor", date: "July 2026",
      quote: "An overall reliable field personnel with good attention to detail. Has good working relationship with Azora's field Ops. Can communicate with drivers and other tenants if needed.",
    },
  ],
  certs: [
    { title: "Google Project Management Certificate", issuer: "Coursera · In progress", url: null },
    { title: "Detailed Quantity Takeoff and Estimating Training", issuer: "Construction Hub PH", url: null },
    { title: "OKR Fundamentals with AI", issuer: "Certified · OKRFC", url: null },
    { title: "Six Sigma Yellow Belt", issuer: "Process improvement", url: null },
    { title: "BOSH Safety Officer 2", issuer: "Occupational safety", url: null },
  ],
  // more certifications, shown on the simple page only (the film has a fixed number of certificate cards and a count)
  certsMore: [
    { title: "Well Operations Crew Resource Management", issuer: "International Well Control Forum (IWCF)", url: null },
    { title: "Level 1 Programme", issuer: "International Well Control Forum (IWCF)", url: null },
  ],
  contact: {
    headline: "LET'S CONNECT",
    pitch: "Need someone to plan and schedule work, coordinate operations across departments, or prepare takeoffs and BOQs? I would be glad to connect.",
    phone: "+63 962 588 6675",
    website: "mikodeperalta.vercel.app",
    links: [
      { label: "Email", value: "miko.q.deperalta@gmail.com", url: "mailto:miko.q.deperalta@gmail.com" },
      { label: "Phone", value: "+63 962 588 6675", url: "tel:+639625886675" },
      { label: "LinkedIn", value: "in/mikodeperalta", url: "https://www.linkedin.com/in/mikodeperalta" },
      { label: "Website", value: "mikodeperalta.vercel.app", url: "https://mikodeperalta.vercel.app" },
      { label: "Based in", value: "Makati, Philippines", url: null },
    ],
  },
};
