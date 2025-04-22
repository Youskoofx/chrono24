import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

const Loader = ({ size = "medium", text = "Chargement..." }: LoaderProps) => {
  // Size mapping
  const sizeMap = {
    small: {
      tire: "h-12 w-12",
      container: "text-sm",
    },
    medium: {
      tire: "h-20 w-20",
      container: "text-base",
    },
    large: {
      tire: "h-32 w-32",
      container: "text-lg",
    },
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${sizeMap[size].container}`}
    >
      <div className="relative">
        {/* Outer tire */}
        <motion.div
          className={`${sizeMap[size].tire} rounded-full border-8 border-zinc-800 bg-black flex items-center justify-center`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* Tire treads */}
          <div className="absolute inset-0 rounded-full">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-1 bg-zinc-700 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "0 0",
                  transform: `rotate(${i * 45}deg) translate(-50%, -50%) translateX(-50%)`,
                }}
              />
            ))}
          </div>

          {/* Inner rim */}
          <div className="h-1/2 w-1/2 rounded-full bg-yellow-500 flex items-center justify-center">
            <div className="h-1/2 w-1/2 rounded-full bg-black"></div>
          </div>
        </motion.div>
      </div>

      {text && (
        <motion.p
          className="mt-4 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
