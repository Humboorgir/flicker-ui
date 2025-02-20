import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

type SkeletonProps = React.ComponentProps<"span">;

const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("relative rounded-sm inline-flex leading-none overflow-hidden w-full", className)}
      style={{ backgroundColor: "hsl(var(--skeleton-base))" }}
      aria-live="polite"
      aria-busy="true"
      {...props}>
      {/* Invisible character */}
      &zwnj;
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 right-0 h-full block dark:[]"
        style={{
          backgroundImage: `linear-gradient(90deg,
           hsl(var(--skeleton-base)) 0%,
           hsl(var(--skeleton-highlight)) 50%,
           hsl(var(--skeleton-base)) 100%)`,
        }}
      />
    </span>
  );
});

export default Skeleton;
