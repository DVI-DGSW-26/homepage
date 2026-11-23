// English copy. Typed as Messages, so a key missing here (or one ko.ts doesn't have) fails the build.
import type { Messages } from './ko';
import { privacyEn } from './privacy.en';


export const en: Messages = {
  /** the wordmark's alt text */
  brand: 'DVISION',

  meta: {
    '/qac-flow': {
      title: 'QAC FLOW – Paperless quality inspection from a phone',
      description: 'Photograph the gauge with a smartphone: OCR reads the value, judges it against the tolerance and carries it through to the inspection report.'
    },
    '/data': {
      title: 'QAC FLOW Data Industry – Every inspection becomes a data asset | DVISION',
      description: 'The photo-verified inspection data QAC FLOW gathers on the floor, turned into a data business. Our 2026–2029 roadmap and partnerships.'
    },
    '/privacy': {
      title: 'Privacy Policy | DVISION',
      description: 'Privacy policy of the DVISION solutions website (solution.dvi-ind.com).'
    },
    image: 'QAC FLOW: paperless quality inspection, with the app photographing a caliper on a smartphone'
  },

  nav: {
    home: 'QAC FLOW home',
    menu: 'Main menu',
    links: { '/qac-flow': 'QAC FLOW', '/data': 'Data Industry' },
    /** the header menu (request doc p.10): sections of QAC FLOW, the data page, and CES until the end of January */
    items: { product: 'Product', how: 'How it works', proof: 'Proof', roadmap: 'Roadmap', ces: 'CES 2027' },
    sites: { label: 'DVISION sites', gateway: 'DVISION start page', manufacturing: 'Manufacturing', solution: 'Solutions' },
    langs: { ko: 'KOR', en: 'ENG' },
    theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
    open: 'Open menu',
    close: 'Close menu'
  },

  planned: 'Planned',

  media: {
    zoom: 'View full size',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    fit: 'Fit to screen',
    close: 'Close',
    watch: (s: number) => `Watch the ${s}-second demo`,
    title: 'QAC FLOW demo video',
    downloads: 'Downloads',
    kinds: { catalog: 'Catalog', leaflet: 'Leaflet' },
    file: (mb: number) => `PDF · ${mb} MB`
  },

  qf: {
    label: 'QAC FLOW quality inspection solution',
    expand: 'Quality · Analysis · Control',
    title: 'Quality inspection without paper check sheets.',
    lead: 'Measure, judge and issue the report, all from one smartphone.\nBuilt and proven in DVISION\'s own factory.',
    stats: ['No dedicated gauges or sensor installation', 'Started running in our own plant'],
    kit: 'A smartphone, one server PC and a monitor',
    statsNote: 'In-house validation at our Daegu HQ plant · IATF 16949',
    cta: { demo: 'Request a demo', cesDemo: 'Request a CES demo', apply: 'Ask about your floor', how: 'See how it works' },
    ces: {
      label: 'CES 2027',
      when: 'Jan 6–9, Las Vegas',
      where: (booth: string) => `Eureka Park Booth ${booth}`,
      hall: 'Venetian Expo Hall G',
      try: 'Measure and shoot it yourself at our booth',
      after: 'Missed us at CES 2027? Get the booth demo online'
    },
    alt: {
      capture: 'Smartphone camera framing the display of a digital caliper reading 24.38 mm',
      ocr: 'App screen: the caliper reading is filled in by OCR and judged as a pass against the tolerance',
      crop: 'App screen: dragging the corner handles of a box to crop the photo down to the caliper reading',
      compare: 'Mobile patrol inspection approval: over the self and patrol values per dimension, the self-inspection and patrol inspection photos of DIM 1 open side by side',
      approval: 'PC web patrol inspection approval screen: self and patrol inspection values compared per dimension, with Reject and Approve (issue report) buttons',
      reports: [
        'Inspection report page 1, Daily Quality Summary: prepared, reviewed and approved sign-off stamps, a QR code for verification, pass rate, headline Cpk, inspection count and issues, an X̄-R control chart and ESG carbon savings',
        'Inspection report page 2, Detailed Inspection & SPC Analysis: dimension locations on the drawing, Cp, Cpk and control status per dimension, OCR photos of self and patrol inspections compared for the first-off, in-process and last-off rounds, and the measurements of each round',
        'Inspection report page 3, Equipment Action & Traceability Log: detection, corrective action and re-inspection approval timelines for two equipment issues, the action history table, and action count, average response time and open items'
      ]
    },
    problem: {
      kicker: '01 / Problem',
      q: 'Why does the shop floor need QAC FLOW?',
      title: 'The time spent writing on paper, taking photos and re-typing into Excel drops by 60%.',
      lead: 'One photo of the gauge records the value, shares the photo and files it on the server at once, and the report is issued the moment it is approved.',
      audience: 'Built for manufacturers that still run self and patrol inspections on paper check sheets and spreadsheets.',
      pains: [
        { title: 'Recorded on paper', body: 'Values are written on check sheets by hand, and photos are taken and shared separately over messaging apps.' },
        { title: 'Retyped into spreadsheets', body: 'Back in the office, the paper records are typed into Excel all over again.' },
        {
          title: 'Records pile up, analysis is separate',
          body: 'Seeing past inspections as control charts or capability figures means collecting and reorganizing the data yet again.'
        }
      ],
      before: 'Before',
      after: 'With QAC FLOW',
      cut: 'less inspection time',
      totalsLabel: 'Initial, mid and final rounds combined',
      totals: [{ item: 'Part with 5 measuring points', from: '37 min 30 s', to: '15 min' }, { item: 'Part with 10 measuring points', from: '1 h 13 min 30 s', to: '30 min' }],
      chart: 'One inspection round · part with 5 measuring points',
      beforeParts: ['Measure', 'Write on paper', 'Take photos', 'Send photos', 'Tidy up in Excel'],
      afterParts: ['Measure', 'Photo, record, share and file on the server (at once)'],
      time: (s: number) => s >= 60 ? `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ''}` : `${s} s`,
      note: 'Measured in-house at our Daegu HQ plant (time spent before and after QAC FLOW)',
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
      ],
      rules: {
        title: 'First-off interlock and approval rules',
        rounds: [
          { title: 'First-off', body: 'Inspect → complete' },
          { title: 'In-process', body: 'Inspect → complete' },
          { title: 'Last-off', body: 'Inspect → request approval' },
          { title: 'Approval', body: 'Quality manager signs off · once, after last-off' },
          { title: 'One report', body: 'One report per approval' }
        ],
        lock: 'Locked until first-off is complete',
        reject: {
          title: 'Fail or rejection',
          body: 'A reason must be entered and no report is issued; the report follows once the part is re-inspected and approved. Skipped items stay incomplete, and an inspection can be closed early if there is a die or mold problem.'
        }
      }
    },
    live: {
      kicker: '04 / Live monitoring',
      q: 'How do you see every inspection at once?',
      title: 'Your entire floor\'s inspections, live on one monitor.',
      lead: 'When an operator enters a result on their phone, it appears on the shop-floor monitor the moment it is saved.\nProgress, measurements and defects are visible to the whole floor in real time.',
      tabsAria: 'Monitor screens',
      tabs: ['Inspection Status', 'Measurement Detail', 'Quality & Defects'],
      bodies: [
        'Track first-off, in-process and last-off self-inspections, along with patrol inspections, for every machine. See at a glance which checks are complete, which are in progress, and which are overdue or skipped.',
        'Each measured value is shown against its nominal and tolerance, with an OK/NG result for every item. A tolerance bar marks where each value falls, so readings close to the limit stand out immediately.',
        'Review today\'s defects by item and type, along with the defect rate. Every follow-up action is logged with its owner, the instruction given and its current status, so each issue can be followed through to resolution.'
      ],
      alts: [
        'Inspection status screen: completed, in-progress, skipped and delayed counts, and first-off, in-process and last-off self-inspection and patrol inspection progress for each machine',
        'Measurement detail screen: each item of an inspection in progress with its nominal and tolerance, measured value, tolerance bar and OK result',
        'Quality and defects screen: today\'s inspections and defect rate, out-of-tolerance items, defect types, and a rejected patrol inspection being re-measured by the operator'
      ],
      note: 'The actual floor monitor screens. Click a screen to see it full size. Sample data.'
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
    /** SPC (request doc p.11): the place and the copy; the screens follow once they pass review */
    spc: {
      kicker: '06 / SPC analysis',
      q: 'What can you see in the records that pile up?',
      title: 'Each inspection becomes a report; the history becomes SPC.',
      lead: 'Approved inspection records become SPC data as they are.\nPick a product, characteristic, machine and period to view control charts and process capability.',
      features: [
        { title: 'Xbar-R control chart', body: 'Follow subgroup means and ranges against their control limits.' },
        { title: 'Process capability', body: 'See how stably the process runs within tolerance with Cp, Cpk, Pp and Ppk.' },
        { title: 'Filters', body: 'Narrow the view by product, characteristic, machine and period.' },
        { title: 'Trend by machine', body: 'Compare how each machine\'s measurements move within the spec band.' }
      ],
      metricsLabel: 'Key indicators',
      metrics: ['Cpk', 'Ppk', 'Mean', 'Std. dev.', 'Sample count', 'Out of control'],
      captions: ['Filters · indicators · Xbar-R charts', 'Process capability', 'Trend by machine'],
      alts: [
        'SPC analysis screen: product, dimension, machine and period filters, an approaching-control-limit warning, Cpk, Ppk, mean, sigma, sample count and out-of-control indicators, and the X̄ and R charts',
        'SPC process capability: a histogram of all measurements against the lower and upper spec limits, with Cp, Cpk, Pp and Ppk',
        'SPC trend by machine: the measurements of CNC-01 and CNC-02 over time inside the spec band, with each machine\'s mean, Cpk and sample count'
      ],
      note: 'The actual SPC analysis screens. Click a screen to see it full size. Sample data.'
    },
    /** the inspection report: the three pages one approval issues, and what its QR code and ESG line are for */
    report: {
      kicker: '07 / Inspection report',
      q: 'What does each inspection leave behind?',
      title: 'One approval issues a three-page report, each page written for its reader.',
      lead: 'Management and buyers read the results on page 1, quality engineers the evidence on page 2, and auditors and maintenance teams the action history on page 3.',
      pageLabel: (n: number) => `Page ${n}`,
      pages: [
        { title: 'Daily Quality Summary', reader: 'Management · Buyers', body: 'Pass rate, headline Cpk, inspection count and issues at a glance, with an Xbar-R control chart and the prepared, reviewed and approved sign-offs.' },
        { title: 'Detailed Inspection & SPC Analysis', reader: 'Quality engineers', body: 'Cp, Cpk and control status for each dimension, the OCR photos of self and patrol inspections compared round by round, and the measurements behind them.' },
        { title: 'Equipment Action & Traceability Log', reader: 'Auditors · Maintenance', body: 'A timeline of each equipment issue from detection through corrective action to re-inspection approval, with the action history, response times and open items.' }
      ],
      qr: { title: 'Verify with a QR code', body: 'Scan the QR code on the report to check it against the original and view the measurement photos and approval history.' },
      esg: { title: 'ESG carbon savings', body: 'The paper the report replaces is converted into CO₂e and shown on the report.' },
      note: 'The actual report as issued. Click a page to see it full size. Sample data.'
    },
    data: {
      kicker: '08 / From report to data',
      q: 'What happens to all that inspection data?',
      title: 'Every approved report becomes data the factory can learn from.',
      steps: [
        { title: 'One report per inspection', body: 'Values, tolerances, photos and approval in one record.' },
        { title: 'Reports pile up as data', body: 'By part, machine and inspection slot, day after day.' },
        { title: 'A learning asset', body: 'The groundwork for defect prediction and process optimization.', plan: true }
      ]
    },
    /** field proof (request doc p.14): what can be said now; photos and figures follow from planning */
    proof: {
      kicker: '09 / Field proof',
      q: 'Is it in use on a real shop floor?',
      title: 'It runs in our own factory first.',
      lead: 'Since June 2026, self and patrol inspections at DVISION\'s Daegu headquarters plant have run on QAC FLOW.',
      since: { figure: '2026.06', label: 'In use in our own plant', body: 'Daegu headquarters plant · first-off, in-process and last-off self and patrol inspections' },
      certsLabel: 'DVISION certifications',
      certs: [
        { name: 'IATF 16949', body: 'Automotive quality management' },
        { name: 'ISO 14001', body: 'Environmental management' },
        { name: 'ISO 45001', body: 'Occupational health and safety' }
      ]
    },
    /** getting started (request doc p.14): the kit, the four-week trial, six questions */
    adopt: {
      kicker: '10 / Getting started',
      q: 'What do you need to get started?',
      title: 'A smartphone, one server PC and a monitor.',
      kit: [
        { title: 'Smartphone', body: 'Photograph the gauge and enter values' },
        { title: 'One server PC', body: 'Stores records and original photos' },
        { title: 'Monitor', body: 'Shop-floor status board' }
      ],
      kitNote: 'No dedicated measuring equipment or sensor installation required.',
      trial: {
        label: '4-week trial',
        title: 'Try it on your own floor for four weeks.',
        body: 'Run QAC FLOW on real inspections for four weeks before you decide. We agree on the parts and the plan together.',
        cta: 'Ask about a trial'
      },
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          q: 'Which gauges does it work with?',
          a: 'It reads digital gauges that show the value as numbers on a display, such as digital calipers, by photographing them with OCR. We will check whether the gauges you use are supported.'
        },
        {
          q: 'How accurate is the OCR?',
          a: 'We will publish a recognition rate once the test conditions and sample are finalized. Operators review every recognized value before saving and can correct it if needed.'
        },
        {
          q: 'What happens when a part fails?',
          a: 'A reason must be entered when an inspection is rejected, and no report is issued. The report is issued once the part is re-inspected and approved.'
        },
        {
          q: 'How is it different from other SPC tools?',
          a: 'Values and photos are recorded the moment they are measured, so control charts and capability come from those records with no re-entry. Every value keeps its original photo, so the evidence is always at hand.'
        },
        { q: 'Does it integrate with ERP or MES?', a: 'The scope and method depend on the systems you run, so we review them with you when planning the rollout.' },
        {
          q: 'How is it deployed and priced?',
          a: 'It depends on the size of your operation and the scope. Request a demo or get in touch, and we will put together an option that fits.'
        }
      ]
    }
  },

  future: {
    label: 'Into the data industry',
    bridge: 'The inspection data piling up\nis where the data business begins',
    eyebrow: 'Data Industry',
    title: 'Every inspection\nbecomes a <k>data asset</k>',
    lead: 'Expanding into the data and AI market. QAC FLOW gathers the data; Data Industry builds a business on it.',
    storyLabel: 'From where data comes in to where it goes out',
    story: [
      { tag: 'Input', title: 'QAC FLOW', body: 'Where data comes in. One photo captures the inspection data' },
      { tag: 'Asset', title: 'Verified data', body: 'Measurements + photo evidence + verdicts + action history' },
      { tag: 'Output', title: 'Data Industry', body: 'Where data goes out. SaaS · data business · credits' }
    ],
    why: {
      kicker: '02 / Why us',
      title: 'We don’t buy data. We make it.',
      from: 'The data is gathered by QAC FLOW',
      items: [
        { title: 'Measurements', sub: 'DIM · nominal · tolerance' },
        { title: 'Measurement photos', sub: 'Operator and patrol evidence' },
        { title: 'Context', sub: 'Machine · part · operator · time' },
        { title: 'Verdicts', sub: 'OK/NG · defect type' },
        { title: 'Action history', sub: 'Closed early · incomplete · rejected' },
        { title: 'Approval history', sub: 'Approver · time issued' }
      ],
      note: 'Data verified by photos = <k>training data you can trust</k>'
    },
    chain: {
      kicker: '03 / Value Chain',
      title: 'Five steps from capturing data to a business',
      steps: [
        { title: 'Data capture', sub: 'Collected live on the floor' },
        { title: 'Internal PoC', sub: 'Proven in-house' },
        { title: 'External PoC', sub: 'Proven with customers' },
        { title: 'SaaS', sub: 'Offered as a service' },
        { title: 'Data Business', sub: 'A data business' }
      ]
    },
    roadmap: {
      kicker: '04 / Roadmap',
      title: 'Expanding step by step, proven at each stage — now at stage one',
      here: 'Now',
      stages: [
        { year: '2026', title: 'Internal PoC', items: ['In-house validation', 'Data model tests', 'Operational tuning'] },
        { year: '2027', title: 'External PoC', items: ['Validate with customers', 'Build the system', 'Field trials'] },
        { year: '2028', title: 'SaaS product', items: ['Service launch', 'Grow the customer base', 'First revenue'] },
        { year: '2029', title: 'Data / Credit', items: ['Data business', 'Credit system', 'Global expansion'] }
      ],
      proof: '<k>QAC FLOW running in our own plant (since 2026.06)</k> — the roadmap is under way, not just a plan'
    },
    asset: {
      kicker: '05 / Data Asset',
      title: 'What the data, once gathered, is worth',
      items: [
        { title: 'Defect prediction', body: 'Measurements and verdicts over time flag a defect before it happens.', plan: true },
        { title: 'Process parameter tuning', body: 'Measurements read with their machine and part context point to better process settings.', plan: true },
        { title: 'Data credit system', body: 'Verified quality data becomes an asset that can be traded and put to use.' },
        { title: 'Closing the quality-data gap', body: 'Floors that struggle to build up data get verified data to work with.' }
      ]
    },
    partner: {
      kicker: '06 / Partnership',
      title: 'Partners to build the data with us',
      tags: ['Join the External PoC', 'Partnership'],
      closing: 'Recorded the moment it’s captured;\nas records build up, <k>they become an industry.</k>'
    }
  },

  contact: {
    kicker: 'Demo / Contact',
    title: 'Request a demo',
    lead: 'We will show you how it fits your floor.',
    close: 'Close',
    booth: (n: string) => `CES 2027 ·\nEureka Park ·\nBooth ${n}`,
    show: 'Jan 6–9, 2027 ·\nLas Vegas, Venetian Expo Hall G',
    fields: { name: 'Name', email: 'Work email', company: 'Company' },
    placeholders: { name: 'Jane Doe', email: 'name@company.com', company: 'Company Inc.' },
    notice: 'We use your name, work email and company to answer your request and follow up, and delete them one year after your inquiry is closed. On the way to our mailbox (Google Workspace) they pass through Vercel and Resend in the U.S.',
    policy: 'Privacy Policy',
    submit: 'Request a demo',
    submitCes: 'Request a CES demo',
    sending: 'Sending…',
    again: 'New request',
    retry: 'Try again',
    sent: 'Thank you. We will get back to you at your work email.',
    failed: 'Your request could not be sent. Please try again in a moment, or email us at the address below.',
    invalid: {
      name: 'Please enter your name.',
      email: 'Please check your work email address.',
      company: 'Please enter your company name.'
    },
    mailSubject: 'QAC FLOW demo request'
  },

  footer: {
    company: 'DVISION Co., Ltd.',
    address: '237, Gukgasandan-daero 33-gil, Guji-myeon, Dalseong-gun, Daegu, Republic of Korea',
    email: 'Contact',
    sites: 'DVISION sites',
    links: { gateway: 'DVISION start page', manufacturing: 'Manufacturing', solution: 'QAC FLOW solutions' },
    privacy: 'Privacy Policy',
    copyright: '© 2026 DVISION Co., Ltd. All rights reserved.'
  },

  privacy: privacyEn
};
