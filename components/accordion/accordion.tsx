import React from "react";
import { cn } from "@/lib/utils";
import { forwardRef, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { FaAngleDown as AngleDownIcon } from "react-icons/fa6";

export type AccordionProps = React.HTMLProps<HTMLDivElement> & {
  /**
   * Accordion items
   */
  items: { trigger: string; content: string }[];
};

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, className, items, ...props }, ref) => {
    const id = useId();
    const [open, setOpen] = useState<number | null>(null);

    function toggleOpen(i: number) {
      if (open == i) return setOpen(null);
      setOpen(i);
    }

    return (
      <div className={cn("w-full", className)} {...props}>
        <div className="relative w-full divide-y divide-blue-200/15 z-10">
          {items.map((item, i) => {
            const isOpen = open == i;
            return (
              <React.Fragment key={`${id}-${i}`}>
                <h3 className="w-full text-foreground text-left font-medium">
                  <button
                    type="button"
                    id={`${id}-${i}-header`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-${i}-panel`}
                    onClick={() => toggleOpen(i)}
                    className="w-full active:bg-blue-200/15 active:transition-all flex flex-col py-2 px-3 rounded-sm">
                    <div className="flex justify-between w-full pointer-events-none">
                      {item.trigger}
                      <AngleDownIcon
                        aria-hidden
                        className={cn(
                          "text-lg mr-1 mt-3 transition-all duration-300 pointer-events-none",
                          isOpen && "rotate-180 ease-out"
                        )}
                      />
                    </div>
                  </button>
                </h3>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key={open}
                      role="region"
                      id={`${id}-${i}-panel`}
                      aria-labelledby={`${id}-${i}-header`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                        opacity: {
                          duration: 0.3,
                        },
                      }}
                      className="text-foreground-light text-left m-0 p-0 font-[0] overflow-hidden flex items-stretch pointer-events-none">
                      <div className="grow p-2">{item.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
);

Accordion.displayName = "Accordion";

export default Accordion;
