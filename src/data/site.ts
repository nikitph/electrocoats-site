export const company = {
  name: 'Electrocoating & Insulation Technologies Pvt. Ltd.',
  short: 'Electrocoats',
  abbr: 'EITPL',
  email: 'mktg@electrocoats.com',
  // The old header showed +90-20-25881565 (Turkey's code). Confirm the Pune landline before re-adding it.
  phones: [
    { label: '+91 93709 03742', tel: '+919370903742' },
    { label: '+91 93709 03748', tel: '+919370903748' },
  ],
  whatsapp: '919370903742',
  ul: 'E255884',
  iso: { std: 'ISO 9001:2015', reg: 'RQ91/610', body: 'ICS · NABCB accredited (QMS 009)' },
  md: 'Ravindra Sadashiv Rane',
  works: {
    title: 'Registered office & works',
    lines: ['Plot No. 1, S. No. 228, Hinjawadi–Maan Road', 'Behind Wipro, Hinjawadi', 'Pune 411 057, Maharashtra'],
    map: 'https://www.google.com/maps/place/Electrocoating+and+Insulation+Technologies+Private+Limited/@18.5868564,73.7307398,15z',
  },
  correspondence: {
    title: 'Correspondence',
    lines: ['R. H. No. 18, Medhi Park, Opp. Hotel Shivsagar', 'Parihar Chowk, Aundh', 'Pune 411 067, Maharashtra'],
    email: 'ravi.rane@electrocoats.com',
  },
  // Set PUBLIC_FORM_ENDPOINT at build time (Formspree, Basin, Web3Forms…). Empty → mailto fallback.
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT ?? '',
};

export const proof = [
  { value: 30, suffix: '+', unit: 'years', label: 'formulating thermoset resins' },
  { value: 20, suffix: '', unit: 't / day', label: 'production capacity' },
  { value: 2, suffix: '', unit: 'plants', label: '3,000 m² + 6,500 m² near Pune' },
  { value: 800, suffix: '+', unit: 'customers', label: 'served across 5 countries' },
];

export const certs = [
  { k: 'UL', v: 'File E255884', d: 'UL 94 V-0 · Urecast FR-M1 (2014), Elcast 60-FR M1 (2020)' },
  { k: 'ISO', v: '9001:2015', d: 'Reg. RQ91/610 · ICS, NABCB accredited' },
  { k: 'RoHS', v: 'Compliant', d: 'Potting compound range' },
  { k: 'CRISIL', v: 'NSIC rated', d: 'Performance & credit rating, 2016' },
];

export const clientGroups: { name: string; clients: { n: string; logo?: number }[] }[] = [
  { name: 'Battery manufacturers', clients: [
    { n: 'Exide Industries', logo: 1 }, { n: 'Amara Raja', logo: 7 }, { n: 'Greenvision Technologies', logo: 22 }, { n: 'Luminous', logo: 3 },
    { n: 'Minda Storage Batteries', logo: 23 }, { n: 'HBL Power Systems', logo: 2 }, { n: 'Solance Industries', logo: 24 } ] },
  { name: 'Automotive', clients: [
    { n: 'Tata Motors', logo: 11 }, { n: 'Bajaj Auto', logo: 25 }, { n: 'Force Motors', logo: 13 }, { n: 'Mahindra', logo: 12 },
    { n: 'Flash Electronics', logo: 20 }, { n: 'Varroc Engineering', logo: 19 }, { n: 'Auto Ignition', logo: 26 }, { n: 'Pricol', logo: 27 },
    { n: 'Bagla Electricals & Electronics', logo: 28 }, { n: 'Brakes India', logo: 29 }, { n: 'Hitachi Automotive Systems', logo: 30 },
    { n: 'Swiss Auto Products', logo: 31 }, { n: 'Victor Magnetics', logo: 32 } ] },
  { name: 'Electrical & electronics', clients: [
    { n: 'Stanley Black & Decker', logo: 18 }, { n: 'BHEL', logo: 17 }, { n: 'BAG Electronics', logo: 33 }, { n: 'Ducati Energia', logo: 34 },
    { n: 'Selec Controls', logo: 35 }, { n: 'Film Electronics', logo: 36 }, { n: 'DSS Micro Systems', logo: 37 }, { n: 'Electrohms', logo: 38 },
    { n: 'Intek Engineering', logo: 39 }, { n: 'Kinetic Taigene Electrical', logo: 40 }, { n: 'Motion Drivetronics', logo: 41 },
    { n: 'Prismatic Engineering', logo: 42 }, { n: 'R.D. Electrocircuits', logo: 43 }, { n: 'Srujan Electricals', logo: 44 },
    { n: 'Wimson Electronics', logo: 45 }, { n: 'Advance Components & Instruments', logo: 46 }, { n: 'Syrma Technology', logo: 21 },
    { n: 'Pragati Electricals', logo: 47 }, { n: 'Atel Devices & Systems', logo: 48 }, { n: 'Devtech M2M', logo: 49 }, { n: 'Pidilite', logo: 16 } ] },
  { name: 'PCB assembly', clients: [
    { n: 'Cyient DLM', logo: 50 }, { n: 'Incap Electronics', logo: 15 }, { n: 'Indic Electronics', logo: 14 }, { n: 'Inyantra Technologies', logo: 51 }, { n: 'Tokheim', logo: 52 } ] },
  { name: 'Export', clients: [
    { n: 'IRICHI (Malaysia)', logo: 55 }, { n: 'Associated Batteries', logo: 54 }, { n: 'Gold Star Batteries', logo: 53 }, { n: 'MSS India', logo: 4 },
    { n: 'Festolyte', logo: 5 }, { n: 'Base Batteries', logo: 6 }, { n: 'NED Energy', logo: 8 }, { n: 'Aegan Batteries', logo: 9 }, { n: 'Everlite', logo: 10 } ] },
];

