"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession } from "next-auth/react"

export default function NavBar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/"
    },
    {
      href: "/discover",
      label: "Discover",
      active: pathname === "/discover"
    },
    ...(session ? [
      {
        href: "/wishlists",
        label: "My Wishlists",
        active: pathname === "/wishlists"
      }
    ] : [])
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">WishFlow</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  route.active ? "text-foreground" : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {session ? (
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}