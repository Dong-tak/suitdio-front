import Image from "next/image";
import { Button } from "@/components/ui/button";

// 소셜 버튼 컴포넌트
interface SocialTagProps {
  size: "sm" | "default";
  social?:
    | "discord"
    | "youtube"
    | "instagram"
    | "facebook"
    | "tiktok"
    | "linkedin"
    | "messenger"
    | "X (twitter)";
  logo:
    | "/social-media/icon-discord.png"
    | "/social-media/icon-youtube.png"
    | "/social-media/icon-instagram.png"
    | "/social-media/icon-facebook.png"
    | "/social-media/icon-tiktok.png"
    | "/social-media/icon-linkedin.png"
    | "/social-media/icon-messenger.png"
    | "/social-media/icon-x-twitter.png";
}

export function SocialTag({ logo, social, size }: SocialTagProps) {
  let buttonClassName =
    "h-6 bg-background hover:bg-background inline-flex justify-center items-center hover:none";
  // 아이콘만 있는 버튼
  if (size === "sm") {
    return (
      <div className={`${buttonClassName} w-max-[32px] h-max-[24px]`}>
        <div className="flex h-full w-full items-center justify-center gap-1 rounded border border-slate-900 px-2">
          <Image src={logo} width={16} height={16} alt={logo} />
        </div>
      </div>
    );

    // 글자 있는 버튼
  } else if (size === "default") {
    return (
      <div
        className={`${buttonClassName} gap-1 rounded border border-slate-900 px-2 py-1`}
      >
        <Image src={logo} width={16} height={16} alt={social || ""} />
        <span className="text-sm font-bold text-gray-900">{social}</span>
      </div>
    );
  }
}
