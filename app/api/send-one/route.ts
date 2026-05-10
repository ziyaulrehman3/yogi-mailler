import { NextResponse } from "next/server";
import { buildAttachmentsFromEnv } from "@/lib/attachments";
import { knownPositions, resolveEmailBody } from "@/lib/email-bodies";
import { defaultSubjectLine, getTransporter } from "@/lib/mailer";

export const runtime = "nodejs";

type Body = {
  email?: string;
  position?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const position = typeof body.position === "string" ? body.position.trim() : "";

  if (!email || !position) {
    return NextResponse.json(
      { ok: false, error: "Fields email and position are required." },
      { status: 400 },
    );
  }

  const text = resolveEmailBody(position);
  if (!text) {
    return NextResponse.json(
      {
        ok: false,
        error: `Unknown position "${position}". Configure it in lib/email-bodies.ts. Known: ${knownPositions().join(", ") || "(none)"}.`,
      },
      { status: 400 },
    );
  }

  let transporter;
  try {
    transporter = getTransporter();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Mail configuration error.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  const attachments = buildAttachmentsFromEnv();
  const subject = defaultSubjectLine(position);

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject,
      text,
      attachments,
    });
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Failed to send email via Gmail.";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    subject,
    attachmentCount: attachments.length,
  });
}
