// English copy. Typed as Messages, so a key missing here (or one ko.ts doesn't have) fails the build.
//
// House style (natural business English for a corporate site, US spelling):
// 자주검사 = self-inspection, 순회검사 = patrol inspection, 초·중·종(품) = first-off · in-process · last-off,
// 측정기 = gauge, 결재 = approval, 검사보고서 = inspection report, 현장 모니터 = shop-floor monitor,
// 공정능력 = process capability, 도입 문의 = Contact sales.
import type { Messages } from './ko';
import { privacyEn } from './privacy.en';


export const en: Messages = {
  /** the wordmark's alt text */
  brand: 'DVISION',

  meta: {
    '/qac-flow': {
      title: 'QAC FLOW – Paperless quality inspection, from reports to SPC | DVISION',
      description: 'Photograph a gauge with your smartphone: OCR enters the value and makes the pass/fail call. Photo-verified approval, automatic inspection reports, a live shop-floor monitor and SPC analysis in one web app.'
    },
    '/data': {
      title: 'QAC FLOW Data Industry – Every inspection becomes a data asset | DVISION',
      description: 'We are building a data business on the photo-verified inspection data QAC FLOW collects on the shop floor. See our 2026–2029 roadmap and partnership opportunities.'
    },
    '/privacy': {
      title: 'Privacy Policy | DVISION',
      description: 'Privacy policy of the DVISION solutions website (solution.dvi-ind.com).'
    },
    image: 'QAC FLOW home screen: paperless quality inspection, with the app photographing a gauge on a smartphone'
  },

  nav: {
    home: 'QAC FLOW home',
    menu: 'Main menu',
    links: { '/qac-flow': 'QAC FLOW', '/data': 'Data Industry' },
    /** the header menu (request doc p.10): sections of QAC FLOW, the data page, and CES until the end of January */
    items: { about: 'About', features: 'Features', preview: 'Preview' },
    sites: { label: 'DVISION sites', gateway: 'DVISION home', manufacturing: 'Manufacturing', solution: 'Solutions' },
    langs: { ko: 'KOR', en: 'ENG' },
    theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
    open: 'Open menu',
    close: 'Close menu'
  },

  planned: 'Planned',

  media: {
    zoom: 'View full size',
    prev: 'Previous screen',
    next: 'Next screen',
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
    title: 'Quality inspection without paper check sheets',
    lead: 'Photograph a gauge with your smartphone, and the inspection record flows straight through to approval, reporting and process analysis, all in one web app.',
    /** the first screen's monitor coming alive as the phone finishes (LiveMonitor): the cell that turns done, the toast */
    heroMonitor: { cells: ['In-process', 'Last-off'] },
    /** the two facts under the first screen's buttons: what it takes, and where it runs */
    facts: ['All you need is a smartphone, one server PC and a monitor. No dedicated measuring equipment or sensor installation required.', 'In use at DVISION’s Daegu headquarters plant since June 2026.'],
    stats: ['No dedicated measuring equipment or sensor installation', 'In operation at our own plant'],
    kit: 'A smartphone, one server PC and a monitor are all you need',
    statsNote: 'Validated in-house at our Daegu HQ plant · IATF 16949',
    cta: { demo: 'Contact sales', apply: 'Contact sales', how: 'See how it works', features: 'Explore features' },
    /** 서비스 소개: the old way and QAC FLOW side by side, one row per part of an inspection record (About.tsx) */
    about: {
      title: 'About',
      lead: 'QAC FLOW brings together quality inspection records that used to be split between paper and Excel.',
      before: 'Before',
      after: 'QAC FLOW',
      rows: [
        { label: 'Readings', before: 'Written by hand on paper check sheets', after: 'Photograph the gauge and the value is entered' },
        { label: 'Photos', before: 'Taken separately and stored in folders', after: 'Saved alongside each reading' },
        { label: 'Reports', before: 'Retyped into Excel', after: 'Issued as soon as they are approved' }
      ],
      note: 'A quality inspection web app we built and use in our own plant. It covers self-inspections and patrol inspections through approval, reporting and SPC analysis.'
    },
    /** 주요 기능: five cards, each with a real screen (Features.tsx). Never "all gauges" (OCR reads digital LCD
     * displays), and "AI" only for Ask AI: the defect forecast extends the trend. */
    features: {
      title: 'Features',
      lead: 'From shop-floor measurement to approval, reporting and analysis, QAC FLOW handles it all.',
      more: 'Learn more',
      close: 'Close',
      prev: 'Previous screen',
      next: 'Next screen',
      rowsHead: ['Item', 'Details'],
      beforeHead: 'Before',
      focus: ['Auto-filled by OCR', 'Self vs. patrol inspection photos'],
      items: [
        { name: 'OCR auto-entry', gain: 'Nothing to write down, everything on record',
          body: 'Photograph the gauge display with your phone, and the value is entered automatically with an instant pass/fail result.',
          before: 'Readings were taken by eye, written on paper and then retyped into a PC, leaving room for errors and omissions.',
          intro: 'Photograph the display of a digital (LCD) gauge and select the reading, and the number goes straight into the check sheet. The photo stays with the value, all the way through approval and into the report.',
          rows: [
            { label: 'Snap → select → auto-fill', body: 'Three steps: line up the display with the guide box, take the photo, select the reading, and the value is entered.' },
            { label: 'Instant pass/fail', body: 'The value is checked against its tolerance and marked pass or fail on the spot.' },
            { label: 'Photo evidence', body: 'The photo is saved with the value, compared during approval and included in the report as evidence.' },
            { label: 'Correct on the spot', body: 'If a value is misread, you can correct it before saving.' },
            { label: 'Supported gauges', body: 'Designed for gauges with a digital (LCD) display.' }
          ] },
        { name: 'Photo-verified approval', gain: 'Confirm every value was actually measured, not just recorded',
          body: 'Approve after comparing the operator’s self-inspection with the quality inspector’s patrol inspection side by side, photos included.',
          before: 'There was no way to confirm that a recorded number had actually been measured.',
          intro: 'For each item, the self-inspection and patrol inspection values appear on one screen with the photos both people took. If a photo and its value do not match, it is caught at approval.',
          rows: [
            { label: 'Self-inspection and patrol inspection', body: 'A self-inspection is carried out by the operator; a patrol inspection is a follow-up check by the quality inspector.' },
            { label: 'Side-by-side comparison', body: 'See both values for the same dimension and the photos each person took, side by side.' },
            { label: 'Approve', body: 'Once a manager approves, the inspection report is issued immediately.' },
            { label: 'Reject', body: 'A rejected inspection goes back to the operator with the reason, to be measured again.' }
          ] },
        { name: 'Inspection reports', gain: 'Send certificates with no stamping or scanning',
          body: 'Once approval is complete, the inspection report is generated automatically as a PDF.',
          before: 'Certificates had to be written by hand, stamped, scanned and then sent.',
          intro: 'A three-page report bearing e-approval stamps is issued without any paper. Recipients can scan the QR code to confirm it is the original.',
          rows: [
            { label: 'E-approval stamps', body: 'The report comes with prepared, reviewed and approved stamps, so there is nothing to stamp by hand.' },
            { label: 'QR verification', body: 'Customers and overseas buyers can scan the QR code to check the report against the original.' },
            { label: 'Page 1: Daily quality summary', body: 'Pass rate, headline Cpk (process capability index), control charts and approval history' },
            { label: 'Page 2: Detailed process capability', body: 'Process capability by dimension, with the OCR evidence photos' },
            { label: 'Page 3: Equipment action log', body: 'A traceable record of each equipment issue, from detection through corrective action to re-inspection approval' }
          ] },
        { name: 'Shop-floor monitor', gain: 'See the whole floor without walking it',
          body: 'Inspection status, shown in real time on a TV on the factory wall.',
          before: 'Finding out what was happening on the floor meant walking around or asking.',
          intro: 'Measurements taken on a phone appear on the monitor instantly. Four screens rotate automatically, or you can pin the one you want.',
          rows: [
            { label: 'Status board', body: 'Progress of first-off, in-process and last-off inspections (the first, middle and last parts of a run) by machine' },
            { label: 'Measurement detail', body: 'Measured values against their tolerance range, with pass/fail for each item' },
            { label: 'Quality and defects', body: 'Defective items and the actions taken' },
            { label: 'SPC', body: 'A summary of control charts and process capability' },
            { label: 'Auto-rotate and pin', body: 'The screens rotate automatically, or you can pin the one you need.' }
          ] },
        { name: 'SPC analysis', gain: 'Get warned before defects occur',
          body: 'Check process stability from the measurements already collected, and get warned before defects occur.',
          before: 'Data had to be compiled in Excel and analyzed separately, so problems surfaced late.',
          intro: 'Control charts and process capability are calculated automatically as measurements come in. By extending the measurement trend, it alerts you machine by machine before a control limit is reached.',
          rows: [
            { label: 'Automatic calculation', body: 'X-bar control charts and process capability (Cpk, Ppk) are calculated the moment a value is measured.' },
            { label: 'Near-limit warning', body: 'Flags a value before it crosses a control limit.' },
            { label: 'Defect forecast by machine', body: 'Extends the measurement trend to show an alert for each machine, such as “CNC-02: control limit in about 2 days.”' },
            { label: 'Equipment issue tracking', body: 'When an issue occurs, follow it through the equipment issue report and its action history.' },
            { label: 'Ask AI', body: 'Ask questions about your analysis data. Requires an internet connection.' }
          ] }
      ]
    },
    preview: {
      title: 'Preview',
      lead: 'Follow a single inspection from the shop floor to its report and analysis.',
      steps: [
        { who: 'Operator', title: 'Snap to measure', body: 'Photograph the gauge display; OCR reads and enters the value, then makes the pass/fail call.' },
        { who: 'Shop-floor monitor', title: 'Updated on the board instantly', body: 'The moment the value is saved, the progress by machine on the shop-floor monitor updates.' },
        { who: 'Approver', title: 'Compare photos and approve', body: 'Review the self-inspection and patrol inspection values next to their photos, and approve right from your phone.' },
        { who: 'Automatic', title: 'Report issued', body: 'The inspection report is issued upon approval and can be verified against the original by QR code.' },
        { who: 'Quality manager', title: 'SPC analysis', body: 'Accumulated measurements feed directly into control charts and process capability analysis.' }
      ],
      step: (i: number, n: number) => `Step ${i} of ${n}`,
      note: 'Actual QAC FLOW screens. Sample data shown.'
    },
    ces: {
      label: 'CES 2027',
      when: 'Jan 6–9, Las Vegas',
      where: (booth: string) => `Eureka Park Booth ${booth}`,
      hall: 'Venetian Expo Hall G',
      try: 'Measure and snap it yourself at our booth',
      after: 'See our CES 2027 booth demo online',
      /** the bar's link to the CES landing page (CES_LANDING_URL), where booth inquiries go */
      more: 'Booth details and inquiries on our CES page',
      /** the × that closes the bar */
      close: 'Close notice'
    },
    alt: {
      capture: 'Smartphone camera framing the display of a digital caliper',
      ocr: 'App screen: the reading is filled in by OCR and judged a pass',
      crop: 'App screen: dragging the corner handles to crop the photo down to the reading',
      compare: 'Mobile patrol inspection approval screen: over the self-inspection and patrol inspection values per dimension, the self-inspection and patrol inspection photos of DIM 1 open side by side',
      approval: 'PC web patrol inspection approval screen: self-inspection and patrol inspection values compared per dimension, with Reject and Approve (issue report) buttons',
      reports: [
        'Inspection report page 1, Daily Quality Summary: prepared, reviewed and approved e-approval stamps, a QR code for verification, pass rate, headline Cpk, total inspections and issues, an X̄-R control chart and ESG carbon savings',
        'Inspection report page 2, Detailed Inspection & Process Capability Analysis: dimension locations on the drawing, Cp, Cpk and control status per item, OCR photos of first-off, in-process and last-off self-inspections and patrol inspections compared, and the measurement data for each round',
        'Inspection report page 3, Equipment Action & Quality Traceability Log: detection, corrective action and re-inspection approval timelines for two equipment issues, the equipment action history table, and action count, average response time and open items'
      ]
    },
    problem: {
      kicker: 'Results',
      q: 'Why does your shop floor need QAC FLOW?',
      title: 'Spend 60% less time writing on paper, taking photos and retyping into Excel.',
      lead: 'One photo of the gauge records the measurement, shares the photo and saves it to the server, all at once.\nThe report is issued the moment it is approved.',
      audience: 'Built for manufacturers that still manage self-inspections and patrol inspections with paper check sheets and Excel.',
      pains: [
        { title: 'Recorded on paper', body: 'Values are written on check sheets by hand, while photos are taken separately and shared over messaging apps.' },
        { title: 'Retyped into Excel', body: 'Back in the office, the paper records are typed into Excel all over again.' },
        { title: 'Records pile up, analysis happens elsewhere', body: 'Viewing past inspections as control charts or process capability means collecting and reorganizing the data all over again.' }
      ],
      before: 'Before',
      after: 'With QAC FLOW',
      cut: 'less inspection time',
      totalsLabel: 'First-off, in-process and last-off rounds combined',
      totals: [{ item: 'Part with 5 measuring points', from: '37 min 30 s', to: '15 min' }, { item: 'Part with 10 measuring points', from: '1 h 13 min 30 s', to: '30 min' }],
      chart: 'Time per inspection round · part with 5 measuring points',
      beforeParts: ['Measure', 'Record on paper', 'Take photos', 'Send photos', 'Enter into Excel'],
      afterParts: ['Measure', 'Photo, record, share and save to server (all at once)'],
      time: (s: number) => s >= 60 ? `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ''}` : `${s} s`,
      note: 'Measured in-house at our Daegu HQ plant (inspection time before and after QAC FLOW)',
      afterSteps: ['Photograph the gauge display', 'OCR reads the value', 'Instant pass/fail against tolerance', 'Report issued upon approval']
    },
    how: {
      kicker: 'Smartphone OCR measurement',
      q: 'How do you take a measurement?',
      title: 'Photograph the gauge display and select the reading, and OCR enters the number into the check sheet.',
      lead: 'No new equipment required.\nJust your existing calipers and gauges, plus a smartphone camera.\nWorks on both mobile and PC web.',
      steps: [
        { title: 'Snap', body: 'Point your camera at the gauge display and take the photo.' },
        { title: 'Crop', body: 'Adjust the frame so only the reading remains.' },
        { title: 'OCR entry', body: 'The value is entered automatically and judged against the tolerance on the spot.' }
      ]
    },
    workflow: {
      kicker: 'Inspection flow',
      q: 'What are the steps of an inspection?',
      title: 'From the inspection order through self-inspection, patrol inspection, approval and reporting, everything stays in one record.',
      step: (n: number) => `Step ${n}`,
      steps: [
        { title: 'Inspection order', body: 'The production manager registers the part, machine and inspection timing.' },
        { title: 'Self-inspection', body: 'The operator photographs the gauge, and OCR enters the value.' },
        { title: 'Patrol inspection', body: 'The patrol inspector re-measures the same items and compares the photos.' },
        { title: 'Approval', body: 'The quality manager reviews both results side by side and approves.' },
        { title: 'Report issued', body: 'The inspection report is issued automatically and can be downloaded as a PDF.' }
      ],
      rules: {
        title: 'First-off interlock and approval rules',
        rounds: [
          { title: 'First-off', body: 'Inspect → complete' },
          { title: 'In-process', body: 'Inspect → complete' },
          { title: 'Last-off', body: 'Inspect → request approval' },
          { title: 'Approval', body: 'Quality manager approves · once, after last-off' },
          { title: 'One report', body: 'One report issued per approval' }
        ],
        lock: 'Locked until first-off is complete',
        reject: { title: 'Fail or rejection', body: 'A reason is required for every rejection, and no report is issued. The report is issued only once the part is re-inspected and approved. Skipped items remain incomplete, and an inspection can be closed early if a mold problem occurs.' }
      }
    },
    live: {
      kicker: 'Shop-floor monitor',
      q: 'How can you see every inspection on the floor at a glance?',
      title: 'Every inspection on your floor, live on one monitor.',
      lead: 'When an operator enters a result on their phone, it appears on the shop-floor monitor the moment it is saved.\nProgress, measurements and defects are visible to everyone on the floor in real time.',
      tabsAria: 'Monitor screens',
      tabs: ['Inspection Status', 'Measurement Detail', 'Quality & Defects'],
      bodies: [
        'Track the progress of first-off, in-process and last-off self-inspections and patrol inspections for every machine. See at a glance which inspections are complete, in progress, delayed or skipped.',
        'Each measured value is shown against its nominal and tolerance, with an OK/NG result for every item. A tolerance bar marks where each value falls, so readings close to the limit stand out immediately.',
        'Review today’s defects by item and type, along with the defect rate. Every corrective action is logged with its owner, instructions and status, so each issue can be followed through to resolution.'
      ],
      alts: [
        'Inspection status screen: completed, in-progress, skipped and delayed counts, and first-off, in-process and last-off self-inspection and patrol inspection progress for each machine',
        'Measurement detail screen: each item of an inspection in progress with its nominal and tolerance, measured value, tolerance bar and OK result',
        'Quality and defects screen: today’s inspection count and defect rate, out-of-tolerance items, defect types, and a rejected patrol inspection being re-measured by the operator'
      ],
      note: 'Actual shop-floor monitor screens. Click a screen to view it full size. Sample data shown.'
    },
    trace: {
      kicker: 'Photo evidence and traceability',
      q: 'How can you trust every measurement?',
      title: 'Every measurement comes with a photo.',
      lead: 'Self-inspection and patrol inspection results sit side by side,\nso mismatches surface before approval,\nand every record is traceable in customer audits and IATF assessments.',
      points: [
        { title: 'Photo evidence for every value', body: 'The gauge photo is stored together with the number it shows.' },
        { title: 'Self-inspection and patrol inspection, side by side', body: 'Two people, two measurements, compared on one screen.' },
        { title: 'One approval, one finished report', body: 'Approval issues an audit-ready report at the same time.' }
      ]
    },
    /** SPC (request doc p.11): the place and the copy; the screens follow once they pass review */
    spc: {
      kicker: 'SPC analysis',
      q: 'What can you learn from accumulated inspection records?',
      title: 'View control charts and process capability from approved inspection records, and manage equipment issues and actions in the same place.',
      lead: 'Approved inspection records become SPC data as they are.\nSelect a product, characteristic, machine and period to view control charts and process capability.',
      /** the four views, each with one screen (Spc.tsx) */
      views: [
        { title: 'Key indicators · control charts', body: 'Follow the process with six key indicators and Xbar-R control charts. Values nearing a control limit are flagged right away.' },
        { title: 'Process capability', body: 'Overlay the measurement distribution on the spec limits and check Cp, Cpk, Pp and Ppk.' },
        { title: 'Equipment issue reports', body: 'View issue reports by machine and status, with downtime and cost recorded alongside.' },
        { title: 'Action history', body: 'Every issue is logged in chronological order, from report through action to completion.' }
      ],
      /** the labels set on each screen, in the order of its marks (Spc.tsx) */
      marks: [
        ['Near-limit warning', 'Six key indicators · Cpk · Ppk · mean · std. dev. · sample count · out of control', 'Xbar chart (subgroup means)', 'R chart (subgroup ranges)'],
        ['Measurement distribution', 'Lower and upper spec limits', 'Capability indices'],
        ['Filter by status', 'Downtime & cost', 'Action status'],
        ['Report → action → completion', 'Action details', 'Total downtime & cost']
      ],
      alts: [
        'SPC analysis screen: product, characteristic, machine and period filters, a near-control-limit warning, Cpk, Ppk, mean, sigma, sample count and out-of-control indicators, and the X̄ and R charts',
        'SPC process capability: a histogram of all measurements against the lower and upper spec limits, with Cp, Cpk, Pp and Ppk',
        'Equipment issue list: issues on CNC-01 and CNC-02 with the report time and reporter, downtime and cost, and an in-progress or completed status',
        'Equipment issue detail: a CNC-01 report of the overall length shifting toward the upper limit, from submission through end mill replacement and offset correction to completion after re-measurement, with total downtime, action cost and the machine’s other reports'
      ],
      note: 'Actual SPC analysis and equipment issue screens in QAC FLOW. Click a screen to view it full size. Sample data shown.'
    },
    /** the inspection report: the three pages one approval issues, and what its QR code and ESG line are for */
    report: {
      kicker: 'Inspection report',
      q: 'What do you get when an inspection is complete?',
      title: 'A single approval issues a three-page report, with each page written for its reader.',
      lead: 'Executives and buyers find the results on page 1, quality engineers the evidence on page 2,\nand auditors and maintenance managers the action history on page 3.',
      pageLabel: (n: number) => `Page ${n}`,
      pages: [
        { title: 'Daily Quality Summary', reader: 'Executives · Buyers', body: 'Pass rate, headline Cpk, inspection count and control charts on one page, together with the prepared, reviewed and approved sign-offs.' },
        { title: 'Detailed Inspection & Process Capability Analysis', reader: 'Quality engineers', body: 'Process capability by dimension, with the first-off, in-process and last-off self-inspection and patrol inspection photos compared.' },
        { title: 'Equipment Action & Quality Traceability Log', reader: 'Auditors · Maintenance managers', body: 'Each equipment issue from detection through corrective action to re-inspection approval, with the full action history.' }
      ],
      qr: { title: 'QR verification', body: 'Scan the QR code on the report to check it against the original and view the measurement photos and approval history.' },
      esg: { title: 'ESG carbon savings', body: 'The paper certificates the report replaces are converted into CO₂e and shown on the report.' },
      /** the spec table under the pages (Report.tsx): these rows, then the QR and ESG ones */
      specsTitle: 'Report specifications',
      specHead: ['Item', 'Details'],
      specs: [{ label: 'Issuance', body: 'Issued automatically once approval is complete.' }, { label: 'Format', body: 'Downloadable as a PDF.' }],
      note: 'The actual report as issued. Click a page to view it full size. Sample data shown.'
    },
    data: {
      kicker: 'Putting data to work',
      q: 'How is the accumulated inspection data used?',
      title: 'Approved reports accumulate as data by part, machine and inspection timing.',
      steps: [
        { title: 'One report per inspection', body: 'Measurements, tolerances, photos and approval in a single record.' },
        { title: 'Reports become data', body: 'Accumulated daily by part, machine and inspection timing.' },
        { title: 'A training asset', body: 'The foundation for defect prediction and process optimization.', plan: true }
      ]
    },
    /** field proof (request doc p.14): what can be said now; photos and figures follow from planning */
    proof: {
      kicker: 'In operation',
      q: 'Is it used on a real shop floor?',
      title: 'In use at DVISION’s Daegu headquarters plant since June 2026.',
      lead: 'Since June 2026, self-inspections and patrol inspections at our Daegu headquarters plant have run on QAC FLOW.',
      since: { figure: '2026.06', label: 'In operation at our own plant', body: 'Daegu headquarters plant · first-off, in-process and last-off self-inspections and patrol inspections' },
      certsLabel: 'DVISION certifications',
      certs: [
        { name: 'IATF 16949', body: 'Automotive quality management system' },
        { name: 'ISO 14001', body: 'Environmental management system' },
        { name: 'ISO 45001', body: 'Occupational health and safety management system' }
      ]
    },
    /** getting started (request doc p.14): the kit, the four-week trial, six questions */
    adopt: {
      kicker: 'Getting started',
      q: 'What do you need to get started?',
      title: 'A smartphone, one server PC and a monitor are all it takes to get started.',
      kit: [
        { title: 'Smartphone', body: 'Photographs gauges and enters values' },
        { title: 'One server PC', body: 'Stores inspection records and original photos' },
        { title: 'Monitor', body: 'Displays the shop-floor status board' }
      ],
      kitNote: 'No dedicated measuring equipment or sensor installation required.',
      trial: {
        label: 'Contact sales',
        title: 'Wondering whether QAC FLOW fits your shop floor? Feel free to get in touch.',
        body: 'Tell us about the parts you inspect, the gauges you use and how you inspect today, and we will recommend the best way to apply QAC FLOW on your floor. We can also discuss a four-week trial on your actual inspections.',
        cta: 'Contact sales'
      },
      faqTitle: 'Frequently asked questions',
      faq: [
        { q: 'Which gauges are supported?', a: 'QAC FLOW uses OCR to read photos of digital gauges that display values as numbers, such as digital calipers. We will confirm during consultation whether the gauges you use are supported.' },
        { q: 'How accurate is the OCR?', a: 'We will publish recognition rates once the test conditions and sample are finalized. Operators review every recognized value before saving and can correct it if needed.' },
        { q: 'What happens when a part fails?', a: 'A reason is required for every rejection, and no report is issued. The report is issued only once the part is re-inspected and approved.' },
        { q: 'How is it different from other SPC tools?', a: 'Values and photos are recorded together at the moment of measurement, so you can view control charts and process capability without re-entering any data. Every value keeps its original photo, so the evidence is always at hand.' },
        { q: 'Does it integrate with ERP or MES?', a: 'The scope and method of integration depend on the systems you use, so we review them with you during consultation.' },
        { q: 'How is it deployed and priced?', a: 'It depends on the size of your operation and the scope of use. Request a demo or send us an inquiry, and we will provide options tailored to you.' }
      ]
    }
  },

  future: {
    label: 'Entering the data industry',
    bridge: 'Accumulated inspection data\nis where our data business begins',
    eyebrow: 'Data Industry',
    title: 'Every inspection\nbecomes a <k>data asset</k>',
    lead: 'Expanding into the data and AI market. QAC FLOW collects the data, and Data Industry turns it into a business.',
    storyLabel: 'From data input to business output',
    story: [
      { tag: 'Input', title: 'QAC FLOW', body: 'The data input. A single photo captures the inspection data' },
      { tag: 'Asset', title: 'Verified data', body: 'Measurements + photo evidence + results + action history' },
      { tag: 'Output', title: 'Data Industry', body: 'The data output. SaaS · data business · credits' }
    ],
    why: {
      kicker: '02 / Why us',
      title: 'We create our data firsthand',
      from: 'All data is collected through QAC FLOW',
      items: [
        { title: 'Measurements', sub: 'DIM · nominal · tolerance' },
        { title: 'Measurement photos', sub: 'Dual evidence: self and patrol inspection' },
        { title: 'Context', sub: 'Machine · part · operator · timing' },
        { title: 'Results', sub: 'OK/NG · defect type' },
        { title: 'Action history', sub: 'Early close · incomplete · rejected' },
        { title: 'Approval history', sub: 'Approver · time issued' }
      ],
      note: 'Photo-verified data = <k>training data you can trust</k>'
    },
    chain: {
      kicker: '03 / Value Chain',
      title: 'Five steps from data collection to business',
      steps: [
        { title: 'Data collection', sub: 'Real-time capture on the floor' },
        { title: 'Internal PoC', sub: 'In-house validation' },
        { title: 'External PoC', sub: 'Customer validation' },
        { title: 'SaaS', sub: 'Productization' },
        { title: 'Data Business', sub: 'Data business' }
      ]
    },
    roadmap: {
      kicker: '04 / Roadmap',
      title: 'Phased growth, validated at every stage. We are in Phase 1.',
      here: 'Now',
      stages: [
        { year: '2026', title: 'Internal PoC', items: ['In-house validation', 'Data model testing', 'Operational optimization'] },
        { year: '2027', title: 'External PoC', items: ['Customer validation', 'System build-out', 'Field testing'] },
        { year: '2028', title: 'SaaS launch', items: ['Service launch', 'Customer growth', 'Monetization'] },
        { year: '2029', title: 'Data / Credit', items: ['Data business', 'Credit system', 'Global expansion'] }
      ],
      proof: '<k>QAC FLOW in operation at our own plant (since June 2026)</k> — our roadmap is not just a plan; it is already underway'
    },
    asset: {
      kicker: '05 / Data Asset',
      title: 'The value accumulated data creates',
      items: [
        { title: 'Defect prediction models', body: 'Accumulated measurements and results help spot defects before they happen.', plan: true },
        { title: 'Process parameter optimization', body: 'Measurements analyzed with their machine and part context point to better process conditions.', plan: true },
        { title: 'Data credit system', body: 'Verified quality data becomes an asset that can be traded and put to use.' },
        { title: 'Closing the quality data gap', body: 'Manufacturers that struggle to build up their own data gain access to verified data.' }
      ]
    },
    partner: {
      kicker: '06 / Partnership',
      title: 'Partners to build data with us',
      tags: ['Join our External PoC', 'Partnership'],
      closing: 'Recorded the moment it is captured.\nAs records build up, <k>they become an industry.</k>'
    }
  },

  contact: {
    /** the inquiry form's own title and line (the dialog) */
    title: 'Contact sales',
    lead: 'Tell us what you inspect and how you inspect it today, and we will recommend the best way to bring QAC FLOW to your shop floor.',
    /** the closing block at the end of the page: a last line, and the button that opens the form */
    closing: { title: 'Bring paperless quality inspection\nto your shop floor.', cta: 'Contact sales' },
    close: 'Close',
    fields: { company: 'Company', name: 'Full name', email: 'Work email', phone: 'Phone number', type: 'Inquiry type', scale: 'Machines to be inspected', timing: 'Desired start date', message: 'Message' },
    placeholders: { company: 'Company name', name: 'Jane Doe', email: 'name@company.com', phone: '+1 000 000 0000', message: 'Tell us about the parts you inspect, the gauges you use and any questions you have.' },
    options: {
      type: ['Consultation', 'Product demo', 'Quote request', 'Trial'],
      scale: ['1–5', '6–20', '21–50', 'More than 50'],
      timing: ['Within 3 months', 'Within 6 months', 'Within 1 year', 'Undecided']
    },
    optional: 'optional',
    choose: 'Please select',
    custom: 'Other (please specify)',
    customPlaceholder: 'Please specify',
    notice: 'We collect your company name, full name, work email, phone number and any optional details to respond to your inquiry and follow up. This information is kept for one year after the consultation ends and then deleted. It is processed via Vercel and Resend in the United States before reaching our company email (Google Workspace).',
    policy: 'Privacy Policy',
    submit: 'Send inquiry',
    sending: 'Sending…',
    again: 'New inquiry',
    retry: 'Try again',
    sent: 'Thank you. Our team will contact you by email or phone shortly.',
    failed: 'Your inquiry could not be sent. Please try again in a moment, or email us at the address below.',
    invalid: { company: 'Please enter your company name.', name: 'Please enter your name.', email: 'Please enter a valid work email address.', phone: 'Please enter your phone number.' },
    mailSubject: 'QAC FLOW inquiry'
  },

  footer: {
    company: 'DVISION Co., Ltd.',
    address: '237, Gukgasandan-daero 33-gil, Guji-myeon, Dalseong-gun, Daegu, Republic of Korea',
    email: 'Contact',
    sites: 'DVISION sites',
    links: { gateway: 'DVISION home', manufacturing: 'Manufacturing site', solution: 'QAC FLOW solution' },
    privacy: 'Privacy Policy',
    copyright: '© 2026 DVISION Co., Ltd. All rights reserved.'
  },

  privacy: privacyEn
};
