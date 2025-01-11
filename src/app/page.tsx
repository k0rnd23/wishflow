"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle,
  Share2,
  Lock,
  GitPullRequest,
  ArrowRight
} from "lucide-react"

export default function Home() {
  const { data: session } = useSession()

  const features = [
    {
      title: "Smart Organization",
      description: "Organize your wishes into categories with smart filtering and sorting capabilities.",
      icon: GitPullRequest,
    },
    {
      title: "Secure & Private",
      description: "Your wishlists are private by default, only shared when you choose.",
      icon: Lock,
    },
    {
      title: "Easy Sharing",
      description: "Share your wishlists with friends and family with just one click.",
      icon: Share2,
    },
    {
      title: "Track Progress",
      description: "Monitor your wishlist completion and track item availability.",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <motion.h1 
            className="font-orbitron text-3xl sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Ultimate Wishlist Platform
          </motion.h1>
          <motion.p 
            className="max-w-[42rem] leading-normal text-emerald-400/80 sm:text-xl sm:leading-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create, organize, and share your wishlists with friends and family. 
            Track gifts, manage budgets, and make special occasions memorable.
          </motion.p>
          <motion.div 
            className="space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {session ? (
              <Button asChild size="lg" variant="cyber">
                <Link href="/wishlists">
                  Go to My Wishlists
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant="cyber">
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Everything you need to manage your wishlists efficiently.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg border bg-background p-2"
            >
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <feature.icon className="h-12 w-12 text-emerald-500" />
                <div className="space-y-2">
                  <h3 className="font-bold text-emerald-400">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}