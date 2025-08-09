import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

import { slides } from "./data/slides";
import { AuditResultsPanel } from "./components/AuditResultsPanel";
import { resultsByModel } from "./data/results";

type ExpectationScore = number | null;

type Model = {
  name: string;
  slug: string;
  componentPath: string;
  note?: string;
  expectation: ExpectationScore;
};

const models: Model[] = [
  {
    name: "GPT-5",
    slug: "gpt-5",
    componentPath: "@/components/gpt-5-carousel.jsx",
    expectation: 57.9,
    note: "Next-generation flagship from OpenAI",
  },
  {
    name: "GPT-5 Thinking",
    slug: "gpt-5-thinking",
    componentPath: "@/components/gpt-5-thinking-carousel.jsx",
    expectation: 61.9,
    note: "Next-generation flagship Reasoning Model from OpenAI",
  },
  {
    name: "Claude Sonnet 4",
    slug: "claude-sonnet-4",
    componentPath: "@/components/claude-sonnet-carousel.jsx",
    expectation: 61.1,
    note: "Anthropic's flagship model",
  },
  {
    name: "Claude 4 Opus",
    slug: "claude-4-opus",
    componentPath: "@/components/claude-4-opus-carousel.jsx",
    expectation: null,
    note: "Anthropic's meticulous flagship coder",
  },
  {
    name: "DeepSeek V3",
    slug: "deepseek-v3",
    componentPath: "@/components/deepseek-v3-carousel.jsx",
    expectation: 52.5,
    note: "Latest update to DeepSeek's chat model",
  },
  {
    name: "Gemini 2.5 Pro",
    slug: "gemini-2-5-pro",
    componentPath: "@/components/gemini-2-5-pro-carousel.jsx",
    expectation: 60.5,
    note: "Google's newest experimental model",
  },
  {
    name: "Grok 4",
    slug: "grok-4",
    componentPath: "@/components/grok-4-carousel.jsx",
    expectation: null,
    note: "xAI's latest and greatest model",
  },
  {
    name: "Qwen3 Coder",
    slug: "qwen-3-coder",
    componentPath: "@/components/qwen-3-coder-carousel.jsx",
    expectation: null,
    note: "Alibaba's largest open-weight model, competitive with o3 and Kimi K2",
  },
  {
    name: "Llama 3.3 70b",
    slug: "llama-3-3",
    componentPath: "@/components/llama-3-3-carousel.jsx",
    expectation: null,
    note: "Meta's OSS model, generalist but solid for code",
  },
];

function statusBadge(score: ExpectationScore) {
  // Buckets: tweak thresholds to taste
  // 0–39: likely-broken, 40–69: decent-ish, 70–100: expected ok
  let label = "unknown";
  let cls = "bg-slate-600 text-white";
  if (typeof score === "number") {
    const pct = `${score.toFixed(1)}%`;
    if (score >= 70) {
      label = `expected ok (${pct})`;
      cls = "bg-emerald-600 text-white";
    } else if (score >= 40) {
      label = `borderline (${pct})`;
      cls = "bg-amber-600 text-white";
    } else {
      label = `expect breakage (${pct})`;
      cls = "bg-rose-600 text-white";
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}
      aria-label={`Accessibility expectation: ${label}`}
      title={label}
    >
      {label}
    </span>
  );
}

