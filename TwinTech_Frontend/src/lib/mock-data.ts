export type Money = number;

export const currency = (v: Money) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

export const currencyPrecise = (v: Money) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  stock: number;
  sku: string;
  badge?: string;
  specs: { cpu: string; gpu: string; ram: string; storage: string; motherboard: string; warranty: string };
  blurb: string;
};

export const products: Product[] = [
  {
    id: "tt-apex-15",
    name: "TwinTech Apex 15 Creator",
    brand: "TwinTech",
    category: "Laptops",
    price: 1899,
    compareAt: 2149,
    rating: 4.8,
    reviews: 214,
    stock: 24,
    sku: "TT-APX15-2024",
    badge: "Best seller",
    specs: {
      cpu: "Intel Core Ultra 9 185H",
      gpu: "NVIDIA RTX 4070 8GB",
      ram: "32GB DDR5 5600MHz",
      storage: "1TB NVMe Gen4 SSD",
      motherboard: "TwinTech TB-Ultra H",
      warranty: "3 years on-site",
    },
    blurb: "Colour-accurate 15.6\" 3K OLED workstation laptop tuned for creators and engineers.",
  },
  {
    id: "tt-forge-x",
    name: "Forge X Gaming Desktop",
    brand: "Forge",
    category: "Desktops",
    price: 2450,
    rating: 4.9,
    reviews: 168,
    stock: 11,
    sku: "FG-X-4080S",
    badge: "New",
    specs: {
      cpu: "AMD Ryzen 9 7950X3D",
      gpu: "NVIDIA RTX 4080 Super",
      ram: "64GB DDR5 6000MHz",
      storage: "2TB NVMe Gen5 SSD",
      motherboard: "ASUS ROG Strix X670E",
      warranty: "2 years parts & labour",
    },
    blurb: "Liquid-cooled flagship tower assembled and stress-tested in our Phnom Penh workshop.",
  },
  {
    id: "tt-office-pro",
    name: "Office Pro Mini PC",
    brand: "TwinTech",
    category: "Desktops",
    price: 749,
    rating: 4.6,
    reviews: 96,
    stock: 62,
    sku: "TT-MINI-I5",
    specs: {
      cpu: "Intel Core i5-13500H",
      gpu: "Intel Iris Xe",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      motherboard: "TwinTech NUC-B",
      warranty: "2 years carry-in",
    },
    blurb: "One-litre business desktop for retail counters, clinics and back-office fleets.",
  },
  {
    id: "tt-vision-27",
    name: "Vision 27 4K Monitor",
    brand: "Vision",
    category: "Monitors",
    price: 529,
    compareAt: 619,
    rating: 4.7,
    reviews: 143,
    stock: 4,
    sku: "VS-27U-IPS",
    badge: "Low stock",
    specs: {
      cpu: "—",
      gpu: "—",
      ram: "—",
      storage: "—",
      motherboard: "—",
      warranty: "3 years panel",
    },
    blurb: "27\" 4K IPS with 98% DCI-P3, USB-C 90W power delivery and a factory calibration report.",
  },
  {
    id: "tt-nvme-2tb",
    name: "HyperDrive 2TB NVMe Gen4",
    brand: "HyperDrive",
    category: "Components",
    price: 189,
    rating: 4.8,
    reviews: 311,
    stock: 128,
    sku: "HD-N2T-G4",
    specs: {
      cpu: "—",
      gpu: "—",
      ram: "—",
      storage: "2TB TLC NAND, 7300MB/s",
      motherboard: "M.2 2280 compatible",
      warranty: "5 years limited",
    },
    blurb: "Drop-in storage upgrade with free cloning at any TwinTech service counter.",
  },
  {
    id: "tt-keeb-75",
    name: "Tactile 75 Mechanical Keyboard",
    brand: "Tactile",
    category: "Accessories",
    price: 139,
    rating: 4.5,
    reviews: 88,
    stock: 0,
    sku: "TC-75-BR",
    badge: "Out of stock",
    specs: {
      cpu: "—",
      gpu: "—",
      ram: "—",
      storage: "—",
      motherboard: "Hot-swap PCB",
      warranty: "1 year",
    },
    blurb: "Gasket-mounted 75% board with hot-swap sockets and lubed tactile switches.",
  },
];

export const categories = [
  { name: "Laptops", count: 148, icon: "Laptop" },
  { name: "Desktops", count: 92, icon: "Monitor" },
  { name: "Monitors", count: 64, icon: "MonitorSmartphone" },
  { name: "Components", count: 310, icon: "Cpu" },
  { name: "Networking", count: 76, icon: "Router" },
  { name: "Accessories", count: 221, icon: "Mouse" },
];

