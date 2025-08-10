export type AuditItem = { id?: string; text: string };

export type AuditResults = {
  itemsScored: number;
  pass: AuditItem[];
  partial: AuditItem[];
  fail: AuditItem[];
  notScored?: string[];
  points: number;
  percent: number;
};

export const resultsByModel: Record<string, AuditResults> = {
  "gpt-5": {
    itemsScored: 19,
    pass: [
      { text: "Focus order is implemented correctly" },
      { text: "Tab and Shift+Tab move through interactive elements" },
      {
        text: "Button elements act like buttons and activation doesn’t steal focus",
      },
      { text: 'Container uses role="region"' },
      { text: 'Container has aria-roledescription="carousel"' },
      { text: "Rotation/prev/next are native <button>" },
      {
        text: "Rotation control label updates to reflect current state and doesn’t use aria-pressed",
      },
      { text: "Slide picker controls are native <button>" },
      { text: "All items meet color contrast" },
      { text: "All interactive elements have a visible focus indicator" },
    ],
    partial: [
      {
        text: 'Container label: accessible name via aria-label, but includes “carousel” while aria-roledescription="carousel" is present',
      },
      {
        text: "Focus indicator contrast: all good except the Play/Pause button",
      },
    ],
    fail: [
      {
        text: "Rotation control is not first in the tab order inside the carousel",
      },
      {
        text: 'Each slide container lacks role="group" with aria-roledescription="slide"',
      },
      {
        text: "Each slide lacks its own accessible name via aria-labelledby or aria-label (“Slide 1 of 5” not associated)",
      },
      {
        text: 'Slide picker buttons are not grouped in an element with role="group"',
      },
      {
        text: "The picker group lacks an aria-label like “Choose slide to display”",
      },
      {
        text: "Picker button names don’t match their slide names (“Go to slide N”, not image descriptions)",
      },
      {
        text: 'Current-slide picker button is not marked with aria-disabled="true"',
      },
    ],
    notScored: [
      "Auto-rotate stop-on-focus and resume-only-via-control (no auto-rotate)",
      "Tabs pattern for slide pickers (not using tabs)",
      "Optional live region settings",
    ],
    points: 11,
    percent: 57.9,
  },
  "gpt-5-thinking": {
    itemsScored: 21,
    pass: [
      { text: "Focus order is implemented correctly" },
      { text: "Tab and Shift+Tab move through the interactive elements." },
      {
        text: "Button elements behave as buttons and activation doesn’t steal focus.",
      },
      { text: 'Carousel container uses role="region".' },
      { text: 'Container has aria-roledescription="carousel".' },
      { text: "Container has an accessible name (via aria-label)." },
      { text: "Rotation, previous, next are native <button>." },
      {
        text: "Rotation control label updates to reflect current action (Play/Stop).",
      },
      { text: 'Slide track uses aria-live="polite" while not auto-rotating.' },
      { text: "Picker controls are native <button>." },
      { text: "All items meet color contrast." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
    ],
    partial: [],
    fail: [
      {
        text: "Rotation control is not first in the tab order inside the carousel.",
      },
      {
        text: 'Container label includes the word “carousel” even though aria-roledescription="carousel" is present.',
      },
      {
        text: 'Each slide container lacks role="group" with aria-roledescription="slide".',
      },
      {
        text: "Each slide lacks its own accessible name on the slide container (aria-labelledby or aria-label).",
      },
      {
        text: 'Picker buttons are not grouped in an element with role="group".',
      },
      {
        text: "The picker group lacks an aria-label like “Choose slide to display”.",
      },
      {
        text: "Picker button names don’t match the slide names (they’re “Go to slide N” instead of the slide’s name).",
      },
      { text: 'Current picker is not marked with aria-disabled="true".' },
    ],
    points: 13, // 12 passes × 1 + 0 partials × 0.5 + 8 fails × 0
    percent: 61.9, // 12 / 20 × 100
  },
  "gpt-oss-20b": {
    itemsScored: 21,
    pass: [
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: "No keyboard traps detected." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
      { text: "All items meet color contrast." },
    ],
    partial: [
      {
        text: "Carousel has an accessible name via aria-label, but it is not descriptive (label is just 'carousel').",
      },
      {
        text: "Auto-rotate stops on interaction and resumes only via the rotation control, but does not pause when any element receives focus.",
      },
    ],
    fail: [
      {
        text: "Rotation control is not first in the tab order inside the carousel.",
      },
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: "Rotation control lacks an accessible name that describes the action.",
      },
      {
        text: "Rotation control label does not change with state (e.g., Start/Stop slide rotation).",
      },
      {
        text: 'Each slide container does not have role="group" with aria-roledescription="slide".',
      },
      {
        text: "Each slide lacks its own accessible name on the slide container.",
      },
      {
        text: 'Picker buttons are not grouped in an element with role="group".',
      },
      {
        text: 'The picker group lacks an accessible label like aria-label="Choose slide to display".',
      },
      { text: "Picker controls are not native buttons." },
      { text: "Picker button names don't match the slide names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
      },
      { text: "No live region behavior to announce slide changes." },
    ],
    notScored: ["Tabs pattern for slide pickers (not applicable here)."],
    points: 9, // 8 passes × 1 + 2 partial × 0.5 + 12 fails × 0
    percent: 42.9, // 9 / 21 × 100
  },
  "claude-sonnet-4": {
    itemsScored: 18,
    pass: [
      { text: "Focus order is implemented correctly" },
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: "Carousel has an accessible name via aria-label." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      { text: "All items meet color contrast." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
    ],
    partial: [],
    fail: [
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: 'Each slide container does not have role="group" with aria-roledescription="slide".',
      },
      {
        text: "Each slide lacks its own accessible name on the slide container.",
      },
      {
        text: 'Picker buttons are not grouped in an element with role="group".',
      },
      {
        text: 'The picker group lacks an accessible label like aria-label="Choose slide to display".',
      },
      { text: "Picker button names don’t match the slide names." },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
    ],
    notScored: [
      "Auto-rotate items, rotation control order/label.",
      "Tabs pattern for slide pickers.",
      "Optional aria-live wrapper.",
    ],
    points: 11, // 10 passes × 1 + 0 partial × 0.5 + 7 fails × 0
    percent: 51.1, // 10 / 17 × 100
  },
  "deepseek-v3": {
    itemsScored: 20,
    pass: [
      { text: "Tab and Shift+Tab move through interactive elements in order." },
      { text: "Button elements behave like real buttons." },
      { text: "Controls are native <button>s." },
      { text: "Rotation control label updates correctly between Play/Pause." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
      { text: "Container has an accessible name (aria-label present)." },
      { text: "Slide picker controls are native <button>s." },
      {
        text: "No auto-rotate present, so focus-on-rotation-stop requirement is met.",
      },
      {
        text: "Prev/Next/Play-Pause keep focus on the control when activated.",
      },
    ],
    partial: [
      {
        text: "Non-text contrast for the dots: may miss on some images depending on background (1.4.11).",
      },
    ],
    fail: [
      { text: 'Carousel container lacks role="region" or role="group".' },
      { text: 'Carousel container lacks aria-roledescription="carousel".' },
      {
        text: "Rotation control is not first in the tab order inside the carousel.",
      },
      {
        text: 'Each slide container lacks role="group" with aria-roledescription="slide".',
      },
      { text: "Slides do not have accessible names." },
      {
        text: 'Picker controls are not contained in an element with role="group".',
      },
      {
        text: 'Picker group lacks an accessible label like aria-label="Choose slide to display".',
      },
      { text: "Picker button names do not match the slide names." },
      {
        text: 'Currently visible slide’s picker button is not marked aria-disabled="true".',
      },
      { text: "Play/pause SVG icon is not hidden from AT." },
      { text: "Focus order does not match visual presentation (WCAG 2.4.3)." },
    ],
    notScored: ["Tabs pattern for slide pickers (not used)."],
    points: 10.5, // 10 passes × 1 + 1 partial × 0.5
    percent: 52.5, // (10.5 / 20) × 100
  },
  "gemini-2-5-pro": {
    itemsScored: 19,
    pass: [
      { text: "Tab and Shift+Tab move through interactive elements." },
      { text: "Button elements behave per the button pattern." },
      { text: "Prev/Next/Play controls are native <button>s." },
      { text: 'Carousel container uses role="region".' },
      { text: 'Container has aria-roledescription="carousel".' },
      {
        text: "Container has an accessible label via aria-label (labeling mechanism is correct).",
      },
      {
        text: 'Each slide container uses role="group" with aria-roledescription="slide".',
      },
      { text: 'Each slide has an accessible name (aria-label="n of 5").' },
      { text: "Slide picker controls are native <button>s." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
    ],
    partial: [
      {
        text: "Non-text contrast for the dots can fail depending on the image behind them (1.4.11).",
      },
    ],
    fail: [
      {
        text: "Rotation control is not first in the tab order inside the carousel.",
      },
      {
        text: 'The container’s accessible label includes the word “carousel” even though aria-roledescription="carousel" is present. The pattern says the label should not include that word.',
      },
      {
        text: 'Picker controls are not contained in an element with role="group".',
      },
      {
        text: 'The picker group lacks an accessible label like aria-label="Choose slide to display".',
      },
      {
        text: "Picker button names do not match the slide names (e.g., “Go to slide 3” vs “3 of 5”).",
      },
      {
        text: 'The currently displayed slide’s picker button is not aria-disabled="true" (pattern prefers aria-disabled so it remains in the tab order).',
      },
      {
        text: "Focus order does not match the visual presentation (WCAG 2.4.3).",
      },
    ],
    notScored: [
      "Tabs pattern for slide pickers (not used).",
      "Auto-rotate stop/resume behavior and rotation-control label change, since autoplay is non-functional here.",
      "Optional live region settings.",
    ],
    points: 11.5, // 11 passes × 1 + 1 partial × 0.5
    percent: 60.5, // (11.5 / 19) × 100
  },
};
