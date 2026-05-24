import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// SoundHelix samples are free to use in any project (commercial included).
// Source: https://www.soundhelix.com — "You can use these songs in your projects free of charge."
const TRACK_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(TRACK_URL);
    audio.loop = true;
    audio.volume = 0.18;
    audio.preload = "auto";
    audioRef.current = audio;
    setReady(true);

    const tryPlay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — wait for first user interaction.
        const resume = async () => {
          try {
            await audio.play();
            setPlaying(true);
          } catch {
            /* ignore */
          }
          window.removeEventListener("pointerdown", resume);
          window.removeEventListener("keydown", resume);
        };
        window.addEventListener("pointerdown", resume, { once: true });
        window.addEventListener("keydown", resume, { once: true });
      }
    };
    tryPlay();

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Couper la musique" : "Lancer la musique"}
      className="fixed bottom-4 right-4 z-[9998] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md shadow-lg transition hover:bg-black/80 hover:scale-105 md:bottom-6 md:right-6"
    >
      {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      {playing && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/10" />
      )}
    </button>
  );
};

export default BackgroundMusic;