export const services = [
  {
    id: "diagnostics",
    title: "Full hardware diagnostics",
    price: "from $15",
    time: "45 min",
    desc: "Bench-test CPU, GPU, RAM, storage health and thermals with a written report.",
  },
  {
    id: "screen",
    title: "Laptop screen replacement",
    price: "from $89",
    time: "Same day",
    desc: "Genuine panels for 400+ models, colour-matched and calibrated before handover.",
  },
  {
    id: "board",
    title: "Motherboard micro-soldering",
    price: "from $120",
    time: "2–4 days",
    desc: "Component-level board repair, BGA reballing and power-rail recovery.",
  },
  {
    id: "data",
    title: "Data recovery & migration",
    price: "from $60",
    time: "1–3 days",
    desc: "Clean-room recovery for failed drives, plus encrypted transfer to your new machine.",
  },
  {
    id: "upgrade",
    title: "Performance upgrade",
    price: "from $25",
    time: "2 hours",
    desc: "RAM, NVMe and cooling upgrades with thermal paste renewal and benchmarking.",
  },
  {
    id: "fleet",
    title: "Business fleet contract",
    price: "custom",
    time: "SLA 4h",
    desc: "Managed maintenance, asset tagging and priority on-site response for teams.",
  },
];

export type RepairStatus = "Received" | "Diagnosing" | "Awaiting parts" | "In repair" | "Quality check" | "Ready" | "Completed";

export const repairJobs = [
  { id: "RPR-2481", customer: "Sokha Chan", device: "MacBook Pro 14 M3", issue: "Liquid damage", status: "In repair" as RepairStatus, tech: "Vireak S.", cost: 240, due: "Jul 28", priority: "High" },
  { id: "RPR-2479", customer: "Dara Kim", device: "Dell XPS 15 9530", issue: "No display output", status: "Diagnosing" as RepairStatus, tech: "Chanthou P.", cost: 95, due: "Jul 27", priority: "Normal" },
  { id: "RPR-2476", customer: "Lyna Sok", device: "Forge X Tower", issue: "Random shutdowns", status: "Awaiting parts" as RepairStatus, tech: "Vireak S.", cost: 180, due: "Jul 30", priority: "Normal" },
  { id: "RPR-2470", customer: "Panha Ly", device: "Lenovo ThinkPad T14", issue: "Keyboard failure", status: "Quality check" as RepairStatus, tech: "Sopheak R.", cost: 130, due: "Jul 26", priority: "Low" },
  { id: "RPR-2465", customer: "Mony Neath", device: "HP Envy x360", issue: "Battery swelling", status: "Ready" as RepairStatus, tech: "Chanthou P.", cost: 110, due: "Jul 25", priority: "High" },
  { id: "RPR-2461", customer: "Rithy Voeun", device: "Apex 15 Creator", issue: "Thermal throttling", status: "Completed" as RepairStatus, tech: "Sopheak R.", cost: 45, due: "Jul 22", priority: "Normal" },
];

export const orders = [
  { id: "TT-10428", customer: "Sokha Chan", items: 3, total: 2688, status: "Paid", method: "ABA PayWay", date: "Jul 24, 2026" },
  { id: "TT-10427", customer: "Dara Kim", items: 1, total: 1899, status: "Fulfilled", method: "KHQR", date: "Jul 24, 2026" },
  { id: "TT-10425", customer: "Lyna Sok", items: 2, total: 718, status: "Pending", method: "ABA PayWay", date: "Jul 23, 2026" },
  { id: "TT-10422", customer: "Panha Ly", items: 5, total: 4310, status: "Fulfilled", method: "Card", date: "Jul 22, 2026" },
  { id: "TT-10419", customer: "Mony Neath", items: 1, total: 189, status: "Refunded", method: "ABA PayWay", date: "Jul 21, 2026" },
  { id: "TT-10415", customer: "Rithy Voeun", items: 2, total: 968, status: "Paid", method: "KHQR", date: "Jul 20, 2026" },
];

