"use client";

import JSON5 from "json5";
import { useState } from "react";

type Entry = { email: string; position: string };

type RowStatus = "pending" | "sending" | "sent" | "failed";

type SendRow = Entry & {
  id: string;
  status: RowStatus;
  error?: string;
};

function normalizePayload(parsed: unknown): Entry[] | null {
  if (parsed === null || typeof parsed !== "object") return null;

  if (Array.isArray(parsed)) {
    const out: Entry[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") return null;
      const rec = item as Record<string, unknown>;
      const email = rec.email;
      const position = rec.position;
      if (typeof email !== "string" || typeof position !== "string") return null;
      const e = email.trim();
      const p = position.trim();
      if (!e || !p) return null;
      out.push({ email: e, position: p });
    }
    return out;
  }

  const rec = parsed as Record<string, unknown>;
  const email = rec.email;
  const position = rec.position;
  if (typeof email !== "string" || typeof position !== "string") return null;
  const e = email.trim();
  const p = position.trim();
  if (!e || !p) return null;
  return [{ email: e, position: p }];
}

const statusStyle: Record<RowStatus, string> = {
  pending:
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  sending:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  sent: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
};

const statusLabel: Record<RowStatus, string> = {
  pending: "Waiting",
  sending: "Sending…",
  sent: "Sent",
  failed: "Failed",
};

export default function Home() {
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [rows, setRows] = useState<SendRow[]>([]);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setParseError(null);

    let parsed: unknown;
    try {
      parsed = JSON5.parse(jsonText);
    } catch {
      setParseError(
        "Invalid data. Use email and position fields. Tip: strict JSON uses double quotes only; relaxed formats (single quotes, trailing commas) are also accepted.",
      );
      return;
    }

    const entries = normalizePayload(parsed);
    if (entries === null) {
      setParseError(
        "Expected a single object or an array of objects. Each item must have non-empty string fields: email and position.",
      );
      return;
    }

    const initial: SendRow[] = entries.map((e, i) => ({
      ...e,
      id: String(i),
      status: "pending" as const,
    }));

    setRows(initial);
    setSending(true);

    for (let i = 0; i < initial.length; i++) {
      setRows((prev) =>
        prev.map((r, j) =>
          j === i ? { ...r, status: "sending", error: undefined } : r,
        ),
      );

      try {
        const res = await fetch("/api/send-one", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: initial[i].email,
            position: initial[i].position,
          }),
        });

        const data = (await res.json()) as {
          ok?: boolean;
          error?: string;
        };

        if (!res.ok || !data.ok) {
          const msg = data.error ?? `HTTP ${res.status}`;
          setRows((prev) =>
            prev.map((r, j) =>
              j === i ? { ...r, status: "failed", error: msg } : r,
            ),
          );
        } else {
          setRows((prev) =>
            prev.map((r, j) =>
              j === i ? { ...r, status: "sent" } : r,
            ),
          );
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Network or unexpected error.";
        setRows((prev) =>
          prev.map((r, j) =>
            j === i ? { ...r, status: "failed", error: msg } : r,
          ),
        );
      }
    }

    setSending(false);
  }

  const doneCount = rows.filter((r) => r.status === "sent").length;
  const failCount = rows.filter((r) => r.status === "failed").length;
  const finishedCount = doneCount + failCount;
  const total = rows.length;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 px-4 py-8 text-foreground sm:px-6 sm:py-12 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Job mailer
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use{" "}
            <code className="rounded bg-zinc-200/80 px-1 font-mono text-[11px] dark:bg-zinc-800">
              position
            </code>{" "}
            as one of: React Native, Mobile App, React, Front End, Full Stack,
            MERN Stack (same spelling as in{" "}
            <code className="rounded bg-zinc-200/80 px-1 font-mono text-[11px] dark:bg-zinc-800">
              lib/email-bodies.ts
            </code>
            ). Subject line is{" "}
            <code className="rounded bg-zinc-200/80 px-1 font-mono text-[11px] dark:bg-zinc-800">
              {"{position} Developer Application"}
            </code>
            . Paste JSON as one object{" "}
            <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
              {"{ \"email\": \"…\", \"position\": \"…\" }"}
            </code>{" "}
            or an array. Edit templates in{" "}
            <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
              lib/email-bodies.ts
            </code>
            . Gmail + attachments are configured via{" "}
            <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
              .env.local
            </code>{" "}
            (see{" "}
            <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
              .env.example
            </code>
            ).
          </p>
        </header>

        <div className="flex flex-1 flex-col gap-3">
          <label htmlFor="json-input" className="text-sm font-medium">
            JSON input
          </label>
          <textarea
            id="json-input"
            spellCheck={false}
            disabled={sending}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`{\n  "email": "person@example.com",\n  "position": "React Native"\n}`}
            className="min-h-[220px] w-full resize-y rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
          />

          {parseError && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {parseError}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:active:bg-zinc-200"
            >
              {sending ? "Sending…" : "Send"}
            </button>

            {total > 0 && !sending && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Finished: {doneCount} sent
                {failCount > 0 ? `, ${failCount} failed` : ""} of {total}.
              </p>
            )}
            {sending && total > 0 && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Progress: {finishedCount} of {total} finished (one may be in flight).
              </p>
            )}
          </div>
        </div>

        {rows.length > 0 && (
          <section className="space-y-2" aria-live="polite">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Send status
            </h2>
            <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-900">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm text-zinc-900 dark:text-zinc-100">
                      {row.email}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Position: {row.position}
                    </p>
                    {row.error && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {row.error}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[row.status]}`}
                  >
                    {statusLabel[row.status]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
