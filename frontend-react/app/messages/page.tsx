"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMessages, sendMessage } from "../services/api";

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
      setError(null);
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }

  async function send() {
    if (!recipientId || !content) return;
    try {
      await sendMessage(Number(recipientId), content);
      setContent("");
      setRecipientId("");
      load();
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      setError(e.message || String(e));
    }
  }

  if (loading) return <div className="p-6">Lade Nachrichten…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl mb-4">Nachrichten</h1>

      <div className="mb-6 border p-4 rounded">
        <h2 className="font-semibold mb-2">Neue Nachricht</h2>
        <input value={recipientId} onChange={e => setRecipientId(e.target.value)} placeholder="Empfänger ID" className="border p-2 mr-2" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Nachricht" className="border p-2 w-full mt-2" />
        <div className="mt-2">
          <button onClick={send} className="px-4 py-2 bg-green-600 text-white rounded">Senden</button>
        </div>
      </div>

      <ul className="space-y-4">
        {messages.map((m: any) => (
          <li key={m.id} className="border p-4 rounded">
            <div className="text-sm text-gray-600">Von: {m.sender?.name ?? m.sender?.email} — {new Date(m.createdAt).toLocaleString()}</div>
            <div className="mt-2">{m.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
