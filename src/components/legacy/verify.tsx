"use client";

import { useState } from "react";
import { Alert, Badge, Button, Card, Spinner, Table } from "@/components/ui";
import { genericVerifyCases } from "@/verify/cases";
import { runVerifyCase, type VerifyResult } from "@/verify/runner";

export default function VerifyPage() {
  const [results, setResults] = useState<VerifyResult[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function runAll() {
    setRunning(true);
    setError("");
    try {
      const next: VerifyResult[] = [];
      for (const testCase of genericVerifyCases)
        next.push(await runVerifyCase(testCase));
      setResults(next);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Verify failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
            VERIFY
          </p>
          <h1 className="mt-2 text-3xl font-black text-ink">
            Generic verification harness
          </h1>
          <p className="mt-2 text-slate-600">
            Four harmless cases call the production API and compare the returned
            value.
          </p>
        </div>
        <Button onClick={runAll} disabled={running}>
          {running ? (
            <>
              <Spinner />
              <span className="ml-2">Running...</span>
            </>
          ) : (
            "Run All Tests"
          )}
        </Button>
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      <Card>
        <Table>
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Expected</th>
              <th className="px-4 py-3">Actual</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {genericVerifyCases.map((testCase) => {
              const result = results.find((item) => item.id === testCase.id);
              return (
                <tr key={testCase.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-ink">{testCase.id}</p>
                    <p className="text-xs text-slate-500">
                      {testCase.description}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {testCase.expected}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {result?.actual ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    {result ? (
                      <Badge tone={result.passed ? "success" : "danger"}>
                        {result.passed ? "PASS" : "FAIL"}
                      </Badge>
                    ) : (
                      <Badge>NOT RUN</Badge>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                    {result ? new Date(result.timestamp).toLocaleString() : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
