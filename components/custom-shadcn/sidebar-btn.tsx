import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  asChild?: boolean;
  id?: string;
}

export const SidebarBtn = forwardRef<HTMLButtonElement, SidebarBtnProps>(
  (
    {
      children,
      onClick,
      className,
      disabled,
      asChild = false,
      isActive = false,
      id,
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : Button;
    return (
      <Comp
        id={id}
        variant="sidebar"
        size="sidebar"
        onClick={onClick}
        disabled={disabled}
        ref={ref}
        className={cn(
          "sidebar-item flex items-center justify-start",
          isActive && "text-accent-foreground",
          className,
        )}
      >
        {children}
      </Comp>
    );
  },
);
SidebarBtn.displayName = "SidebarBtn"; // for better debugging experience
