"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { WishItemCard } from "@/components/wishlists/wish-item-card"
import { SearchBar } from "@/components/wishlists/search-bar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { WishItem, Wishlist, User } from "@prisma/client"

interface SharedWishlistProps {
  params: {
    wishlistId: string
  }
}

interface WishlistWithUser extends Wishlist {
  user: User
  isOwner: boolean
}

export default function SharedWishlistPage({ params }: SharedWishlistProps) {
  const router = useRouter()
  const [wishlist, setWishlist] = useState<WishlistWithUser | null>(null)
  const [items, setItems] = useState<WishItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [params.wishlistId])

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`/api/shared/${params.wishlistId}`)
      
      if (response.status === 403) {
        setError("This wishlist is private")
        setIsLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }

      const data = await response.json()
      setWishlist(data.wishlist)
      setItems(data.items)
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
      setError("Wishlist not found")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = items.filter(item =>
    searchQuery === "" ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!wishlist) return null

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{wishlist.title}</h1>
        {wishlist.description && (
          <p className="text-muted-foreground mb-4">{wishlist.description}</p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Created by {wishlist.user.name}</span>
          <span>•</span>
          <span>Public Wishlist</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <WishItemCard 
              key={item.id} 
              item={item}
              wishlistOwnerId={wishlist.user.id}
              onUpdate={fetchWishlist}
              isShared
            />
          ))}
        </div>
      )}
    </div>
  )
}