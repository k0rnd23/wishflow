"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface WishlistSummary {
  id: string
  title: string
  totalItems: number
  completedItems: number
}

export function WishlistOverview() {
  const [wishlists, setWishlists] = useState<WishlistSummary[]>([])

  useEffect(() => {
    fetchWishlists()
  }, [])

  const fetchWishlists = async () => {
    try {
      const response = await fetch("/api/dashboard/wishlists")
      const data = await response.json()
      setWishlists(data)
    } catch (error) {
      console.error("Failed to fetch wishlists:", error)
    }
  }

  return (
    <div className="space-y-4">
      {wishlists.map((wishlist) => (
        <Link key={wishlist.id} href={`/wishlists/${wishlist.id}`}>
          <Card className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{wishlist.title}</h3>
              <span className="text-sm text-muted-foreground">
                {wishlist.completedItems} / {wishlist.totalItems} items
              </span>
            </div>
            <Progress 
              value={(wishlist.completedItems / wishlist.totalItems) * 100} 
              className="h-2"
            />
          </Card>
        </Link>
      ))}
    </div>
  )
}