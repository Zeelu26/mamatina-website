"use client";

import { useEffect, useState } from "react";
import type { ContactMessage } from "@/lib/types";
import { Button, Card } from "../ui";

export default function MessagesView({ initial }: { initial: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [open, setOpen] = useState<ContactMessage | null>(null);

  useEffect(() => {
    setMessages(initial);
  }, [initial]);

  async function refetch() {
    const res = await fetch("/api/messages", { cache: "no-store" });
    const data = await res.json();
    setMessages(data.messages);
  }

  async function toggleRead(m: ContactMessage) {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, read: !m.read }),
    });
    await refetch();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
    await refetch();
  }

  const shown = messages
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((m) => (filter === "unread" ? !m.read : true));

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 luxe-card p-1">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-widest-2 transition ${
                filter === f
                  ? "bg-chocolate text-cream"
                  : "text-chocolate/65 hover:text-chocolate"
              }`}
            >
              {f}
              {f === "unread" && unread > 0 && (
                <span className="ml-2 bg-gold text-soft-black rounded-full px-1.5 text-[10px]">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>
        <a
          href="/api/messages/export"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-widest-2 bg-cream border border-chocolate/20 hover:border-chocolate text-chocolate transition"
        >
          Export CSV
        </a>
      </div>

      {shown.length === 0 ? (
        <Card>
          <div className="text-chocolate/55 italic text-sm">No messages here.</div>
        </Card>
      ) : (
        <ul className="grid gap-3">
          {shown.map((m) => (
            <li
              key={m.id}
              className={`luxe-card p-5 transition hover:-translate-y-0.5 cursor-pointer ${
                !m.read ? "border-gold/60" : ""
              }`}
              onClick={() => {
                if (!m.read) toggleRead(m);
                setOpen(m);
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-chocolate font-medium">{m.name}</span>
                    <span className="text-chocolate/45 text-xs">· {m.email}</span>
                    {!m.read && (
                      <span className="text-[9px] uppercase tracking-widest-2 bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-chocolate/70 truncate">
                    {m.message}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/45 shrink-0">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <Detail message={open} onClose={() => setOpen(null)} onAct={refetch} onDelete={async () => {
          await remove(open.id);
          setOpen(null);
        }} />
      )}
    </>
  );
}

function Detail({
  message,
  onClose,
  onAct,
  onDelete,
}: {
  message: ContactMessage;
  onClose: () => void;
  onAct: () => void;
  onDelete: () => void;
}) {
  async function toggleRead() {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: message.id, read: !message.read }),
    });
    onAct();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-soft-black/60 backdrop-blur-sm">
      <div className="relative bg-cream w-full max-w-2xl rounded-3xl overflow-hidden">
        <div className="px-7 py-5 border-b border-beige flex items-center justify-between">
          <h3 className="font-display text-xl text-chocolate">Message</h3>
          <button onClick={onClose} className="h-9 w-9 rounded-full hover:bg-beige text-xl">×</button>
        </div>
        <div className="px-7 py-6 max-h-[75vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <Info label="From" value={message.name} />
            <Info label="Received" value={new Date(message.createdAt).toLocaleString()} />
            <Info label="Email" value={<a className="hover:text-gold-dark" href={`mailto:${message.email}`}>{message.email}</a>} />
            <Info label="Phone" value={<a className="hover:text-gold-dark" href={`tel:${message.phone}`}>{message.phone}</a>} />
            {message.productInterest && <Info label="Flavor" value={message.productInterest} />}
            {message.quantity && <Info label="Quantity" value={message.quantity} />}
            {message.eventDate && <Info label="Event Date" value={message.eventDate} />}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/55 mb-2">
              Message
            </div>
            <div className="whitespace-pre-line text-chocolate/85 leading-relaxed font-light">
              {message.message}
            </div>
          </div>
          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <Button onClick={toggleRead}>
              Mark as {message.read ? "unread" : "read"}
            </Button>
            <a
              href={`mailto:${message.email}`}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-widest-2 bg-cream border border-chocolate/20 hover:border-chocolate text-chocolate transition"
            >
              Reply
            </a>
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/55">{label}</div>
      <div className="text-sm text-chocolate mt-0.5">{value}</div>
    </div>
  );
}
