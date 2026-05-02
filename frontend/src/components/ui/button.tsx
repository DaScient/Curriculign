import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm shadow-indigo-200/60 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-200/70",
        destructive: "bg-rose-500/90 text-white hover:bg-rose-500",
        outline:
          "border border-white/70 bg-white/60 text-slate-700 backdrop-blur hover:-translate-y-0.5 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm",
        secondary:
          "border border-white/60 bg-white/70 text-slate-700 backdrop-blur hover:bg-white/90",
        ghost:
          "text-slate-700 hover:bg-white/60 hover:text-slate-900",
        link: "text-indigo-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
