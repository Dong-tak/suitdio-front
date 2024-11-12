import { Bold } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export function OurToggle() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  );
}
