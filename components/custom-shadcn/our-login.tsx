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

export function OurLogIn() {
  return (
    <Card className="max-h-[540px] max-w-[400px] grow items-center justify-center space-y-[16px] border-none bg-background shadow-none sm:w-auto sm:min-w-[343px]">
      <CardHeader className="p-0">
        <CardTitle className="h-auto w-full text-center">로그인</CardTitle>
        <CardDescription className="text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="h-auto w-full space-y-4 p-0">
        <div className="space-y-[6px]">
          <Label htmlFor="email" className="h-10">
            Email
          </Label>
          <Input id="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-[6px]">
          <Label htmlFor="password" className="h-10">
            Password
          </Label>
          <Input id="password" />
        </div>
        <Button size={"long"}>Save changes</Button>
      </CardContent>
      <CardContent className="flex h-auto w-full items-center p-0">
        <Separator />
        <div className="w-full text-center text-muted-foreground body-normal-body-01">
          OR Login WITH
        </div>
        <Separator />
      </CardContent>
      <CardContent className="h-auto w-full space-y-2 p-0">
        <Button variant={"background"} size={"long"} className="gap-2">
          <Github className="h-4 w-4" />
          GitHub
        </Button>
        <Button variant={"background"} size={"long"} className="gap-2">
          <Instagram className="h-4 w-4" />
          Instagram
        </Button>
      </CardContent>
      <CardContent className="flex h-auto w-full items-center justify-center py-6">
        <div>Don&apos;t have an account?&nbsp;&nbsp;</div>
        <Link
          href={"/signup"}
          className="flex underline underline-offset-2 hover:scale-105 hover:opacity-60"
        >
          Sign up
        </Link>
      </CardContent>
    </Card>
  );
}
