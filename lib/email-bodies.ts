/**
 * Six roles. Use the same `position` string in JSON (case/spacing normalized for matching).
 * Replace example paragraphs with your final templates.
 */
export const EMAIL_BODIES_BY_POSITION: Record<string, string> = {
  QA: `Hi, 

  I am writing to express my interest in the QA position at your company. With experience in manual testing, writing detailed test cases, executing regression and functional testing, and identifying edge cases, I ensure high-quality product delivery. I am detail-oriented, proactive, and committed to improving user experience through thorough testing.
  
  I would welcome the opportunity to contribute to your team and add value through my testing expertise.
  
  Thank you for your time and consideration.

Best Regards,
Yogita Mishra
+91-8848187763
LinkedIn: https://www.linkedin.com/in/yogita-mishra-7902081ab`,
};

/** Normalizes spacing/case so JSON input matches templates reliably. */
export function normalizePositionKey(s: string): string {
  const t = s.trim().toLowerCase().replace(/\s+/g, " ");
  return t.replace(/\s*,\s*/g, ", ");
}

export function resolveEmailBody(position: string): string | null {
  const needle = normalizePositionKey(position);
  for (const [key, body] of Object.entries(EMAIL_BODIES_BY_POSITION)) {
    if (normalizePositionKey(key) === needle) return body;
  }
  return null;
}

export function knownPositions(): string[] {
  return Object.keys(EMAIL_BODIES_BY_POSITION);
}
