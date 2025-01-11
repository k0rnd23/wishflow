"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DeleteWishlistDialog } from "./delete-wishlist-dialog"
import { formatDate } from "@/lib/utils"
import type { Wishlist } from "@prisma/client"

interface WishlistCardProps {
  wishlist: Wishlist
}

export function WishlistCard({ wishlist }: WishlistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DeleteWishlistDialog
          wishlistId={wishlist.id}
          wishlistTitle={wishlist.title}
        />
      </div>

      <Link href={`/wishlists/${wishlist.id}`}>
        <Card 
          variant="neon" 
          className="group cursor-pointer overflow-hidden transition-all duration-300"
        >
          <CardHeader>
            <CardTitle className="line-clamp-1">{wishlist.title}</CardTitle>
            <CardDescription className="mt-2 space-y-2">
              {wishlist.description && (
                <p className="line-clamp-2 text-emerald-400/70">
                  {wishlist.description}
                </p>
              )}
              <div className="flex items-center text-xs text-emerald-500/50">
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <span>Created {formatDate(wishlist.createdAt)}</span>
                </motion.div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  )
}