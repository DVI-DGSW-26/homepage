'use client';
// QAC FLOW, the smartphone quality inspection system built on DVISION's own line. The figures up
// front, then the problem, how it works, the workflow, the live monitor, traceability, SPC, the inspection report, reports →
// data (whose last step links on to the data-industry page, src/views/data), field proof and getting started. Each block is a band of
// its own, the surfaces alternating, and opens on the visitor's question (Head, ./parts).
import { useT } from '../../i18n';
import { Intro } from './sections/Intro';
import { Problem } from './sections/Problem';
import { How } from './sections/How';
import { Workflow } from './sections/Workflow';
import { Live } from './sections/Live';
import { Trace } from './sections/Trace';
import { Spc } from './sections/Spc';
import { Report } from './sections/Report';
import { Data } from './sections/Data';
import { Proof } from './sections/Proof';
import { Adopt } from './sections/Adopt';

export function QacFlowPage() {
  const m = useT().qf;
  return (
    <div id="qac-flow" role="region" aria-label={m.label}>
      <Intro />
      <Problem />
      <How />
      <Workflow />
      <Live />
      <Trace />
      <Spc />
      <Report />
      <Data />
      <Proof />
      <Adopt />
    </div>
  );
}
