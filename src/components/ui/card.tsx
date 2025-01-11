import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "futuristic" | "hologram" | "neon"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "rounded-lg border bg-card text-card-foreground shadow-sm",
    futuristic: "rounded-xl border-2 border-emerald-500/30 bg-black/80 backdrop-blur-sm text-card-foreground shadow-[0_0_25px_rgba(52,211,153,0.2)] hover:shadow-[0_0_35px_rgba(52,211,153,0.3)] transition-all duration-300",
    hologram: "rounded-xl border border-emerald-400/20 bg-emerald-950/10 backdrop-blur-md text-card-foreground shadow-lg relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-emerald-500/5 before:to-transparent",
    neon: "rounded-xl border border-emerald-500 bg-black text-card-foreground shadow-[0_0_25px_rgba(52,211,153,0.3)] relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-b after:from-emerald-500/10 after:via-transparent after:to-transparent",
  }

  return (
    <div
      ref={ref}
      className={cn(variantStyles[variant], className)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }