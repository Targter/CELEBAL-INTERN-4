// import { IconBrightness } from "@tabler/icons-react";
// import { useTheme } from "next-themes";
// import * as React from "react";

// // import { Button } from "@/components/ui/button";
// import { Button } from "../components/Button/Button";

// export function ModeToggle() {
//   const { setTheme, resolvedTheme } = useTheme();

//   const handleThemeToggle = React.useCallback(
//     (e) => {
//       console.log("called..");
//       const newMode = resolvedTheme === "dark" ? "light" : "dark";
//       const root = document.documentElement;

//       if (!document.startViewTransition) {
//         setTheme(newMode);
//         return;
//       }

//       // Set coordinates from the click event
//       if (e) {
//         root.style.setProperty("--x", `${e.clientX}px`);
//         root.style.setProperty("--y", `${e.clientY}px`);
//       }

//       document.startViewTransition(() => {
//         setTheme(newMode);
//       });
//     },
//     [resolvedTheme, setTheme]
//   );

//   return (
//     <Button
//       variant="secondary"
//       size="icon"
//       className="group/toggle size-8"
//       onClick={handleThemeToggle}
//     >
//       <IconBrightness />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// }

//

import { IconBrightness } from "@tabler/icons-react";
import * as React from "react";
import { useThemeConfig } from "./ActiveTheme";
// import { useThemeConfig } from "../../theme/ActiveTheme"; // Update path as needed
import { Button } from "../components/Button/Button";

export function ModeToggle() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  const handleThemeToggle = React.useCallback(
    (e) => {
      const newTheme = activeTheme === "dark" ? "light" : "dark";
      const root = document.documentElement;
      console.log("root", root);
      console.log("newThemeee:", newTheme);
      // Fallback if view transitions aren't supported
      if (!document.startViewTransition) {
        console.log("calling...");
        setActiveTheme(newTheme);
        return;
      }

      // Set click coordinates for the transition
      if (e) {
        root.style.setProperty("--x", `${e.clientX}px`);
        root.style.setProperty("--y", `${e.clientY}px`);
      }

      // Smooth transition
      document.startViewTransition(() => {
        setActiveTheme(newTheme);
      });

      // Optional: Handle animation ready state
      //   transition.ready.then(() => {
      //     // You could add additional animation logic here
      //   });
    },
    [activeTheme, setActiveTheme]
  );

  return (
    <Button
      variant="secondary"
      size="icon"
      className="group/toggle size-8 ml-11"
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
    >
      <IconBrightness className="transition-transform group-hover/toggle:scale-110" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
