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
import { Github, Instagram } from "lucide-react";
import Link from "next/link";
import { OurFooter } from "./our-footer";

export function OurSignUp() {
  return (
    <Card className="max-h-[540px] max-w-[400px] grow items-center justify-center space-y-[16px] border-none bg-background shadow-none sm:w-auto sm:min-w-[343px]">
      <CardHeader className="p-0">
        <CardTitle className="text-center">회원가입</CardTitle>
        <CardDescription className="text-center">
          바로 계정을 연결하세요!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <Input id="email" placeholder="name@example.com" />
        <Button size={"long"}>Save changes</Button>
      </CardContent>
      <CardContent className="flex items-center p-0">
        <Separator />
        <div className="w-full text-center text-muted-foreground body-normal-body-01">
          OR Login WITH
        </div>
        <Separator />
      </CardContent>
      <CardContent className="space-y-2 p-0">
        <Button variant={"background"} size={"long"} className="gap-2">
          <Github className="h-4 w-4" />
          GitHub
        </Button>
        <Button variant={"background"} size={"long"} className="gap-2">
          <Instagram className="h-4 w-4" />
          Instagram
        </Button>
      </CardContent>
      <CardContent className="flex items-center justify-center py-6">
        <OurFooter />
      </CardContent>
    </Card>
  );
}
