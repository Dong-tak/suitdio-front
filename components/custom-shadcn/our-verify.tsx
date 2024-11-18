import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, Github, Instagram } from "lucide-react";
import Link from "next/link";
import { OurTooltip } from "./our-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export function OurVerify() {
  return (
    <Card className="max-h-[540px] max-w-[400px] grow items-center justify-center space-y-[16px] border-none bg-background shadow-none sm:w-auto sm:min-w-[343px]">
      <CardHeader className="p-0">
        <CardTitle>인증하기</CardTitle>
        <Link href="">
          <CardDescription className="underline underline-offset-1">
            인증번호를 입력하세요!
          </CardDescription>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="space-y-[6px]">
          <div className="flex items-end justify-between">
            <Label htmlFor="email">인증번호</Label>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="verify"
                      className="underline underline-offset-2"
                    >
                      혹시 인증메일이 오지 않았나요?
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>다시 보내세요!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex gap-2">
            <Input id="verifyCode" />
            <Button
              variant={"default"}
              size={"icon"}
              className="h-10 w-10 flex-shrink-0"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button size={"long"}>MileQue 시작하기</Button>
      </CardContent>
    </Card>
  );
}
