import React, { useState } from "react";

export default function GptOss20bCarousel({
  slides = [],
  ariaLabel = "Model output",
  className = "",
}) {
  const snippetLines = [
    "/// lets just say this one didn't finish.. I tried multiple times on this one.. this is the furthest it got.",
    "import React, { useState, useEffect, useRef } from 'react';",
    "",
    "export default function GptOss20bCarousel({",
    "slides,",
    "ariaLabel,",
    "loop = true,",
    "autoPlay = false,",
    "interval = 5000,",
    "initialIndex = 0,",
    "showDots = true,",
    "showPlayPause = true,",
    "className = '',",
    "onIndexChange,",
    "}) {",
    "const clampedInitial =",
    "typeof initialIndex === 'number'",
    "? Math.max(0, Math.min(initialIndex, Math.max(0, slides.length - 1)))",
    ": undefined;",
    "",
    "const [currentSlide] = useState(clampedInitial ?? null);",
    "const [currentIdxState] =",
    "typeof clampedInitial === 'number' ? [clampedInitial] : [null];",
    "}",
    "",
    "import React,{useState,useEffect,useRef}from'preact/hooks';",
    "export default function GptOss20bCarousel({slides=[],ariaLabel='',loop=true:autoPlay=false:intlvl=5000:initidx=0,dots=true,pplay=true,classN='',onChg}){const[slc,setSlc]=useState(initidx<slides.length&&initidx>=0?initidx:Math.min(Math.max(initidx||0),slides.length>1&&slc>slc?-slc:-slc));const[playing,setPl]=useState(autoPlay);const[paused,setPd]=useState(false);const[timer,setTimer]=useRef();function move(i){if(i<0){i=loop?-1:i;}else if(i>=slides.length){i=loop?-2:i;}if(i===slc)return;i=i%slides.length;if(i<0)i+=slides.length;if(onChg)onChg(i);setSlc(i);}function prev(){move(slc>0||loop?(slc+slides.length)%slides.length:-1);}function next(){move((slc+1)%slides.length);}function handleStart(e){e.preventDefault();let x=e.touches?[e.touches[0].clientX]:e.clientX,start=x;(e.type==='mousedown'||e.type==='pointerdown')&&document.addEventListener('mousemove',handleMove)&&document.addEventListener('mouseup',handleEnd)||document.addEventListener('touchmove',handleMove)&&document.addEventListener('touchend',handleEnd);}function handleMove(e){let x=e.touches?[e.touches[0].clientX]:e.clientX;if(Math.abs(x-start)>30)(x-start>30)?prev():next();start=x;}function handleEnd(e){(e.type==='mouseup'||e.type==='pointerup')&&document.removeEventListener('mousemove',handleMove)&&document.removeEventListener('mouseup',handleEnd)||document.removeEventListener('touchmove',handleMove)&&document.removeEventListener('touchend',handleEnd);setPl(false);}useEffect(()=>{if(playing&&!paused&&slides?.length>1){timer.current=setInterval(next,intlvl<20000??20000:intlvl)}return()=>clearInterval(timer.current);},{playing,pd,intlvl});return(slides?.length?<div role='region' aria-label={ariaLabel||'carousel'}class={relative overflow-hidden ${classN}}onMouseDown={pplay&&prev}onTouchStart={pplay&&prev}><div style={{transform:translate3d(-${slc*100}%,${''},${''})}}class='flex transition-transform duration-[400ms]'>{slides.map((s,i)=>(<div key={i}class='w-full flex-shrink-00'><img src={s.image}alt={s.description||''}class='block w-full h-auto'/><p>{s.description}</p></div>))}</div><button type='button'onClick={()=>{prev();setPl(false)}}disabled={!loop&&slc===Math.min(slides?.length)}class='absolute left-[5%] top-[50%] transform -translate-y-[50%]'>Prev</button><button type='button'onClick={()=>{next();setPl(false)}}disabled={!loop&&slc===Math.max(slides?.length)}class='absolute right-[5%] top-[50%] transform -translate-y-[50%]'>Next</button>{dots?<ul class='absolute bottom-[5%] left-[50%] transform -translate-x-[50%]'>{Array.from({length:slots}).map((_,i)=>(<li key=i}{style={{display:'inline-block'}}}>{i===slc?'●':'○'} </li>))}</ul>:null}{pplay?<button type='button'onClick={()=>setPl(!playing)}style={{position:'absolute',top:'5%',right:'5%' }}>{playing?'⏸':'▶️'}</button>:null}</div>:<span>No Slides Available</span>)}",
  ];
  const snippet = snippetLines.join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section
      role="region"
      aria-label={ariaLabel || "Model output"}
      className={`rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white dark:bg-slate-950 p-5 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Model did not return a complete component
          </h2>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            After several attempts, this model never produced a runnable
            carousel. The returned code was an incomplete mix of two different
            implementations (React and Preact) with syntax errors, undeclared
            variables, invalid hook usage, and broken JSX. It also contained
            mismatched property names and malformed event handlers, so it could
            not compile or run as intended.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <details
          open
          className="rounded-xl border border-gray-200/70 dark:border-gray-800/70"
        >
          <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium">
            Show partial output
          </summary>
          <pre className="whitespace-pre-wrap break-words p-4 text-xs font-mono leading-relaxed">
            {snippet}
          </pre>
        </details>
      </div>

      <div className="mt-3">
        <p className="mt-1 mb-3 text-gray-700 dark:text-gray-300">
          Based on the code, what it was <em>trying</em> to generate was the
          following - minus all interaction, of course:
        </p>
        <section
          role="region"
          aria-label="carousel"
          className="relative overflow-hidden your-extra-classes"
        >
          <div className="flex transition-transform duration-[400ms] transform -translate-x-[25%]">
            <div className="w-full flex-shrink-00">
              <img
                src="https://images.unsplash.com/photo-1754206352604-0a4f13ca2a22"
                alt="A serene, green valley is surrounded by trees."
                className="block w-full h-auto"
              />
              <p>A serene, green valley is surrounded by trees.</p>
            </div>
            <div className="w-full flex-shrink-00">
              <img
                src="https://images.unsplash.com/photo-1566154247258-466b02048738"
                alt="Manhattan skyline at dusk"
                className="block w-full h-auto"
              />
              <p>Manhattan skyline at dusk</p>
            </div>
            <div className="w-full flex-shrink-00">
              <img
                src="https://images.unsplash.com/photo-1735736617534-533cf25e3770"
                alt="Market outside of Sensō-ji temple"
                className="block w-full h-auto"
              />
              <p>Market outside of Sensō-ji temple</p>
            </div>
            <div className="w-full flex-shrink-00">
              <img
                src="https://images.unsplash.com/photo-1749729163012-a9f552b8c3fe"
                alt="View of Český Krumlov, Czech Republic"
                className="block w-full h-auto"
              />
              <p>View of Český Krumlov, Czech Republic</p>
            </div>
            <div className="w-full flex-shrink-00">
              <img
                src="https://images.unsplash.com/photo-1751795195789-8dab6693475d"
                alt="View of Phare de Kermorvan - Le Conquet, France"
                className="block w-full h-auto"
              />
              <p>View of Phare de Kermorvan - Le Conquet, France</p>
            </div>
          </div>

          <button
            type="button"
            className="absolute left-[5%] top-[50%] transform -translate-y-[50%]"
          >
            Prev
          </button>
          <button
            type="button"
            className="absolute right-[5%] top-[50%] transform -translate-y-[50%]"
          >
            Next
          </button>

          <ul className="absolute bottom-[5%] left-[50%] transform -translate-x-[50%]">
            <li className="inline-block">● </li>
            <li className="inline-block">○ </li>
            <li className="inline-block">○ </li>
            <li className="inline-block">○ </li>
            <li className="inline-block">○ </li>
          </ul>

          <button type="button" className="absolute top-[5%] right-[5%]">
            ▶️
          </button>
        </section>

        <p className="mt-1 mb-3 text-gray-700 dark:text-gray-300">
          That all being said, if this <em>did</em> build, the score it{" "}
          <em>likely</em> would have received is below.
        </p>
      </div>
    </section>
  );
}
