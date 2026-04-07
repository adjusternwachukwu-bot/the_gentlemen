import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { messages, answer } = await request.json();

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { response: "Let's continue. What else should I know?", error: "AI unavailable" },
        { status: 200 }
      );
    }

    const conversation = messages
      .slice(-4)
      .map((m: { role: string; content: string }) => 
        `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
      )
      .join('\n');

    const systemMessage = `You are The Gentlemen's AI intake. Keep responses SHORT (1-2 sentences). Be conversational like a savvy friend. Ask one question at a time.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          ...messages.slice(-4).map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
          { role: "user", content: answer }
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Let's keep going.";
    
    return NextResponse.json({ response: reply });
  } catch (error) {
    return NextResponse.json(
      { response: "Let's wrap this up." },
      { status: 200 }
    );
  }
}