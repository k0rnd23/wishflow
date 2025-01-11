import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/">
          <Home className="h-4 w-4 mr-2" />
          Return Home
        </Link>
      </Button>
    </div>
  )
}