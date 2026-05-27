import nodemailer from "nodemailer";

export function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment variables."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/** Subject line: `{position} Developer Application` (uses the same string as JSON `position`). */
export function defaultSubjectLine(position: string): string {
  const p = position.trim();
  return `${p} Engineer Application`;
}
