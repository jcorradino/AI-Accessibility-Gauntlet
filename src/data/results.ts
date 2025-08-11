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
    itemsScored: 25,
    pass: [
      { text: 'Carousel container uses role="region".' },
      { text: 'Carousel container has aria-roledescription="carousel".' },
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      {
        text: "Activating rotation, next, and previous controls does not move focus.",
      },
      { text: "Rotation, Previous, and Next controls are native buttons." },
      { text: "Rotation control label updates based on current state." },
      { text: "Rotation control does not use aria-pressed." },
      { text: "Picker controls are native buttons." },
      { text: "Each interactive element receives tab focus." },
      { text: "Text meets contrast requirements." },
      { text: "Non-text items meet contrast requirements." },
      { text: "Focus states are present." },
      { text: "There are no keyboard traps." },
    ],
    partial: [
      {
        text: 'Carousel has an accessible name via aria-label, but it includes the word "carousel".',
      },
      {
        text: "Auto-rotation behavior: does not stop on focus, but it does not resume unless the rotation control is activated.",
      },
    ],
    fail: [
      {
        text: "Not all control buttons fully follow the WAI-ARIA Button Pattern (some labels or decorative icons are not handled correctly).",
      },
      {
        text: "Rotation control is not the first item in the Tab order inside the carousel.",
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
      { text: "Picker button names do not match the slide names." },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
      {
        text: "Decorative SVG icons in controls are not explicitly hidden from assistive technology.",
      },
      {
        text: "Focus indicator contrast fails for the currently selected bullet and the play button.",
      },
    ],
    notScored: [
      "Tabs pattern for slide pickers (not applicable here).",
      "Optional aria-live wrapper for announcements.",
    ],
    points: 14, // 13 passes × 1 + 2 partial × 0.5 + 10 fails × 0
    percent: 56.0, // 14 / 25 × 100
  },
  "gpt-5-thinking": {
    itemsScored: 23,
    pass: [
      { text: 'Carousel container uses role="region".' },
      { text: 'Carousel container has aria-roledescription="carousel".' },
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      {
        text: "Activating rotation / next / previous controls does not move focus.",
      },
      {
        text: "Rotation, Previous, and Next controls are native buttons or follow the Button Pattern.",
      },
      { text: "Picker controls are native buttons." },
      { text: "Each interactive element receives tab focus." },
      { text: "Text meets contrast requirements." },
      { text: "Non-text items meet contrast requirements." },
      { text: "Play/Pause (rotation) label updates based on current state." },
      { text: "Rotation control does not use aria-pressed." },
      { text: "Focus states are present." },
    ],
    partial: [
      {
        text: 'Carousel has an accessible name via aria-label, but it includes the word "carousel".',
      },
      {
        text: "Auto-rotation behavior: does not stop on focus, but it does not resume unless the rotation control is activated.",
      },
    ],
    fail: [
      {
        text: "Rotation control is not the first item in the Tab order inside the carousel.",
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
      { text: "Picker button names do not match the slide names." },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
      {
        text: "Decorative SVG icons in controls are not explicitly hidden from assistive technology.",
      },
      {
        text: 'Live region is present but incorrectly set to aria-live="polite" while auto-rotating (should be "off").',
      },
    ],
    notScored: [
      "Tabs pattern for slide pickers (not applicable here).",
      "Focus indicators meet contrast (value not provided).",
      "There are no keyboard traps (value not provided).",
    ],
    points: 13, // 12 passes × 1 + 2 partial × 0.5 + 9 fails × 0
    percent: 56.5, // 13 / 23 × 100
  },
  "gpt-oss-120b": {
    itemsScored: 26,
    pass: [
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Rotation control label updates based on current state." },
      { text: "Rotation control does not use aria-pressed." },
      { text: "Picker controls are native buttons." },
      { text: "Each interactive element receives tab focus." },
      { text: "Non-text items meet color contrast." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "There are no keyboard traps." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
    ],
    partial: [
      {
        text: 'Carousel has an accessible name via aria-label, but it includes the word "carousel".',
      },
    ],
    fail: [
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: 'Carousel container is missing role="region" or role="group".' },
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: "Auto-rotation does not stop when any carousel element receives keyboard focus.",
      },
      {
        text: "Rotation control is not the first item in the Tab order inside the carousel.",
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
      { text: "Picker button names don’t match the slide names." },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
      {
        text: "Decorative SVG icons in buttons are not explicitly hidden from assistive technology.",
      },
      {
        text: "Text does not consistently meet contrast requirements due to overlap with imagery.",
      },
      {
        text: "Focus indicators do not meet contrast requirements for some controls.",
      },
    ],
    notScored: [
      "Optional aria-live/aria-atomic wrapper for announcements.",
      "Tabs pattern for slide pickers (not applicable here).",
    ],
    points: 11.5, // 12 passes × 1 + 1 partial × 0.5 + 13 fails × 0
    percent: 44.2, // 11.5 / 26 × 100
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
    itemsScored: 25,
    pass: [
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: "Carousel has an accessible name via aria-label." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      { text: "Each interactive element receives tab focus." },
      { text: "Non-text items meet color contrast requirements." },
      { text: "Play/Pause label updates based on current state." },
      { text: "Focus states are present." },
      { text: "Focus states meet contrast requirements." },
      { text: "There are no keyboard traps." },
      { text: "All control buttons follow the WAI-ARIA Button Pattern." },
      { text: "Rotation control does not use aria-pressed." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
    ],
    partial: [],
    fail: [
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: "Auto-rotation does not stop when any carousel element receives keyboard focus.",
      },
      {
        text: "Rotation control is not the first item in the Tab order inside the carousel.",
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
      { text: "Picker button names don’t match the slide names." },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
      {
        text: "Decorative SVG icons in controls are not explicitly hidden from assistive technology.",
      },
    ],
    notScored: [
      "Text meets contrast requirements: not applicable for this sample.",
      "Optional aria-live/aria-atomic wrapper for announcements.",
      "Tabs pattern for slide pickers (not applicable here).",
    ],
    points: 15, // 15 passes × 1 + 0 partial × 0.5 + 10 fails × 0
    percent: 60.0, // 15 / 25 × 100
  },
  "claude-4-opus": {
    itemsScored: 25,
    pass: [
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      { text: "Each interactive element receives tab focus." },
      { text: "Play/Pause label updates based on current state." },
      { text: "Rotation control does not use aria-pressed." },
      { text: "Focus states are present." },
      { text: "Focus indicators meet contrast." },
      { text: "There are no keyboard traps." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
      { text: "Carousel has an accessible name via aria-label." },
    ],
    partial: [],
    fail: [
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: 'Carousel container is missing role="region" or role="group".' },
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: "Auto-rotation does not stop when any carousel element receives keyboard focus.",
      },
      {
        text: "Rotation control is not the first item in the Tab order inside the carousel.",
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
      { text: "Picker button names don’t match the slide names." },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
      {
        text: "Decorative SVG icons in controls are not explicitly hidden from assistive technology.",
      },
      {
        text: "Non-text items do not consistently meet contrast requirements (carousel buttons fail at times).",
      },
    ],
    notScored: [
      "Text contrast: not applicable in this sample.",
      "Optional aria-live/aria-atomic wrapper for announcements.",
      "Tabs pattern for slide pickers (not applicable here).",
    ],
    points: 12, // 13 passes × 1 + 0 partial × 0.5 + 12 fails × 0
    percent: 48, // 12 / 25 × 100
  },
  "deepseek-v3": {
    itemsScored: 27,
    pass: [
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: "Carousel has an accessible name via aria-label." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      { text: "Each interactive element receives tab focus." },
      { text: "Play/Pause label updates based on current state." },
      { text: "Rotation control does not use aria-pressed." },
      { text: "Focus states are present." },
      { text: "Focus indicators meet contrast." },
      { text: "There are no keyboard traps." },
      { text: "All control buttons follow the WAI-ARIA Button Pattern." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
    ],
    partial: [],
    fail: [
      { text: "Focus order is implemented correctly" },
      { text: 'Carousel container is missing role="region" or role="group".' },
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: "Auto-rotation does not stop when any carousel element receives keyboard focus.",
      },
      {
        text: "Rotation control is not the first item in the Tab order inside the carousel.",
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
      { text: "Picker button names don’t match the slide names." },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
      {
        text: "Decorative SVG icons in controls are not explicitly hidden from assistive technology.",
      },
      {
        text: "Non-text items do not consistently meet contrast requirements.",
      },
    ],
    notScored: [
      "Text contrast: not applicable for this sample.",
      "Optional aria-live/aria-atomic wrapper for announcements.",
      "Tabs pattern for slide pickers (not applicable here).",
    ],
    points: 14, // 15 passes × 1 + 0 partial × 0.5 + 12 fails × 0
    percent: 51.9, // 14 / 27 × 100
  },
  "gemini-2-5-pro": {
    itemsScored: 24,
    pass: [
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: 'Carousel container has aria-roledescription="carousel".' },
      { text: "Carousel has an accessible name via aria-label." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      { text: "Each interactive element receives tab focus." },
      { text: "Play/Pause label updates based on current state." },
      { text: "Rotation control does not use aria-pressed." },
      { text: "Focus states are present." },
      { text: "Focus indicators meet contrast." },
      { text: "There are no keyboard traps." },
      {
        text: 'Each slide container has role="group" with aria-roledescription="slide".',
      },
      {
        text: "Each slide has its own accessible name on the slide container.",
      },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
    ],
    partial: [],
    fail: [
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      {
        text: "Auto-rotation does not stop when any carousel element receives keyboard focus.",
      },
      {
        text: "Rotation control is not the first item in the Tab order inside the carousel.",
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
      {
        text: "Decorative SVG icons in controls are not explicitly hidden from assistive technology.",
      },
      {
        text: "Non-text items do not consistently meet contrast requirements (bullet navigation fails at times).",
      },
    ],
    notScored: [
      "Text contrast: not applicable for this sample.",
      "Optional aria-live/aria-atomic wrapper for announcements.",
      "Tabs pattern for slide pickers (not applicable here).",
    ],
    points: 15,
    percent: 62, // 15 / 24 × 100
  },
  "grok-4": {
    itemsScored: 24,
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
      { text: "Each interactive element receives tab focus." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
      { text: "There are no keyboard traps." },
      { text: "All control buttons follow the WAI-ARIA Button Pattern." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
    ],
    partial: [
      {
        text: "Play/Pause label updates based on current state, but relies on a special character that may not be announced consistently by assistive technology.",
      },
    ],
    fail: [
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: "Auto-rotation does not stop when any carousel element receives keyboard focus.",
      },
      {
        text: "Rotation control is not the first item in the Tab order inside the carousel.",
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
      { text: "Picker button names don’t match the slide names." },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
      {
        text: "Non-text items do not meet contrast requirements (slide navigation bullets fail).",
      },
    ],
    notScored: [
      "Text contrast: not applicable in this sample.",
      "Optional aria-live/aria-atomic wrapper for announcements.",
      "Tabs pattern for slide pickers (not applicable here).",
      "Decorative SVG handling: not applicable as provided.",
    ],
    points: 13.5, // 13 passes × 1 + 1 partial × 0.5 + 10 fails × 0
    percent: 56.3, // 13.5 / 24 × 100
  },
  "qwen-3-coder": {
    itemsScored: 24,
    pass: [
      {
        text: "Rotation, Previous, and Next controls are native <button>s (follow the Button pattern).",
      },
      { text: "Activating Rotation/Next/Previous does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: "Carousel has an accessible name via aria-label." },
      {
        text: "Rotation control label updates to reflect action (Play/Pause).",
      },
      { text: "Rotation control does not use aria-pressed." },
      {
        text: 'Each slide container has role="group" with aria-roledescription="slide".',
      },
      { text: 'Each slide has its own accessible name ("n of total").' },
      { text: "Each interactive element receives tab focus." },
      { text: "There are no keyboard traps." },
      { text: "Picker controls are native <button>s." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast requirements." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
    ],
    partial: [],
    fail: [
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      {
        text: "Auto-rotation does not stop when any carousel element receives keyboard focus.",
      },
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: "Rotation control is not first in the Tab sequence inside the carousel (it follows the slides).",
      },
      {
        text: 'Picker buttons are not grouped in an element with role="group".',
      },
      {
        text: 'The picker group lacks an accessible label like aria-label="Choose slide to display".',
      },
      {
        text: 'Picker button names don’t match the slide names (e.g., "Go to slide 3" vs "3 of 5").',
      },
      {
        text: 'Currently visible slide’s picker button does not have aria-disabled="true".',
      },
      {
        text: "Non-text items do not consistently meet contrast requirements (arrows/dots can fail).",
      },
      {
        text: 'Decorative SVG icons are not explicitly hidden from assistive tech (missing aria-hidden="true").',
      },
    ],
    notScored: [
      "Text contrast.",
      "Tabs pattern for slide pickers (not applicable; grouped style used).",
      "Optional aria-live/aria-atomic wrapper.",
    ],
    points: 14,
    percent: 58.3,
  },
  "llama-3-3": {
    itemsScored: 23,
    pass: [
      { text: "Activating Previous/Next does not move focus." },
      { text: "Each interactive element receives tab focus." },
      { text: "Non-text items meet color contrast." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
      { text: "Prev/Next controls are native <button>s." },
      { text: "Picker controls are native <button>s." },
      { text: "There are no keyboard traps." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
    ],
    partial: [],
    fail: [
      { text: "Focus order is implemented correctly." },
      { text: "All control buttons follow the WAI-ARIA Button Pattern." },
      { text: "Play/Pause label updates based on current state." },
      {
        text: "SVGs/decorative graphics are properly hidden from assistive tech.",
      },
      { text: 'Carousel container uses role="region" or role="group".' },
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: 'Carousel has an accessible name via aria-* that does not include the word "carousel".',
      },
      {
        text: 'Each slide container has role="group" with aria-roledescription="slide".',
      },
      {
        text: "Each slide has its own accessible name on the slide container.",
      },
      { text: 'Picker buttons are grouped in an element with role="group".' },
      {
        text: 'The picker group has an accessible label like aria-label="Choose slide to display".',
      },
      { text: "Picker button names match the slide names." },
      {
        text: 'Currently visible slide’s picker button has aria-disabled="true".',
      },
      {
        text: "Auto-rotation stops when any carousel element receives keyboard focus.",
      },
    ],
    notScored: [
      "Rotation control is first in the Tab order inside the carousel.",
      "Tabs pattern for slide pickers (not applicable here).",
      "Optional aria-live/aria-atomic wrapper.",
    ],
    points: 9, // 9 passes × 1 + 0 partial × 0.5 + 14 fails × 0
    percent: 39.1, // 9 / 23 × 100
  },
};
