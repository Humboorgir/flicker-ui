import type { SelectProps } from "./select";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import SelectOption from "./selectOption";

type Option = SelectProps["options"][0];
type SelectOptionProps = {
  isOpen: boolean;
  menuId: string;
  scrollable: SelectProps["scrollable"];
  options: Option[];
  focusedOption: Option;
  selectOption: (option: Option) => void;
};

export default function SelectMenu({
  isOpen,
  menuId,
  scrollable,
  options,
  focusedOption,
  selectOption,
}: SelectOptionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.ul
          id={menuId}
          role="listbox"
          initial={{
            opacity: 0,
            scale: 0.87,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: 0.25,
            delay: 0.1,
            ease: [0.76, 0, 0.24, 1],
          }}
          className={cn(
            `bg-background absolute top-full right-0 origin-top-right mt-1 max-h-[200px] rounded-md flex flex-col items-stretch`,
            scrollable && "overflow-y-scroll"
          )}>
          {options &&
            options.map((option) => {
              return (
                <SelectOption
                  focusedOption={focusedOption}
                  selectOption={selectOption}
                  option={option}
                  key={option.value}
                />
              );
            })}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
