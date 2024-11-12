import {
  Bookmark,
  ChevronDown,
  FileDown,
  Link,
  Star,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarBtn } from "./sidebar-btn";
import { RoutePage } from "../route-setting";
import SocialLinkDialog from "../setting/sidebar-modul/sociallink-dialog";

export function SidebarDropdownBtn({ pos }: { pos: string }) {
  return (
    <div className="dropdown flex">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md hover:bg-accent hover:text-accent-foreground">
          <SidebarBtn asChild>
            <div className="flex items-center">
              {pos === "left" ? (
                <Star className="icon mr-2 size-4" />
              ) : (
                <ChevronDown className="icon mr-2 size-4" />
              )}
              <span>모음집</span>
            </div>
          </SidebarBtn>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" className="mt-1 flex flex-col">
          {/* SocialLinkDialog를 열 때 Dropdown이 닫히지 않도록 onSelect 이벤트를 막음 */}
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <SocialLinkDialog
              button={
                <div className="flex">
                  <Link className="icon mr-2 h-4 w-4" />
                  <span>계정연동</span>
                </div>
              }
            />
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <UserPlus className="icon mr-2 h-4 w-4" />
            <span>초대하기</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