export const transactions = [
  { id: "ABA-9F27C1", order: "TT-10428", amount: 2688, status: "Settled", channel: "ABA PayWay", fee: 26.88, at: "Jul 24 · 14:22" },
  { id: "ABA-9F2611", order: "TT-10427", amount: 1899, status: "Settled", channel: "KHQR", fee: 18.99, at: "Jul 24 · 11:05" },
  { id: "ABA-9F24A8", order: "TT-10425", amount: 718, status: "Pending", channel: "ABA PayWay", fee: 7.18, at: "Jul 23 · 17:48" },
  { id: "ABA-9F2201", order: "TT-10419", amount: -189, status: "Refunded", channel: "ABA PayWay", fee: 0, at: "Jul 21 · 09:31" },
  { id: "ABA-9F21B4", order: "TT-10415", amount: 968, status: "Settled", channel: "KHQR", fee: 9.68, at: "Jul 20 · 16:12" },
  { id: "ABA-9F1F90", order: "TT-10411", amount: 349, status: "Failed", channel: "ABA PayWay", fee: 0, at: "Jul 19 · 20:04" },
];

export const inventory = [
  { sku: "TT-APX15-2024", name: "Apex 15 Creator", warehouse: "Phnom Penh · A1", stock: 24, reorder: 10, serials: 24, value: 33200, status: "Healthy" },
  { sku: "FG-X-4080S", name: "Forge X Tower", warehouse: "Phnom Penh · A2", stock: 11, reorder: 6, serials: 11, value: 21450, status: "Healthy" },
  { sku: "VS-27U-IPS", name: "Vision 27 4K Monitor", warehouse: "Siem Reap · B1", stock: 4, reorder: 12, serials: 4, value: 1780, status: "Low" },
  { sku: "TC-75-BR", name: "Tactile 75 Keyboard", warehouse: "Phnom Penh · C3", stock: 0, reorder: 20, serials: 0, value: 0, status: "Out" },
  { sku: "HD-N2T-G4", name: "HyperDrive 2TB NVMe", warehouse: "Central DC", stock: 128, reorder: 40, serials: 128, value: 18900, status: "Healthy" },
  { sku: "TT-MINI-I5", name: "Office Pro Mini PC", warehouse: "Battambang · A1", stock: 62, reorder: 25, serials: 62, value: 34100, status: "Healthy" },
];

export const customersList = [
  { id: "CUS-4821", name: "Sokha Chan", email: "sokha@twintech.dev", tier: "Business", orders: 14, spend: 18420, joined: "2024" },
  { id: "CUS-4790", name: "Dara Kim", email: "dara.kim@mail.com", tier: "Retail", orders: 4, spend: 3980, joined: "2025" },
  { id: "CUS-4712", name: "Lyna Sok", email: "lyna@studio.kh", tier: "Retail", orders: 7, spend: 6120, joined: "2024" },
  { id: "CUS-4655", name: "Panha Ly", email: "panha@acme.co", tier: "Enterprise", orders: 32, spend: 74800, joined: "2023" },
  { id: "CUS-4602", name: "Mony Neath", email: "mony.n@mail.com", tier: "Retail", orders: 2, spend: 940, joined: "2026" },
];

export const employees = [
  { id: "EMP-11", name: "Vireak Sam", role: "Senior technician", team: "Repairs", jobs: 128, rating: 4.9, status: "Active" },
  { id: "EMP-14", name: "Chanthou Pen", role: "Technician", team: "Repairs", jobs: 96, rating: 4.7, status: "Active" },
  { id: "EMP-19", name: "Sopheak Ros", role: "Technician", team: "Repairs", jobs: 74, rating: 4.8, status: "On leave" },
  { id: "EMP-22", name: "Nita Chea", role: "Inventory lead", team: "Warehouse", jobs: 0, rating: 4.6, status: "Active" },
  { id: "EMP-27", name: "Bora Tep", role: "Sales manager", team: "Retail", jobs: 0, rating: 4.9, status: "Active" },
];

export const revenueSeries = [
  { month: "Jan", revenue: 82000, repairs: 14200, orders: 310 },
  { month: "Feb", revenue: 91500, repairs: 15600, orders: 342 },
  { month: "Mar", revenue: 104200, repairs: 17400, orders: 388 },
  { month: "Apr", revenue: 98800, repairs: 16100, orders: 364 },
  { month: "May", revenue: 118400, repairs: 19800, orders: 421 },
  { month: "Jun", revenue: 132900, repairs: 22400, orders: 468 },
  { month: "Jul", revenue: 146300, repairs: 24900, orders: 512 },
];

export const topProducts = [
  { name: "Apex 15 Creator", units: 148, revenue: 281052 },
  { name: "Forge X Tower", units: 96, revenue: 235200 },
  { name: "Office Pro Mini", units: 214, revenue: 160286 },
  { name: "Vision 27 4K", units: 187, revenue: 98923 },
  { name: "HyperDrive 2TB", units: 402, revenue: 75978 },
];

