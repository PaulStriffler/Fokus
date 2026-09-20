// Kurze, eigene Antreiber — kein Copyright, keine (falschen) Attributionen.
const QUOTES: string[] = [
  "Kleine Schritte, jeden Tag. So wird man zur Maschine.",
  "Disziplin schlägt Motivation. Zieh es durch.",
  "Der beste Moment ist jetzt — nicht morgen.",
  "Fokus heißt: Nein sagen zu allem, was nicht zählt.",
  "Konstanz ist dein unfairer Vorteil.",
  "Was du heute tust, entscheidet, wer du morgen bist.",
  "Ein Prozent besser reicht. Jeden Tag.",
  "Deine Ziele interessieren sich nicht für deine Stimmung.",
  "Schwer heute, leicht später. Bleib dran.",
  "Du brauchst keine Erlaubnis, um anzufangen.",
  "Entweder du bewegst dich vorwärts — oder du wartest.",
  "Der Streak, den du nicht brichst, verändert alles.",
  "Fang klein an, aber fang an.",
  "Der Plan zählt nur, wenn du ihn durchziehst.",
  "Heute ist ein guter Tag, um besser zu werden.",
];

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export function quoteOfTheDay(d: Date = new Date()): string {
  return QUOTES[dayOfYear(d) % QUOTES.length];
}
