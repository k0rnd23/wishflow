"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface WishlistWithUser {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  user: {
    name: string;
  };
  _count: {
    items: number;
  };
}

export default function DiscoverPage() {
  const [wishlists, setWishlists] = useState<WishlistWithUser[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWishlists()
  }, [])

  const fetchWishlists = async () => {
    try {
      setError(null)
      const response = await fetch('/api/discover')
      if (!response.ok) {
        throw new Error('Failed to fetch wishlists')
      }
      const data = await response.json()
      setWishlists(data)
    } catch (error) {
      console.error('Failed to fetch wishlists:', error)
      setError('Failed to load wishlists. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredWishlists = wishlists.filter(wishlist => 
    searchQuery === "" || 
    wishlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wishlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-emerald-500">Discover Wishlists</h1>
          <p className="text-muted-foreground">
            Explore public wishlists shared by the community
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wishlists..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[200px] animate-pulse bg-accent/50 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-destructive">{error}</h3>
            <button
              onClick={fetchWishlists}
              className="mt-4 text-sm text-emerald-500 hover:text-emerald-400"
            >
              Try Again
            </button>
          </div>
        ) : filteredWishlists.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No wishlists found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Check back later for new wishlists"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWishlists.map((wishlist) => (
              <motion.div
                key={wishlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/shared/${wishlist.id}`}>
                  <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer group">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{wishlist.title}</CardTitle>
                      {wishlist.description && (
                        <CardDescription className="line-clamp-2">
                          {wishlist.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>By {wishlist.user.name}</span>
                        <span>{wishlist._count.items} items</span>
                      </div>
                      <div className="mt-2 text-xs text-emerald-500/50">
                        Created {formatDate(wishlist.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}