export const channelSplit = [
  { name: "ABA PayWay", value: 58 },
  { name: "KHQR", value: 24 },
  { name: "Card", value: 12 },
  { name: "Cash", value: 6 },
];

export const reviews = [
  { name: "Sokha Chan", role: "IT Manager, Angkor Logistics", quote: "We moved 240 devices onto TwinTech asset tracking in a week. Warranty claims that used to take days now close in minutes.", rating: 5 },
  { name: "Dara Kim", role: "Owner, KimTech Store", quote: "Repair intake, technician notes and ABA PayWay settlement in one place. My counter staff learned it in an afternoon.", rating: 5 },
  { name: "Lyna Sok", role: "Studio lead, Riverside Post", quote: "The status tracker means clients stop calling to ask about their machines. That alone paid for the subscription.", rating: 4 },
];

export const faqs = [
  { q: "Does TwinTech support ABA PayWay and KHQR out of the box?", a: "Yes. Checkout, refunds and settlement reconciliation are built around ABA PayWay, including KHQR scan-to-pay and deep links for the ABA Mobile app." },
  { q: "Can I track serial numbers and warranty per unit?", a: "Every stock unit carries a serial or barcode record with purchase order, warranty window, service history and current asset owner." },
  { q: "How do repair jobs flow through the system?", a: "Intake captures device details and photos, then the job moves through diagnosing, quoting, approval, repair, QC and handover — each step timestamped and visible to the customer." },
  { q: "Is there a limit on staff accounts?", a: "Growth includes 15 staff accounts with role-based permissions. Enterprise is unlimited with custom permission sets and audit exports." },
  { q: "Can I import my existing inventory?", a: "Import CSV or XLSX files with column mapping, or connect a supplier feed. Imports are validated line-by-line before commit." },
  { q: "Do you offer on-premise deployment?", a: "Enterprise plans can be deployed in your own cloud tenancy with SSO, IP allowlists and signed audit log exports." },
];

