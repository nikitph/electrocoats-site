/**
 * Single source of truth for every product. Feeds the finder, each product page,
 * the enquiry dropdown and the legacy-URL redirects.
 *
 * Content is taken from the previous electrocoats.com pages. Nothing numeric has
 * been invented: where the old page had no data, `stub: true` and the page asks
 * for a datasheet instead of showing a spec table.
 */

export const APPLICATIONS = {
  electrical: { label: 'Electrical & Electronics', short: 'E&E', slug: 'electrical-electronics', d: 'Potting, casting, coating and impregnation compounds for transformers, LED drivers, PCBs, motors and switchgear.' },
  battery: { label: 'Batteries', short: 'BAT', slug: 'batteries', d: 'Lid-to-container and terminal sealing epoxies for lead-acid and VRLA batteries.' },
  civil: { label: 'Civil Engineering', short: 'CIV', slug: 'civil-engineering', d: 'Water-thinnable epoxies and protective coatings for tanks, terraces, floors and stone.' },
  tooling: { label: 'Modelling & Tooling', short: 'TLG', slug: 'modelling-tooling', d: 'Boards, pastes, gelcoats and PU systems for patterns, fixtures and moulds.' },
  general: { label: 'General Purpose', short: 'GP', slug: 'general-purpose', d: 'Adhesives, putties, diluents and pigment pastes for the workshop.' },
} as const;

/** URL of an application's category page. */
export const appHref = (k: keyof typeof APPLICATIONS) => `/products/${APPLICATIONS[k].slug}/`;

export const PROCESSES = {
  potting: 'Potting & encapsulation',
  casting: 'Casting',
  coating: 'Coating',
  impregnation: 'Impregnation',
  sealing: 'Sealing',
  bonding: 'Bonding',
  tooling: 'Patterns & moulds',
  additive: 'Diluents & additives',
} as const;

export const CHEMISTRIES = {
  epoxy: { label: 'Epoxy', code: 'EP' },
  polyurethane: { label: 'Polyurethane', code: 'PU' },
  silicone: { label: 'Silicone', code: 'SI' },
  phenolic: { label: 'Phenolic', code: 'PH' },
  asphalt: { label: 'Asphalt', code: 'AS' },
  polyester: { label: 'Polyester', code: 'PE' },
  pigment: { label: 'Pigment', code: 'PG' },
} as const;

export const ATTRIBUTES = {
  ul: 'UL 94 V-0',
  fr: 'Flame retardant',
  rohs: 'RoHS compliant',
  classF: 'Class F (155 °C)+',
  rt: 'Room-temperature cure',
  thermal: 'High thermal conductivity',
} as const;

export type App = keyof typeof APPLICATIONS;
export type Proc = keyof typeof PROCESSES;
export type Chem = keyof typeof CHEMISTRIES;
export type Attr = keyof typeof ATTRIBUTES;

export interface Product {
  slug: string;
  name: string;
  chemistry: Chem;
  apps: App[];
  process: Proc[];
  attrs: Attr[];
  /** one-line summary used on cards and meta descriptions */
  summary: string;
  intro?: string[];
  features?: string[];
  uses?: string[];
  /** spec rows, only what the source states */
  specs?: [string, string][];
  /** hardener / colour / pack variants mentioned on the old site */
  variants?: string[];
  featured?: boolean;
  stub?: boolean;
  /** container glyph drawn on the card */
  pack: 'pail' | 'drum' | 'can' | 'bag' | 'board' | 'cartridge';
  /** old filenames that should 301 here */
  legacy: string[];
}

