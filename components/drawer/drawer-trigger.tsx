import Button, { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

type DrawerTriggerProps = {
  children: React.ReactNode;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  toggleOpen: React.MouseEventHandler<HTMLButtonElement>;
};
const DrawerTrigger = ({ children, className, variant, toggleOpen }: DrawerTriggerProps) => {
  return (
    <Button className={className} variant={variant} onClick={toggleOpen}>
      {children}
    </Button>
  );
};

export default DrawerTrigger;
