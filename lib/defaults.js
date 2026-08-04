// Default seed data. All values are editable from Admin Panel.
export const DEFAULT_SETTINGS = {
  _id: 'global',
  brand: {
    name: 'RGR Green Energy',
    tagline: 'Engineered Solar. Delivered with Precision.',
    logoText: 'RGR',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#0A1A2F',
    accentColor: '#059669',
  },
  contact: {
    phone: '+91 98000 00000',
    whatsapp: '+91 98000 00000',
    email: 'contact@rgrgreenenergy.com',
    address: 'Siliguri, West Bengal, India',
    hours: 'Mon–Sat, 9:30 AM – 7:00 PM IST',
    mapUrl: 'https://maps.google.com/?q=Siliguri,West+Bengal',
  },
  social: {
    facebook: '', instagram: '', linkedin: '', youtube: '', twitter: '',
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Projects', href: '/projects' },
    { label: 'Calculator', href: '/calculator' },
    { label: 'Blog', href: '/blog' },
    { label: 'Career', href: '/career' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: {
    about: 'RGR Green Energy is a premium Solar EPC firm delivering engineered rooftop, commercial, industrial and agricultural solar plants across India.',
    copyright: '© 2025 RGR Green Energy. All rights reserved.',
    quickLinks: [
      { label: 'About', href: '/about' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blog' },
      { label: 'Career', href: '/career' },
    ],
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
  home: {
    hero: {
      eyebrow: 'Solar EPC • India',
      title: 'Powering India’s next chapter with engineered solar.',
      subtitle: 'From rooftops to megawatt-scale plants — we design, build and maintain solar systems that pay for themselves.',
      primaryCta: { label: 'Get Free Proposal', href: '/contact?intent=proposal' },
      secondaryCta: { label: 'Estimate My Savings', href: '/calculator' },
      image: 'https://images.unsplash.com/photo-1552197892-f2ad2f75e7c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxzb2xhciUyMGZhcm0lMjBhZXJpYWx8ZW58MHx8fGJsdWV8MTc4NTg0NzAxMXww&ixlib=rb-4.1.0&q=85&w=1600',
    },
    stats: [
      { value: '25+ yrs', label: 'System Lifetime' },
      { value: '0.7%/yr', label: 'Panel Degradation' },
      { value: 'PAN-India', label: 'Delivery' },
      { value: 'Tier-1', label: 'Modules Only' },
    ],
    why: {
      title: 'Why go solar with RGR',
      items: [
        { icon: 'Zap', title: 'Cut electricity bills up to 90%', text: 'Engineered sizing ensures you generate what you actually consume.' },
        { icon: 'ShieldCheck', title: '25-year performance', text: 'Tier-1 modules, string-optimised inverters, monitored 24/7.' },
        { icon: 'Leaf', title: 'Real climate impact', text: 'Every kWp offsets ~1.2 tCO₂/yr — equivalent to 40+ trees.' },
        { icon: 'BadgeCheck', title: 'PM Surya Ghar subsidy', text: 'Full assistance with subsidy paperwork and DISCOM approvals.' },
      ],
    },
    process: [
      { step: '01', title: 'Site Assessment', text: 'Free technical survey and shading analysis.' },
      { step: '02', title: 'Engineering & Design', text: 'Custom SLD, structural, electrical design.' },
      { step: '03', title: 'Procurement', text: 'Only Tier-1 modules and BIS-certified BOS.' },
      { step: '04', title: 'Installation', text: 'Certified crews with IEC-grade safety protocols.' },
      { step: '05', title: 'Handover & O&M', text: 'Commissioning, monitoring app, and lifetime support.' },
    ],
    finalCta: {
      title: 'Ready to see your solar potential?',
      subtitle: 'Get an engineered proposal tailored to your bill, roof and location.',
      button: { label: 'Get Free Proposal', href: '/contact?intent=proposal' },
    },
  },
  about: {
    story: 'Founded on the belief that clean energy should be engineered, not improvised, RGR Green Energy delivers premium solar systems built to last a generation.',
    mission: 'Make premium, engineered solar accessible to every home, business and farm in India.',
    vision: 'A carbon-lighter India, powered by rooftops and fields that pay their owners back every day.',
    values: [
      { title: 'Engineering First', text: 'No shortcuts. Every plant is designed, not assembled.' },
      { title: 'Radical Transparency', text: 'Real quotes. Real generation. Real reports.' },
      { title: 'Lifetime Partnership', text: 'A 25-year asset deserves 25 years of care.' },
    ],
    founder: { name: 'The RGR Team', message: 'We started RGR to fix what was broken in solar — mediocre execution. Our promise is simple: engineered systems, honest reporting, and lifetime support.' },
    timeline: [
      { year: '2019', text: 'RGR Green Energy founded in Siliguri.' },
      { year: '2021', text: 'Expanded to commercial rooftops across North Bengal.' },
      { year: '2023', text: 'Empanelled with leading DISCOMs for PM Surya Ghar.' },
      { year: '2025', text: 'PAN-India project delivery footprint.' },
    ],
  },
  notifications: {
    leadEmails: '',
    subjectPrefix: '[RGR Lead]',
  },
  seo: {
    home: { title: 'RGR Green Energy — Premium Solar EPC', description: 'Engineered rooftop, commercial, industrial and agricultural solar solutions.', keywords: 'solar epc, rooftop solar, commercial solar' },
    about: { title: 'About RGR Green Energy', description: 'Our story, mission and engineering philosophy.', keywords: 'about rgr, solar company india' },
    solutions: { title: 'Solar Solutions', description: 'Residential, Commercial, Industrial and Agriculture solar solutions.', keywords: 'solar solutions india' },
    projects: { title: 'Projects', description: 'Recently commissioned solar projects across India.', keywords: 'solar projects india' },
    calculator: { title: 'Solar Savings Calculator', description: 'Estimate your solar savings, subsidy and CO₂ impact.', keywords: 'solar calculator, subsidy calculator' },
    blog: { title: 'Solar Insights & News', description: 'Latest updates on solar tech, policy and case studies.', keywords: 'solar blog, solar news india' },
    contact: { title: 'Contact', description: 'Talk to our solar engineers.', keywords: 'contact solar company' },
    career: { title: 'Careers', description: 'Join the RGR team.', keywords: 'solar jobs, career solar' },
  },
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_CALC = {
  _id: 'global',
  tariffs: {
    RESIDENTIAL: 7.0,
    COMMERCIAL: 9.0,
    INDUSTRIAL: 8.0,
    AGRICULTURE: 4.0,
  },
  billPeriodMonths: { MONTHLY: 1, QUARTERLY: 3 },
  systemSizing: {
    unitsPerKWpPerDay: 4.0, // avg daily generation per kWp
    daysPerMonth: 30,
    minKWp: 1,
    maxKWp: 500,
  },
  performanceRatio: 0.78,
  degradationRatePerYear: 0.007, // 0.7%
  systemLifetimeYears: 25,
  tariffEscalationPerYear: 0.05, // 5% yearly increase
  co2FactorKgPerKWh: 0.82,
  treesPerTonCO2: 40,
  subsidy: {
    enabledFor: { customerType: 'RESIDENTIAL', systemType: 'ON_GRID' },
    slabs: [
      { upToKW: 1, amount: 30000 },
      { upToKW: 2, amount: 60000 },
      { upToKW: 3, amount: 78000 },
      { upToKW: 10, amount: 78000 },
    ],
  },
  costPerKWp: {
    RESIDENTIAL: 60000,
    COMMERCIAL: 50000,
    INDUSTRIAL: 45000,
    AGRICULTURE: 55000,
  },
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SOLUTIONS = [
  { slug: 'residential', title: 'Residential Solar', category: 'RESIDENTIAL', tagline: 'Own your power. Own your roof.', description: 'Engineered rooftop solar for independent homes, villas and housing societies. On-Grid, Off-Grid and Hybrid options with PM Surya Ghar subsidy assistance.', image: 'https://images.pexels.com/photos/12224996/pexels-photo-12224996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', benefits: ['Bills down by up to 90%','PM Surya Ghar subsidy assistance','Net-metering with your DISCOM','25-year module warranty','App-based monitoring'], technologies: ['On-Grid','Off-Grid','Hybrid','Battery Storage'] },
  { slug: 'commercial', title: 'Commercial Solar', category: 'COMMERCIAL', tagline: 'Better margins. Bigger roofs.', description: 'Solar plants engineered for shops, offices, hotels, hospitals and warehouses — with accelerated depreciation and net-metering benefits.', image: 'https://images.pexels.com/photos/16427010/pexels-photo-16427010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', benefits: ['Payback in 3–4 years','Accelerated depreciation','CAPEX and OPEX models','SCADA-grade monitoring','Priority O&M'], technologies: ['On-Grid','Hybrid','Ground-Mount','Carport'] },
  { slug: 'industrial', title: 'Industrial Solar', category: 'INDUSTRIAL', tagline: 'Engineered for continuous load.', description: 'MW-scale rooftop and ground-mount solar for manufacturing units, cold chains and large industrial consumers with wheeling and OA options.', image: 'https://images.unsplash.com/photo-1564151436289-8fc3f8ea6326?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGZhcm0lMjBhZXJpYWx8ZW58MHx8fGJsdWV8MTc4NTg0NzAxMXww&ixlib=rb-4.1.0&q=85&w=1200', benefits: ['Open Access & wheeling','String-optimised inverters','SCADA + energy meters','Predictive O&M','ESG-grade reports'], technologies: ['On-Grid','Ground-Mount','Hybrid','Battery Backup'] },
  { slug: 'agriculture', title: 'Agriculture Solar', category: 'AGRICULTURE', tagline: 'Sunlight into yield.', description: 'Solar pumps (KUSUM), agri-feeder solarisation and farmland ground-mount plants for reliable, subsidised power to farms.', image: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwyfHxzb2xhciUyMGluc3RhbGxhdGlvbnxlbnwwfHx8Ymx1ZXwxNzg1ODQ3MDE3fDA&ixlib=rb-4.1.0&q=85&w=1200', benefits: ['KUSUM Scheme assistance','Diesel-free pumping','Ground-mount installations','Weatherproof BOS','Field-grade robustness'], technologies: ['Solar Pumps','Ground-Mount','Off-Grid','Feeder Solarisation'] },
];

export const DEFAULT_PROJECTS = [
  { slug: 'residential-siliguri-8kwp', title: '8 kWp Residential Rooftop', location: 'Siliguri, West Bengal', category: 'RESIDENTIAL', capacityKWp: 8, technology: 'On-Grid', completionYear: 2024, estimatedAnnualGenerationKWh: 11680, image: 'https://images.pexels.com/photos/12224996/pexels-photo-12224996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', challenge: 'High monthly electricity bills for a 4-BHK independent home.', solution: 'Engineered on-grid rooftop system with net-metering; bill reduced by ~92%.', featured: true },
  { slug: 'commercial-kolkata-50kwp', title: '50 kWp Commercial Rooftop', location: 'Kolkata, West Bengal', category: 'COMMERCIAL', capacityKWp: 50, technology: 'On-Grid', completionYear: 2024, estimatedAnnualGenerationKWh: 73000, image: 'https://images.pexels.com/photos/16427010/pexels-photo-16427010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', challenge: 'Retail chain wanting to lower operating costs and demonstrate ESG.', solution: 'CAPEX rooftop with SCADA monitoring; 3.6 year payback projected.', featured: true },
  { slug: 'industrial-durgapur-500kwp', title: '500 kWp Industrial Rooftop', location: 'Durgapur, West Bengal', category: 'INDUSTRIAL', capacityKWp: 500, technology: 'On-Grid', completionYear: 2025, estimatedAnnualGenerationKWh: 730000, image: 'https://images.unsplash.com/photo-1564151436289-8fc3f8ea6326?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGZhcm0lMjBhZXJpYWx8ZW58MHx8fGJsdWV8MTc4NTg0NzAxMXww&ixlib=rb-4.1.0&q=85&w=1200', challenge: 'Continuous-process factory needing predictable power costs.', solution: 'String-inverter rooftop with SCADA + energy meters and predictive O&M.', featured: true },
  { slug: 'agri-jalpaiguri-25kwp', title: '25 kWp Agri Ground-Mount', location: 'Jalpaiguri, West Bengal', category: 'AGRICULTURE', capacityKWp: 25, technology: 'Off-Grid', completionYear: 2024, estimatedAnnualGenerationKWh: 36500, image: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwyfHxzb2xhciUyMGluc3RhbGxhdGlvbnxlbnwwfHx8Ymx1ZXwxNzg1ODQ3MDE3fDA&ixlib=rb-4.1.0&q=85&w=1200', challenge: 'Diesel-dependent irrigation for a 40-acre farm.', solution: 'Off-grid ground-mount with battery buffer for reliable daytime pumping.', featured: false },
];

export const DEFAULT_TESTIMONIALS = [
  { name: 'A Satisfied Homeowner', location: 'Siliguri', projectType: 'Residential Rooftop', rating: 5, review: 'Placeholder review — editable from Admin Panel. RGR handled paperwork, engineering and installation end-to-end.' },
  { name: 'A Commercial Client', location: 'Kolkata', projectType: 'Commercial Rooftop', rating: 5, review: 'Placeholder review — editable from Admin. Delivered on time with clean documentation and monitoring.' },
  { name: 'A Factory Owner', location: 'Durgapur', projectType: 'Industrial Rooftop', rating: 5, review: 'Placeholder review — editable from Admin. Excellent SCADA integration and predictive O&M reports.' },
];

export const DEFAULT_FAQS = [
  { category: 'General', question: 'How long does a solar system last?', answer: 'Tier-1 modules carry a 25-year linear performance warranty with a max ~0.7%/yr degradation.' },
  { category: 'General', question: 'Do I need battery backup?', answer: 'Only if you need power during outages. On-Grid systems export excess to the DISCOM without batteries.' },
  { category: 'Subsidy', question: 'Am I eligible for a subsidy?', answer: 'PM Surya Ghar subsidy is available for residential On-Grid systems up to 10 kW. We assist with all paperwork.' },
  { category: 'Payback', question: 'What is the typical payback period?', answer: 'Residential: 4–5 years. Commercial/Industrial: 3–4 years with accelerated depreciation.' },
  { category: 'Maintenance', question: 'How much maintenance is required?', answer: 'Solar systems need minimal upkeep — periodic module cleaning and annual O&M inspections.' },
];

export const DEFAULT_BLOGS = [
  { slug: 'pm-surya-ghar-explained', title: 'PM Surya Ghar Yojana Explained (2025)', excerpt: 'Everything homeowners need to know about the central rooftop solar subsidy — eligibility, amounts, and how to apply.', content: '<p>PM Surya Ghar Muft Bijli Yojana is the flagship rooftop solar subsidy programme for Indian households. Under the scheme, residential On-Grid systems up to 10 kW receive Central Financial Assistance in slabs.</p><p>Slabs (indicative, editable from admin):</p><ul><li>Up to 1 kW: ₹30,000</li><li>Up to 2 kW: ₹60,000</li><li>3 kW and above: ₹78,000</li></ul><p>Contact RGR for full assistance with DISCOM registration, empanelled vendor paperwork and net-metering.</p>', author: 'RGR Editorial', category: 'Policy', tags: ['subsidy','policy','residential'], featuredImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGVuZ2luZWVyfGVufDB8fHxibHVlfDE3ODU4NDcwMTd8MA&ixlib=rb-4.1.0&q=85&w=1200', published: true },
  { slug: 'on-grid-vs-off-grid-vs-hybrid', title: 'On-Grid vs Off-Grid vs Hybrid: Which is right for you?', excerpt: 'A no-jargon guide to choosing the right solar architecture for your home or business.', content: '<p>Choosing the correct system topology has a bigger impact on ROI than the module brand. Here is our engineering perspective.</p><h3>On-Grid</h3><p>Best for most homes and businesses with reliable grid supply. Uses net-metering to bank excess generation.</p><h3>Off-Grid</h3><p>For sites with no grid or unreliable grid. Requires battery storage sized for autonomy.</p><h3>Hybrid</h3><p>Best of both — daytime solar consumption, battery backup for essential loads, grid as fallback.</p>', author: 'RGR Editorial', category: 'Guides', tags: ['guide','on-grid','off-grid','hybrid'], featuredImage: 'https://images.unsplash.com/photo-1658298775754-5839ffd434cc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGluc3RhbGxhdGlvbnxlbnwwfHx8Ymx1ZXwxNzg1ODQ3MDE3fDA&ixlib=rb-4.1.0&q=85&w=1200', published: true },
];
