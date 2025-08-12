import { LazyExoticComponent, ComponentType, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import { slides, CarouselProps } from "@/data/carousel";
import { models } from "@/data/models";
import { promptText, accessiblePromptText } from "@/data/promptText";

import { AuditResultsPanel } from "@/components/AuditResultsPanel";
import { resultsByModel } from "@/data/results";
import { ModelCard } from "@/components/ModelCard";

// Build a mapping of all carousel component files so we can load them dynamically when needed.
const carouselModules = import.meta.glob(
  "/src/components/carousels/*-carousel.jsx"
);

// Given a specific carousel component file path, return a lazy-loaded React component on-demand
function makeLazyCarousel(
  componentPath: `/src/components/carousels/${string}-carousel.jsx`
): LazyExoticComponent<ComponentType<CarouselProps>> {
  const loader = carouselModules[componentPath];
  return lazy(async () => {
    if (!loader) {
      return {
        default: () => <div className="text-sm">Component not found.</div>,
      };
    }

    // Dynamically import the module.
    const mod: any = await loader();
    const comp =
      mod.default ?? Object.values(mod).find((v) => typeof v === "function");

    return {
      default: comp ?? (() => <div className="text-sm">No export found.</div>),
    };
  });
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
  const inaccessibleModels = models.filter(
    (m) => m.promptType === "inaccessible"
  );
  const accessibleModels = models.filter((m) => m.promptType === "accessible");

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
          One-Shot Accessibility Challenge
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

        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          This page sends one prompt to a chosen model, drops the returned code
          into a React wrapper, and runs it with the same slides. No edits. No
          fixes. The goal is to see what a typical dev request produces and how
          accessible it is.
        </p>

        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Each result is reviewed against the{" "}
          <a
            href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 underline underline-offset-1"
          >
            ARIA Authoring Practices Guide carousel pattern
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
          Standard Prompt Model Tests
        </h3>
        <p className="mt-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
          These models were given a single coding prompt {"(displayed below)"}{" "}
          with no additional guidance on accessibility. The goal is to see what
          a "typical" request produces without nudging for accessible
          implementation.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inaccessibleModels.map((m) => (
            <ModelCard key={m.slug} m={m} />
          ))}
        </ul>
      </section>

      <section
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16"
        aria-labelledby="toc-heading"
      >
        <h3 className="text-xl sm:text-xl font-semibold tracking-tight flex items-center gap-3 mb-3">
          "Accessible" Prompt Model Tests
        </h3>
        <p className="mt-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
          These models received the same coding prompt but with one small
          change: the words <strong>"Make this accessible"</strong> were added.
          This tests whether a minimal accessibility instruction significantly
          improves results.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accessibleModels.map((m) => (
            <ModelCard key={m.slug} m={m} />
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="prompts-heading"
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16"
      >
        <h3 id="prompts-heading" className="text-xl font-semibold mb-3">
          Standardized Prompts
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Below are the exact prompts sent to the models. The only difference in
          the “Accessible” version is an explicit instruction to meet WCAG 2.2
          Level AA guidelines.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200/70 dark:border-gray-800/70">
              <h4 className="text-lg font-semibold tracking-tight">
                Standard Prompt
              </h4>
            </div>
            <div className="p-5">
              <pre className="whitespace-pre-wrap break-words rounded-xl border bg-transparent p-4 font-mono text-xs leading-relaxed tracking-tight">
                {promptText}
              </pre>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200/70 dark:border-gray-800/70">
              <h4 className="text-lg font-semibold tracking-tight">
                Accessible Prompt
              </h4>
            </div>
            <div className="p-5">
              <pre className="whitespace-pre-wrap break-words rounded-xl border bg-transparent p-4 font-mono text-xs leading-relaxed tracking-tight">
                {accessiblePromptText}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ModelPage() {
  const { slug } = useParams();
  const model = models.find((m) => m.slug === slug);

  if (!model) {
    return (
      <SimplePage title="Model not found">
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          The requested model “{slug}” was not found.
        </p>
        <BackHome />
      </SimplePage>
    );
  }

  const LazyCarousel = makeLazyCarousel(model.componentPath);
  const results = resultsByModel[model.slug];

  return (
    <SimplePage title={`Carousel Attempt - Model ${model.name}`}>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Standard prompt was run through <strong>{model.name}</strong>. Below is
        the output.
      </p>

      <div className="mt-6">
        <Suspense
          // While the carousel component is being lazy-loaded, show a text fallback.
          fallback={
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Loading {model.name} carousel…
            </div>
          }
        >
          <LazyCarousel
            slides={slides}
            ariaLabel={`${model.name} image carousel`}
            autoPlay={true}
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

      <BackHome />
    </SimplePage>
  );
}

function NotFound() {
  return (
    <SimplePage title="Not found">
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        That route does not exist.
      </p>
      <BackHome />
    </SimplePage>
  );
}

function SimplePage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {children}
    </div>
  );
}

function BackHome() {
  return (
    <Link to="/" className="mt-8 inline-block text-blue-600 hover:underline">
      Back to all models
    </Link>
  );
}
