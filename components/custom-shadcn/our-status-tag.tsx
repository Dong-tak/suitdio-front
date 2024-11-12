import {
  ThumbsUp,
  AlertTriangle,
  XOctagon,
  Baby,
  Lightbulb,
  Lock,
  Eye,
  Flame,
} from "lucide-react";
import React from "react";

export function GoodTag() {
  return (
    <div className="inline-flex h-6 items-center justify-center gap-1 rounded border border-[#2962ff] px-2">
      <ThumbsUp className="relative h-4 w-4 text-[#2962ff]" />
      <div className="font-['SUIT Variable'] text-xs font-semibold leading-none text-[#2962ff]">
        양호
      </div>
    </div>
  );
}

export function WarningTag() {
  return (
    <div className="inline-flex h-6 items-center justify-center gap-1 rounded border border-[#ffcc00] px-2">
      <AlertTriangle className="relative h-4 w-4 text-[#ffcc00]" />
      <div className="font-['SUIT Variable'] text-xs font-semibold leading-none text-[#ffcc00]">
        주의
      </div>
    </div>
  );
}

export function StopTag() {
  return (
    <div className="inline-flex h-6 items-center justify-center gap-1 rounded border border-[#d50000] px-2">
      <XOctagon className="relative h-4 w-4 text-[#d50000]" />
      <div className="font-['SUIT Variable'] text-xs font-semibold leading-none text-[#d50000]">
        중단
      </div>
    </div>
  );
}

interface NewTagProps {
  logo: boolean;
}

export function NewTag({ logo }: NewTagProps) {
  return (
    <div className="inline-flex h-6 items-center justify-center gap-1 rounded border border-[#aeea00] px-2">
      {logo && <Baby className="relative h-4 w-4 text-[#aeea00]" />}
      <div className="text-[#aeea00]">NEW</div>
    </div>
  );
}

export function RecommendTag() {
  return (
    <div className="inline-flex h-6 items-center justify-center gap-1 rounded border border-[#ffcc00] px-2">
      <Lightbulb className="relative h-4 w-4 text-[#ffcc00]" />
      <div className="font-['SUIT Variable'] text-xs font-semibold leading-none text-[#ffcc00]">
        추천
      </div>
    </div>
  );
}

export function HotTag() {
  return (
    <div className="inline-flex h-6 items-center justify-center gap-1 rounded border border-[#d50000] px-2 text-[#d50000]">
      <Flame className="relative h-4 w-4" />
      <div className="font-['SUIT Variable'] text-xs font-semibold leading-none">
        HOT
      </div>
    </div>
  );
}

export function PrivateTag() {
  return (
    <div className="inline-flex h-6 items-center justify-center gap-1 rounded border border-slate-500 px-2">
      <Lock className="relative h-4 w-4 text-slate-500" />
      <div className="font-['SUIT Variable'] text-xs font-semibold leading-none text-slate-500">
        비공개
      </div>
    </div>
  );
}

export function PublicTag() {
  return (
    <div className="inline-flex h-6 items-center justify-center gap-1 rounded border border-slate-900 px-2">
      <Eye className="relative h-4 w-4 text-slate-900" />
      <div className="font-['SUIT Variable'] text-xs font-semibold leading-none text-slate-900">
        공개
      </div>
    </div>
  );
}
