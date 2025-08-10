# One-Shot AI Carousel Accessibility Challenge

This project is a test bed for a tech talk on **accessible use of AI**.  
The idea: give multiple AI models the exact same prompt — “Build a React carousel” — drop the raw output into the app, and run it **without edits or fixes**.

Then, we measure how close each one gets to meeting the [ARIA carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) and other practical accessibility checks.

## What It Does

- Sends a **standardized prompt** to each AI model
- Saves the returned code as `/src/components/carousels/{model}-carousel.jsx`
- Renders the component with the same set of slides

## Why

AI is getting better at writing code, but accessibility requires more than "working" output.  
This project visually and functionally demonstrates:

- Where AI nails accessibility patterns
- Where it misses subtle but important requirements
- How even small failures can make an "accessible" alternative **inaccessible** in practice

The goal is to start a conversation about the **responsible** use of AI for accessibility-critical code.

## Tech Stack

- [React 19](https://react.dev/) + [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/) for fast builds and HMR
- [Tailwind CSS](https://tailwindcss.com/) for styling
- TypeScript for types
- Dynamic imports with [`import.meta.glob`](https://vitejs.dev/guide/features.html#glob-import)

## Adding a New Model

1. Save the generated carousel code in `/src/components/carousels/{model}-carousel.jsx`
2. Add an entry to `/src/data/models.ts`:
   - `name`
   - `slug`
   - `componentPath` (matching the filename)
3. Add its results to `/src/data/results.ts`

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Running _Not_ Locally

[View Project in CodeSandbox](https://codesandbox.io/p/github/jcorradino/AI-Accessibility-Gauntlet/main)
