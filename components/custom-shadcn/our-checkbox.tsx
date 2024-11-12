"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface OurCheckboxProps {
  disabled?: boolean;
  size?: string;
  children?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
}

export function OurCheckbox({
  disabled = false,
  size = "sm",
  children,
  checked = false,
  onCheckedChange,
  id,
}: OurCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        disabled={disabled}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange?.(checked === true)}
      />
      <label
        htmlFor={id}
        className="text-foreground body-normal-body-01 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
      </label>
    </div>
  );
}

export function OurColorCheckbox({
  disabled = false,
  size = "sm",
  children,
  checked = false,
  onCheckedChange,
}: OurCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        disabled={disabled}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange?.(checked === true)}
      />
      <label
        htmlFor="terms"
        className="text-accent-foreground body-normal-body-01 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
      </label>
    </div>
  );
}
