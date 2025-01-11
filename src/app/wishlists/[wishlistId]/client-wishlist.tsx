"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddItemDialog } from "@/components/wishlists/add-item-dialog"
import { WishItemCard } from "@/components/wishlists/wish-item-card"
import { CategorySelect } from "@/components/wishlists/category-select"
import { SearchBar } from "@/components/wishlists/search-bar"
import { DeleteWishlistDialog } from "@/components/wishlists/delete-wishlist-dialog"
import type { WishItem, Wishlist } from "@prisma/client"

interface ClientWishlistProps {
  wishlistId: string
  initialWishlist: Wishlist | null
}

export function ClientWishlist({ wishlistId, initialWishlist }: ClientWishlistProps) {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState<Wishlist | null>(initialWishlist)
  const [items, setItems] = useState<WishItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/wishlists/${wishlistId}/items`)
      if (!response.ok) {
        throw new Error('Failed to fetch items')
      }
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Failed to fetch items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [wishlistId])

  const filteredItems = items
    .filter(item => 
      selectedCategory === "all" || item.categoryId === selectedCategory
    )
    .filter(item =>
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

  if (!wishlist) {
    return <div className="container py-8">Wishlist not found</div>
  }

  if (isLoading) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{wishlist.title}</h1>
          <p className="text-muted-foreground">{wishlist.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <DeleteWishlistDialog 
            wishlistId={wishlistId} 
            wishlistTitle={wishlist.title}
          />
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <CategorySelect
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
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
              onUpdate={fetchItems}
            />
          ))}
        </div>
      )}

      <AddItemDialog
        wishlistId={wishlistId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchItems}
      />
    </div>
  )
}