import { CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OurAlertProps {
  variant?: "default" | "destructive" | null | undefined;
}

export function OurAlert({ variant }: OurAlertProps) {
  return (
    <Alert variant={variant} className="w-[634px]">
      <CircleAlert className="mt-[1px] size-4" />
      <div>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </div>
    </Alert>
  );
}
