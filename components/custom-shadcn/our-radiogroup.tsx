import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface OurRadioGroupProps {
  className?: string;
  disabled?: boolean;
}

export function OurRadioGroup({ className, disabled }: OurRadioGroupProps) {
  return (
    <RadioGroup className={className} defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem disabled={disabled} value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem disabled={disabled} value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem disabled={disabled} value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  );
}
