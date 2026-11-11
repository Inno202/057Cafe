import type { ReactNode } from 'react';

/** Splits "plain *marked* plain" into parts. Unbalanced asterisks are kept as text. */
export function splitEmphasis(text: string): { text: string; marked: boolean }[] {
  const parts: { text: string; marked: boolean }[] = [];
  const pattern = /\*([^*]+)\*/g;
  let last = 0;
  for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index), marked: false });
    parts.push({ text: match[1], marked: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), marked: false });
  return parts;
}

export const plainText = (text: string) => splitEmphasis(text).map((part) => part.text).join('');

/** Renders *marked* words in the accent colour (headings) or bold (running text). */
export function Emphasis({ text, as = 'accent' }: { text: string; as?: 'accent' | 'strong' }): ReactNode {
  return splitEmphasis(text).map((part, index) =>
    !part.marked ? part.text
      : as === 'accent' ? <span key={index} className="text-accent">{part.text}</span>
      : <strong key={index} className="font-semibold text-ink">{part.text}</strong>,
  );
}
