import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

type Context = {
  params: {
    itemId: string
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { itemId } = context.params
    const { image } = await request.json()

    if (!image) {
      return new NextResponse("Image is required", { status: 400 })
    }

    // Verify base64 image format
    if (!image.startsWith('data:image/')) {
      return new NextResponse("Invalid image format", { status: 400 })
    }

    // Verify the item belongs to the user's wishlist
    const existingItem = await db.wishItem.findFirst({
      where: {
        id: itemId,
        wishlist: {
          userId: session.user.id
        }
      }
    })

    if (!existingItem) {
      return new NextResponse("Not found", { status: 404 })
    }

    const updatedItem = await db.wishItem.update({
      where: {
        id: itemId
      },
      data: {
        image
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating item image:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { itemId } = context.params

    // Verify the item belongs to the user's wishlist
    const existingItem = await db.wishItem.findFirst({
      where: {
        id: itemId,
        wishlist: {
          userId: session.user.id
        }
      }
    })

    if (!existingItem) {
      return new NextResponse("Not found", { status: 404 })
    }

    const updatedItem = await db.wishItem.update({
      where: {
        id: itemId
      },
      data: {
        image: null
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error removing item image:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}