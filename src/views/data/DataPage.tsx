'use client';
// The data industry page, following the homepage plan: the vision (inspection data in, a data
// business out), why us (the six kinds of data QAC FLOW gathers every day), the value chain in five
// steps, the 2026–2029 roadmap with where we are lit, what the data is worth, and the partnership the
// page ends on. QAC FLOW's last block links here (src/pages/qac-flow), and Why us links back.
import { useT } from '../../i18n';
import { Vision } from './sections/Vision';
import { WhyUs } from './sections/WhyUs';
import { Chain } from './sections/Chain';
import { Roadmap } from './sections/Roadmap';
import { Asset } from './sections/Asset';
import { Partner } from './sections/Partner';

export function DataPage() {
  const m = useT().future;
  return (
    <div id="future" role="region" aria-label={m.label}>
      <Vision />
      <WhyUs />
      <Chain />
      <Roadmap />
      <Asset />
      <Partner />
    </div>
  );
}
