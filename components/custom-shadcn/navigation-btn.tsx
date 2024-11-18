import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const NavButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    isActive?: boolean;
    className?: string;
  }
>(({ children, onClick, disabled, isActive = false, className }, ref) => {
  return (
    <Button
      variant="background"
      size={"nav"}
      disabled={disabled}
      className={cn(
        "flex w-full justify-center border-none hover:text-accent-foreground",
        isActive && "text-accent-foreground",
        className,
      )}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </Button>
  );
});
NavButton.displayName = "NavButton";