export const testimonials = [
  { q: 'Electrocoating & Insulation Technologies have been our supplier for all our epoxy resin and compound needs for the last three decades. Consistent quality, timely deliveries and excellent customer service.', n: 'Jagdish Jedhe', c: 'Neotroniks Pvt. Ltd.' },
  { q: 'The company has a strong R&D setup, testing facilities and complete product knowledge. Their technical team is always available for service.', n: 'Bharat Patil', c: 'Stanley Black & Decker India Pvt. Ltd.' },
  { q: 'For any new product development their R&D team is very proactive.', n: 'Ajit Thatte', c: 'Kinetic Taigene Electrical Co. Pvt. Ltd.' },
  { q: 'Electrocoatings means good product and delivery at the right time.', n: 'Kailash Thakur', c: 'Coating Chemical Enterprises' },
  { q: 'The company has the potential to develop new products, with application techniques, for upcoming start-ups.', n: 'Kushal Dhokare', c: 'XDM Printing Solutions' },
];

export const awards = [
  { img: 'a8.jpg', t: 'Exide Business Partners Meet — Silver', y: '2013', d: 'ORM / consumables group, Exide Hosur' },
  { img: 'a1.jpg', t: 'Exide Certificate of Excellence', y: 'FY 2012–13', d: 'Quality & delivery support, ORM / consumables' },
  { img: 'a7.jpg', t: 'Exide Certificate of Excellence', y: '2011–12', d: 'On-time delivery and quality, accessories / BOP / ORM' },
  { img: 'a4.jpg', t: 'Exide Certificate of Association', y: '2007', d: 'Business partner, Exide Hosur' },
  { img: 'a10.jpg', t: 'CBIC Certificate of Appreciation', y: 'FY 2023–24', d: 'Government of India, Ministry of Finance' },
  { img: 'a3.jpg', t: 'NSIC–CRISIL rating · IRMA membership', y: '2016', d: 'Performance & credit rating; Indian Resin Manufacturers Association' },
  { img: 'a6.jpg', t: 'Powercon battery expo', y: '2022', d: 'Participant, Noida' },
  { img: 'a2.jpg', t: 'ELCOMP India', y: '2005', d: 'International conference participation, New Delhi' },
  { img: 'a5.jpg', t: 'Battery industry exhibition stand', y: '—', d: 'A trusted name in epoxy for lead-acid / VRLA batteries' },
  { img: 'a9.jpg', t: 'ISO 9001:2015', y: 'Reg. RQ91/610', d: 'ICS, NABCB accredited (QMS 009)' },
];

export const timeline = [
  { y: '2002', t: 'Company incorporated', d: 'Electrocoating & Insulation Technologies Pvt. Ltd. begins manufacturing epoxy resins, hardeners and PU formulations in Pune.' },
  { y: '2005', t: 'ELCOMP India', d: 'Takes part in the international electronics components conference in New Delhi.' },
  { y: '2007', t: 'Exide business partner', d: 'Certificate of Association from Exide Hosur for battery sealing compounds.' },
  { y: '2012', t: 'Exide excellence', d: 'Certificates of Excellence for 2011–12 and 2012–13, then Silver at the 2013 Business Partners Meet.' },
  { y: '2014', t: 'First UL listing', d: 'Urecast FR-M1 polyurethane earns UL 94 V-0 under file E255884.' },
  { y: '2016', t: 'NSIC–CRISIL rating', d: 'Rated for high performance capability and financial strength.' },
  { y: '2020', t: 'Second UL listing', d: 'Elcast 60-FR M1 epoxy added to file E255884 at UL 94 V-0.' },
  { y: '2024', t: 'CBIC appreciation', d: 'Recognised by the Ministry of Finance for GST compliance in FY 2023–24.' },
];

export const capabilities = [
  'Synthetic resin formulations',
  'Epoxy & polyurethane potting compounds',
  'Electrical insulation',
  'Electrical insulating powders',
];

export const nav = [
  { href: '/products/', label: 'Products' },
  { href: '/quality/', label: 'Quality' },
  { href: '/company/', label: 'Company' },
  { href: '/clients/', label: 'Clients' },
  { href: '/contact/', label: 'Contact' },
];
