'use client';
// QAC FLOW, the smartphone quality inspection system built on DVISION's own line, laid out as a product's
// home page: the first screen (what it is and does), the features at a glance, then each feature in turn
// (measuring, the inspection flow, the floor monitor, photo evidence, SPC, the report), the results, the
// data, where it runs and how to start, and the form. Each section opens on the feature's name and a plain
// sentence (Head, ./parts).
import { useT } from '../../i18n';
import { Intro } from './sections/Intro';
import { Features } from './sections/Features';
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
      <Features />
      <How />
      <Workflow />
      <Live />
      <Trace />
      <Spc />
      <Report />
      <Problem />
      <Data />
      <Proof />
      <Adopt />
    </div>
  );
}
