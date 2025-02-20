import React from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import ClientOnlyPortal from "@/components/ui/client-only-portal";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const drawerVariants = cva(`fixed z-50 bg-background border-ring/60 flex flex-col px-8 py-3 border`, {
  variants: {
    /**
     * Which side should the drawer open from?
     */
    direction: {
      left: "h-full left-0 top-0 bottom-0",
      top: "w-full top-0 left-0 right-0",
      right: "h-full right-0 top-0 bottom-0",
      bottom: "w-full bottom-0 left-0 right-0",
    },
  },
  defaultVariants: {
    direction: "left",
  },
});

export type DrawerProps = HTMLMotionProps<"div"> &
  VariantProps<typeof drawerVariants> & {
    isOpen: boolean;
    scrollable?: boolean;
  };

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ children, direction = "left", isOpen, scrollable = false, className, ...props }: DrawerProps, ref) => {
    function getAnimationVariants(direction: DrawerProps["direction"]) {
      if (direction == "right") return { outOfView: { opacity: 0, x: "50%" }, inView: { opacity: 1, x: 0 } };
      if (direction == "left") return { outOfView: { opacity: 0, x: "-50%" }, inView: { opacity: 1, x: 0 } };
      if (direction == "top") return { outOfView: { opacity: 0, y: "-50%" }, inView: { opacity: 1, y: 0 } };
      if (direction == "bottom") return { outOfView: { opacity: 0, y: "50%" }, inView: { opacity: 1, y: 0 } };
    }

    return (
      <ClientOnlyPortal selector="body">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={ref}
              initial="outOfView"
              animate="inView"
              exit="outOfView"
              variants={getAnimationVariants(direction)}
              transition={{
                duration: 0.35,
                delay: 0.1,
                ease: [0.76, 0, 0.24, 1],
              }}
              className={cn(drawerVariants({ direction, className }), scrollable && "overflow-y-scroll")}
              {...props}>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </ClientOnlyPortal>
    );
  }
);

export default Drawer;
