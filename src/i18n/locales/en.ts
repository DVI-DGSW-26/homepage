// English copy. Typed as Messages, so a key missing here (or one ko.ts doesn't have) fails the build.
import type { Messages } from './ko';
import { privacyEn } from './privacy.en';


export const en: Messages = {
  /** the wordmark's alt text */
  brand: 'DVISION',

  meta: {
    '/qac-flow': {
      title: 'QAC FLOW – Paperless quality inspection, through to reports and SPC',
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
    items: { about: 'About', features: 'Features', preview: 'Preview' },
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
    lead: 'A quality inspection web app: photograph a gauge with a smartphone, and the record carries through to approval, reports and process analysis.',
    /** the first screen's monitor coming alive as the phone finishes (LiveMonitor): the cell that turns done, the toast */
    heroMonitor: { cells: ['In-process', 'Last-off'] },
    /** the two facts under the first screen's buttons: what it takes, and where it runs */
    facts: ['Start with a smartphone, one server PC and a monitor. No dedicated measuring equipment or sensor installation.', 'In use at DVISION\'s Daegu headquarters plant since June 2026.'],
    stats: ['No dedicated gauges or sensor installation', 'Started running in our own plant'],
    kit: 'A smartphone, one server PC and a monitor',
    statsNote: 'In-house validation at our Daegu HQ plant · IATF 16949',
    cta: { demo: 'Contact sales', apply: 'Contact sales', how: 'See how it works', features: 'Explore features' },
    /** 서비스 소개: the old way and QAC FLOW side by side, one row per part of an inspection record (About.tsx) */
    about: {
      title: 'About',
      lead: 'One place for inspection records once split between paper and spreadsheets.',
      before: 'Until now',
      after: 'QAC FLOW',
      rows: [
        { label: 'Readings', before: 'Written by hand on a paper sheet', after: 'Photograph the gauge and the value is entered' },
        { label: 'Photos', before: 'Taken separately, kept in a folder', after: 'Saved beside the reading' },
        { label: 'Reports', before: 'Retyped into Excel', after: 'Issued the moment it is approved' }
      ],
      note: 'A quality inspection web app we built and use in our own factory, running from self and patrol inspections to approval, reports and SPC analysis.'
    },
    /** 주요 기능: five cards, each with a real screen (Features.tsx) */
    features: {
      title: 'Features',
      lead: 'From measuring on the floor to approval, reports and analysis, QAC FLOW handles it all.',
      more: 'Learn more',
      close: 'Close',
      rowsHead: ['Item', 'Details'],
      beforeHead: 'Before',
      focus: ['Filled in by OCR', 'Self vs patrol photos'],
      items: [
        { name: 'OCR input', gain: 'A record without writing anything down',
          body: 'Photograph a gauge display with your phone: the value is entered and judged pass or fail on the spot.',
          before: 'Values were read by eye, written on paper and typed into a PC again, and mistakes and gaps crept in along the way.',
          intro: 'Photograph the display of a digital (LCD) gauge and select the reading; the number goes straight into the check sheet. The photo stays with the value, through approval and into the report.',
          rows: [
            { label: 'Shoot, select, filled in', body: 'Three steps: fit the display into the guide box, select the reading, and the value is in.' },
            { label: 'Judged at once', body: 'The value is checked against its tolerance and marked pass or fail right there.' },
            { label: 'Photo evidence', body: 'The photo is saved with the value, compared at approval and included in the report as evidence.' },
            { label: 'Fix it on the spot', body: 'If a value is misread, correct it before saving.' },
            { label: 'Supported gauges', body: 'Gauges with a digital (LCD) display.' }
          ] },
        { name: 'Photo-checked approval', gain: 'Not just numbers: proof they were measured',
          body: 'The operator\'s self inspection and the quality inspector\'s patrol inspection, compared side by side with their photos, then approved.',
          before: 'There was no way to tell whether a recorded number had really been measured.',
          intro: 'For each item, the self and patrol values and both photos sit on one screen. If a photo and its value disagree, it is caught at approval.',
          rows: [
            { label: 'Self and patrol inspection', body: 'Self inspection is done by the operator; patrol inspection is the quality inspector\'s check.' },
            { label: 'One screen', body: 'Both values and both photos for the same dimension, side by side.' },
            { label: 'Approve', body: 'Approval issues the inspection report right away.' },
            { label: 'Reject', body: 'A rejection goes back to the operator with its reason, to be measured again.' }
          ] },
        { name: 'Inspection reports', gain: 'Certificates sent without stamps or scans',
          body: 'Once approved, the inspection report PDF is created automatically.',
          before: 'Certificates were written by hand, stamped, scanned and then sent.',
          intro: 'A three-page report carrying its e-approval stamps is issued without paper. Whoever receives it can scan the QR code to confirm it is the original.',
          rows: [
            { label: 'E-approval stamps', body: 'Prepared, reviewed and approved stamps are printed on it, so nothing needs stamping by hand.' },
            { label: 'QR verification', body: 'A customer or overseas buyer scans the QR code to check it against the original.' },
            { label: 'Page 1 Daily quality summary', body: 'Pass rate, headline Cpk (process capability index), control charts and sign-offs' },
            { label: 'Page 2 Detailed capability', body: 'Capability per dimension, with the OCR evidence photos' },
            { label: 'Page 3 Equipment action log', body: 'Each equipment issue traced from detection through action to re-inspection approval' }
          ] },
        { name: 'Shop-floor monitor', gain: 'See the floor without walking it',
          body: 'Inspection status, live on the TV on the factory wall.',
          before: 'Knowing what was happening on the floor meant walking around or asking.',
          intro: 'A value measured on a phone shows on the monitor at once. Four screens take turns, or stay on the one you pin.',
          rows: [
            { label: 'Status board', body: 'First-off, in-process and last-off inspections (the first, middle and last parts of a run) by machine' },
            { label: 'Measurement detail', body: 'Values against their tolerance range, pass or fail per item' },
            { label: 'Quality and defects', body: 'Defective items and the actions taken' },
            { label: 'SPC', body: 'Control charts and capability at a glance' },
            { label: 'Rotate or pin', body: 'The screens take turns, or stay on the one you need.' }
          ] },
        { name: 'SPC analysis', gain: 'Warned before a defect, not after',
          body: 'See whether the process is stable from the values already collected, with a warning before defects appear.',
          before: 'Data had to be gathered into Excel and analysed separately, so problems came to light late.',
          intro: 'Control charts and capability are calculated as values come in. By extending each machine\'s trend, it warns before a control limit is reached.',
          rows: [
            { label: 'Calculated automatically', body: 'X-bar control charts and capability (Cpk, Ppk), the moment a value is measured.' },
            { label: 'Near-limit warning', body: 'Flagged before a control limit is crossed.' },
            { label: 'Defect forecast by machine', body: 'Extending the measured trend, each machine shows a line like "CNC-02: control limit in about 2 days".' },
            { label: 'Equipment issues and actions', body: 'When something goes wrong, follow it through the issue report and its action history.' },
            { label: 'Ask AI', body: 'Ask questions about the analysis data. Needs an internet connection.' }
          ] }
      ]
    },
    preview: {
      title: 'Preview',
      lead: 'Follow one inspection from the floor to its report and analysis.',
      steps: [
        { who: 'Operator', title: 'Photograph to measure', body: 'Photograph the gauge display; OCR reads the value, enters it and judges pass or fail.' },
        { who: 'Floor monitor', title: 'On the board at once', body: 'The moment it is saved, the floor monitor shows the progress by machine.' },
        { who: 'Approver', title: 'Check the photos, approve', body: 'Self and patrol readings side by side with their photos, approved right from the phone.' },
        { who: 'Automatic', title: 'Report issued', body: 'Approval issues the inspection report, verifiable against the original by QR code.' },
        { who: 'Quality manager', title: 'SPC analysis', body: 'The readings build up into control charts and capability analysis.' }
      ],
      step: (i: number, n: number) => `Step ${i} of ${n}`,
      note: 'Actual QAC FLOW screens. Sample data.'
    },
    ces: {
      label: 'CES 2027',
      when: 'Jan 6–9, Las Vegas',
      where: (booth: string) => `Eureka Park Booth ${booth}`,
      hall: 'Venetian Expo Hall G',
      try: 'Measure and shoot it yourself at our booth',
      after: 'Missed us at CES 2027? Get the booth demo online',
      /** the bar's link to the CES landing page (CES_LANDING_URL), where booth inquiries go */
      more: 'Booth info & inquiries on our CES page',
      /** the × that closes the bar */
      close: 'Close notice'
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
      kicker: 'Results',
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
      kicker: 'Smartphone OCR measurement',
      q: 'How do you take a measurement?',
      title: 'Photograph the gauge display, select the reading, and OCR enters the number into the check sheet.',
      lead: 'No new equipment.\nYour existing calipers and gauges plus a smartphone camera.\nWorks on mobile and PC web.',
      steps: [
        { title: 'Snap', body: 'Point the phone at the gauge display and take the shot.' },
        { title: 'Crop', body: 'Drag the frame around the reading only.' },
        { title: 'OCR input', body: 'The value fills itself in and is judged against the tolerance on the spot.' }
      ]
    },
    workflow: {
      kicker: 'Inspection flow',
      q: 'How does an inspection flow?',
      title: 'From the inspection order through self and patrol inspections, approval and the report, everything stays in one record.',
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
      kicker: 'Shop-floor monitor',
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
      kicker: 'Photo evidence and traceability',
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
      kicker: 'SPC analysis',
      q: 'What can you see in the records that pile up?',
      title: 'View control charts and process capability from approved inspection records, and manage equipment issues and actions alongside them.',
      lead: 'Approved inspection records become SPC data as they are.\nPick a product, characteristic, machine and period to view control charts and process capability.',
      /** the four views, each with one screen (Spc.tsx) */
      views: [
        { title: 'Key indicators · control charts', body: 'Follow the process with six key indicators and the Xbar-R charts. Anything near a control limit is flagged right away.' },
        { title: 'Process capability', body: 'Lay the distribution over the spec limits and check Cp, Cpk, Pp and Ppk.' },
        { title: 'Equipment issues', body: 'See issue reports by machine and status, with downtime and cost recorded alongside.' },
        { title: 'Action history', body: 'Each issue keeps its handling in order, from report through action to close.' }
      ],
      /** the labels set on each screen, in the order of its marks (Spc.tsx) */
      marks: [
        ['Near-limit warning', 'Six key indicators · Cpk · Ppk · mean · std. dev. · samples · out of control', 'Xbar chart (subgroup means)', 'R chart (subgroup ranges)'],
        ['Distribution', 'Spec limits', 'Capability indices'],
        ['Filter by status', 'Downtime & cost', 'Action status'],
        ['Report → action → close', 'What was done', 'Total downtime & cost']
      ],
      alts: [
        'SPC analysis screen: product, dimension, machine and period filters, an approaching-control-limit warning, Cpk, Ppk, mean, sigma, sample count and out-of-control indicators, and the X̄ and R charts',
        'SPC process capability: a histogram of all measurements against the lower and upper spec limits, with Cp, Cpk, Pp and Ppk',
        'Equipment issue list: issues on CNC-01 and CNC-02 with the time and reporter, downtime and cost, and an in-progress or resolved status',
        'Equipment issue detail: a CNC-01 report of the overall length drifting toward the upper limit, from report through end mill replacement and offset correction to resolution after re-measurement, with total downtime, action cost and the machine\'s other reports'
      ],
      note: 'The actual SPC analysis and equipment issue screens in QAC FLOW. Click a screen to see it full size. Sample data.'
    },
    /** the inspection report: the three pages one approval issues, and what its QR code and ESG line are for */
    report: {
      kicker: 'Inspection report',
      q: 'What does each inspection leave behind?',
      title: 'One approval issues a three-page report, each page written for its reader.',
      lead: 'Management and buyers read the results on page 1, quality engineers the evidence on page 2, and auditors and maintenance teams the action history on page 3.',
      pageLabel: (n: number) => `Page ${n}`,
      pages: [
        { title: 'Daily Quality Summary', reader: 'Management · Buyers', body: 'Pass rate, headline Cpk, inspection count and control charts on one page, with the prepared, reviewed and approved sign-offs.' },
        { title: 'Detailed Inspection & SPC Analysis', reader: 'Quality engineers', body: 'Capability per dimension, with the self and patrol inspection photos compared for each round.' },
        { title: 'Equipment Action & Traceability Log', reader: 'Auditors · Maintenance', body: 'Each equipment issue from detection through action to re-inspection approval, and the action history.' }
      ],
      qr: { title: 'Verify with a QR code', body: 'Scan the QR code on the report to check it against the original and view the measurement photos and approval history.' },
      esg: { title: 'ESG carbon savings', body: 'The paper the report replaces is converted into CO₂e and shown on the report.' },
      /** the spec table under the pages (Report.tsx): these rows, then the QR and ESG ones */
      specsTitle: 'Report details',
      specHead: ['Item', 'Details'],
      specs: [{ label: 'Issued', body: 'Automatically, once approval is complete.' }, { label: 'Format', body: 'Downloadable as a PDF.' }],
      note: 'The actual report as issued. Click a page to see it full size. Sample data.'
    },
    data: {
      kicker: 'Using the data',
      q: 'What happens to all that inspection data?',
      title: 'Approved reports build up as data by part, machine and inspection round.',
      steps: [
        { title: 'One report per inspection', body: 'Values, tolerances, photos and approval in one record.' },
        { title: 'Reports pile up as data', body: 'By part, machine and inspection slot, day after day.' },
        { title: 'A learning asset', body: 'The groundwork for defect prediction and process optimization.', plan: true }
      ]
    },
    /** field proof (request doc p.14): what can be said now; photos and figures follow from planning */
    proof: {
      kicker: 'In operation',
      q: 'Is it in use on a real shop floor?',
      title: 'In use at DVISION\'s Daegu headquarters plant since June 2026.',
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
      kicker: 'Getting started',
      q: 'What do you need to get started?',
      title: 'A smartphone, one server PC and a monitor.',
      kit: [
        { title: 'Smartphone', body: 'Photograph the gauge and enter values' },
        { title: 'One server PC', body: 'Stores records and original photos' },
        { title: 'Monitor', body: 'Shop-floor status board' }
      ],
      kitNote: 'No dedicated measuring equipment or sensor installation required.',
      trial: {
        label: 'Get in touch',
        title: 'Wondering whether it fits your floor? We would be glad to hear from you.',
        body: 'Tell us about the parts you inspect, the gauges you use and how you inspect today, and we will suggest how QAC FLOW could work for you. A four-week trial on real inspections can be part of that conversation.',
        cta: 'Contact us'
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
    /** the inquiry form's own title and line (the dialog) */
    title: 'Contact sales',
    lead: 'Tell us what you inspect and how you inspect it today, and we will suggest how QAC FLOW could fit your floor.',
    /** the closing block at the end of the page: a last line, and the button that opens the form */
    closing: { title: 'Quality inspection without paper,\nstarting on your floor.', cta: 'Contact sales' },
    close: 'Close',
    fields: {
      company: 'Company',
      name: 'Your name',
      email: 'Work email',
      phone: 'Phone',
      type: 'Inquiry type',
      scale: 'Machines to inspect',
      timing: 'Planned timing',
      message: 'Message'
    },
    placeholders: {
      company: 'Company Inc.',
      name: 'Jane Doe',
      email: 'name@company.com',
      phone: '+1 000 000 0000',
      message: 'The parts you inspect, the gauges you use, anything you would like to know.'
    },
    options: {
      type: ['Adoption', 'Demo', 'Quote', 'Trial'],
      scale: ['1–5', '6–20', '21–50', 'More than 50'],
      timing: ['Within 3 months', 'Within 6 months', 'Within a year', 'Not decided']
    },
    optional: 'optional',
    choose: 'Choose one',
    custom: 'Other (type it in)',
    customPlaceholder: 'Type your answer',
    notice: 'We use your company, name, work email, phone and the optional details to answer your inquiry and follow up, and delete them one year after it is closed. On the way, they pass through Vercel and Resend in the United States to our company mail (Google Workspace).',
    policy: 'Privacy Policy',
    submit: 'Send inquiry',
    sending: 'Sending…',
    again: 'New inquiry',
    retry: 'Try again',
    sent: 'Thank you. We will get back to you by email or phone.',
    failed: 'Your inquiry could not be sent. Please try again in a moment, or email us at the address below.',
    invalid: {
      company: 'Please enter your company name.',
      name: 'Please enter your name.',
      email: 'Please check your work email address.',
      phone: 'Please enter a phone number.'
    },
    mailSubject: 'QAC FLOW inquiry'
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
