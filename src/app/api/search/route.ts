import { NextRequest, NextResponse } from "next/server";

const MOCK_WEB_RESULTS: Record<string, any[]> = {
  general: [
    { title: "Next-gen AI Architectures", url: "https://deepmind.google", snippet: "Google Gemini's latest multimodal models process text, video, audio, and code natively.", domain: "deepmind.google" },
    { title: "Framer Motion Documentation", url: "https://framer.com/motion", snippet: "Framer Motion is a simple yet powerful motion library for React apps.", domain: "framer.com" },
    { title: "Tailwind CSS v4 updates", url: "https://tailwindcss.com", snippet: "Tailwind CSS v4 introduces high-performance rust engine and custom theme setups.", domain: "tailwindcss.com" }
  ],
  claude: [
    { title: "Anthropic Claude 3.5 Sonnet", url: "https://anthropic.com/claude", snippet: "Claude 3.5 Sonnet sets industry standards for reasoning and coding speed.", domain: "anthropic.com" },
    { title: "Gemini 1.5 Pro contexts", url: "https://google.com/gemini", snippet: "Gemini 1.5 Pro features a huge 2 million token context window.", domain: "google.com" }
  ],
  quantum: [
    { title: "Quantum Entanglement", url: "https://wikipedia.org/wiki/Quantum_entanglement", snippet: "Quantum entanglement is a physical phenomenon where pairs of particles interact.", domain: "wikipedia.org" },
    { title: "KaTeX Math Rendering", url: "https://katex.org", snippet: "KaTeX is the fastest math typesetting library for the web.", domain: "katex.org" }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").toLowerCase();

    let key = "general";
    if (query.includes("claude") || query.includes("gemini")) {
      key = "claude";
    } else if (query.includes("quantum") || query.includes("math")) {
      key = "quantum";
    }

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({
      results: MOCK_WEB_RESULTS[key] || MOCK_WEB_RESULTS.general,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
