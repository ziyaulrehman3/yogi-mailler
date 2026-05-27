import fs from "fs";
import path from "path";
import type { Attachment } from "nodemailer/lib/mailer";

/** Tried in order when MAIL_ATTACHMENT_RESUME is unset. */
const DEFAULT_RESUME_CANDIDATES = [
  "attachments/yogita_mishra_resume.pdf",
  "attachments/yogita mishra resume.pdf",
];

function resolveResumeAbsolute(root: string): string | null {
  const fromEnv = process.env.MAIL_ATTACHMENT_RESUME?.trim();
  const relPaths = fromEnv ? [fromEnv] : DEFAULT_RESUME_CANDIDATES;

  for (const raw of relPaths) {
    const resolved = path.isAbsolute(raw)
      ? raw
      : path.join(root, raw.replace(/^\//, ""));
    if (fs.existsSync(resolved)) return resolved;
  }

  return null;
}

/**
 * Single resume for all positions. Set MAIL_ATTACHMENT_RESUME in .env.local to override
 * (relative to project root or absolute). When unset, looks for the default PDF names above.
 */
export function buildAttachmentsFromEnv(): Attachment[] {
  const root = process.cwd();
  const resolved = resolveResumeAbsolute(root);

  if (!resolved) {
    const hint = "attachments/yogita_mishra_resume.pdf".trim()
      ? "attachments/yogita_mishra_resume.pdf"
      : "attachments/yogita_mishra_resume.pdf";
    console.warn(
      `[mail] Resume attachment not found. Checked: ${hint} (project root: ${root})`
    );
    return [];
  }

  return [
    {
      filename: path.basename(resolved),
      path: resolved,
    },
  ];
}
