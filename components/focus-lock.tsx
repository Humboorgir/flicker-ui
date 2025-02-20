import React, { useEffect, useRef } from "react";

type FocusLockProps = React.ComponentProps<"div"> & {
  isLocked?: boolean;
};

const FocusLock: React.FC<FocusLockProps> = ({ isLocked = true, children, ...otherProps }) => {
  const rootNode = useRef<HTMLDivElement | null>(null);
  const focusableItems = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const updateFocusableItems = () => {
      if (rootNode.current) {
        focusableItems.current = Array.from(
          rootNode.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video'
          )
        );
      }
    };

    const observer = new MutationObserver(updateFocusableItems);
    updateFocusableItems();

    if (rootNode.current) {
      observer.observe(rootNode.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, [rootNode]);

  useEffect(() => {
    if (focusableItems.current.length > 0) {
      const { 0: firstItem } = focusableItems.current;
      firstItem.focus();
    }
  }, [focusableItems]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!focusableItems.current.length) return;

      const { shiftKey } = event;
      const { length, 0: firstItem, [length - 1]: lastItem } = focusableItems.current;

      if (isLocked && event.key === "Tab") {
        // If only one item then prevent tabbing when locked
        if (length === 1) {
          event.preventDefault();
          return;
        }

        // If focused on last item then focus on first item when tab is pressed
        if (!shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
          return;
        }

        // If focused on first item then focus on last item when shift + tab is pressed
        if (shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isLocked, focusableItems]);

  return (
    <div {...otherProps} ref={rootNode}>
      {children}
    </div>
  );
};

export default FocusLock;
