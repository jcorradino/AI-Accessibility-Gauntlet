export const promptText = `Build a React carousel component in ONE file, plain JSX, styled with Tailwind. No external UI libraries.

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
