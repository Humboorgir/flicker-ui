// NOTE: this component hasnt been tested and is only being added for my own usage.
// TODO: rewrite the animations with framer-motion and organize the code

import Button, { buttonVariants } from "@/components/ui/button";

import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SelectProps = Omit<React.HTMLProps<HTMLDivElement>, "onChange"> & {
  /**
   * The component's title. Visible before any user interaction takes place.
   */
  children: React.ReactNode;
  /**
   * List of select options.
   */
  options: { name: string; value: string }[];
  /**
   * Variant of the trigger button.
   */
  variant?: VariantProps<typeof buttonVariants>["variant"];
  /**
   * If true, scroll-y will be set to `auto`
   */
  scrollable?: boolean;
  /**
   * A function that runs everytime the selected option changes.
   */
  onChange?: (option: { name: string; value: string }) => void;
};

const Select = ({
  variant = "default",
  scrollable = false,
  children,
  options,
  className,
  onChange = () => {},
}: SelectProps) => {
  type Option = { name: string; value: string };

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>({ name: "", value: "" });

  function toggleOpen() {
    setOpen(!open);
  }

  function selectOption(option: Option) {
    onChange(option);
    setSelected(option);
    setOpen(false);
  }

  // select component
  return (
    <div className={cn("relative w-fit h-fit", className)}>
      <Button
        className={cn("transition-all", open && "rounded-b-none")}
        rippleColor="#7C72FF"
        variant={variant}
        onClick={toggleOpen}>
        {selected.value ? selected.name : children}
      </Button>
      {/* select options  */}

      <div
        className={cn(
          `absolute invisible top-full right-0 bg-neutral-900 z-20 scale-[.8]
           opacity-0 transition-all duration-100 origin-top max-h-[200px] delay-100 rounded-b-md
           border-b border-b-secondary`,
          scrollable && "overflow-y-scroll",
          open && "scale-100 opacity-100 visible"
        )}>
        {options &&
          options.map((option, i) => (
            <Button
              key={i}
              className={cn(
                `w-full justify-start border-secondary border-t-0 first-of-type:border-t rounded-none
            last-of-type:rounded-b-md`
              )}
              rippleColor="#7C72FF"
              variant="outline"
              onClick={() => selectOption(option)}>
              {option.name}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Select;
