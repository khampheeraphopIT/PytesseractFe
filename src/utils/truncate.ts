export default function truncateText(
  text: string,
  maxLines: number = 5,
  charsPerLine: number = 100
): string {
  const maxLength = maxLines * charsPerLine;
  if (text.length <= maxLength) return text;

  let truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    truncated = truncated.slice(0, lastSpace);
  }
  return `${truncated}...`;
}
