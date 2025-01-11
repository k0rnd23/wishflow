"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession } from "next-auth/react"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NavBar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Base routes that don't require authentication
  const publicRoutes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/"
    },
    {
      href: "/discover",
      label: "Discover",
      active: pathname === "/discover"
    }
  ]

  // Routes that require authentication
  const authRoutes = session ? [
    {
      href: "/wishlists",
      label: "My Wishlists",
      active: pathname.startsWith("/wishlists")
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard"
    }
  ] : []

  // Combine routes
  const allRoutes = [...publicRoutes, ...authRoutes]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo - Always visible */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">WishFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {allRoutes.map((route) => (
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

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] mt-2">
                {allRoutes.map((route) => (
                  <DropdownMenuItem key={route.href} asChild>
                    <Link
                      href={route.href}
                      className={cn(
                        "w-full",
                        route.active ? "text-foreground" : "text-foreground/60"
                      )}
                    >
                      {route.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {!session ? (
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full">
                      Login
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:block">
            {!session ? (
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}