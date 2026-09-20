import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-brand-pink text-white hover:bg-brand-pink-dark active:scale-[0.98] shadow-none",
        secondary:
          "bg-white text-foreground border border-border hover:border-brand-pink/50 hover:bg-brand-pink-soft/30 active:scale-[0.98]",
        outline:
          "border border-brand-pink text-brand-pink hover:bg-brand-pink-soft/40 active:scale-[0.98]",
        ghost:
          "text-foreground hover:bg-brand-pink-soft/40 hover:text-brand-pink-dark active:scale-[0.98]",
        accent:
          "bg-brand-pink text-white hover:bg-brand-pink-dark active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
        link: "text-brand-pink underline-offset-4 hover:underline hover:text-brand-pink-dark p-0 h-auto rounded-none",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base font-medium",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
