import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, question, answer } = await request.json();

    const systemPrompt = `You are The Gentlemen's AI intake assistant. You're having a conversation with a new member. 

Keep it SHORT and CONVERSATIONAL. No medical jargon. No clinical questions. 

Rules:
- 1-2 sentences max per response
- Ask follow-up questions naturally
- Don't sound like a bot or form
- Reference their previous answers
- Stay in character as a savvy friend who gets it

Previous context:`;

    const conversationHistory = messages?.length 
      ? messages.map((m: { role: string; content: string }) => 
          `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
        ).join('\n')
      : '';

    const fullPrompt = `${systemPrompt}\n${conversationHistory}\nUser just answered: "${answer}"\n\n${question}`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma:latest",
        prompt: fullPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama request failed");
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      response: data.response,
      status: "success"
    });
  } catch (error) {
    console.error("AI intake error:", error);
    return NextResponse.json(
      { response: "Let's continue. What else should I know?", error: "AI unavailable" },
      { status: 200 }
    );
  }
}