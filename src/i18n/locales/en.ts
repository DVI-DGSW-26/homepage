// English copy. Typed as Messages, so a key missing here (or one ko.ts doesn't have) fails the build.
import type { Messages } from './ko.ts';
import { privacyEn } from './privacy.en.ts';

/** a span of minutes as hours and minutes: 186 → "3h 6m" */
const dur = (m: number) => `${m >= 60 ? `${Math.floor(m / 60)}h ` : ''}${m % 60}m`;

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
    statsNote: 'In-house validation at our Daegu HQ plant · IATF 16949',
    cta: { demo: 'Request a demo', apply: 'Ask about your floor' },
    ces: {
      label: 'CES 2027',
      when: 'Jan 6–9, 2027 · Las Vegas',
      where: (booth: string) => `Venetian Expo Hall G · Eureka Park · Booth ${booth}`,
      try: 'Measure and shoot it yourself at the booth',
      after: 'Missed us at CES 2027? Get the booth demo online'
    },
    alt: {
      capture: 'Smartphone camera framing the display of a digital caliper reading 30.00 mm',
      ocr: 'App screen: the caliper reading is filled in by OCR and judged as a pass against the tolerance',
      crop: 'App screen: dragging the corner handles of a box to crop the photo down to the caliper reading',
      compare: 'Mobile patrol inspection screen comparing self-inspection and patrol inspection values per dimension, with a mismatch marked as fail',
      photos: 'Side-by-side photos of the same caliper reading taken at self-inspection and at patrol inspection',
      approval: 'PC web approval screen: self-inspection and patrol inspection results compared, with an Approve and issue report button',
      report: 'Fully approved inspection report: basic information such as process and machine, the prepared, reviewed and approved signatures, and self and patrol inspection results for each round'
    },
    problem: {
      kicker: '01 / Problem',
      q: 'Why does the shop floor need QAC FLOW?',
      title: 'Writing a number twice is where data loses trust.',
      before: 'Before',
      after: 'With QAC FLOW',
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
      note: 'A working copy of the floor screens: click the tabs, a line or a defect type. Sample data.'
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
        { title: 'A learning asset', body: 'The groundwork for defect prediction and process optimization.', plan: true }
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

  privacy: privacyEn,

  monitor: {
    app: 'Inspection Status', titles: { board: 'Dashboard', detail: 'Inspection Details', defects: 'Quality · Defects' }, date: 'Oct 2 (Fri)',
    fixed: 'Fixed', cycling: 'Cycling', otherLang: 'KO', live: 'Real-time', updated: 'Last updated', prev: 'Previous', next: 'Next',
    self: 'Self', patrol: 'Patrol', line: (n: number) => `Line ${n}`,
    kpi: ['Completed', 'In Progress', 'Skipped', 'Remaining Slots', 'Delayed'], over: ['slots', 'over time'],
    queue: 'Patrol Queue', queueSub: ['Drafting', 'Awaiting', 'Rejected'],
    progress: 'Progress by Time Slot', boardCols: ['Line', 'Status', 'Progress'], legendSelf: ['Completed', 'In Progress', 'Skipped', 'Incomplete', 'Incomplete Approved', 'Not Started', 'Late'], legendPatrol: ['Completed', 'Drafting', 'Queue', 'Rejected'],
    due: (t: string, m: number) => `${t} deadline ${dur(m)}`, late: (m: number) => `Delayed ${dur(m)}`,
    dueToday: '1 line due today', dueName: 'Bae Jun-ho', dueLine: 'Line 10',
    inProgress: 'In-Progress Inspections', stages: ['Initial', 'Mid', 'Final'], ago: (m: number) => m >= 60 ? `${Math.floor(m / 60)} hour${m >= 120 ? 's' : ''} ago` : `${m} min ago`,
    running: 'In Progress', refreshed: (m: number) => `Updated ${m} min ago`, visual: 'Visual', defectItems: 'Defect Items', measured: 'Measurement Progress',
    items: 'Measurement Items', cols: ['No', 'Item', 'Spec / Tolerance', 'Measured Value', 'Tolerance Range', 'Result'], judgeSpec: 'OK/NG judgement item', judgeHint: 'Operator selects OK/NG', pending: 'Pending', auto: 'Auto',
    today: "Today's Inspections", done: 'Completed', cases: 'Defect Cases', stopped: 'Early Stop', unit: 'cases', risk: (r: string) => `Defect Rate ${r}% · At Risk`, stopSub: 'Stopped for quality issues',
    defectList: 'Defect Items', includes: 'Includes in-progress inspections before approval', kinds: { spec: 'Out of Spec', visual: 'Visual NG', judge: 'OK/NG' },
    valueLabel: 'Measured', specLabel: 'Spec', visualNg: 'NG in visual inspection', judgeNg: 'NG in OK/NG item',
    types: 'Defect Types', actions: 'Action Status', actionKinds: { stop: 'Early Stop', open: 'Incomplete' }, states: { report: 'Report issued · Reinspection started', wait: 'Awaiting approval', ok: 'Approved' }, hoursAgo: (h: number) => `${h} hour${h > 1 ? 's' : ''} ago`
  }
};
