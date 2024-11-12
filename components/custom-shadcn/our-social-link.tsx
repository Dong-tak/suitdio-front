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
import { OurCheckbox, OurColorCheckbox } from "./our-checkbox";

export function OurSocialLink() {
  return (
    <Card className="max-h-[540px] max-w-[400px] grow items-center justify-center space-y-[16px] border-none bg-background shadow-none sm:w-auto sm:min-w-[343px]">
      <CardHeader className="p-0">
        <CardTitle>정보 입력하기</CardTitle>
        <CardDescription>바로 계정을 연결하세요!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="space-y-[6px]">
          <Label htmlFor="email">아이디</Label>
          <Input id="verifyCode" placeholder="@velroy" />
        </div>
        <div className="space-y-[6px]">
          <Label htmlFor="email">아이디</Label>
          <Input id="verifyCode" placeholder="@velroy" />
        </div>
        <div className="space-y-2">
          <OurColorCheckbox>모두 동의하기.</OurColorCheckbox>
          <OurCheckbox>이용약관에 동의합니다.</OurCheckbox>
          <OurCheckbox>이용약관에 동의합니다.</OurCheckbox>
        </div>
        <Button size={"long"}>MileQue 시작하기</Button>
      </CardContent>
    </Card>
  );
}
