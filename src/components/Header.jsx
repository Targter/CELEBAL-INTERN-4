import React from "react";
import { ThemeSelector } from "../theme/ThemeSelector";
// import { ModeToggle } from "./ThemeToggle/theme-toggle";
import { ModeToggle } from "../theme/ThemeToggle";
// import CtaGithub from "./cta-github";
export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 ">
      <div className="flex items-center justify-end w-full gap-2 px-4  p-2">
        <ModeToggle />
      </div>
    </header>
  );
}