export default function App() {
  return (
    <Router>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-white focus:text-black"
      >
        Skip to main content
      </a>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/models/:slug" element={<ModelPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const promptText = `Build a React carousel component in ONE file, plain JSX, styled with Tailwind. No external UI libraries.

Data:

Slides come in as an array of objects:
  type Slide = { image: string; description: string };

Example:
const slides = [
  { 
    image: "https://images.unsplash.com/photo-1754206352604-0a4f13ca2a22", 
    description: "A serene, green valley is surrounded by trees." 
  },
  { 
    image: "https://images.unsplash.com/photo-1566154247258-466b02048738", 
    description: "Manhattan skyline at dusk" 
  },
  { 
    image: "https://images.unsplash.com/photo-1735736617534-533cf25e3770", 
    description: "Market outside of Sensō-ji temple" 
  },
  { 
    image: "https://images.unsplash.com/photo-1749729163012-a9f552b8c3fe", 
    description: "View of Český Krumlov, Czech Republic" 
  },
  { 
    image: "https://images.unsplash.com/photo-1751795195789-8dab6693475d", 
    description: "View of Phare de Kermorvan - Le Conquet, France" 
  },
];

Deliverable
- A single file named "__FILE_NAME__".
- Default export a React component function named "__COMPONENT_NAME__".

Component API
export default function __COMPONENT_NAME__(props) {
  // props.slides: Slide[]
  // props.ariaLabel?: string
  // props.loop?: boolean               // default true
  // props.autoPlay?: boolean           // default false
  // props.interval?: number            // ms, default 5000, clamp to >= 2000
  // props.initialIndex?: number        // default 0
  // props.showDots?: boolean           // default true
  // props.showPlayPause?: boolean      // default true
  // props.className?: string
  // props.onIndexChange?: (i:number)=>void
}

Requirements
- Render slides horizontally in a track that translates by -index * 100%.
- Each slide uses <img src={slide.image} alt={slide.description} className="block w-full h-auto" />.
- Provide Previous and Next buttons.
- Provide dot navigation below the viewport.
- Optional autoplay when autoPlay=true, with a timer using the interval in ms. Pause on user interaction.
- Support basic swipe or drag on touch or pointer devices with a simple threshold.
- If loop=false, disable Prev on the first slide and Next on the last slide.
- Call onIndexChange when the index changes.
- Keep the DOM simple. No portals. No global listeners.
- Use Tailwind utility classes for layout and visuals.
- Render a small placeholder if slides is empty.

Notes
- Do not include build config or package.json. Only the component file.
- Return only the code for the file.
`;
  return (
    <main
      id="main"
      className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100"
    >
      <header className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-3">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black"
            aria-hidden="true"
          >
            AI
          </span>
          One-Shot Accessibility Challange
        </h1>
        <h3 className="text-xl sm:text-xl font-semibold tracking-tight flex items-center gap-3">
          Single prompt in, raw component out.
        </h3>
      </header>

      <section
        aria-labelledby="purpose-heading"
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-2"
      >
        <h2 id="purpose-heading" className="sr-only">
          Purpose
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-gray-700 dark:text-gray-300">
          This page sends one prompt to a chosen model, drops the returned code
          into a React wrapper, and runs it with the same slides. No edits. No
          fixes. The goal is to see what a typical dev request produces and how
          accessible it is.
        </p>

        <p className="mt-2 max-w-2xl text-sm text-gray-700 dark:text-gray-300">
          Each result is reviewed against the{" "}
          <a
            href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"
            target="_blank"
            className="text-sky-600 underline underline-offset-1"
          >
            WAI-ARIA Authoring Practices carousel pattern
          </a>{" "}
          and a small set of practical checks. Passes, partials, and fails are
          scored to show how close the raw output gets to "accessible" without
          any hand tuning.
        </p>

        <div className="mt-4 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white dark:bg-slate-950 p-5">
          <h3 className="text-sm font-semibold">What this tests</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              Container semantics: <code>role="region"</code>,{" "}
              <code>aria-roledescription="carousel"</code>, and a label that
              does not include the word “carousel”
            </li>
            <li>
              Slide semantics: each slide as a <code>role="group"</code> with{" "}
              <code>aria-roledescription="slide"</code> and a name like “n of m”
              or a meaningful title
            </li>
            <li>
              Controls: Previous, Next, and rotation toggle are real{" "}
              <code>&lt;button&gt;</code> elements with clear names
            </li>
            <li>
              Slide pickers: grouped and labeled, picker names match slide
              names, current picker exposed (often with{" "}
              <code>aria-disabled="true"</code>)
            </li>
            <li>
              Keyboard and focus: Tab and Shift+Tab flow, arrow keys if
              implemented, rotation control early in the tab order, no traps,
              focus order matches the visual layout
            </li>
            <li>
              Rotation behavior: if autoplay exists, it can be stopped and
              restarted, stops on focus and hover, and respects reduced motion
            </li>
            <li>
              Announcements: polite live updates when present without chattiness
            </li>
            <li>
              Contrast: focus indicators and non-text indicators like dots
              against varying images
            </li>
          </ul>

          <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">WCAG touched here:</span> 1.3.1 Info
            and Relationships, 4.1.2 Name Role Value, 2.1.1 Keyboard, 2.2.2
            Pause Stop Hide (if autoplay), 1.4.3 Contrast, 1.4.11 Non-text
            Contrast, 2.4.3 Focus Order.
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16"
        aria-labelledby="toc-heading"
      >
        <h3 className="text-xl sm:text-xl font-semibold tracking-tight flex items-center gap-3 mb-3">
          Model Tests
        </h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <li key={m.slug} className="list-none">
              <Card className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow h-full">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {m.name}
                    </h3>
                    {statusBadge(m.expectation)}
                  </div>
                  {m.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {m.note}
                    </p>
                  )}
                  <div className="mt-2">
                    <Link
                      to={`/models/${m.slug}`}
                      className="inline-flex items-center justify-between w-full rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      aria-label={`Open ${m.name} workspace`}
                    >
                      Open workspace
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl mt-5 border border-gray-200/70 dark:border-gray-800/70 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between gap-3 p-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Standardized Prompt
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                This is the same prompt sent to each model above. Only the{" "}
                <code className="rounded bg-gray-100 dark:bg-slate-800 px-1 py-0.5">
                  {"{"}model{"}"}-carousel.jsx
                </code>{" "}
                component and{" "}
                <code className="rounded bg-gray-100 dark:bg-slate-800 px-1 py-0.5">
                  {"{"}model{"}"}Carousel
                </code>{" "}
                function changes.
              </p>
            </div>
          </div>

          <div className="p-5 pt-0">
            <div className="relative">
              <pre className="whitespace-pre-wrap break-words rounded-xl border bg-transparent p-4 font-mono text-xs leading-relaxed tracking-tight">
                {promptText}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const carouselModules = import.meta.glob("/src/components/*-carousel.jsx");

function ModelPage() {
  const { slug } = useParams();
  const model = models.find((m) => m.slug === slug);
  if (!model) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">
          Model not found
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          The requested model "{slug}" was not found.
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const key = `/src/components/${model.slug}-carousel.jsx`;
  const loader = carouselModules[key];

  if (!loader) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">
          Component not found
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          I couldn’t find a carousel for “{model.name}” at {key}.
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const LazyCarousel = lazy(async () => {
    const m: any = await loader();
    return {
      default:
        m.default ??
        m.Gpt5Carousel ??
        m.DeepseekV3Carousel ??
        m.Llama31Carousel ??
        m.MistralLargeCarousel ??
        m.Claude37Carousel ??
        m.Gemini20Carousel ??
        m.Oss120bCarousel,
    };
  });

  const results = resultsByModel[model.slug];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        {model.name} Workspace
      </h1>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        This is the dedicated workspace for <strong>{model.name}</strong>. Below
        is its carousel output.
      </p>
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Loading {model.name} carousel…
            </div>
          }
        >
          <LazyCarousel
            slides={slides}
            ariaLabel={`${model.name} image carousel`}
            autoPlay={false}
            loop
            showDots
            showPlayPause
            initialIndex={0}
            interval={5000}
            onIndexChange={(i: number) => console.log("slide", i)}
          />
        </Suspense>
        {results && <AuditResultsPanel results={results} />}
      </div>
      <Link to="/" className="mt-8 inline-block text-blue-600 hover:underline">
        Back to all models
      </Link>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        That route does not exist.
      </p>
      <Link to="/" className="text-blue-600 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
