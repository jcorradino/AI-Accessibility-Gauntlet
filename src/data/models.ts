export type AccessibilityScore = number | "DNF" | null;

export type Model = {
  readonly name: string;
  readonly slug: string;
  readonly componentPath: `/src/components/carousels/${string}-carousel.jsx`;
  readonly note?: string;
  readonly score: AccessibilityScore;
};

export const models: readonly Model[] = [
  {
    name: "GPT-5",
    slug: "gpt-5",
    componentPath: "/src/components/carousels/gpt-5-carousel.jsx",
    score: 56.0,
    note: "Next-gen OpenAI flagship, strong baseline coder",
  },
  {
    name: "GPT-5 Thinking",
    slug: "gpt-5-thinking",
    componentPath: "/src/components/carousels/gpt-5-thinking-carousel.jsx",
    score: 56.5,
    note: "Next-gen reasoning variant, deliberate and analytical",
  },
  {
    name: "GPT OSS 120b",
    slug: "gpt-oss-120b",
    componentPath: "/src/components/carousels/gpt-oss-120b-carousel.jsx",
    score: 44.2,
    note: "Large open-weight model with strong code potential",
  },
  {
    name: "GPT OSS 20b",
    slug: "gpt-oss-20b",
    componentPath: "/src/components/carousels/gpt-oss-20b-carousel.jsx",
    score: "DNF",
    note: "Meta's 70B open model, solid code-capable generalist",
  },
  {
    name: "Claude Sonnet 4",
    slug: "claude-sonnet-4",
    componentPath: "/src/components/carousels/claude-sonnet-4-carousel.jsx",
    score: 60,
    note: "Anthropic's balanced high-quality generalist, reliable for code",
  },
  {
    name: "Claude 4 Opus",
    slug: "claude-4-opus",
    componentPath: "/src/components/carousels/claude-4-opus-carousel.jsx",
    score: 48,
    note: "Anthropic's top-tier model, meticulous on structure and code",
  },
  {
    name: "DeepSeek V3",
    slug: "deepseek-v3",
    componentPath: "/src/components/carousels/deepseek-v3-carousel.jsx",
    score: 51.9,
    note: "Fast reasoning generalist from DeepSeek, strong open baseline",
  },
  {
    name: "Gemini 2.5 Pro",
    slug: "gemini-2-5-pro",
    componentPath: "/src/components/carousels/gemini-2-5-pro-carousel.jsx",
    score: 62,
    note: "Google's long-context generalist with solid frontend output",
  },
  {
    name: "Grok 4",
    slug: "grok-4",
    componentPath: "/src/components/carousels/grok-4-carousel.jsx",
    score: 56.3,
    note: "xAI's high-reasoning model",
  },
  {
    name: "Qwen3 Coder",
    slug: "qwen-3-coder",
    componentPath: "/src/components/carousels/qwen-3-coder-carousel.jsx",
    score: 58.3,
    note: "Alibaba's Qwen 3 coder variant, competitive open weight",
  },
  {
    name: "Llama 3.3 70b",
    slug: "llama-3-3",
    componentPath: "/src/components/carousels/llama-3-3-carousel.jsx",
    score: 39.1,
    note: "Meta's 70B open model, solid code-capable generalist",
  },
];
