import React from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollArea } from "./Scroll-area";

export default function PageContainer({ children, scrollable = true }) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="flex flex-1 p-4 md:px-6">{children}</div>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 p-4 md:px-6">{children}</div>
      )}
    </>
  );
}
