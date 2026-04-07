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

const questions = [
  {
    id: "energy",
    question: "How's your energy been lately?",
    subtitle: "Rate your energy from 1-10",
    type: "number",
  },
  {
    id: "typical_day",
    question: "What does a typical day look like for you?",
    subtitle: "Describe your daily routine",
    type: "text",
  },
  {
    id: "edge_goal",
    question: "What would getting your edge back mean to you?",
    subtitle: "What does peak performance look like?",
    type: "text",
  },
  {
    id: "stress",
    question: "How do you handle stress?",
    subtitle: "Share what's been working (or not)",
    type: "text",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      setLoading(true);
      const sb = getSupabase();
      if (!sb) {
        router.push("/dashboard");
        return;
      }
      const {
        data: { user },
      } = await sb.auth.getUser();

      if (user) {
        const stepNumbers = Object.entries(answers).map(([question, answer]) => ({
          user_id: user.id,
          question,
          answer: String(answer),
          step_number: questions.findIndex((q) => q.id === question) + 1,
        }));

        await sb.from("intake_responses").insert(stepNumbers as unknown as never);

        await sb.from("profiles").insert({
          id: user.id,
          full_name: answers.full_name || "Member",
        } as unknown as never);

        try {
          await fetch("/api/telehealth/referral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(answers),
          });
        } catch (e) {
          console.error("Referral error:", e);
        }
      }

      router.push("/dashboard");
    } else {
      setStep(step + 1);
    }
    setLoading(false);
  };

  const handleAnswer = (value: string | number) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase">
            Step {step + 1} of {questions.length}
          </p>
          <div className="h-1 bg-white/10 mt-2">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-white mb-4">
            {currentQuestion.question}
          </h1>
          <p className="font-body text-grey-muted">{currentQuestion.subtitle}</p>
        </div>

        <div className="space-y-6">
          {currentQuestion.type === "number" ? (
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAnswer(num)}
                  className={`w-16 h-16 font-display text-2xl border transition-colors ${
                    answers[currentQuestion.id] === num
                      ? "border-gold bg-gold text-black"
                      : "border-white/20 text-white hover:border-gold"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={(answers[currentQuestion.id] as string) || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              rows={4}
              className="w-full px-6 py-4 bg-grey-warm border border-white/20 text-white font-body focus:outline-none focus:border-gold resize-none"
              placeholder="Tell us..."
            />
          )}

          <button
            onClick={handleNext}
            disabled={loading || !answers[currentQuestion.id]}
            className="w-full py-4 bg-gold text-black font-accent text-sm tracking-wider uppercase hover:bg-gold-light disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isLastStep
              ? "Complete"
              : "Continue"}
          </button>
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-grey-muted hover:text-white text-sm"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}