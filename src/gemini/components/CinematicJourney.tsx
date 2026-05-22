'use client';

import React from 'react';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import ScrollAdventure from '@/components/ui/scroll-adventure';
import { projects } from '@/gemini/data';

/**
 * Full-width cinematic section placed OUTSIDE the sticky phone layout.
 * Projects now power BOTH:
 *  - Script #4 ScrollAdventure → fullscreen chapter-by-chapter showcase
 *  - Script #1 FlowArt → pinned rotating project scenes
 */
export const CinematicJourney: React.FC = () => {
  const accents = ['#f5a524', '#e879f9', '#60a5fa', '#34d399', '#fb7185', '#a78bfa', '#facc15', '#22d3ee'];

  const pages = projects.map((p, i) => ({
    id: p.id,
    subtitle: `${String(i + 1).padStart(2, '0')} · ${p.category}`,
    title: p.title,
    body: `${p.category} — ${p.year}. Une réalisation construite autour d'une intention claire et d'une exécution soignée.`,
    image: p.image,
    accent: accents[i % accents.length],
  }));

  // Pick 3 hero projects for the pinned FlowArt scenes
  const flowProjects = [projects[0], projects[4], projects[5]].filter(Boolean);
  const flowAccents = ['text-amber-400', 'text-fuchsia-400', 'text-blue-300'];
  const flowAlign = ['items-end justify-start', 'items-center justify-end', 'items-center justify-center'];
  const flowTextAlign = ['text-left', 'text-right', 'text-center'];

  return (
    <div className="relative w-full bg-[#0a0a0a] text-zinc-100">
      {/* Intro */}
      <div className="relative py-24 md:py-32 px-8 md:px-20 text-center max-w-5xl mx-auto">
        <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-500">
          Portfolio · plein écran
        </span>
        <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05]">
          Une plongée dans le travail.
        </h2>
        <p className="mt-6 text-zinc-400 max-w-2xl mx-auto">
          Chaque projet, en immersion. Laissez le scroll vous guider d'une réalisation à l'autre.
        </p>
      </div>

      {/* #4 ScrollAdventure — fullscreen chapter showcase */}
      <ScrollAdventure pages={pages} />

      {/* Bridge */}
      <div className="relative py-24 md:py-32 px-8 md:px-20 text-center max-w-5xl mx-auto">
        <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-500">
          Scènes épinglées
        </span>
        <h3 className="mt-6 font-display text-4xl md:text-6xl leading-[1.05]">
          Trois moments. Trois intentions.
        </h3>
      </div>

      {/* #1 FlowArt — pinned rotating project scenes */}
      <FlowArt aria-label="Scènes épinglées">
        {flowProjects.map((p, i) => (
          <FlowSection key={p.id} className="bg-[#0d0d0d]">
            <div className="relative w-full h-full">
              <img
                src={p.image}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/70" />
              <div className={`relative z-10 h-full flex ${flowAlign[i]} p-12 md:p-20`}>
                <div className={flowTextAlign[i]}>
                  <span className={`text-[10px] tracking-[0.4em] uppercase ${flowAccents[i]}`}>
                    Scène 0{i + 1} · {p.category}
                  </span>
                  <h3 className="mt-3 font-display text-4xl md:text-6xl">{p.title}</h3>
                  <p className={`mt-3 text-zinc-300 max-w-xl ${i === 1 ? 'ml-auto' : i === 2 ? 'mx-auto' : ''}`}>
                    {p.year} — une réalisation pensée pour durer.
                  </p>
                </div>
              </div>
            </div>
          </FlowSection>
        ))}
      </FlowArt>
    </div>
  );
};

export default CinematicJourney;
