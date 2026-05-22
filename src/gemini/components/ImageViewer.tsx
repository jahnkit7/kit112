import { motion, AnimatePresence } from 'motion/react';
import { X } from "@/components/icons/hugeicons";

interface ImageViewerProps {
  image: string | null;
  onClose: () => void;
}

export const ImageViewer = ({ image, onClose }: ImageViewerProps) => {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-8 right-8 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-[110]"
            onClick={onClose}
          >
            <X className="w-8 h-8" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-5xl w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image}
              alt="Portfolio Detail"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
