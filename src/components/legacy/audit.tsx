"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  Spinner,
  Table,
} from "@/components/ui";

type AuditEvent = {
  id: string;
  type: string;
  actor: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/events", { cache: "no-store" });
      const body = (await response.json()) as {
        success?: boolean;
        data?: AuditEvent[];
        error?: { message?: string };
      };
      if (!response.ok || body.success !== true)
        throw new Error(body.error?.message ?? "Could not load events");
      setEvents(body.data ?? []);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load events",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
            AUDIT
          </p>
          <h1 className="mt-2 text-3xl font-black text-ink">
            Generic event log
          </h1>
          <p className="mt-2 text-slate-600">
            Click a row to inspect metadata, actor, and event type.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => void loadEvents()}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ml-2">Loading...</span>
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      <Card>
        <Table>
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {events.length ? (
              events.map((event) => (
                <tr
                  key={event.id}
                  className="cursor-pointer hover:bg-paper"
                  onClick={() => setSelected(event)}
                >
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                    {new Date(event.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm">{event.actor}</td>
                  <td className="px-4 py-4 font-mono text-xs">{event.type}</td>
                  <td className="px-4 py-4">
                    <Badge tone="success">RECORDED</Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  {loading
                    ? "Loading events..."
                    : "No events yet. Process a workspace input to create one."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
      <Dialog
        open={Boolean(selected)}
        title="Event detail"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2">
              <dt className="font-semibold text-slate-500">Timestamp</dt>
              <dd>{new Date(selected.createdAt).toLocaleString()}</dd>
              <dt className="font-semibold text-slate-500">Actor</dt>
              <dd>{selected.actor}</dd>
              <dt className="font-semibold text-slate-500">Event type</dt>
              <dd className="font-mono text-xs">{selected.type}</dd>
              <dt className="font-semibold text-slate-500">ID</dt>
              <dd className="break-all font-mono text-xs">{selected.id}</dd>
            </dl>
            <div>
              <p className="mb-2 font-semibold text-slate-500">Metadata</p>
              <pre className="overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                {JSON.stringify(selected.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
