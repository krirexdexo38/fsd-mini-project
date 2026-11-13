import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function Loader({
  title = "Configuring your account...",
  subtitle = "Please wait while we prepare everything for you",
  size = "md",
  className,
  ...props
}) {
  const sizeConfig = {
    sm: {
      container: "w-20 h-20",
      titleClass: "text-sm font-bold",
      subtitleClass: "text-xs",
      spacing: "space-y-2",
      maxWidth: "max-w-48",
    },
    md: {
      container: "w-28 h-28 sm:w-32 sm:h-32",
      titleClass: "text-base sm:text-lg font-bold",
      subtitleClass: "text-xs sm:text-sm",
      spacing: "space-y-2.5",
      maxWidth: "max-w-md",
    },
    lg: {
      container: "w-36 h-36 sm:w-40 sm:h-40",
      titleClass: "text-lg sm:text-xl font-extrabold",
      subtitleClass: "text-sm sm:text-base",
      spacing: "space-y-3",
      maxWidth: "max-w-lg",
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 p-6",
        className
      )}
      {...props}
    >
      {/* Enhanced Monochrome/Notebook Loader */}
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
        }}
        className={cn("relative", config.container)}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: [0.4, 0, 0.6, 1],
        }}
      >
        {/* Outer elegant ring with shimmer - Light mode */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          className="absolute inset-0 rounded-full dark:hidden"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgb(15, 23, 42) 90deg, transparent 180deg)",
            mask: "radial-gradient(circle at 50% 50%, transparent 35%, black 37%, black 39%, transparent 41%)",
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 35%, black 37%, black 39%, transparent 41%)",
            opacity: 0.85,
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Primary animated ring with gradient - Light mode */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          className="absolute inset-0 rounded-full dark:hidden"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgb(15, 23, 42) 120deg, rgba(15, 23, 42, 0.5) 240deg, transparent 360deg)",
            mask: "radial-gradient(circle at 50% 50%, transparent 42%, black 44%, black 48%, transparent 50%)",
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 42%, black 44%, black 48%, transparent 50%)",
            opacity: 0.9,
          }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.4, 0, 0.6, 1],
          }}
        />

        {/* Secondary elegant ring - counter rotation - Light mode */}
        <motion.div
          animate={{
            rotate: [0, -360],
          }}
          className="absolute inset-0 rounded-full dark:hidden"
          style={{
            background:
              "conic-gradient(from 180deg, transparent 0deg, rgba(15, 23, 42, 0.6) 45deg, transparent 90deg)",
            mask: "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 56%, transparent 58%)",
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 56%, transparent 58%)",
            opacity: 0.4,
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.4, 0, 0.6, 1],
          }}
        />

        {/* Dark mode variants */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          className="absolute inset-0 hidden rounded-full dark:block"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgb(255, 255, 255) 90deg, transparent 180deg)",
            mask: "radial-gradient(circle at 50% 50%, transparent 35%, black 37%, black 39%, transparent 41%)",
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 35%, black 37%, black 39%, transparent 41%)",
            opacity: 0.85,
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          className="absolute inset-0 hidden rounded-full dark:block"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgb(255, 255, 255) 120deg, rgba(255, 255, 255, 0.5) 240deg, transparent 360deg)",
            mask: "radial-gradient(circle at 50% 50%, transparent 42%, black 44%, black 48%, transparent 50%)",
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 42%, black 44%, black 48%, transparent 50%)",
            opacity: 0.9,
          }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.4, 0, 0.6, 1],
          }}
        />

        <motion.div
          animate={{
            rotate: [0, -360],
          }}
          className="absolute inset-0 hidden rounded-full dark:block"
          style={{
            background:
              "conic-gradient(from 180deg, transparent 0deg, rgba(255, 255, 255, 0.6) 45deg, transparent 90deg)",
            mask: "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 56%, transparent 58%)",
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 56%, transparent 58%)",
            opacity: 0.4,
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.4, 0, 0.6, 1],
          }}
        />
      </motion.div>

      {/* Typography with Breathing Animation */}
      <motion.div
        animate={{
          opacity: 1,
          y: 0,
        }}
        className={cn("text-center", config.spacing, config.maxWidth)}
        initial={{ opacity: 0, y: 12 }}
        transition={{
          delay: 0.2,
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <motion.h2
          className={cn(
            config.titleClass,
            "text-foreground leading-snug tracking-normal"
          )}
        >
          <motion.span
            animate={{
              opacity: [0.95, 0.7, 0.95],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.4, 0, 0.6, 1],
            }}
          >
            {title}
          </motion.span>
        </motion.h2>

        <motion.p
          className={cn(
            config.subtitleClass,
            "text-muted-foreground leading-relaxed font-normal"
          )}
        >
          <motion.span
            animate={{
              opacity: [0.8, 0.5, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.4, 0, 0.6, 1],
            }}
          >
            {subtitle}
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  );
}
