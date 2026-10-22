// English copy. Typed as Messages, so a key missing here (or one ko.ts doesn't have) fails the build.
import type { Messages } from './ko';

const pad2 = (n: number) => String(n).padStart(2, '0');

export const en: Messages = {
  /** the wordmark's alt text */
  brand: 'DVISION',

  meta: {
    title: 'DVISION — Precision Aluminum',
    description: 'DVISION supplies automotive, industrial, architectural and aerospace & defense components through aluminum extrusion and precision machining, from Daegu, Korea.'
  },

  nav: {
    home: 'DVISION home',
    menu: 'Main menu',
    links: { '/company': 'Company', '/qac-flow': 'Q.A.C-Flow', '/data': 'Data Industry' },
    langs: { ko: 'KOR', en: 'ENG' },
    theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
    contact: 'Contact us',
    open: 'Open menu',
    close: 'Close menu'
  },

  hero: {
    label: 'Introduction',
    beats: [
      { title: 'Driving Innovation with Precision Aluminum', body: 'Automotive components finished with precision machining, and the engineering behind them, leading the future of the mobility industry.' },
      { title: 'Built Locally, Delivered Globally', body: 'From design through production to export, aluminum solutions built on trust and delivered worldwide.' },
      { title: 'Lighter Structure, Greater Possibilities', body: 'Less weight, the same performance. Lightweighting opens up wider possibilities.' },
      { title: 'Greener Materials, Smarter Choices', body: 'Aluminum is a highly recyclable, low-impact material — a smart choice for a sustainable future.' }
    ],
    hud: {
      sequence: 'Sequence', part: 'Part', system: 'System', process: 'Process',
      hint: 'Drag the part to turn it to any angle',
      beatOf: (k: number, n: number) => `${pad2(k)} / ${pad2(n)}`,
      // read out by the tick buttons
      beatLabel: (k: number, n: number) => `${k} / ${n}`
    },
    cue: 'Scroll',
    marquee: ['Aluminum Extrusion', 'CNC Machining', 'T6 Heat Treatment', 'Pipe Bending', 'Daegu → Michigan → Monterrey', '1,450 t / 3,500 t Press']
  },

  directory: {
    label: 'The three engines',
    pages: {
      '/company': { engine: 'Manufacturing', body: 'We extrude and machine aluminum ourselves, and the line we run is where our data comes from.', tags: ['Automotive parts', 'Aluminum extrusions', 'OEM / ODM'] },
      '/qac-flow': { engine: 'Solutions', body: 'Inspection that measures and manages quality with vision data analysis.', tags: ['PoC', 'Deployment', 'Maintenance', 'SaaS'] },
      '/data': { engine: 'Data', body: 'From manufacturing data we verify ourselves to a data and AI business.', tags: ['Data licensing', 'API', 'Credits'] }
    }
  },

  about: {
    eyebrow: 'About — Company',
    aside: 'Manifesto / Daegu, since 2020',
    manifesto: 'We extrude and machine aluminum into automotive, industrial and architectural components. Lighter and stronger, through <k>R&D</k>, <k>skilled people</k> and <k>our supply chain</k>.',
    frame: {
      label: 'Frame 01 / Greener materials',
      title: 'Greener, Lighter, Global',
      body: 'We build lighter parts from highly recyclable aluminum and send them from Daegu to North America — the way a social enterprise thinks about people, technology and the environment.',
      alt: 'A lake shaped like a world map set among forest',
      tagEyebrow: 'Greener Materials, Smarter Choices',
      tagTitle: 'A social enterprise built around people, technology and the environment',
      tagBody: 'Aluminum is a highly recyclable, low-impact material — a smart choice for a sustainable future.',
      ledger: [
        { value: '30%', label: 'Energy efficiency gain, two-stage inverter compressor' },
        { value: '20%', label: 'Further reduction' },
        { value: '14001', label: 'ISO environmental management, 2021' },
        { value: '5 sites', label: 'across the US and Mexico' }
      ]
    },
    years: { title: 'Six years', range: '2020 — 2025', more: 'See the full month-by-month history →' },
    pledge: {
      title: 'Our promise', aside: 'Customer, Supplier',
      customer: { title: 'Customer', sub: 'To our customers', items: ['R&D shaped around customer requirements', 'Partnership built on trust', 'Specialists with years of experience in automotive components', 'Precision machining and distinctive engineering'] },
      supplier: { title: 'Supplier', sub: 'With our suppliers', items: ['High-quality material supply', 'Sustainable supply chain management'] },
      closing: 'We intend to grow together in global markets with sustainable solutions that account for both people and the environment.'
    },
    partners: { title: 'Key customers', aside: 'End users', logoAlt: (n: number) => `Customer logo ${n}` },
    projects: { title: 'Projects in progress', count: (n: number) => `${n} projects`, item: (n: number) => `Project ${String(n).padStart(2, '0')}`, status: 'In progress' },
    org: { title: 'Organization chart', aside: 'Organization chart', collapse: 'Collapse', expand: 'Expand' }
  },

  product: {
    eyebrow: 'Product',
    title: 'Meet the DVISION product range',
    lead: 'Four industries, 26 photographs of real parts. Pick a category and the part list and photos change with it.',
    labels: { automotive: 'Automotive', industrial: 'Industrial', architecture: 'Architecture', aerospace: 'Aerospace & Defense' },
    tags: { automotive: ['Extrusion', 'CNC', 'T6'], industrial: ['Extrusion', 'Cutting', 'Machining'], architecture: ['Extrusion', 'Cutting', 'Finishing'], aerospace: ['Bending', 'Cutting', 'Deburring'] },
    counts: (parts: number, photos: number) => `${parts} parts / ${photos} photos`,
    photoCount: (n: number) => `${pad2(n)} photo${n > 1 ? 's' : ''}`,
    showSystemEn: false,
    gallery: 'Product photos'
  },

  statement: {
    label: 'Slogan',
    lines: ['Lighter Structure', 'Greater', 'Possibilities'],
    body: "Less weight, the same performance. Aluminum is a highly recyclable material, and lightweighting is mobility's next possibility."
  },

  config: {
    label: 'Profile design demo',
    eyebrow: 'Technology — Profile lab',
    title: 'One cross-section decides the weight',
    lead: 'Change the width, height, cell count and wall thickness of a multi-hollow section. Weight per metre and circumscribed circle diameter tell you which press it has to run on.',
    controls: { w: 'Width W', h: 'Height H', cells: 'Cells', wall: 'Wall t' },
    out: { area: 'Section area', weight: 'Weight', ccd: 'Circumscribed circle', press: 'Suggested press' },
    note: 'Weight is a plain calculation at an aluminum density of 2.7 g/cm³, and the press suggestion is a reference value using a 120 mm circumscribed circle as the boundary. Please contact us for actual specifications.',
    hud: { runOut: 'Run-out', die: 'Die', dieValue: 'Multi-hollow' }
  },

  process: {
    label: 'Manufacturing process',
    eyebrow: 'Technology — Manufacturing process',
    hint: 'Scroll over the cards to move along',
    hintTouch: 'Swipe the cards to move along',
    photoHint: 'Hover: photo',
    photoHintTouch: 'Tap: photo',
    step: (n: number) => `Step ${pad2(n)}`,
    middle: 'DVISION, Daegu'
  },

  equip: {
    eyebrow: 'Technology — Facilities',
    title: 'Extrusion, machining and measurement under one roof',
    lead: 'Equipment and test instruments at the head-office plant in the Daegu National Industrial Complex. Bar length is proportional to the number of units.',
    units: (q: number) => (q === 1 ? 'unit' : 'units'),
    machining: {
      title: 'Machining', sub: 'Machining equipment',
      rows: {
        center: { name: 'Machining center', spec: 'WIA i-CUT380T and others' },
        tapping: { name: 'Tapping center', spec: 'WIA VX380T and others' },
        lathe: { name: 'CNC lathe', spec: 'WIA E-200A, PL 1600G' },
        bending: { name: 'CNC pipe bending', spec: 'Max Ø50' },
        cutting: { name: 'Pipe cutting & deburring', spec: 'Max Ø120' }
      }
    },
    extrusion: {
      title: 'Extrusion', sub: 'Extrusion equipment',
      capacity: 'Press capacity',
      billet: (inch: number) => `${inch} inch billet`,
      oneUnit: '1 unit',
      aging: { name: 'Aging furnace', spec: 'T6 heat treatment, 1 + 1' }
    },
    test: { title: 'Inspection & testing equipment', aside: 'Inspection & testing', cols: ['Equipment', 'Brand', 'Purpose', 'Qty'] },
    facs: {
      machiningHall: { cap: 'Machining hall', alt: 'Facility photo 1' },
      extrusionLine: { cap: 'Extrusion line', alt: 'Facility photo 2' },
      heatTreatment: { cap: 'Heat treatment', alt: 'Facility photo 3' },
      pipeLine: { cap: 'Pipe line', alt: 'Facility photo 4' },
      cmm: { cap: 'CMM', alt: 'Test equipment photo 1' },
      utm: { cap: 'UTM', alt: 'Test equipment photo 2' },
      video: { cap: 'Video measuring', alt: 'Test equipment photo 3' },
      hardness: { cap: 'Hardness', alt: 'Test equipment photo 4' }
    }
  },

  rnd: {
    heroTag: 'Research & Development',
    eyebrow: 'R&D — Research field',
    title: 'An extrusion process controlled by data',
    lead: 'The corporate research institute works toward sustainable, low-impact lightweight components. It starts with reading process temperature and speed as numbers.',
    signal: {
      title: 'Extrusion line telemetry', badge: 'Demo signal',
      aria: 'Demo waveform of extrusion process temperature and speed',
      temp: 'Billet temp', ram: 'Ram speed',
      note: 'Illustrative waveform, not actual measurements'
    },
    research: [
      { tag: 'Process', title: 'Process build-out', body: 'Improving the data acquisition system for the aluminum extrusion process', items: ['Automatic collection of temperature, speed and other data at each process step', 'Converting the existing analog sensors to digital', 'Adding non-contact temperature sensors at each step'] },
      { tag: 'Analysis', title: 'Correlation analysis system', body: 'Visual correlation analysis between process conditions, yield and defect rate in AL extrusion', items: ['Variation history by item and by production run', 'Hourly aggregated variation history'] },
      { tag: 'Status', title: 'Research status', body: 'The research project under way.', items: [], projects: true }
    ],
    esg: {
      e: { eyebrow: 'Environment', title: 'Protecting the environment', body: 'A two-stage inverter air compressor raises energy efficiency over the previous setup and delivers further savings, cutting greenhouse gas emissions.', kpis: ['Energy efficiency gain', 'Further reduction'] },
      s: { eyebrow: 'Social', title: 'Social responsibility', body: 'An AI-based safety system detects workers approaching hazardous zones and issues a warning, preventing accidents and keeping the workplace safe.', kpis: ['Hazard zone approach detection'] },
      g: { eyebrow: 'Governance', title: 'Ethical management', body: 'Investment in high-efficiency equipment and smart safety systems is building a sustainable management system centred on energy and safety.', kpis: ['14001 / 45001 / IATF 16949'] }
    },
    certs: { title: 'Certificates, awards, patents', count: (n: number) => `${n} documents` }
  },

  global: {
    eyebrow: 'About — Global network',
    title: 'Made in Daegu, handed over in North America',
    lead: 'The head-office plant sits in the Daegu National Industrial Complex; the sales office and four logistics centers sit in the US and Mexico auto belt. The line across the Pacific is the delivery route.',
    mapAria: 'Route map linking the Daegu head office with sites in the US and Mexico'
  },

  history: {
    eyebrow: 'About — History',
    title: 'From a sole proprietorship in 2020 to an exporter',
    lead: 'Over six years we brought in presses, stacked up certifications and opened logistics centers overseas. Here is the full month-by-month history.'
  },

  qf: {
    label: 'Q.A.C-Flow quality inspection solution',
    expand: 'Quality · Analysis · Control',
    title: 'Quality inspection without paper check sheets.',
    lead: 'Measure, judge and issue the report, all from one smartphone.\nBuilt and proven in DVISION\'s own factory.',
    demo: 'Book a Demo at CES',
    poc: 'Request a PoC',
    stats: ['OCR recognition rate', 'New hardware', 'In use at our Daegu HQ plant'],
    statsNote: 'In-house validation at our Daegu HQ plant · IATF 16949',
    alt: {
      capture: 'Smartphone camera framing the display of a digital caliper reading 30.00 mm',
      ocr: 'App screen: the caliper reading is filled in by OCR and judged as a pass against the tolerance',
      trio: 'Three smartphone screens in sequence: photographing a caliper display, cropping to the reading, and the value filled in by OCR with a pass result',
      monitor: ['Measurement detail screen: each measured value plotted against its tolerance band, with the out-of-tolerance value flagged NG in red', 'Status board by machine: self-inspection and patrol inspection progress per time slot, with delays highlighted', 'Defects and actions dashboard: defect counts by type and the status of each corrective action'],
      compare: 'Mobile patrol inspection screen comparing self-inspection and patrol inspection values per dimension, with a mismatch marked as fail',
      photos: 'Side-by-side photos of the same caliper reading taken at self-inspection and at patrol inspection',
      approval: 'PC web approval screen: self-inspection and patrol inspection results compared, with an Approve and issue report button',
      report: 'Approved inspection report summary listing process, machine and each inspection slot with self-inspection and patrol inspection results'
    },
    problem: {
      kicker: '01 / Problem',
      q: 'Why does the shop floor need Q.A.C-Flow?',
      title: 'Writing a number twice is where data loses trust.',
      before: 'Before',
      after: 'With Q.A.C-Flow',
      beforeSteps: ['Read the gauge', 'Write it on paper', 'Re-type it into Excel'],
      pains: ['Time spent copying the same number again', 'Typing errors creep in', 'Quality status is known only after the weekly tally'],
      afterSteps: ['Photograph the gauge', 'OCR reads the value', 'Pass / fail against tolerance, instantly', 'Report issued on approval']
    },
    how: {
      kicker: '02 / How it works',
      q: 'How do you take a measurement?',
      title: 'Snap, crop, done. Three taps from gauge to data.',
      lead: 'No new equipment.\nYour existing calipers and gauges plus a smartphone camera.\nWorks on mobile and PC web.',
      steps: [
        { title: 'Snap', body: 'Point the phone at the gauge display and take the shot.' },
        { title: 'Crop', body: 'Drag the frame around the reading only.' },
        { title: 'OCR input', body: 'The value fills itself in and is judged against the tolerance on the spot.' }
      ]
    },
    workflow: {
      kicker: '03 / Workflow',
      q: 'How does an inspection flow?',
      title: 'One inspection, five steps, one record.',
      step: (n: number) => `Step ${n}`,
      steps: [
        { title: 'Inspection order', body: 'The production manager registers what to inspect, where and when.' },
        { title: 'Self-inspection', body: 'The operator photographs the gauge; OCR enters the value.' },
        { title: 'Patrol inspection', body: 'The patrol inspector re-measures the same items and compares the photos.' },
        { title: 'Approval', body: 'The quality manager reviews both results side by side and approves.' },
        { title: 'Report', body: 'The inspection report is issued automatically, ready as a PDF.' }
      ]
    },
    live: {
      kicker: '04 / Live monitoring',
      q: 'When do you find out about a defect?',
      title: 'Detect defects the moment they happen.',
      lead: 'Every measurement lands on the shop-floor monitor as it is taken:\nprogress by machine, each value against its tolerance,\ndefects and actions, and alerts for late inspections.',
      tabsAria: 'Monitor screens',
      tabs: ['Measurement detail', 'Status board', 'Defects & actions'],
      note: 'Screens from our in-house deployment, Korean UI. Customer names hidden.'
    },
    trace: {
      kicker: '05 / Traceability',
      q: 'How can you trust every value?',
      title: 'Every value comes with its photo.',
      lead: 'Self-inspection and patrol inspection sit side by side,\nso a mismatch is caught before approval\nand every record can be traced in a customer audit or IATF review.',
      points: [
        { title: 'Photo evidence on every value', body: 'The gauge photo is stored with the number it produced.' },
        { title: 'Self vs. patrol, side by side', body: 'Two people, two measurements, one screen to compare.' },
        { title: 'Approve once, report ready', body: 'Approval issues the audit-ready report at the same moment.' }
      ]
    },
    data: {
      kicker: '06 / From report to data',
      q: 'What happens to all that inspection data?',
      title: 'Every approved report becomes data the factory can learn from.',
      caption: 'Inspection report, issued on approval / PDF',
      steps: [
        { title: 'One report per inspection', body: 'Values, tolerances, photos and approval in one record.' },
        { title: 'Reports pile up as data', body: 'By part, machine and inspection slot, day after day.' },
        { title: 'A learning asset', body: 'The groundwork for defect prediction and process optimization.' }
      ]
    }
  },

  future: {
    label: 'Into the data industry',
    bridge: 'The inspection data piling up\nis where the data business begins',
    eyebrow: 'Our Future — Data Industry',
    title: 'Into the data industry:\n<k>expanding step by step, proven at each stage</k>',
    chainLabel: 'From manufacturing to a data business',
    chain: [
      { title: 'Manufacturing', sub: 'Extrusion, machining, assembly' },
      { title: 'Data capture', sub: 'Collected in real time' },
      { title: 'Internal PoC', sub: 'Proven in-house' },
      { title: 'External PoC', sub: 'Proven with customers' },
      { title: 'SaaS', sub: 'Offered as a service' },
      { title: 'Data Business', sub: 'A business of its own' }
    ],
    roadmap: 'Roadmap by stage',
    here: 'We are here',
    stages: [
      { year: '2026', title: 'Internal PoC', sub: 'Sharpening our own manufacturing', items: ['Validate in-house processes', 'Test data models', 'Optimize manufacturing'] },
      { year: '2027', title: 'External PoC', sub: 'Building out', items: ['Validate with external customers', 'Build the system', 'Field trials'] },
      { year: '2028', title: 'SaaS product', sub: 'Commercial launch', items: ['Service launch', 'Grow the customer base', 'First revenue'] },
      { year: '2029', title: 'Data/Credit', sub: 'Full-scale business', items: ['Data business', 'Credit system', 'Global expansion'] }
    ],
    closing: 'Beyond manufacturing, <k>into data and AI markets for a new engine of growth</k>'
  },

  events: {
    eyebrow: 'About — Events',
    title: 'Where DVISION has shown up',
    filters: 'Event filters',
    all: 'All',
    count: (n: number) => `${n} event${n === 1 ? '' : 's'}`,
    kind: { out: 'External', in: 'In-house' },
    host: 'Host',
    press: 'Press',
    video: 'Video',
    coverage: 'Coverage',
    coverageCount: (n: number) => `${n} Coverage`,
    none: 'No links on file.',
    photo: (n: number) => `${n}`
  },

  community: {
    eyebrow: 'Community',
    title: 'News from DVISION',
    news: {
      tag: 'News', date: '2025.11.12',
      title: 'Website renewal',
      body: 'We have redesigned the official website to give a better user experience. The renewal reflects our work on innovation and accessibility, with more intuitive navigation and up-to-date information.',
      more: 'More news'
    },
    video: {
      tag: 'PR video', source: 'YouTube',
      play: 'Play the PR video', frameTitle: 'DVISION PR video', close: 'Close',
      title: 'PR video',
      body: 'See the DVISION process on video, from extrusion through machining to shipping.',
      channel: 'Go to the channel'
    },
    catalog: {
      tag: 'Catalog', size: 'PDF 5.6 MB',
      cover: 'DVISION catalog cover',
      title: 'DVISION catalog',
      body: 'The official catalog covering product lines, equipment, processes and certifications.',
      download: 'Download the catalog'
    },
    social: { youtube: 'YouTube', instagram: 'Instagram', linkedin: 'LinkedIn' }
  },

  contact: {
    eyebrow: 'Support — Contact us',
    title: 'We answer with quality, engineering and genuine care',
    email: 'Email us',
    catalog: 'Download the catalog',
    info: { tel: 'Tel', fax: 'Fax', email: 'E-mail', address: 'Address', overseas: 'Overseas' },
    address: '237, Gukgasandan-daero 33-gil, Guji-myeon, Dalseong-gun, Daegu 43011, Korea <map>Directions ↗</map>',
    overseas: 'Michigan sales office; Canton / Querétaro / Laredo / Monterrey logistics centers',
    form: {
      title: 'Send an inquiry',
      company: 'Company', name: 'Contact name', tel: 'Phone', email: 'Email', message: 'Message',
      send: 'Send inquiry',
      note: 'Until the send server is wired up, your mail app opens with the message pre-filled.',
      sent: 'Your mail app is open. We reply within two business days of receiving it.',
      mail: { subject: '[Website inquiry] ', company: 'Company', name: 'Contact', tel: 'Phone', email: 'Email', message: 'Message' }
    },
    footer: { copyright: '© 2026 DVISION. All rights reserved.', tagline: 'Precision aluminum, extruded in Daegu', top: 'Back to top ↑' }
  }
};
