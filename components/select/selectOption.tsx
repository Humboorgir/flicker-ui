import type { SelectProps } from "./select";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useRef } from "react";

type Option = SelectProps["options"][0];
type SelectOptionProps = {
  option: Option;
  focusedOption: Option;
  selectOption: (option: Option) => void;
};

export default function SelectOption({ option, focusedOption, selectOption }: SelectOptionProps) {
  const optionRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (option.value != focusedOption.value) return;
    optionRef.current?.focus();
    optionRef.current?.scrollIntoView({
      block: "nearest",
    });
  }, [focusedOption]);

  return (
    <li
      tabIndex={-1}
      ref={optionRef}
      role="option"
      key={option.value}
      className={cn(
        buttonVariants({ variant: "outline" }),
        `shrink-0 focus-visible:bg-secondary focus-visible:ring-0 cursor-pointer border-t-0 
        first-of-type:border-t rounded-none first-of-type:rounded-t-md last-of-type:rounded-b-md`
      )}
      onClick={() => selectOption(option)}>
      {option.name}
    </li>
  );
}
