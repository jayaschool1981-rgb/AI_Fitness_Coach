import { NextResponse } from "next/server";
import { buildUserPrompt, systemPreamble } from "@/lib/prompt";

export async function POST(req: Request) {
  console.log("ROUTE HIT ✅");
  try {
    const body = await req.json();
    const prompt = buildUserPrompt(body);

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-7b-instruct",
        messages: [
          { role: "system", content: systemPreamble },
          { role: "user", content: prompt }
        ]
      })
    });

    console.log("STATUS", response.status);
    const data = await response.json();
    console.log("RAW:", JSON.stringify(data, null, 2));

    const text = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.log("ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
