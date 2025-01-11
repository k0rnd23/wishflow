import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { wishlistId: string } }
) {
  try {
    const wishlist = await db.wishlist.findUnique({
      where: {
        id: params.wishlistId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!wishlist) {
      return new NextResponse("Not found", { status: 404 })
    }

    // Check if wishlist is private
    if (wishlist.isPrivate) {
      return new NextResponse("This wishlist is private", { status: 403 })
    }

    // Get items for public wishlist
    const items = await db.wishItem.findMany({
      where: {
        wishlistId: params.wishlistId
      },
      include: {
        notes: {
          orderBy: {
            createdAt: "desc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ 
      wishlist: {
        ...wishlist,
        isOwner: false
      }, 
      items 
    })
  } catch (error) {
    console.error("Error fetching shared wishlist:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}