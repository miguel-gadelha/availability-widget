"use client";

import { TeamContext } from "@/app/context/TeamContext";
import { useContext } from "react";
import SmallButton from "../ui/SmallButton";
import { LogOut, UserCog } from "lucide-react";
import LogOutButton from "./LogOutButton";
interface Props {
  className?: string;
}

const Header = ({ className }: Props) => {
  const context = useContext(TeamContext);

  if (!context) {
    return null;
  }

  return (
    <section
      className={`flex items-center justify-center gap-10 self-stretch bg-slate-800 py-6 ${className}`}
    >
      <div className="w-2/3 flex justify-between items-center">
        <h1 className="text-slate-50 text-2xl font-semibold leading-none">
          {context.name}
        </h1>
        <nav className="flex">
          <SmallButton className="mr-6" disabled>
            <UserCog width={16} height={16} />
          </SmallButton>

          <LogOutButton />
        </nav>
      </div>
    </section>
  );
};

export default Header;
