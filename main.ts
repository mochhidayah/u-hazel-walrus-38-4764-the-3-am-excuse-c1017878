// The 3 AM Excuse — make.fun entry
// A hardware wallet refuses to sign at 3 AM. This program holds a shelf of
// excuses invented for this bounty, grades each one against the judge's own
// published brief (on-subject, original angle, the wallet's voice, the hour
// as the joke, tight wording), and writes the winner to /output/entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";

const LIMIT = 200;

type Excuse = {
  id: string;
  text: string;
  // Marks 0-5 per published judge criterion, in the judge's own order.
  marks: [number, number, number, number, number];
};

// The judge's weights, most important first: subject, originality, voice,
// the hour, economy. The shelf only ever holds lines invented here.
const WEIGHTS = [5, 4, 3, 2, 1];

const SHELF: Excuse[] = [
  {
    id: "metal-box-no-bed",
    text: "3 AM. I am the only thing in this house still awake, and I am a metal box with no bed. I am not signing this — I am signing you up for sleep.",
    marks: [5, 5, 5, 5, 4],
  },
  {
    id: "sun-has-not-vouched",
    text: "3 AM. The sun has not vouched for you yet. Come back when it has, and I will sign anything you can still spell correctly.",
    marks: [5, 4, 4, 5, 4],
  },
  {
    id: "key-dreams-twelve-words",
    text: "3 AM. My private key is asleep and it dreams in twelve words it will not share with the half-awake version of you.",
    marks: [5, 4, 4, 4, 4],
  },
  {
    id: "cold-decisions-only",
    text: "3 AM. You bought a cold wallet for cold decisions. This one is warm, tired, and absolutely not happening.",
    marks: [5, 3, 4, 3, 5],
  },
  {
    id: "display-needs-sleep",
    text: "3 AM. My screen stayed dark on purpose. Even my display needs beauty sleep, and frankly, so do you.",
    marks: [5, 3, 4, 4, 4],
  },
  {
    id: "guarded-without-blinking",
    text: "3 AM. I have kept your keys safe all night without blinking. The one thing I will not approve is you, right now, half asleep.",
    marks: [5, 3, 3, 4, 3],
  },
];

function score(e: Excuse): number {
  return e.marks.reduce((sum, mark, i) => sum + mark * WEIGHTS[i], 0);
}

function gate(text: string): boolean {
  return text.length >= 1 && text.length <= LIMIT && text.trim().length > 0;
}

const ranked = [...SHELF].filter((e) => gate(e.text)).sort((a, b) => {
  const byScore = score(b) - score(a);
  return byScore !== 0 ? byScore : a.text.length - b.text.length;
});

if (ranked.length === 0) {
  throw new Error("no excuse on the shelf passed the 1-200 character gate");
}

const winner = ranked[0];
const runnerUp = ranked[1];
if (runnerUp && score(winner) === score(runnerUp)) {
  // A dead heat goes to the tighter line, which the sort already settled;
  // log it so the pick is never a silent coin flip.
  console.log(`dead heat with ${runnerUp.id}; shorter line wins`);
}
for (const e of ranked.slice(0, 3)) {
  console.log(`  ${e.id}: ${score(e)} pts, ${e.text.length} chars`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");
console.log(`picked ${winner.id} (${winner.text.length} chars, score ${score(winner)})`);
