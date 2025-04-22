import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "small" | "medium" | "large";
  withText?: boolean;
  className?: string;
}

const Logo = ({
  size = "medium",
  withText = true,
  className = "",
}: LogoProps) => {
  // Size mapping
  const sizeMap = {
    small: {
      container: "h-6 w-6",
      text: "text-sm",
    },
    medium: {
      container: "h-8 w-8",
      text: "text-xl",
    },
    large: {
      container: "h-12 w-12",
      text: "text-2xl",
    },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
        className={`${sizeMap[size].container} bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black`}
      >
        CP
      </motion.div>
      {withText && (
        <motion.h1
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`${sizeMap[size].text} font-bold text-white`}
        >
          Chrono Pneus
        </motion.h1>
      )}
    </div>
  );
};

export default Logo;
