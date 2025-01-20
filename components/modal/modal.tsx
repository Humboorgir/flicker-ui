import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  open: boolean;
  handleClose: React.MouseEventHandler;
  className?: string;
};

const Modal = ({ children, open, handleClose, className, ...props }: Props) => {
  const easeOut = [0, 0, 0.2, 1];
  return (
    <AnimatePresence>
      {/* backdrop  */}
      {open && (
        <motion.div
          key="backdrop"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 100,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            delay: 0.1,
          }}
          className="fixed left-0 right-0 top-0 bottom-0 bg-black/60 z-[100] grid place-items-center"
          onClick={handleClose}>
          {/* modal window  */}
          {open && (
            <motion.div
              key="modal"
              initial={{
                opacity: 0,
                scale: 0.88,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.75,
              }}
              transition={{
                ease: easeOut,
                duration: 0.2,
                delay: 0.1,
              }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                `bg-neutral-900 text-foreground p-6 max-w-[90vw] md:max-w-[640px] w-fit !ease-out rounded-md 
                flex flex-col border border-neutral-800`,
                className
              )}
              {...props}>
              {children}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
