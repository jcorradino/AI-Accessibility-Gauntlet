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
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
    points: 14,
    percent: 56.0,
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
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
    points: 13,
    percent: 56.5,
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
      { text: "Picker button names don't match the slide names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
    points: 11.5,
    percent: 44.2,
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
    points: 9,
    percent: 42.9,
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
      { text: "Picker button names don't match the slide names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
    points: 15,
    percent: 60.0,
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
      { text: "Picker button names don't match the slide names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
    points: 12,
    percent: 48,
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
      { text: "Picker button names don't match the slide names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
    points: 14,
    percent: 51.9,
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
      { text: "Picker button names don't match the slide names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
    percent: 62,
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
      { text: "Picker button names don't match the slide names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
    points: 13.5,
    percent: 56.3,
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
        text: 'Picker button names don\'t match the slide names (e.g., "Go to slide 3" vs "3 of 5").',
      },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
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
        text: 'Currently visible slide\'s picker button has aria-disabled="true".',
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
    points: 9,
    percent: 39.1,
  },
  "gpt-5-accessible": {
    itemsScored: 25,
    pass: [
      {
        text: "Auto-rotation stops when any carousel element receives keyboard focus.",
      },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Buttons are native <button>s and follow the Button Pattern." },
      {
        text: "Activating rotation / next / previous controls does not move focus.",
      },
      { text: "Each interactive element receives tab focus." },
      { text: "Non-text items meet contrast requirements." },
      { text: "Play/Pause label updates based on current state." },
      { text: "Decorative graphics and SVGs are properly hidden from AT." },
      { text: "Focus states are present." },
      { text: "Focus indicators meet contrast." },
      { text: "There are no keyboard traps." },
      { text: 'Carousel container uses role="region".' },
      { text: 'Carousel container has aria-roledescription="carousel".' },
      { text: "Rotation, Previous, and Next controls are native buttons." },
      {
        text: 'Each slide container has role="group" with aria-roledescription="slide".',
      },
      { text: 'Each slide has an accessible name (e.g., "Slide n of total").' },
      { text: "Picker controls are native buttons." },
      { text: 'Picker controls are grouped in an element with role="group".' },
      {
        text: 'The picker group has an accessible label (e.g., "Slide navigation").',
      },
    ],
    partial: [
      {
        text: 'Live region present (sr-only) but configuration is mixed: aria-live="polite" is fine when not rotating, though aria-atomic should be false; behavior during rotation is not confirmed.',
      },
    ],
    fail: [
      {
        text: "Rotation control uses aria-pressed (should rely on changing label instead of a pressed state).",
      },
      {
        text: "Rotation control is not the first item in the Tab sequence inside the carousel.",
      },
      { text: "Picker button names do not match the slide accessible names." },
      {
        text: 'Current slide\'s picker button is not marked aria-disabled="true".',
      },
    ],
    notScored: [
      "Text contrast (marked N/A).",
      "Tabs pattern for slide pickers (not applicable here).",
    ],
    points: 20.5,
    percent: 82,
  },
  "gpt-5-thinking-accessible": {
    itemsScored: 25,
    pass: [
      { text: "Auto-rotation stops when any carousel element receives focus." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Activating rotation/Next/Previous does not move focus." },
      { text: "Each interactive element receives tab focus." },
      { text: "There are no keyboard traps." },
      { text: "Text meets contrast requirements." },
      { text: "Non-text items meet contrast requirements." },
      { text: "Focus states are present." },
      { text: "Focus indicators meet contrast." },
      { text: "Decorative graphics are properly hidden from assistive tech." },
      { text: 'Carousel container uses role="region".' },
      { text: 'Carousel container has aria-roledescription="carousel".' },
      { text: "Carousel has an accessible name via aria-label." },
      { text: "Rotation control label updates based on current state." },
      {
        text: 'Each slide container uses role="group" with aria-roledescription="slide".',
      },
      { text: "Each slide has an accessible name." },
      { text: "Picker controls are native buttons." },
      { text: "Prev/Next controls are native buttons." },
    ],
    partial: [
      {
        text: "Slide picker controls use tab roles/states but likely do not implement a single Tab stop (no roving tabindex).",
      },
    ],
    fail: [
      {
        text: "Rotation control is not first in the tab order inside the carousel.",
      },
      { text: "Rotation control uses aria-pressed; pattern says not to." },
      {
        text: "Prev/Next controls are inside an aria-hidden ancestor so they are invisible to assistive technologies.",
      },
      {
        text: 'Each slide\'s accessible name contains the word "Slide" despite aria-roledescription="slide".',
      },
      {
        text: "Slide picker controls are not a single Tab stop per the Tabs Pattern.",
      },
    ],
    notScored: [
      "Optional aria-live/aria-atomic wrapper.",
      "Grouped carousel elements (not present).",
    ],
    points: 19.5,
    percent: 78.0,
  },
  "gpt-oss-120b-accessible": {
    itemsScored: 24,
    pass: [
      { text: "Auto-rotation stops when a carousel element receives focus." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: "Carousel has an accessible name via aria-label." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      { text: "Each interactive element receives tab focus." },
      { text: "There are no keyboard traps." },
      { text: "Non-text items meet color contrast." },
      { text: "Focus states are present." },
      { text: "Play/Pause control label updates when toggled." },
    ],
    partial: [
      {
        text: "Rotation control label reflects Start/Stop when toggled, but does not update when auto-rotation halts due to focus.",
      },
    ],
    fail: [
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: "Tab and Shift+Tab do not move through interactive elements in visual page order.",
      },
      {
        text: "Rotation control is not first in the Tab order inside the carousel.",
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
      { text: "Picker button names don't match the slide accessible names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
      },
      {
        text: "Focus indicators do not consistently meet contrast over images.",
      },
    ],
    notScored: [
      "Text contrast (marked N/A).",
      "SVGs/decorative graphics (marked N/A).",
      "Tabs pattern for slide pickers (not present).",
      "Optional aria-live/aria-atomic wrapper.",
    ],
    points: 13.5,
    percent: 56.3,
  },
  "claude-sonnet-4-accessible": {
    itemsScored: 23,
    pass: [
      { text: "Focus order is implemented correctly." },
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: "Carousel has an accessible name via aria-label." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      { text: "Decorative SVGs are properly hidden." },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
      { text: "Play/Pause label updates based on current state." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
      { text: "There are no keyboard traps." },
    ],
    partial: [],
    fail: [
      {
        text: "Auto-rotation does not stop when any carousel element receives focus.",
      },
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: 'Each slide container does not have role="group" with aria-roledescription="slide".',
      },
      {
        text: "Each slide lacks its own accessible name on the slide container.",
      },
      {
        text: "Rotation control is not first in the carousel Tab sequence before the rotating content.",
      },
      { text: "Non-text items (arrow buttons) occasionally fail contrast." },
      {
        text: "Tabbed picker controls are not a single Tab stop (no roving tabindex).",
      },
      {
        text: "Picker button names don't match the corresponding slide names.",
      },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
      },
    ],
    notScored: [
      "Optional aria-live wrapper (present but optional; behavior depends on rotation state).",
      "Tabs pattern keyboard behavior (Arrow/Home/End) cannot be verified from static markup.",
    ],
    points: 14,
    percent: 60.9,
  },
  "claude-4-opus-accessible": {
    itemsScored: 25,
    pass: [
      { text: "Focus order is implemented correctly." },
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: "Carousel has an accessible name via aria-label." },
      { text: 'Carousel container includes aria-roledescription="carousel".' },
      { text: "Rotation control does not use aria-pressed." },
      {
        text: "Rotation control label updates to reflect action (Play/Pause).",
      },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      {
        text: 'Each slide container uses role="group" with aria-roledescription="slide".',
      },
      {
        text: "Each slide has an accessible name using the “n of total” format.",
      },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
      {
        text: "Auto-rotation does not resume unless the rotation control is activated.",
      },
      { text: "There are no keyboard traps." },
      {
        text: 'Picker group has an accessible label describing its purpose ("Slide navigation").',
      },
    ],
    partial: [],
    fail: [
      {
        text: "Auto-rotation does not stop when any carousel element receives focus.",
      },
      {
        text: "Rotation control is not first in the carousel Tab sequence before the rotating content.",
      },
      {
        text: "Non-text items (e.g., arrows) do not consistently meet contrast requirements.",
      },
      { text: "Decorative SVG icons are not explicitly hidden from AT." },
      {
        text: 'Picker buttons are not grouped in an element with role="group".',
      },
      { text: "Picker button names don't match the slide accessible names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
      },
    ],
    notScored: [
      "Tabs pattern for slide pickers (not applicable here).",
      "Optional aria-live/aria-atomic wrapper behavior.",
    ],
    points: 18,
    percent: 72.0,
  },
  "deepseek-v3-accessible": {
    itemsScored: 25,
    pass: [
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Picker controls are native buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: 'Carousel container uses role="region".' },
      { text: "Carousel has an accessible name via aria-label." },
      {
        text: "Rotation control label changes to reflect action (Play/Pause).",
      },
      { text: "No aria-pressed on rotation control." },
      {
        text: 'Each slide container has role="group" with aria-roledescription="slide".',
      },
      {
        text: "Each slide has an accessible name using the “n of total” format.",
      },
      { text: "Each interactive element receives tab focus." },
      { text: "Focus states are present." },
      { text: "There are no keyboard traps." },
    ],
    partial: [],
    fail: [
      {
        text: "Auto-rotation does not stop when any carousel element receives focus.",
      },
      {
        text: "Auto-rotation resumes without the rotation control being activated.",
      },
      {
        text: "Tab and Shift+Tab do not move through interactive elements in normal page order.",
      },
      { text: "Rotation control is not first in the carousel Tab sequence." },
      { text: "All items meet color contrast." },
      { text: "Focus indicators meet contrast." },
      { text: "Decorative SVGs are not properly hidden from assistive tech." },
      { text: 'Missing aria-roledescription="carousel" on the container.' },
      {
        text: 'Picker buttons are not grouped in an element with role="group".',
      },
      {
        text: 'The picker group lacks an accessible label like aria-label="Choose slide to display".',
      },
      { text: "Picker button names don't match the slide accessible names." },
      {
        text: 'Currently visible slide\'s picker button does not have aria-disabled="true".',
      },
    ],
    notScored: ["Optional aria-live/aria-atomic wrapper."],
    points: 13,
    percent: 52.0,
  },
  "gemini-2-5-pro-accessible": {
    itemsScored: 21,
    pass: [
      {
        text: "Tab and Shift+Tab move through interactive elements in page order.",
      },
      { text: "Buttons are native <button>s and behave like buttons." },
      { text: "Activating Previous/Next does not move focus." },
      { text: "Each interactive element receives tab focus." },
      { text: 'Carousel container uses role="region".' },
      { text: 'Carousel container includes aria-roledescription="carousel".' },
      { text: "Carousel has an accessible name via aria-label." },
      { text: "Prev/Next controls are native buttons." },
      { text: "Rotation control is a native button." },
      {
        text: "Rotation control label changes to reflect action (Play/Pause updates).",
      },
      { text: "Rotation control does not use aria-pressed." },
      {
        text: 'Each slide container has role="group" with aria-roledescription="slide".',
      },
      { text: 'Each slide has an accessible name (e.g., "n of total").' },
      { text: 'Picker controls are native buttons (role="tab").' },
      { text: "All interactive elements have a visible focus indicator." },
      { text: "Focus indicators meet contrast." },
      { text: "There are no keyboard traps." },
      {
        text: "Slide picker controls follow Tabs Pattern.",
      },
    ],
    partial: [],
    fail: [
      { text: "Non-text items meet color contrast." },
      {
        text: "Rotation control is the first item in the carousel’s Tab sequence.",
      },
      {
        text: "Decorative SVGs are properly hidden.",
      },
    ],
    notScored: [
      "Auto-rotate behavior and related label/order checks (auto-rotation not active).",
      "Optional aria-live/aria-atomic wrapper correctness.",
      "Grouped-carousel picker requirements (not applicable; using tablist).",
    ],
    points: 18,
    percent: 85,
  },
  "grok-4-accessible": {
    "itemsScored": 22,
    "pass": [
      { "text": "Tab and Shift+Tab move through interactive elements in page order." },
      { "text": "Activating Previous/Next does not move focus." },
      { "text": "Each interactive element receives tab focus." },
      { "text": "Carousel container uses role=\"region\"." },
      { "text": "Carousel has an accessible name via aria-label." },
      { "text": "Rotation, Previous, and Next are native <button> elements." },
      { "text": "Rotation control label updates to reflect current action (Play/Pause)." },
      { "text": "Rotation control does not use aria-pressed." },
      { "text": "Picker controls are native <button> elements." },
      { "text": "Picker controls are a single Tab stop (only the active tab is tabbable)." },
      { "text": "All items (text and non-text) meet color contrast." },
      { "text": "All interactive elements have a visible focus indicator." },
      { "text": "There are no keyboard traps." }
    ],
    "partial": [],
    "fail": [
      { "text": "Automatic rotation does not stop when any carousel element receives keyboard focus." },
      { "text": "Automatic rotation resumes without user activation of the rotation control." },
      { "text": "Control buttons do not fully follow the WAI-ARIA Button Pattern." },
      { "text": "Missing aria-roledescription=\"carousel\" on the container." },
      { "text": "Rotation control is not the first element in the carousel’s tab sequence." },
      { "text": "Tabs Pattern keyboard support is not implemented for slide pickers (e.g., Arrow/Home/End behavior)." },
      { "text": "Slides (role=\"tabpanel\") lack clear accessible names via aria-labelledby pointing to a named tab." },
      { "text": "Picker button names do not match the slide names." },
      { "text": "Focus indicators do not consistently meet contrast." }
    ],
    "notScored": [
      "Optional aria-live/aria-atomic wrapper for slide set.",
      "Basic-style slide roles (role=\"group\" with aria-roledescription=\"slide\") not applicable when using Tabs.",
      "Grouped picker pattern (role=\"group\" with aria-label and aria-disabled on current) not applicable."
    ],
    "points": 13,
    "percent": 59.1
  },
  "qwen-3-coder-accessible": {
    "itemsScored": 20,
    "pass": [
      { "text": "Buttons are native <button>s and behave like buttons." },
      { "text": "Activating Previous/Next does not move focus." },
      { "text": "Carousel container uses role=\"region\"." },
      { "text": "Carousel has an accessible name via aria-label." },
      { "text": "Each slide container has role=\"group\" with aria-roledescription=\"slide\"." },
      { "text": "Each slide has an accessible name (e.g., \"n of total\")." },
      { "text": "Play/Pause label updates based on current state." },
      { "text": "Each interactive element receives tab focus." },
      { "text": "There are no keyboard traps." },
      { "text": "All interactive elements have a visible focus indicator." }
    ],
    "partial": [],
    "fail": [
      { "text": "Automatic rotation does not stop when any carousel element receives keyboard focus." },
      { "text": "Automatic rotation resumes without the user activating the rotation control." },
      { "text": "Tab and Shift+Tab do not move through interactive elements in normal page order." },
      { "text": "Rotation control is not the first element in the Tab sequence inside the carousel." },
      { "text": "Missing aria-roledescription=\"carousel\" on the container." },
      { "text": "Non-text items (icons, bullets, controls) do not consistently meet contrast requirements." },
      { "text": "Focus indicators do not meet contrast requirements." },
      { "text": "Decorative SVGs are not properly hidden from assistive tech (e.g., missing aria-hidden=\"true\")." },
      { "text": "Slide picker controls do not follow the Tabs Pattern (keyboard behavior not implemented)." },
      { "text": "Picker controls are not a single Tab stop (each tab is focusable by Tab)." }
    ],
    "notScored": [
      "Optional aria-live/aria-atomic wrapper for slide set."
    ],
    "points": 10,
    "percent": 50.0
  },
  "llama-3-3-accessible": {
    itemsScored: 26,
    pass: [
      { "text": "Activating Previous/Next/Rotation does not move focus." },
      { "text": "Each interactive element receives tab focus." },
      { "text": "Non-text items meet color contrast." },
      { "text": "All interactive elements have a visible focus indicator." },
      { "text": "There are no keyboard traps." },
      { "text": "Rotation, Previous, and Next controls function as buttons." },
      { "text": "Carousel has an accessible name via aria-label." },
      { "text": "Rotation control does not use aria-pressed." },
      { "text": "Auto-rotation does not resume unless the rotation control is activated." }
    ],
    partial: [],
    fail: [
      { "text": "Focus order is implemented correctly." },
      { "text": "Tab and Shift+Tab move through interactive elements in page order." },
      { "text": "Auto-rotation does not stop when any carousel element receives keyboard focus." },
      { "text": "Rotation control label does not reflect the current action (not labeled with Start/Stop)." },
      { "text": "Prev/Next/Rotation controls are unlabeled, so they lack accessible names." },
      { "text": "Carousel container does not use role=\"region\" or role=\"group\"." },
      { "text": "Missing aria-roledescription=\"carousel\" on the container." },
      { "text": "Rotation control is not first in the Tab sequence inside the carousel." },
      { "text": "Each slide container does not have role=\"group\" with aria-roledescription=\"slide\"." },
      { "text": "Each slide lacks its own accessible name on the slide container." },
      { "text": "Picker buttons are not grouped in an element with role=\"group\"." },
      { "text": "The picker group lacks an accessible label that describes its purpose." },
      { "text": "Picker button names do not match the slide names, and picker buttons are unlabeled." },
      { "text": "Currently visible slide\'s picker button does not have aria-disabled=\"true\"." },
      { "text": "Decorative SVGs are not hidden from assistive technology." },
      { "text": "Focus indicators do not meet contrast requirements." }
    ],
    notScored: [
      "Text color contrast for body copy was not applicable.",
      "Optional aria-live wrapper (aria-live/aria-atomic) not present.",
      "Tabs pattern for slide pickers not applicable because this is a grouped picker style."
    ],
    points: 9,
    percent: 36
  }
};
