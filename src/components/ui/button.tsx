import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New futuristic variants
        neon: "relative bg-black border border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.5)] hover:shadow-[0_0_25px_rgba(52,211,153,0.7)] hover:bg-emerald-950/30 hover:scale-105 active:scale-95 transition-all duration-150",
        cyber: "relative overflow-hidden bg-black border-2 border-emerald-500 text-emerald-500 before:absolute before:inset-0 before:bg-emerald-500 before:translate-x-[-100%] hover:before:translate-x-[0%] before:transition-transform before:duration-300 hover:text-black hover:border-transparent",
        matrix: "relative bg-black text-emerald-400 border border-emerald-500/50 shadow-lg transition-all duration-300 hover:tracking-widest hover:scale-105 hover:shadow-emerald-500/20 hover:border-emerald-400 active:scale-95",
        hologram: "relative bg-transparent backdrop-blur-sm border border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] hover:border-emerald-400 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // New futuristic sizes
        pill: "h-10 px-6 rounded-full",
        wide: "h-10 px-8 rounded-md min-w-[160px]",
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