export const plans = [
  {
    name: "Counter",
    price: 39,
    tagline: "Single-store retail and repair basics.",
    features: ["1 store location", "3 staff accounts", "Inventory + serials", "Repair intake & tracking", "ABA PayWay checkout"],
  },
  {
    name: "Growth",
    price: 99,
    tagline: "Multi-store operations with analytics.",
    features: ["5 store locations", "15 staff accounts", "Purchase orders & suppliers", "Warranty automation", "Revenue & repair analytics", "Coupons and reviews"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: 249,
    tagline: "Fleet contracts, SSO and audit control.",
    features: ["Unlimited locations", "Unlimited staff & roles", "Asset tracking + SLA queues", "Custom permissions", "Audit log exports", "Dedicated success manager"],
  },
];

export const posts = [
  { slug: "aba-payway-reconciliation", title: "How we reconcile ABA PayWay settlements in under a minute", excerpt: "A look at the ledger model behind TwinTech payments and why every transaction carries its own audit trail.", category: "Payments", date: "Jul 18, 2026", read: "6 min" },
  { slug: "repair-shop-throughput", title: "Five bottlenecks that slow a repair shop down", excerpt: "Field notes from 40 workshops: intake queues, parts waiting, and the QC step everyone skips.", category: "Operations", date: "Jul 09, 2026", read: "8 min" },
  { slug: "serial-tracking-warranty", title: "Serial-level warranty tracking, explained", excerpt: "Why per-unit records beat per-SKU records the moment a customer walks in with a claim.", category: "Inventory", date: "Jun 28, 2026", read: "5 min" },
  { slug: "gpu-stock-planning", title: "Planning GPU stock in a volatile market", excerpt: "Reorder points, supplier lead times and the reports we watch weekly.", category: "Inventory", date: "Jun 14, 2026", read: "7 min" },
];

export const stores = [
  { name: "TwinTech Central", address: "#128 Norodom Blvd, Phnom Penh", hours: "Mon–Sat · 8:00–20:00", phone: "+855 23 900 128", services: ["Sales", "Repairs", "Pickup"] },
  { name: "TwinTech Toul Kork", address: "#42 St. 315, Toul Kork, Phnom Penh", hours: "Mon–Sun · 9:00–21:00", phone: "+855 23 900 142", services: ["Sales", "Repairs"] },
  { name: "TwinTech Siem Reap", address: "#7 Sivatha Rd, Siem Reap", hours: "Mon–Sat · 8:30–19:00", phone: "+855 63 900 207", services: ["Sales", "Pickup"] },
  { name: "TwinTech Battambang", address: "#19 St. 1, Battambang", hours: "Mon–Sat · 8:30–18:30", phone: "+855 53 900 311", services: ["Sales", "Repairs", "Warranty"] },
];

export const timeline = [
  { label: "Device received", at: "Jul 22 · 09:14", note: "Intake by Bora Tep. Serial TTX-4482-KH logged, 2 photos attached.", done: true },
  { label: "Diagnostics complete", at: "Jul 22 · 13:40", note: "Liquid ingress on keyboard membrane, board cleaned. Trackpad flex cable damaged.", done: true },
  { label: "Quote approved", at: "Jul 23 · 10:02", note: "Customer approved $240 estimate via SMS link.", done: true },
  { label: "In repair", at: "Jul 24 · 08:30", note: "Vireak S. replacing flex cable and keyboard assembly.", done: false, active: true },
  { label: "Quality check", at: "Pending", note: "48-hour burn-in test, thermals and I/O verification.", done: false },
  { label: "Ready for pickup", at: "Pending", note: "Customer notified by SMS and in-app notification.", done: false },
];

export const notifications = [
  { title: "Repair RPR-2481 moved to In repair", time: "12 min ago", type: "info" as const },
  { title: "Payment ABA-9F27C1 settled — $2,688", time: "2 hours ago", type: "success" as const },
  { title: "Vision 27 4K Monitor below reorder point", time: "5 hours ago", type: "warning" as const },
  { title: "Payment ABA-9F1F90 failed — retry sent", time: "Yesterday", type: "danger" as const },
];

/* ---------- Extended operational datasets ---------- */

export const suppliers = [
  { id: "SUP-101", name: "Mekong Components Co.", contact: "sales@mekongparts.kh", category: "Components", leadTime: "5 days", openPOs: 3, spend: 128400, status: "Active" },
  { id: "SUP-104", name: "Angkor Displays", contact: "orders@angkordisplays.kh", category: "Monitors", leadTime: "9 days", openPOs: 1, spend: 64200, status: "Active" },
  { id: "SUP-108", name: "Silicon Bay Imports", contact: "hello@siliconbay.sg", category: "Storage", leadTime: "12 days", openPOs: 2, spend: 91750, status: "Active" },
  { id: "SUP-112", name: "Riverside Peripherals", contact: "team@riverside.kh", category: "Peripherals", leadTime: "4 days", openPOs: 0, spend: 22100, status: "On leave" },
  { id: "SUP-119", name: "Northgate Power Systems", contact: "po@northgate.co", category: "Power", leadTime: "15 days", openPOs: 1, spend: 47800, status: "Active" },
];

export const purchaseOrders = [
  { id: "PO-3391", supplier: "Mekong Components Co.", items: 14, total: 28400, eta: "Jul 29, 2026", status: "Processing", raised: "Jul 21, 2026" },
  { id: "PO-3388", supplier: "Angkor Displays", items: 30, total: 13400, eta: "Aug 04, 2026", status: "Pending", raised: "Jul 20, 2026" },
  { id: "PO-3382", supplier: "Silicon Bay Imports", items: 120, total: 21600, eta: "Jul 27, 2026", status: "Approved", raised: "Jul 16, 2026" },
  { id: "PO-3377", supplier: "Northgate Power Systems", items: 22, total: 9400, eta: "Aug 11, 2026", status: "Processing", raised: "Jul 14, 2026" },
  { id: "PO-3369", supplier: "Riverside Peripherals", items: 60, total: 4200, eta: "Jul 18, 2026", status: "Completed", raised: "Jul 06, 2026" },
  { id: "PO-3361", supplier: "Mekong Components Co.", items: 8, total: 6100, eta: "Jul 12, 2026", status: "Cancelled", raised: "Jul 02, 2026" },
];

export const coupons = [
  { code: "BACKTOWORK15", type: "Percent", value: "15%", uses: 218, cap: 500, expires: "Aug 31, 2026", status: "Active" },
  { code: "REPAIR20", type: "Fixed", value: "$20", uses: 96, cap: 200, expires: "Sep 15, 2026", status: "Active" },
  { code: "FLEET2026", type: "Percent", value: "8%", uses: 12, cap: 50, expires: "Dec 31, 2026", status: "Active" },
  { code: "NEWYEAR10", type: "Percent", value: "10%", uses: 480, cap: 480, expires: "Jan 31, 2026", status: "Expired" },
  { code: "STUDENT5", type: "Fixed", value: "$5", uses: 64, cap: 1000, expires: "Jun 30, 2026", status: "Expired" },
];

export const productReviews = [
  { id: "REV-881", product: "TwinTech Apex 15 Creator", customer: "Sokha Chan", rating: 5, comment: "Runs Resolve exports without breaking a sweat. Build quality is excellent.", date: "Jul 23, 2026", status: "Approved" },
  { id: "REV-874", product: "Forge X Tower", customer: "Panha Ly", rating: 4, comment: "Great performance, though the stock fans are louder than expected.", date: "Jul 21, 2026", status: "Approved" },
  { id: "REV-869", product: "Vision 27 4K Monitor", customer: "Lyna Sok", rating: 5, comment: "Colour accuracy out of the box was better than my calibrated old panel.", date: "Jul 19, 2026", status: "Pending" },
  { id: "REV-863", product: "Tactile 75 Keyboard", customer: "Mony Neath", rating: 3, comment: "Nice typing feel but the keycaps shine after a month.", date: "Jul 15, 2026", status: "Pending" },
  { id: "REV-855", product: "HyperDrive 2TB NVMe", customer: "Dara Kim", rating: 5, comment: "Cloned my system drive in minutes, sustained speeds held up.", date: "Jul 11, 2026", status: "Approved" },
];

export const appointments = [
  { id: "APT-2201", customer: "Sokha Chan", service: "Liquid damage assessment", branch: "Phnom Penh · Toul Kork", tech: "Vireak S.", slot: "Jul 26 · 09:00", status: "Approved" },
  { id: "APT-2204", customer: "Dara Kim", service: "Display diagnostics", branch: "Phnom Penh · BKK1", tech: "Chanthou P.", slot: "Jul 26 · 11:30", status: "Pending" },
  { id: "APT-2208", customer: "Lyna Sok", service: "Workstation upgrade", branch: "Siem Reap", tech: "Sopheak R.", slot: "Jul 27 · 14:00", status: "Approved" },
  { id: "APT-2211", customer: "Panha Ly", service: "Fleet onsite service", branch: "Phnom Penh · BKK1", tech: "Vireak S.", slot: "Jul 28 · 08:30", status: "Processing" },
  { id: "APT-2215", customer: "Mony Neath", service: "Battery replacement", branch: "Battambang", tech: "Chanthou P.", slot: "Jul 28 · 16:00", status: "Cancelled" },
];

export const warrantyClaims = [
  { id: "WTY-771", customer: "Sokha Chan", device: "TwinTech Apex 15 Creator", serial: "APX15-004821", opened: "Jul 22, 2026", coverage: "Until Mar 2027", status: "Processing" },
  { id: "WTY-765", customer: "Dara Kim", device: "Vision 27 4K Monitor", serial: "VS27-118902", opened: "Jul 18, 2026", coverage: "Until Nov 2026", status: "Approved" },
  { id: "WTY-758", customer: "Panha Ly", device: "Forge X Tower", serial: "FGX-330147", opened: "Jul 12, 2026", coverage: "Until Aug 2028", status: "Completed" },
  { id: "WTY-742", customer: "Mony Neath", device: "Tactile 75 Keyboard", serial: "TC75-990233", opened: "Jun 30, 2026", coverage: "Expired Jun 2026", status: "Expired" },
  { id: "WTY-736", customer: "Lyna Sok", device: "HyperDrive 2TB NVMe", serial: "HD2T-556410", opened: "Jun 24, 2026", coverage: "Until Jun 2029", status: "Approved" },
];

export const auditLogs = [
  { id: "LOG-99120", actor: "Bora Tep", action: "Updated price", target: "TT-APX15-2024", ip: "203.189.14.22", at: "Jul 24 · 15:02", severity: "Active" },
  { id: "LOG-99117", actor: "Nita Chea", action: "Adjusted stock", target: "VS-27U-IPS", ip: "203.189.14.31", at: "Jul 24 · 12:44", severity: "Pending" },
  { id: "LOG-99110", actor: "System", action: "Failed payment webhook", target: "ABA-9F1F90", ip: "10.0.4.8", at: "Jul 23 · 20:04", severity: "Failed" },
  { id: "LOG-99104", actor: "Vireak Sam", action: "Closed repair job", target: "RPR-2461", ip: "203.189.14.77", at: "Jul 22 · 17:31", severity: "Active" },
  { id: "LOG-99098", actor: "Bora Tep", action: "Invited employee", target: "EMP-27", ip: "203.189.14.22", at: "Jul 21 · 09:18", severity: "Active" },
];

export const invoicesList = [
  { id: "INV-20428", customer: "Sokha Chan", order: "TT-10428", amount: 2688, issued: "Jul 24, 2026", due: "Aug 07, 2026", status: "Paid" },
  { id: "INV-20427", customer: "Dara Kim", order: "TT-10427", amount: 1899, issued: "Jul 24, 2026", due: "Aug 07, 2026", status: "Paid" },
  { id: "INV-20425", customer: "Lyna Sok", order: "TT-10425", amount: 718, issued: "Jul 23, 2026", due: "Aug 06, 2026", status: "Pending" },
  { id: "INV-20422", customer: "Panha Ly", order: "TT-10422", amount: 4310, issued: "Jul 22, 2026", due: "Aug 05, 2026", status: "Paid" },
  { id: "INV-20419", customer: "Mony Neath", order: "TT-10419", amount: -189, issued: "Jul 21, 2026", due: "—", status: "Refunded" },
  { id: "INV-20415", customer: "Rithy Voeun", order: "TT-10415", amount: 968, issued: "Jul 20, 2026", due: "Aug 03, 2026", status: "Pending" },
];

export const supportTickets = [
  { id: "TCK-5521", subject: "Invoice copy for TT-10428", channel: "Email", opened: "Jul 24, 2026", agent: "Bora Tep", status: "Processing" },
  { id: "TCK-5514", subject: "Repair pickup reschedule", channel: "Phone", opened: "Jul 22, 2026", agent: "Chanthou Pen", status: "Approved" },
  { id: "TCK-5502", subject: "KHQR payment not reflected", channel: "Chat", opened: "Jul 19, 2026", agent: "Bora Tep", status: "Completed" },
  { id: "TCK-5488", subject: "Warranty transfer to new owner", channel: "Email", opened: "Jul 12, 2026", agent: "Nita Chea", status: "Completed" },
];

export const reportsList = [
  { id: "RPT-01", name: "Monthly revenue summary", scope: "All branches", period: "Jul 2026", format: "PDF", status: "Completed" },
  { id: "RPT-02", name: "Repair throughput & SLA", scope: "Service desk", period: "Jul 2026", format: "XLSX", status: "Completed" },
  { id: "RPT-03", name: "Inventory valuation", scope: "Warehouses", period: "Jul 2026", format: "XLSX", status: "Processing" },
  { id: "RPT-04", name: "Payment settlement ledger", scope: "ABA PayWay", period: "Jul 2026", format: "CSV", status: "Pending" },
  { id: "RPT-05", name: "Customer cohort retention", scope: "Retail + Business", period: "Q2 2026", format: "PDF", status: "Completed" },
];

export const customerOrders = [
  { id: "TT-10428", items: 3, total: 2688, status: "Paid", method: "ABA PayWay", date: "Jul 24, 2026", eta: "Jul 27" },
  { id: "TT-10391", items: 1, total: 189, status: "Fulfilled", method: "KHQR", date: "Jul 11, 2026", eta: "Delivered" },
  { id: "TT-10344", items: 2, total: 1420, status: "Fulfilled", method: "ABA PayWay", date: "Jun 28, 2026", eta: "Delivered" },
  { id: "TT-10298", items: 4, total: 3260, status: "Refunded", method: "Card", date: "Jun 09, 2026", eta: "Returned" },
];

export const customerPayments = [
  { id: "ABA-9F27C1", order: "TT-10428", amount: 2688, method: "ABA PayWay", at: "Jul 24 · 14:22", status: "Settled" },
  { id: "ABA-9E1120", order: "TT-10391", amount: 189, method: "KHQR", at: "Jul 11 · 10:04", status: "Settled" },
  { id: "ABA-9C8842", order: "TT-10344", amount: 1420, method: "ABA PayWay", at: "Jun 28 · 16:51", status: "Settled" },
  { id: "ABA-9A2210", order: "TT-10298", amount: -3260, method: "Card", at: "Jun 12 · 09:12", status: "Refunded" },
];

export const customerWarranty = [
  { id: "WTY-771", device: "TwinTech Apex 15 Creator", serial: "APX15-004821", purchased: "Mar 12, 2025", coverage: "Until Mar 2027", status: "Approved" },
  { id: "WTY-736", device: "HyperDrive 2TB NVMe", serial: "HD2T-556410", purchased: "Jun 24, 2026", coverage: "Until Jun 2029", status: "Approved" },
  { id: "WTY-742", device: "Tactile 75 Keyboard", serial: "TC75-990233", purchased: "Jun 03, 2024", coverage: "Expired Jun 2026", status: "Expired" },
];

/* ---------------------------------- ABA PayWay --------------------------------- */

export type PayWayMethod = "ABA PayWay card" | "KHQR" | "ABA Pay deeplink" | "Bakong wallet";

export const payWayPayments = [
  { tran: "ABA-9F27C1", order: "TT-10428", customer: "Sokha Chan", method: "ABA PayWay card" as PayWayMethod, amount: 2688, fee: 26.88, net: 2661.12, status: "Settled", batch: "PWB-2607-01", at: "Jul 24, 2026 · 14:22", authCode: "A73K19" },
  { tran: "ABA-9F2611", order: "TT-10427", customer: "Dara Kim", method: "KHQR" as PayWayMethod, amount: 1899, fee: 18.99, net: 1880.01, status: "Settled", batch: "PWB-2607-01", at: "Jul 24, 2026 · 11:05", authCode: "K91B04" },
  { tran: "ABA-9F24A8", order: "TT-10425", customer: "Lyna Sok", method: "ABA Pay deeplink" as PayWayMethod, amount: 718, fee: 7.18, net: 710.82, status: "Pending", batch: "—", at: "Jul 23, 2026 · 17:48", authCode: "—" },
  { tran: "ABA-9F2201", order: "TT-10419", customer: "Mony Neath", method: "ABA PayWay card" as PayWayMethod, amount: -189, fee: 0, net: -189, status: "Refunded", batch: "PWB-2607-00", at: "Jul 21, 2026 · 09:31", authCode: "R22F71" },
  { tran: "ABA-9F21B4", order: "TT-10415", customer: "Rithy Voeun", method: "KHQR" as PayWayMethod, amount: 968, fee: 9.68, net: 958.32, status: "Settled", batch: "PWB-2606-29", at: "Jul 20, 2026 · 16:12", authCode: "K44C10" },
  { tran: "ABA-9F1F90", order: "TT-10411", customer: "Vichea Non", method: "Bakong wallet" as PayWayMethod, amount: 349, fee: 0, net: 0, status: "Failed", batch: "—", at: "Jul 19, 2026 · 20:04", authCode: "—" },
  { tran: "ABA-9F1D22", order: "TT-10408", customer: "Panha Ly", method: "ABA PayWay card" as PayWayMethod, amount: 4310, fee: 43.1, net: 4266.9, status: "Settled", batch: "PWB-2606-29", at: "Jul 18, 2026 · 10:41", authCode: "A11X88" },
];

export const payWayBatches = [
  { batch: "PWB-2607-01", window: "Jul 24 · 00:00–23:00", count: 2, gross: 4587, fees: 45.87, expected: 4541.13, posted: 4541.13, status: "Settled" },
  { batch: "PWB-2607-00", window: "Jul 23 · 00:00–23:00", count: 2, gross: 529, fees: 7.18, expected: 521.82, posted: 521.82, status: "Settled" },
  { batch: "PWB-2606-29", window: "Jul 20 · 00:00–23:00", count: 2, gross: 5278, fees: 52.78, expected: 5225.22, posted: 5180.22, status: "Pending" },
  { batch: "PWB-2606-28", window: "Jul 19 · 00:00–23:00", count: 1, gross: 349, fees: 0, expected: 0, posted: 0, status: "Failed" },
];

export const payWayWebhooks = [
  { id: "WHK-88214", event: "transaction.settled", tran: "ABA-9F27C1", code: 200, attempts: 1, at: "Jul 24 · 14:22:07", status: "Completed" },
  { id: "WHK-88213", event: "transaction.settled", tran: "ABA-9F2611", code: 200, attempts: 1, at: "Jul 24 · 11:05:44", status: "Completed" },
  { id: "WHK-88209", event: "transaction.pending", tran: "ABA-9F24A8", code: 200, attempts: 1, at: "Jul 23 · 17:48:12", status: "Completed" },
  { id: "WHK-88204", event: "transaction.refunded", tran: "ABA-9F2201", code: 500, attempts: 3, at: "Jul 21 · 09:31:58", status: "Failed" },
  { id: "WHK-88198", event: "transaction.failed", tran: "ABA-9F1F90", code: 200, attempts: 2, at: "Jul 19 · 20:04:31", status: "Processing" },
];

export const payWayVolume = [
  { month: "Feb", volume: 41200 },
  { month: "Mar", volume: 48800 },
  { month: "Apr", volume: 52100 },
  { month: "May", volume: 61400 },
  { month: "Jun", volume: 69900 },
  { month: "Jul", volume: 78600 },
];
