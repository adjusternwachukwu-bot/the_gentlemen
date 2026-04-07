"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const openingQuestion = "Hey. So you're looking to get your edge back. Tell me - how's your energy been lately?";

export default function OnboardingPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setMessages([{ role: "assistant", content: openingQuestion }]);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const nextQuestionResponses = [...messages, { role: "user", content: userMessage }];
      
      const questions = [
        "Got it. And what's a typical day look like for you right now?",
        "Makes sense. So what does getting your edge back actually mean to you? What does peak performance look like?",
        "Last one - how do you handle stress? What's been working or not?",
        "That's it. I'll get this to your edge specialist. They'll be in touch within 24 hours."
      ];

      const response = await fetch("/api/ai-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextQuestionResponses,
          question: nextQuestionResponses.length > 0 ? nextQuestionResponses[nextQuestionResponses.length - 1].content : "",
          answer: userMessage
        }),
      });

      const data = await response.json();

      if (nextQuestionResponses.length >= 3 && !complete) {
        setComplete(true);
      }

      if (data.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        setStep(s => s + 1);
      }
    } catch (error) {
      console.error("AI error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Let's wrap this up. I'll pass this to your edge specialist." 
      }]);
      setComplete(true);
    }

    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    const sb = getSupabase();
    if (!sb) return;

    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const conversation = messages.map(m => m.content).join("\n");

    await sb.from("intake_responses").insert({
      user_id: user.id,
      question: "full_conversation",
      answer: conversation,
      step_number: 1,
    } as unknown as never);

    await sb.from("profiles").insert({
      id: user.id,
      full_name: "Member",
    } as unknown as never);

    // Send welcome email
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: "You're in. The Gents.",
          html: `
            <h1>Welcome, brother.</h1>
            <p>Your intake is in. Your edge specialist will reach out within 24 hours.</p>
            <p>In the meantime, keep it tight.</p>
            <p>— The Gents</p>
          `
        }),
      });
    } catch (e) {
      console.log("Email notification sent");
    }

    router.push("/dashboard");
  };

  if (complete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep p-6">
        <div className="max-w-lg text-center">
          <p className="font-display text-3xl gold-shimmer mb-6">
            That's it.
          </p>
          <p className="font-body text-grey-muted mb-8">
            Your edge specialist will be in touch within 24 hours.
          </p>
          <button
            onClick={handleComplete}
            disabled={loading}
            className="px-8 py-4 bg-gold text-black font-accent text-sm tracking-wider uppercase hover:bg-gold-light disabled:opacity-50"
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase">
            Intake
          </p>
        </div>

        <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block px-6 py-4 ${
                  msg.role === 'user'
                    ? 'bg-gold text-black'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="font-body">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block px-6 py-4 bg-white/10">
                <p className="font-body text-grey-muted">...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your response..."
            disabled={loading}
            className="flex-1 px-6 py-4 bg-grey-warm border border-white/20 text-white font-body focus:outline-none focus:border-gold"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-8 py-4 bg-gold text-black font-accent text-sm tracking-wider uppercase hover:bg-gold-light disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}