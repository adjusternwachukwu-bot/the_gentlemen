"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient> | null = null;

const getSupabase = () => {
  if (!supabase && typeof window !== "undefined") {
    supabase = createClient(
      (window as unknown as { env: { NEXT_PUBLIC_SUPABASE_URL: string; NEXT_PUBLIC_SUPABASE_ANON_KEY: string } }).env?.NEXT_PUBLIC_SUPABASE_URL || "",
      (window as unknown as { env: { NEXT_PUBLIC_SUPABASE_URL: string; NEXT_PUBLIC_SUPABASE_ANON_KEY: string } }).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
  }
  return supabase;
};

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      const sb = getSupabase();
      if (!sb) return;

      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data } = await sb
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      setLoading(false);
    }

    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return;

    const sb = getSupabase();
    if (!sb) return;

    await sb.from("messages").insert({
      sender_id: userId,
      receiver_id: userId, 
      content: newMessage,
    } as unknown as never);

    setMessages([
      ...messages,
      { id: Date.now().toString(), sender_id: userId, content: newMessage, created_at: new Date().toISOString() },
    ]);
    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-deep p-6 flex items-center justify-center">
        <p className="font-body text-grey-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl text-white mb-8">Messages</h1>

        <div className="border border-white/10 bg-grey-warm/20 p-4 mb-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="font-body text-grey-muted text-center py-8">
              No messages yet. Start a conversation with your performance doctor.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 ${
                  msg.sender_id === userId ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 ${
                    msg.sender_id === userId
                      ? "bg-gold text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <p className="font-body text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-grey-warm border border-white/20 text-white font-body focus:outline-none focus:border-gold"
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-gold text-black font-accent text-sm tracking-wider uppercase hover:bg-gold-light"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}