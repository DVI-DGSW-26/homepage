// Q.A.C-Flow, the smartphone quality inspection system built on DVISION's own line. The figures up
// front, then the problem, how it works, the workflow, the live monitor, traceability, and report →
// data, whose last step links on to the data-industry page (src/pages/data). Each block is a band of
// its own, the surfaces alternating, and opens on the visitor's question (Head, ./parts).
import { useT } from '../../i18n';
import { Intro } from './sections/Intro';
import { Problem } from './sections/Problem';
import { How } from './sections/How';
import { Workflow } from './sections/Workflow';
import { Live } from './sections/Live';
import { Trace } from './sections/Trace';
import { Data } from './sections/Data';

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
      <Data />
    </div>
  );
}
