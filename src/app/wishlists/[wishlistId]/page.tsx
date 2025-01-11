import { ClientWishlist } from "./client-wishlist"
import { db } from "@/lib/db"
import { Suspense } from "react"

interface Props {
  params: Promise<{ wishlistId: string }>
}

export default async function WishlistPage({ params }: Props) {
  const resolvedParams = await params
  const wishlistId = resolvedParams.wishlistId

  const wishlist = await db.wishlist.findUnique({
    where: {
      id: wishlistId
    }
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWishlist wishlistId={wishlistId} initialWishlist={wishlist} />
    </Suspense>
  )
}