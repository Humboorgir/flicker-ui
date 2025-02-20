import { motion, cubicBezier, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import FocusLock from "../focus-lock";

type ModalProps = {
  /**
   * Modal content
   */
  children: React.ReactNode;
  /**
   * Determines whether the modal should be open or not.
   */
  open: boolean;
  /**
   * Function that sets the open prop to false when called.
   */
  handleClose: React.MouseEventHandler;
  /**
   * For customization purposes.
   */
  className?: string;
};

const Modal = ({ children, open, handleClose, className, ...props }: ModalProps) => {
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
            <FocusLock>
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
                  `bg-background text-foreground p-6 max-w-[90vw] md:max-w-[640px] w-fit !ease-out rounded-md 
                flex flex-col border border-ring`,
                  className
                )}
                {...props}>
                {children}
              </motion.div>
            </FocusLock>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
