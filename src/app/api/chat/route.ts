import { NextRequest } from "next/server";

export const runtime = "nodejs";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ANSWERS: Record<string, string> = {
  claude: `### Claude 3.5 Sonnet vs. Gemini 1.5 Pro

Here is a side-by-side analysis of the two leading models:

1. **Context Window**: Gemini 1.5 Pro features a 2 million token context window, enabling it to ingest hours of video or full code repositories. Claude 3.5 Sonnet supports a 200,000 token window.
2. **Coding Performance**: Claude 3.5 Sonnet scores 92.0% on HumanEval, representing the state-of-the-art for coding assistance and logic.
3. **Tone & Style**: Claude is generally preferred for writing articles and creative drafting due to its natural, human-like voice.

Both models represent peak AI performance, with Gemini excelling at multimodal tasks and Claude excelling at reasoning and writing.`,

  quantum: `### Introduction to Quantum Computing

Quantum computing is a multidisciplinary field that utilizes **quantum mechanics** to solve complex mathematical problems faster than classical computers.

#### Core Principles

* **Superposition**: Unlike classical bits (0 or 1), qubits can exist in a superposition of both states simultaneously.
* **Entanglement**: Qubits can be entangled so that the state of one instantly determines the state of another.
* **Interference**: Quantum algorithms use interference to amplify path options leading to correct answers while canceling incorrect ones.

Quantum computers excel at specialized tasks like molecular modeling, cryptanalysis, and optimization challenges.`,

  code: `Here is a clean React counter component written in TypeScript with Tailwind CSS styling:

\`\`\`tsx
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-bg-card rounded-xl border border-border-custom text-center max-w-sm mx-auto shadow-sm">
      <h2 className="text-lg font-bold text-txt-primary">Count: {count}</h2>
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-3 py-1 bg-border-custom hover:bg-bg-app rounded-lg text-xs transition"
        >
          Decrement
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-accent-custom text-white hover:opacity-90 rounded-lg text-xs transition"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
\`\`\`
`,

  general: `### Welcome to Aethera AI

Aethera is a minimalist, premium conversational AI interface. You can ask questions, write code, analyze concepts, or brainstorm creative ideas. 

Type your prompt in the input box below to start a thread.`
};

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json();
    const query = (prompt || "").toLowerCase();
    const apiKey = process.env.GEMINI_API_KEY;

    let queryKey = "general";
    if (query.includes("claude") || query.includes("gemini")) {
      queryKey = "claude";
    } else if (query.includes("quantum") || query.includes("qubit")) {
      queryKey = "quantum";
    } else if (query.includes("code") || query.includes("react") || query.includes("counter")) {
      queryKey = "code";
    }
    const responseText = ANSWERS[queryKey] || ANSWERS.general;

    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY") {
      let apiModel = "gemini-2.5-flash";
      try {
        if (model) {
          if (model.includes("3.5-flash") || model.includes("3.5")) {
            apiModel = "gemini-3.5-flash";
          } else if (model.includes("2.5-pro") || model.includes("pro")) {
            apiModel = "gemini-2.5-flash"; // Fallback to flash due to 0 limit on free tier pro keys
          } else if (model.includes("2.5-flash") || model.includes("2.5")) {
            apiModel = "gemini-2.5-flash";
          }
        }

        const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/${apiModel}:streamGenerateContent?key=${apiKey}`;

        const apiResponse = await fetch(apiURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }]
              }
            ],
            systemInstruction: {
              parts: [{ text: "You are Aethera, a premium AI chatbot. Provide clean, elegant responses. Use clean markdown formatting, tables, lists, and code blocks where appropriate." }]
            },
            generationConfig: {
              temperature: 0.5
            }
          })
        });

        if (!apiResponse.ok) {
          const errText = await apiResponse.text();
          throw new Error(`Gemini API error: ${errText}`);
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            const reader = apiResponse.body!.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
              const { value, done } = await reader.read();
              if (done) break;

              const rawChunk = decoder.decode(value, { stream: true });
              buffer += rawChunk;

              // Scan for complete JSON candidate chunks
              let braceCount = 0;
              let inString = false;
              let startIdx = -1;

              for (let i = 0; i < buffer.length; i++) {
                const char = buffer[i];

                if (char === "\\" && inString) {
                  i++;
                  continue;
                }

                if (char === '"') {
                  inString = !inString;
                }

                if (!inString) {
                  if (char === "{") {
                    if (braceCount === 0) {
                      startIdx = i;
                    }
                    braceCount++;
                  } else if (char === "}") {
                    braceCount--;
                    if (braceCount === 0 && startIdx !== -1) {
                      const jsonStr = buffer.substring(startIdx, i + 1);
                      try {
                        const parsed = JSON.parse(jsonStr);
                        const textSegment = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (textSegment) {
                          controller.enqueue(encoder.encode(textSegment));
                        }
                      } catch (e) {
                        // try again later
                      }
                      buffer = buffer.substring(i + 1);
                      i = -1;
                      startIdx = -1;
                    }
                  }
                }
              }
            }
            controller.close();
          }
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
          },
        });
      } catch (err: any) {
        console.error("Gemini stream error:", err);
        return new Response(`⚠️ **Gemini API Connection Error**

${err.message}

---
* **Requested Model:** \`${apiModel}\`
* **Troubleshooting:** This error usually means your API key has a **0 quota limit** for the requested model (common with new keys attempting to use \`Gemini 2.5 Pro\` on the free tier).
* **Fix:** Click the **Settings icon** (sliders icon) in the top-right navbar and change your **Primary Model** to **Gemini 2.5 Flash** (Recommended) or **Gemini 3.5 Flash**, then start a new thread.`, {
          status: 200, // Send as a 200 text response so the client streams it directly into the chat bubble!
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    }

    // Fallback Mock Stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = responseText.split(" ");
        let currentChunk = "";

        for (let i = 0; i < words.length; i++) {
          currentChunk += words[i] + " ";
          if (i % 3 === 0 || i === words.length - 1) {
            controller.enqueue(encoder.encode(currentChunk));
            currentChunk = "";
            await sleep(40);
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
