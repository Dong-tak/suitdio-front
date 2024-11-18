import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OurTooltipProps {
  children: React.ReactNode;
  description: string;
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'background'
    | 'link'
    | 'default'
    | 'outline'
    | 'ghost'
    | 'foreground'
    | null
    | undefined;
}

export function OurTooltip({
  children,
  description,
  variant,
}: OurTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>{children}</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
