"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface IPicture {
  src: string;
  scale: MotionValue<number>;
}

interface ImmersiveScrollGalleryProps {
  images: { src: string }[];
  className?: string;
  caption?: string;
}

const IMAGE_STYLES = [
  "w-[25vw] h-[25vh]",
  "w-[35vw] h-[30vh] -top-[30vh] left-[5vw]",
  "w-[20vw] h-[55vh] -top-[15vh] -left-[25vw]",
  "w-[25vw] h-[25vh] left-[27.5vw]",
  "w-[20vw] h-[30vh] top-[30vh] left-[5vw]",
  "w-[30vw] h-[25vh] top-[27.5vh] -left-[22.5vw]",
  "w-[15vw] h-[15vh] top-[22.5vh] left-[25vw]",
];

const ImmersiveScrollGallery: React.FC<ImmersiveScrollGalleryProps> = ({
  images,
  className = "",
  caption,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const opacitySection2 = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);

  const pictures: IPicture[] = images.map((img, index) => ({
    ...img,
    scale: [scale4, scale5, scale6, scale5, scale6, scale8, scale9][index % 7],
  }));

  return (
    <div ref={container} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {pictures.map(({ src, scale }, index) => (
          <motion.div
            key={index}
            style={{ scale }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
          >
            <div className={`relative ${IMAGE_STYLES[index % IMAGE_STYLES.length]} overflow-hidden`}>
              <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </motion.div>
        ))}

        {caption ? (
          <motion.div
            style={{ opacity: opacitySection2 }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <p className="max-w-2xl text-center text-white/90 text-base md:text-lg font-light leading-relaxed px-6">
              {caption}
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default ImmersiveScrollGallery;
