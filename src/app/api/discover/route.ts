import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const wishlists = await db.wishlist.findMany({
      where: {
        isPrivate: false
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(wishlists)
  } catch (error) {
    console.error("Error fetching public wishlists:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}