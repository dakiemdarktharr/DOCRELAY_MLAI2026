"use client";

import { useState } from "react";
import { Alert, Button, Card, Spinner, Textarea } from "@/components/ui";

type EchoResult = {
  success?: boolean;
  data?: { text?: string };
  error?: { message?: string };
};

export default function WorkspacePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<EchoResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function processInput() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/echo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const body = (await response.json()) as EchoResult;
      if (!response.ok || body.success !== true) {
        setError(body.error?.message ?? "The request could not be processed.");
      } else {
        setResult(body);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Network request failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
          WORKSPACE
        </p>
        <h1 className="mt-2 text-3xl font-black text-ink">
          Generic request workspace
        </h1>
        <p className="mt-2 text-slate-600">
          Enter harmless test text. This pre-sprint shell sends it to{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            POST /api/echo
          </code>
          .
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <h2 className="font-bold text-ink">Input</h2>
            <p className="mt-1 text-sm text-slate-500">
              Zod requires a non-empty string.
            </p>
          </div>
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type a test message..."
            aria-label="Test input"
          />
          <Button onClick={processInput} disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              "Process"
            )}
          </Button>
        </Card>
        <Card className="space-y-4">
          <div>
            <h2 className="font-bold text-ink">Result</h2>
            <p className="mt-1 text-sm text-slate-500">
              The API response is rendered without hidden transformations.
            </p>
          </div>
          {error && <Alert tone="error">{error}</Alert>}
          {result ? (
            <pre className="min-h-36 overflow-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            !error && (
              <div className="flex min-h-36 items-center justify-center rounded-xl border border-dashed border-line text-sm text-slate-400">
                No result yet
              </div>
            )
          )}
        </Card>
      </div>
    </div>
  );
}