export const products: Product[] = [
  // ───────── Electrical & electronics · potting, epoxy
  {
    slug: 'epofil-60', name: 'Epofil 60', chemistry: 'epoxy', apps: ['electrical'], process: ['potting', 'casting'],
    attrs: ['rohs', 'classF'], pack: 'pail', featured: true, legacy: ['epofil-60.html'],
    summary: 'Pigmented, filled, solvent-free epoxy for void-free potting of small and medium components.',
    intro: [
      'EPOFIL 60 is a pigmented, filled, solvent-free, RoHS compliant epoxy compound, formulated and processed to obtain void-free casting, potting and encapsulated components.',
      'A ready-to-use filled system with low viscosity at processing temperature. It is a slow-curing system with low exotherm.',
    ],
    features: ['RoHS compliance', 'Good adhesion to most organic and inorganic materials', 'Good mechanical and electrical properties', 'Reduced shrinkage and exotherm', 'Low coefficient of linear thermal expansion'],
    uses: ['Casting, potting and sealing of small and medium sized electrical and electronic components'],
    specs: [['Chemistry', 'Filled epoxy, solvent free'], ['Thermal class', 'F · 155 °C'], ['Shrinkage', '1.5 – 2.0 %'], ['Cure', 'Slow, low exotherm'], ['Compliance', 'RoHS']],
  },
  {
    slug: 'epofil-60-d20', name: 'Epofil 60 D-20', chemistry: 'epoxy', apps: ['electrical'], process: ['potting', 'casting'],
    attrs: ['rohs', 'classF', 'thermal'], pack: 'pail', legacy: ['epofil-60-D20.html'],
    summary: 'Flexible filled epoxy built for heavy thermal cycling and SMD electronics potting.',
    intro: [
      'EPOFIL 60 D-20 is a filled, solvent-free, RoHS compliant epoxy compound for void-free casting, potting and encapsulation, with low viscosity at processing temperature and low exotherm.',
      'General-purpose epoxy potting compounds cured with polyamine or polyamide hardeners reach Shore D 80 and above. They are mechanically strong but cycle poorly under temperature, and the stress causes component failure. EPOFIL 60 D-20 was developed for better thermal cycling.',
    ],
    features: ['Excellent flexibility', 'Increased thermal conductivity', 'Good adhesion', 'Good mechanical and electrical properties', 'Reduced shrinkage and exotherm', 'Low CLTE and lower thermal stress', 'Suitable for SMD electronic potting', 'RoHS compliance'],
    uses: ['Casting, potting and sealing of small and medium sized electrical and electronic components', 'Assemblies that see a large degree of thermal cycling'],
    specs: [['Chemistry', 'Filled epoxy, solvent free'], ['Thermal class', 'F · 155 °C'], ['Working range', '−30 °C to 150 °C'], ['Shrinkage', '< 0.1 %'], ['Compliance', 'RoHS']],
  },
  {
    slug: 'epofil-60-fr', name: 'Epofil 60-FR (Thixo)', chemistry: 'epoxy', apps: ['electrical'], process: ['potting', 'casting', 'bonding'],
    attrs: ['fr', 'classF', 'rt', 'thermal'], pack: 'pail', legacy: ['epofil-60-FR.html'],
    summary: 'Fire-retardant, thixotropic filled epoxy that cures at room temperature.',
    intro: [
      'A fire-retardant, filled epoxy system that cures at room temperature, for electrical and electronic potting and casting.',
      'Specially formulated and processed for void-free encapsulation and good electrical properties, with moderate viscosity at processing temperature. Anti-settling agents keep the filler soft and easy to re-mix after storage.',
    ],
    features: ['Good thermal conductivity', 'Class F (155 °C) continuous operation', 'Good adhesion to most organic and inorganic materials', 'Good chemical and water resistance', 'Reduced shrinkage and exotherm', 'Low coefficient of linear expansion', 'Can be used as an adhesive'],
    uses: ['Casting, potting and sealing of small and medium circuits and components', 'Casting of switchgear components and insulators', 'Potting of instrument transformers', 'Cable joint insulation', 'Topping of capacitors as a sealant'],
    specs: [['Chemistry', 'Filled epoxy, fire retardant'], ['Rheology', 'Thixotropic, anti-settling'], ['Thermal class', 'F · 155 °C'], ['Cure', 'Room temperature']],
  },
  {
    slug: 'epofil-60-hf', name: 'Epofil 60 HF', chemistry: 'epoxy', apps: ['electrical'], process: ['potting'],
    attrs: [], pack: 'pail', stub: true, legacy: ['epofil-60-HF.html'],
    summary: 'Epofil 60 family potting grade. Technical data available on request.',
  },
  {
    slug: 'epofil-hc-6016', name: 'Epofil HC 6016', chemistry: 'epoxy', apps: ['electrical'], process: ['potting'],
    attrs: ['rohs', 'classF', 'rt', 'thermal'], pack: 'pail', featured: true, legacy: ['epofil-HC-6016.html'],
    summary: 'High thermal-conductivity epoxy that cures at room temperature, for heat-dissipating electronics.',
    intro: [
      'EPOFIL HC 6016 is a filled, solvent-free, RoHS compliant epoxy compound for void-free casting, potting and encapsulation.',
      'Special ingredients give it high thermal conductivity. It cures at room temperature with good electrical, mechanical and chemical properties.',
    ],
    features: ['High thermal conductivity', 'Room-temperature cure', 'Good electrical, mechanical and chemical properties', 'Stable under thermal cycling'],
    uses: ['Potting of electronic and electrical components', 'Encapsulation where higher thermal conductivity is needed', 'Thermal-cycling potting applications'],
    specs: [['Chemistry', 'Filled epoxy, solvent free'], ['Thermal class', 'F · 155 °C'], ['Cure', 'Room temperature'], ['Compliance', 'RoHS']],
  },
  {
    slug: 'elcast-60-fr-m1', name: 'Elcast 60-FR M1', chemistry: 'epoxy', apps: ['electrical'], process: ['potting', 'casting'],
    attrs: ['ul', 'fr', 'rohs', 'classF'], pack: 'pail', featured: true, legacy: ['elcast-60-FR-M1.html'],
    summary: 'UL 94 V-0 listed, fire-retardant filled epoxy with under 0.1 % shrinkage.',
    intro: [
      'ELCAST 60-FR M1 is a fire-retardant, pigmented, filled, solvent-free, RoHS compliant epoxy compound, formulated and processed to obtain void-free casting, potting and encapsulated components.',
    ],
    features: ['UL 94 V-0 approved', 'RoHS compliance', 'Good adhesion to most organic and inorganic materials', 'Good mechanical and electrical properties', 'Reduced shrinkage and exotherm', 'Low coefficient of linear thermal expansion'],
    uses: ['Casting, potting and sealing of small and medium sized electrical and electronic components'],
    specs: [['Chemistry', 'Filled epoxy, fire retardant'], ['Flammability', 'UL 94 V-0'], ['UL file', 'E255884 · 1 Jun 2020'], ['Thermal class', 'F · 155 °C'], ['Shrinkage', '< 0.1 %'], ['Compliance', 'RoHS']],
  },
  // ───────── potting, polyurethane & others
  {
    slug: 'resin-x-seal', name: 'Resin X Seal', chemistry: 'polyurethane', apps: ['electrical'], process: ['potting'],
    attrs: [], pack: 'drum', legacy: ['resin-X-seal.html', 'X-seal.html'],
    summary: 'Castor-oil based PU potting compound: low exotherm, very low shrinkage, highly resilient.',
    intro: [
      'Resin X Seal is a castor-oil based potting compound for electrical and electronic applications. Mixed with liquid isocyanates it reacts and cures to a PCR plastic.',
    ],
    features: ['Low exotherm', 'Very low shrinkage', 'High elasticity, highly resilient', 'Resistant to chemicals and transformer oils', 'Easy to pour', 'Better thermal cycling than epoxies'],
    uses: ['Potting of electronic and electrical components', 'Encapsulation with higher thermal conductivity', 'Thermal-cycling potting applications'],
    specs: [['Chemistry', 'Castor-oil polyol + isocyanate'], ['Thermal class', 'B · 130 °C']],
  },
  {
    slug: 'urecast-fr-m1', name: 'Urecast FR-M1', chemistry: 'polyurethane', apps: ['electrical'], process: ['potting'],
    attrs: ['ul', 'fr', 'rohs', 'classF'], pack: 'drum', featured: true, legacy: ['urecast-FR-M1.html'],
    summary: 'UL 94 V-0 listed polyurethane potting compound, resilient with under 0.1 % shrinkage.',
    intro: [
      'URECAST FR-M1 is a pigmented, filled, solvent-free, RoHS compliant PU potting compound. Mixed with liquid polyisocyanates it reacts and cures to a thermoset, with distinct advantages over epoxy resins.',
    ],
    features: ['UL 94 V-0 approved', 'RoHS compliance', 'Good mechanical and electrical properties', 'Reduced shrinkage and exotherm', 'Low coefficient of linear thermal expansion', 'High elasticity, highly resilient'],
    uses: ['Potting of electronic and electrical components', 'Encapsulation with higher thermal conductivity', 'Thermal-cycling potting applications'],
    specs: [['Chemistry', 'Filled polyurethane'], ['Flammability', 'UL 94 V-0'], ['UL file', 'E255884 · 13 May 2014'], ['Thermal class', 'F · 155 °C'], ['Shrinkage', '< 0.1 %'], ['Compliance', 'RoHS']],
  },
  {
    slug: 'urecast-60-lv', name: 'Urecast 60 LV', chemistry: 'polyurethane', apps: ['electrical'], process: ['potting', 'casting'],
    attrs: ['fr', 'rohs', 'classF'], pack: 'drum', legacy: ['urecast-60-LV.html'],
    summary: 'Low-viscosity, fire-resistant PU with very high thermal-cycling performance; repairable.',
    intro: [
      'URECAST 60 LV is a pigmented, filled, solvent-free, RoHS compliant polyurethane compound for void-free casting, potting and encapsulation, with very low shrinkage, fire resistance and very high thermal-cycling properties.',
    ],
    features: ['Very low shrinkage', 'Good adhesion to PVC', 'Good mechanical and electrical properties', 'Repairable system'],
    uses: ['Casting, potting and sealing of small and medium sized electrical and electronic components'],
    specs: [['Chemistry', 'Filled polyurethane'], ['Thermal class', 'F · 155 °C'], ['Shrinkage', '< 0.1 %'], ['Compliance', 'RoHS']],
  },
  {
    slug: 'apc-90', name: 'APC-90', chemistry: 'asphalt', apps: ['electrical'], process: ['potting'],
    attrs: ['rohs', 'classF', 'thermal'], pack: 'drum', legacy: ['APC-90.html'],
    summary: 'Asphalt-based potting compound with high thermal conductivity, widely used in LED drivers.',
    intro: ['APC-90 is an asphalt-based electrical encapsulation and potting compound. It is cast into cavities containing electrical components to insulate, protect and hold them in place.'],
    features: ['RoHS compliance', 'Good adhesion to most organic and inorganic materials', 'Good mechanical and electrical properties', 'Low coefficient of linear thermal expansion', 'High thermal conductivity'],
    uses: ['Casting, potting and sealing of small and medium electrical and electronic components', 'LED driver potting'],
    specs: [['Chemistry', 'Asphalt based'], ['Thermal class', 'F · 155 °C'], ['Compliance', 'RoHS']],
  },
  {
    slug: 'silcast-rtv-50', name: 'Silcast RTV-50', chemistry: 'silicone', apps: ['electrical'], process: ['potting'],
    attrs: ['rt', 'thermal'], pack: 'cartridge', legacy: ['silcast-RTV-50.html'],
    summary: 'Two-part, low-odour RTV silicone: soft, reworkable, no ovens required.',
    intro: ['SILCAST RTV-50 is a two-part, low-odour RTV silicone potting and encapsulating resin that cures on exposure to ambient temperature and moisture. Its softness, thermal-shock behaviour and thermal conductivity help dissipate heat and extend product life.'],
    features: ['Reworkable', 'Excellent dielectric properties', 'No priming step required', 'Room-temperature cure, no ovens', 'Energy savings from RT cure'],
    uses: ['LED lighting drivers', 'Power modules', 'Inverters', 'Transformers', 'Ballasts', 'Sensors', 'Electronic control units'],
    specs: [['Chemistry', 'Two-part RTV silicone'], ['Cure', 'Ambient temperature + moisture']],
  },
  // ───────── casting
  {
    slug: 'resin-520', name: 'Epoxy Resin 520', chemistry: 'epoxy', apps: ['electrical', 'general'], process: ['casting', 'potting'],
    attrs: [], pack: 'drum', featured: true,
    legacy: ['resin-520.html', 'resin-520-with-hardner-D.html', 'resin-520-with-hardner-HG.html', 'resin-520-with-hardner-AMD-140.html'],
    summary: 'Low-viscosity, long pot-life solventless epoxy for switchgear, CT/PT casting and APG.',
    intro: ['Epoxy Resin 520 is a solventless epoxy resin that cures to a hard mass with a range of room-temperature and heat-curing hardeners.'],
    features: ['Low viscosity', 'Long pot life', 'Good mechanical and electrical properties', 'Fast gelling at high temperature, suited to pressure gelation'],
    uses: ['Switchgear bushings', 'Current and voltage transformers', 'Bus bar support assemblies', 'Automatic pressure gelation casting', 'Glass-fibre impregnation and lamination (lay-up or pultrusion)'],
    variants: ['Hardener D', 'Hardener HG', 'Hardener AMD 140'],
    specs: [['Chemistry', 'Solventless epoxy'], ['Hardeners', 'RT-cure and heat-cure options'], ['Process', 'Gravity casting, APG, lamination']],
  },
  {
    slug: 'urecast-70-hf', name: 'Urecast 70 HF', chemistry: 'polyurethane', apps: ['electrical'], process: ['casting', 'potting'],
    attrs: ['rohs', 'classF'], pack: 'drum', legacy: ['urecast-70-HF.html'],
    summary: 'Filled PU casting compound with excellent impact and heat-shock resistance.',
    intro: ['URECAST 70 HF is a pigmented, filled, solvent-free, RoHS compliant polyurethane compound for void-free casting, potting and encapsulation. It offers excellent resistance to impact and heat shock, with very low shrinkage.'],
    features: ['RoHS compliance', 'Good adhesion to most organic and inorganic materials', 'Good mechanical and electrical properties', 'Reduced shrinkage and exotherm', 'Low coefficient of linear thermal expansion'],
    uses: ['Casting, potting and sealing of small and medium sized electrical and electronic components'],
    specs: [['Chemistry', 'Filled polyurethane'], ['Thermal class', 'F · 155 °C'], ['Compliance', 'RoHS']],
  },
  // ───────── coatings
  {
    slug: 'gelcoat', name: 'Epoxy Gelcoat', chemistry: 'epoxy', apps: ['electrical', 'tooling'], process: ['coating'],
    attrs: [], pack: 'pail', legacy: ['gelcoat.html'],
    summary: 'Thixotropic finishing coat for coils, stators and PCBs; blue tooling and black IP67 grades.',
    intro: ['EPOXY GELCOAT is a filled, solvent-free compound with thixotropic consistency, good electrical and mechanical properties and excellent chemical and humidity resistance.'],
    uses: ['Finishing coat on varnish-impregnated coils, transformers, stators and armatures for tracking, moisture and chemical resistance', 'Blue tooling gelcoat for the top layer of holding fixtures', 'Black gelcoat to cover SMD components on PCBs for IP67 and to protect circuit designs from copying'],
    variants: ['Clear', 'Blue (tooling)', 'Black (PCB)'],
    specs: [['Chemistry', 'Filled epoxy, solvent free'], ['Rheology', 'Thixotropic']],
  },
  {
    slug: 'drz-51', name: 'DRZ-51', chemistry: 'phenolic', apps: ['electrical'], process: ['coating'],
    attrs: [], pack: 'bag', legacy: ['DRZ-51.html'],
    summary: 'Phenolic powder for coating capacitors, resistors and coils. Developed in India, one-year shelf life.',
    intro: ['DRZ-51 is a blended thermosetting phenolic resin powder specially formulated for electronic component coating. It suits Indian climatic conditions and has a minimum shelf life of one year.'],
    features: ['Longer shelf life than imported powders', 'Shorter drying and curing time', 'Excellent solvent resistance', 'Allows cheaper solvents', 'First indigenous development of its kind in India', 'Made only from indigenous raw materials'],
    uses: ['Coating capacitors, resistors, coils, thick films, chips and PCBs for electrical, mechanical, solvent and humidity protection'],
    specs: [['Chemistry', 'Phenolic resin powder'], ['Shelf life', '≥ 12 months']],
  },
  {
    slug: 'epicoat-e', name: 'Epicoat-E', chemistry: 'epoxy', apps: ['electrical'], process: ['coating', 'impregnation'],
    attrs: [], pack: 'bag', featured: true, legacy: ['epicoat-E.html'],
    summary: 'One-part epoxy powder for slot-cell insulation of micro-motor stators and armatures.',
    intro: [
      'Epicoat-E is a one-part epoxy resin powder for insulation coating of slot cells in motor stators and rotors, particularly micro motors such as two-wheeler auto-start motors, magnetos and hand-tool armatures.',
      'The powder can also be used for motor coil impregnation.',
    ],
    features: ['High heat resistance', 'High glass transition temperature', 'Good adhesion and edge coverage', 'Better abrasion and cut-through resistance', 'Excellent electrical properties', 'Moderate-temperature cure, no post cure', 'Excellent cloud formation'],
    uses: ['Fluidised and electro-fluidised bed coating', 'Armatures and stators of auto-start motors, magnetos and hand tools'],
    specs: [['Chemistry', 'One-part epoxy powder'], ['Process', 'Fluidised / electro-fluidised bed'], ['Cure', 'Moderate temperature, no post cure']],
  },
  {
    slug: 'resin-500-75x', name: 'Epoxy Resin 500-75X', chemistry: 'epoxy', apps: ['general', 'civil'], process: ['coating'],
    attrs: [], pack: 'drum', legacy: ['resin-500-75X.html'],
    summary: 'Solvent-cut, medium molecular weight epoxy for two-pack paints and protective coatings.',
    intro: [
      'A solvent-cut epoxy resin of medium molecular weight for two-pack epoxy paints, intermediates and finish coats.',
      'Tight specifications reduce batch-to-batch variation and give superior flow, freedom from crawling and cratering, better wetting, and less pigment floating, flocculation and silking.',
    ],
    features: ['Soluble in n-butanol/aromatic blends, esters, ketones and glycol ethers', 'Compatible with amino resins, thermosetting acrylics and short-oil alkyds', 'Works with polyamine, adduct, polyamide and phenolic hardeners'],
    uses: ['Maintenance coatings', 'Marine finishes', 'Tank linings', 'Floor finishes', 'Concrete coatings', 'Interior pipe coatings'],
    specs: [['Chemistry', 'Solvent-cut epoxy'], ['Hardener', 'EC-115-70X'], ['Mix ratio', '100 : 35 by volume']],
  },
  {
    slug: 'silicone-paint-sp-91', name: 'Silicone Paint SP-91 & Varnish SV-117', chemistry: 'silicone', apps: ['electrical'], process: ['coating', 'impregnation'],
    attrs: [], pack: 'can', legacy: ['silicon-paint-SP-91.html'],
    summary: 'Heat-resistant silicone paint for wire-wound resistors, plus Class H coil varnish.',
    intro: [
      'Silicone-resin paints for coating wire-wound resistors, with advantages over conventional epoxy and vitreous coatings.',
      'SV-117 is a 50 % solids methyl-silicone varnish for Class H coil impregnation: a thermosetting varnish for electric coils and insulation parts.',
    ],
    features: ['Cures far below vitreous coatings', 'Ready-made in a range of heat-resistant colours', 'Resists humidity and corrosive atmospheres', 'High continuous operating temperature', 'Simple to apply'],
    uses: ['Wire-wound resistor coating (SP-91)', 'Class H coil impregnation (SV-117)'],
    specs: [['SP-91 cure', '150 – 250 °C'], ['SV-117 cure', '150 – 180 °C'], ['SV-117 class', 'H · 180 °C'], ['SV-117 solids', '50 % silicone']],
  },
  {
    slug: 'air-drying-varnish', name: 'Excel Coat AD Air-Drying Varnish', chemistry: 'phenolic', apps: ['electrical'], process: ['coating', 'impregnation'],
    attrs: [], pack: 'can', legacy: ['air-drying-varnish.html'],
    summary: 'Modified phenolic air-drying varnish with high moisture and tracking resistance.',
    intro: ['Excel Coat AD is a modified phenolic air-drying insulating varnish of temperature index 120 (Class E). Fully cured, it has good dielectric properties and excellent resistance to tracking, mild acids, alkalis and hot transformer oil, and holds its electrical properties in humid conditions.'],
    uses: ['Finishing varnish for windings and electrical components', 'Machined phenolic laminates, mouldings and PCBs', 'Transformer tanks (resists hot transformer oil)', 'Stamping stacks', 'Ceiling and table-fan stator impregnation', 'Motor rewinding and repairs'],
    specs: [['Chemistry', 'Modified phenolic'], ['Thermal class', 'E · 120 °C'], ['Bake (fan stators)', '2 – 3 h at 110 – 120 °C'], ['Application', 'Dip, brush or spray']],
  },
  // ───────── batteries
  {
    slug: 'resin-505e', name: 'Resin 505 E', chemistry: 'epoxy', apps: ['battery'], process: ['sealing', 'bonding'],
    attrs: [], pack: 'pail', featured: true, legacy: ['resin-505E.html'],
    summary: 'Lid-to-container and terminal sealing epoxy for VRLA batteries; red and black grades.',
    intro: ['Epoxy Resin 505 E with Epoxy Hardener 269 E is used as glue for lid-to-container sealing of VRLA batteries and for terminal sealing. It bonds PP to PP and ABS to ABS, has excellent acid resistance, and does not shrink on cooling.'],
    features: ['Excellent electrolyte resistance', 'Fast curing', 'Mild smell', 'Very good resistance to H₂SO₄'],
    uses: ['Lid-to-container sealing of VRLA batteries', 'Terminal sealing'],
    variants: ['Red', 'Black'],
    specs: [['Chemistry', 'Epoxy'], ['Hardener', '269 E'], ['Substrates', 'PP–PP, ABS–ABS']],
  },
  {
    slug: 'resin-505e-fr', name: 'Resin 505 E FR', chemistry: 'epoxy', apps: ['battery'], process: ['sealing', 'bonding'],
    attrs: ['fr'], pack: 'pail', legacy: ['resin-505E-FR.html'],
    summary: 'Fire-retardant VRLA sealing epoxy for railway and telecom-tower batteries.',
    intro: ['Epoxy Resin 505 E FR with Hardener 269 E FR was developed for VRLA batteries used in railways, mobile towers and similar duty. It has excellent fire-retardant properties, bonds PP to PP and ABS to ABS, resists acid and does not shrink on cooling.'],
    features: ['Excellent fire retardancy', 'Excellent electrolyte resistance', 'Fast curing', 'Mild smell', 'Very good resistance to H₂SO₄'],
    uses: ['Lid-to-container sealing of VRLA batteries', 'Terminal sealing'],
    specs: [['Chemistry', 'Epoxy, fire retardant'], ['Hardener', '269 E FR'], ['Substrates', 'PP–PP, ABS–ABS']],
  },
  {
    slug: 'resin-505e-fr-ir', name: 'Resin 505 E FR IR', chemistry: 'epoxy', apps: ['battery'], process: ['sealing'],
    attrs: ['fr'], pack: 'pail', stub: true, legacy: ['resin-505E-FR-IR.html'],
    summary: 'Fire-retardant battery sealing grade in the 505 E family. Technical data available on request.',
  },
  {
    slug: 'resin-505', name: 'Epoxy Resin 505', chemistry: 'epoxy', apps: ['electrical', 'tooling', 'general'], process: ['casting', 'tooling'],
    attrs: ['rt'], pack: 'drum', legacy: ['resin-505.html', 'resin-505-with-hardner-AMD-140.html'],
    summary: 'Clear, solvent-free, room-temperature-curing epoxy for CT/PT, moulds and composites.',
    intro: ['EPOXY RESIN 505 is a clear, solvent-free epoxy compound with good adhesion to most surfaces. It cures at room temperature and has good electrical and mechanical properties.'],
    uses: ['Current transformers', 'Potential transformers', 'Charging coils', 'Moulds and patterns', 'Composites'],
    variants: ['Hardener AMD 140'],
    specs: [['Chemistry', 'Clear epoxy, solvent free'], ['Cure', 'Room temperature']],
  },
  // ───────── civil
  {
    slug: 'water-based-epoxy', name: 'Water-Thinnable Epoxy System', chemistry: 'epoxy', apps: ['civil'], process: ['coating', 'sealing'],
    attrs: [], pack: 'pail', featured: true, legacy: ['water-based-epoxy.html'],
    summary: 'Emulsified two-pack epoxy that bonds to wet surfaces, for complete waterproofing.',
    intro: [
      'An emulsified epoxy coating that, unlike solvent-based epoxies, adheres to wet surfaces. It forms a complete waterproofing system for all surfaces.',
      'Supplied as two equal parts by weight of resin and hardener.',
    ],
    uses: ['Waterproofing water tanks', 'Terraces, walls and toilet blocks', 'Sealing tile joints on terraces', 'Additive to cement mortar for rapid hardening and waterproofing'],
    specs: [['Chemistry', 'Water-emulsified epoxy'], ['Mix ratio', '1 : 1 by weight']],
  },
  {
    slug: 'epoxy-coal-tar', name: 'Epoxy Coal Tar', chemistry: 'epoxy', apps: ['civil'], process: ['coating'],
    attrs: [], pack: 'pail', stub: true, legacy: ['epoxy-coal-tar.html'],
    summary: 'Epoxy coal-tar protective coating. Technical data available on request.',
  },
  {
    slug: 'granite-marble-coating', name: 'Granite & Marble Coating', chemistry: 'epoxy', apps: ['civil'], process: ['coating'],
    attrs: [], pack: 'can', stub: true, legacy: ['granite-and-marble-coating.html'],
    summary: 'Protective coating for natural stone. Technical data available on request.',
  },
  // ───────── tooling
  {
    slug: 'epoxy-boards', name: 'Epoxy Tooling Board', chemistry: 'polyurethane', apps: ['tooling'], process: ['tooling'],
    attrs: [], pack: 'board', legacy: ['epoxy-boards.html'],
    summary: 'Post-cured synthetic board for jigs, fixtures and master models. Four stock sizes.',
    intro: ['A synthetic, post-cured board material on a polyurethane base, with an even structure and flat surfaces, for jigs, fixtures and pattern work.'],
    features: ['Dense structure', 'Good edge strength', 'Low tension', 'Good workability'],
    uses: ['Tools and dies', 'Fixtures', 'Master models', 'Design models'],
    specs: [['Sizes (mm)', '1000×500×50 · 1000×500×75'], ['', '1500×500×50 · 1500×500×75']],
  },
  {
    slug: 'master-paste', name: 'Epoxy Master Paste', chemistry: 'epoxy', apps: ['tooling'], process: ['tooling'],
    attrs: ['rt'], pack: 'pail', legacy: ['master-paste.html'],
    summary: 'Lightweight epoxy putty that cures to the density of seasoned teak and works like wood.',
    intro: [
      'General-purpose two-component epoxy putties are hard to work and dense. This lightweight putty cures to the density of seasoned teak and works like wood.',
      'The mix is easily pliable and can be formed to any shape. The cured mass can be planed, sawn, chiselled and painted, and it doubles as repair putty for epoxy tooling boards.',
    ],
    uses: ['Pattern and model making', 'Repair putty for epoxy boards'],
    specs: [['Chemistry', 'Two-part lightweight epoxy'], ['Set time', '3 – 4 h at room temperature'], ['Density', 'Comparable to seasoned teak']],
  },
  {
    slug: 'high-flex-pu', name: 'High Flex PU', chemistry: 'polyurethane', apps: ['tooling'], process: ['tooling'],
    attrs: ['rt'], pack: 'drum', legacy: ['high-flex-PU.html'],
    summary: 'Two-part flexible PU for mould making, rapid prototyping and patterns.',
    intro: ['A two-part flexible system for mould making, rapid prototyping, pattern making and tooling.'],
    features: ['Minimum shrinkage', 'Moisture-proof', 'Room-temperature cure', 'Excellent abrasion resistance', 'Oil resistant', 'High flexibility, low hardness'],
    uses: ['Mould making', 'Rapid prototyping', 'Pattern making'],
    specs: [['Chemistry', 'Two-part polyurethane'], ['Cure', 'Room temperature']],
  },
  {
    slug: 'urecast-fnd', name: 'Urecast FND', chemistry: 'polyurethane', apps: ['tooling'], process: ['tooling', 'casting'],
    attrs: [], pack: 'drum', legacy: ['Urecast-FND.html', 'urecast-FND-2.html'],
    summary: 'Abrasion-resistant, flexible castable PU for foundry patterns and core boxes.',
    features: ['Excellent abrasion resistance', 'Flexible', 'No brittle phase', 'Castable'],
    uses: ['Foundry patterns', 'Pattern plates', 'Fixtures', 'Core boxes'],
    specs: [['Chemistry', 'Castable polyurethane']],
  },
  // ───────── general purpose
  {
    slug: 'epi-bond', name: 'Epi-Bond', chemistry: 'epoxy', apps: ['general', 'tooling'], process: ['bonding'],
    attrs: [], pack: 'cartridge', featured: true, legacy: ['epi-bond.html'],
    summary: 'Tough, thixotropic two-part epoxy adhesive for high-strength bonding of almost anything.',
    intro: ['EPI-BOND is a versatile two-part epoxy adhesive (A: resin, B: hardener) for high bond-strength applications.'],
    features: ['Excellent adhesion to all materials', 'Tough, elastic cured mass with high impact resistance', 'High adhesive, tensile and shear strength', 'Thixotropic, stays on vertical surfaces', 'Excellent electrical insulation', 'Suitable for food-grade applications'],
    uses: ['Magnets and ferrites', 'Brake liners', 'Wood and metal patterns', 'Wood, metal, glass, marble and granite bonding', 'Steel railing fixing'],
    specs: [['Chemistry', 'Two-part epoxy adhesive'], ['Temperature index', '100 – 120 °C'], ['Rheology', 'Thixotropic']],
  },
  {
    slug: 'eazy-seal', name: 'Eazy Seal Putty', chemistry: 'epoxy', apps: ['general'], process: ['sealing', 'bonding'],
    attrs: ['rt'], pack: 'cartridge', legacy: ['eazy-seal.html', 'eazy-seal-putty.html'],
    summary: 'Multi-purpose two-part epoxy putty that sets hard and can be drilled and painted.',
    intro: ['Eazy Seal is a two-component, room-temperature-setting, multi-purpose epoxy putty for sealing, gripping, joining and insulating ferrous metals, granite, asbestos, glass, wood, leather and more. It cures to a tough, hard mass that can be drilled and painted, insulates well, and resists moisture and heat.'],
    uses: ['Blowholes, cracks and leaks in castings, pumps and mould boxes', 'Joints, corners and holes in wooden and metal patterns', 'Leaks in fabrications and industrial vessels', 'Water mains, storage tanks, concrete sewer pipes and heat-exchanger coils'],
    specs: [['Chemistry', 'Two-part epoxy putty'], ['Cure', 'Room temperature']],
  },
  {
    slug: 'diluent-c', name: 'Epoxy Diluent C', chemistry: 'epoxy', apps: ['general'], process: ['additive'],
    attrs: [], pack: 'can', legacy: ['diluent-C.html'],
    summary: 'Mono-epoxy reactive diluent and flexibiliser for Resins 520, 505 and 400.',
    intro: ['Epoxy Diluent C is a mono-epoxy flexibiliser and reactive diluent, compatible with Epoxy Resins 520, 505 and 400, and stable at room and low temperatures.'],
    uses: ['Casting and potting where sharp metal inserts cause stress cracking', 'Coatings that need more flexibility and lower mix viscosity', 'Laminating mixes with better glass-fibre wetting'],
    specs: [['Type', 'Reactive mono-epoxy diluent'], ['Compatible with', 'Resin 520, 505, 400']],
  },
  {
    slug: 'diluent-m', name: 'Diluent M', chemistry: 'polyester', apps: ['general', 'electrical'], process: ['additive'],
    attrs: [], pack: 'can', legacy: ['diluent-M.html'],
    summary: 'Very low-viscosity viscosity reducer and cleaner for polyester and polyesterimide resins.',
    intro: ['Diluent M is a very low-viscosity linear-chain polymer used as a diluent and viscosity reducer, and as a cleaning agent for polyester and polyesterimide resin compounds.'],
    uses: ['All unsaturated polyester resins', 'Viscosity reduction of Electromide 2018 500V'],
    specs: [['Dosage', '5 – 20 pbw in polyester resin']],
  },
  {
    slug: 'diluent-p', name: 'Diluent P', chemistry: 'epoxy', apps: ['general'], process: ['additive'],
    attrs: [], pack: 'can', stub: true, legacy: ['diluent-P.html'],
    summary: 'Diluent grade. Technical data available on request.',
  },
  {
    slug: 'diluent-mc', name: 'Diluent MC', chemistry: 'epoxy', apps: ['general'], process: ['additive'],
    attrs: [], pack: 'can', stub: true, legacy: ['diluent-MC.html'],
    summary: 'Diluent grade. Technical data available on request.',
  },
  {
    slug: 'coloring-paste', name: 'Colouring Paste', chemistry: 'pigment', apps: ['general'], process: ['additive'],
    attrs: [], pack: 'can', legacy: ['coloring-paste.html'],
    summary: 'Colour pigment pastes for epoxy and PU resins, matched to your shade.',
    intro: ['Colour pigments for epoxy and PU resins. Mix into natural-colour resin to get a cured compound in the colour you need. Custom shades on request.'],
    specs: [['For', 'Epoxy and PU resins'], ['Shades', 'Matched to requirement']],
  },
];

export const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

export function related(p: Product, n = 4) {
  return products
    .filter((q) => q.slug !== p.slug && !q.stub)
    .map((q) => ({ q, s: q.apps.filter((a) => p.apps.includes(a)).length * 2 + q.process.filter((x) => p.process.includes(x)).length + (q.chemistry === p.chemistry ? 1 : 0) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.q);
}
