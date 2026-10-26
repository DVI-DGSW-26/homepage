// The site's 24 × 24 line icons, as path data for <LineIcon d={ICON.camera} /> (ui.tsx): drawn with the
// current colour at a 1.5 stroke. One place, so the same picture is the same path on every page.
export const ICON = {
  arrow: 'M5 12h14m-5-5l5 5-5 5',
  checkCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6',

  // inspection: the paper way, then Q.A.C-Flow's
  gauge: 'M4 7h16v10H4z M8 11h8',
  paper: 'M6 3h9l3 3v15H6z M9 10h6M9 14h6M9 18h3',
  spreadsheet: 'M3 5h18v14H3z M3 10h18M9 5v14M15 5v14',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4z M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  scan: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4 M8 12h8',
  docCheck: 'M6 3h9l3 3v15H6z M9 13l2 2 4-4',
  order: 'M6 3h9l3 3v15H6z M9 9h6M9 13h6M9 17h4',
  phone: 'M7 2h10v20H7z M11 18h2 M10 7h4v5h-4z',
  patrol: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3 M18 3v4h-4M6 21v-4h4',
  approve: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M9 12l2 2 4-4',
  report: 'M6 3h9l3 3v15H6z M12 9v7m0 0l-3-3m3 3l3-3',

  // the data industry
  verified: 'M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z M8.5 12l2.5 2.5 4.5-5',
  chart: 'M4 4v16h16 M7 15l4-4 3 3 5-6',
  ruler: 'M3 17L17 3l4 4L7 21z M7 13l2 2M10 10l2 2M13 7l2 2',
  layers: 'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
  history: 'M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 7v5l3 2',
  signed: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 14l2 2 4-4',
  database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  flask: 'M9 3h6 M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3 M7.5 15h9',
  people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18 14.2a6.5 6.5 0 0 1 3.5 5.8',
  cloud: 'M7 18h10.5a4 4 0 0 0 .6-8A6 6 0 0 0 6.6 9.2 4.5 4.5 0 0 0 7 18z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  sliders: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1 M15 4v4M9 10v4M17 16v4',
  coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M14.8 9.4c-.5-.9-1.5-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2s1.2 1.6 2.8 2 2.8.8 2.8 2-1.2 2-2.8 2c-1.3 0-2.3-.5-2.8-1.4 M12 6.5V8M12 16v1.5'
};
