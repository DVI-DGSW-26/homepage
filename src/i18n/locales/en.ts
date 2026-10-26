// English copy. Typed as Messages, so a key missing here (or one ko.ts doesn't have) fails the build.
import type { Messages } from './ko';

/** a span of minutes as hours and minutes: 186 → "3h 6m" */
const dur = (m: number) => `${m >= 60 ? `${Math.floor(m / 60)}h ` : ''}${m % 60}m`;

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
    links: { '/qac-flow': 'Q.A.C-Flow', '/data': 'Data Industry' },
    langs: { ko: 'KOR', en: 'ENG' },
    theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
    open: 'Open menu',
    close: 'Close menu'
  },

  qf: {
    launch: 'Q.A.C-Flow launch date',
    label: 'Q.A.C-Flow quality inspection solution',
    expand: 'Quality · Analysis · Control',
    title: 'Quality inspection without paper check sheets.',
    lead: 'Measure, judge and issue the report, all from one smartphone.\nBuilt and proven in DVISION\'s own factory.',
    stats: ['OCR recognition rate', 'New hardware', 'In use at our Daegu HQ plant'],
    statsNote: 'In-house validation at our Daegu HQ plant · IATF 16949',
    alt: {
      capture: 'Smartphone camera framing the display of a digital caliper reading 30.00 mm',
      ocr: 'App screen: the caliper reading is filled in by OCR and judged as a pass against the tolerance',
      crop: 'App screen: dragging the corner handles of a box to crop the photo down to the caliper reading',
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
        { title: 'A learning asset', body: 'The groundwork for defect prediction and process optimization.' }
      ]
    }
  },

  future: {
    label: 'Into the data industry',
    bridge: 'The inspection data piling up\nis where the data business begins',
    eyebrow: 'Data Industry',
    title: 'Every inspection\nbecomes a <k>data asset</k>',
    lead: 'Expanding into the data and AI market. Q.A.C-Flow gathers the data; Data Industry builds a business on it.',
    storyLabel: 'From where data comes in to where it goes out',
    story: [
      { tag: 'Input', title: 'Q.A.C-Flow', body: 'Where data comes in. One photo captures the inspection data' },
      { tag: 'Asset', title: 'Verified data', body: 'Measurements + photo evidence + verdicts + action history' },
      { tag: 'Output', title: 'Data Industry', body: 'Where data goes out. SaaS · data business · credits' }
    ],
    why: {
      kicker: '02 / Why us',
      title: 'We don’t buy data. We make it.',
      from: 'The data is gathered by Q.A.C-Flow',
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
      proof: '<k>Q.A.C-Flow in live use on the floor (since 2026.06.01)</k> — the roadmap is under way, not just a plan'
    },
    asset: {
      kicker: '05 / Data Asset',
      title: 'What the data, once gathered, is worth',
      items: [
        { title: 'Defect prediction', body: 'Measurements and verdicts over time flag a defect before it happens.' },
        { title: 'Process parameter tuning', body: 'Measurements read with their machine and part context point to better process settings.' },
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

  monitor: {
    app: 'Inspection Status', titles: { board: 'Dashboard', detail: 'Inspection Details', defects: 'Quality · Defects' }, date: 'Oct 2 (Fri)',
    fixed: 'Fixed', cycling: 'Cycling', otherLang: 'KO', live: 'Real-time', updated: 'Last updated', prev: 'Previous', next: 'Next',
    self: 'Self', patrol: 'Patrol', line: (n: number) => `Line ${n}`,
    kpi: ['Completed', 'In Progress', 'Skipped', 'Remaining Slots', 'Delayed'], over: ['slots', 'over time'],
    queue: 'Patrol Queue', queueSub: ['Drafting', 'Awaiting', 'Rejected'],
    progress: 'Progress by Time Slot', legendSelf: ['Completed', 'In Progress', 'Skipped', 'Incomplete', 'Incomplete Approved', 'Not Started', 'Late'], legendPatrol: ['Completed', 'Drafting', 'Queue', 'Rejected'],
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
