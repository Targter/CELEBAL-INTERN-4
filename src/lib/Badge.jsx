// 1. Imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot"; // Enables polymorphic components
import { cva } from "class-variance-authority"; // For managing class variants
// import { cn } from "@/lib/utils"; // Utility function for merging Tailwind classes
import { cn } from "./utils";
// 2. Define variants using class-variance-authority
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// 3. Badge Component
// type BadgeProps = React.ComponentProps<"span"> &
//   VariantProps<typeof badgeVariants> & {
//     asChild?: boolean,
//   };

function Badge({ className, variant, asChild = false, ...props }) {
  // Use Slot if asChild is true, else render a <span>
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
