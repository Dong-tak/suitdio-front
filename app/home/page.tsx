"use client";

import { Input } from "@/components/ui/input";
import SvgIcon from "@/lib/utils/svgIcon";
import { sixBoltSvg, pauseSvg, recordSvg } from "@/lib/utils/svgBag";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import HomeView from "@/components/home/homeview";

export default function Home() {
  return (
    <div>
      <HomeView
        contentTitle="test"
        handleInputChange={() => {}}
        handleSaveClick={() => {}}
        open={false}
        onOpenChange={() => {}}
      />
    </div>
  );
}
