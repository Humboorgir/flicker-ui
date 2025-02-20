import { cn } from "@/lib/utils";
import React, { createContext, useContext, useId, useMemo, useState } from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";

type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

type TTooltipContext = {
  id: string;
  isOpen: boolean;
  setIsOpen: ReactSetState<boolean>;
};

const TooltipContext = createContext<TTooltipContext>({
  id: "",
  isOpen: false,
  setIsOpen: () => {},
});

type TooltipProps = {
  children: React.ReactNode;
};

export const Tooltip = ({ children }: TooltipProps) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  const tooltipContext = useMemo(() => ({ id, isOpen, setIsOpen }), [id, isOpen, setIsOpen]);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <TooltipContext.Provider value={tooltipContext}>
      <div
        role="tooltip"
        className="relative inline-block"
        onFocus={handleOpen}
        onMouseOver={handleOpen}
        onBlur={handleClose}
        onMouseLeave={handleClose}>
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

type TooltipTriggerProps = React.ComponentProps<"div">;

export const TooltipTrigger = ({ children, className }: TooltipTriggerProps) => {
  const { id } = useContext(TooltipContext);
  return (
    <div className={className} aria-describedby={`${id}-content`} tabIndex={0}>
      {children}
    </div>
  );
};

type TooltipContentProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

export const TooltipContent = ({ children, className, ...props }: TooltipContentProps) => {
  const { isOpen, id } = useContext(TooltipContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="pb-2 absolute bottom-full left-1/2 -translate-x-1/2">
          <motion.div
            id={`${id}-content`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.2,
              ease: [0, 0, 0.2, 1],
            }}
            className={cn(
              "relative whitespace-nowrap text-background py-1 px-1.5 ease-out rounded-md bg-foreground",
              className
            )}
            {...props}>
            <div
              aria-hidden
              className="top-full left-1/2 -translate-x-1/2 border-[6px] absolute"
              style={{ borderColor: "hsl(var(--foreground)) transparent transparent transparent" }}
            />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
