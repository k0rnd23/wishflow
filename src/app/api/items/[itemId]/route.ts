import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

type Context = {
  params: {
    itemId: string
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { itemId } = context.params
    const body = await request.json()

    // Allow partial updates, only validate fields that are present in the body
    if (body.title && body.title.length === 0) {
      return new NextResponse("Title cannot be empty if provided", { status: 400 })
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

    // Update only the fields that are present in the request body
    const dataToUpdate: {
      title?: string
      description?: string
      price?: number
      url?: string
      completed?: boolean
    } = {}

    if (body.title !== undefined) dataToUpdate.title = body.title
    if (body.description !== undefined) dataToUpdate.description = body.description
    if (body.price !== undefined) dataToUpdate.price = body.price
    if (body.url !== undefined) dataToUpdate.url = body.url
    if (body.completed !== undefined) dataToUpdate.completed = body.completed

    const item = await db.wishItem.update({
      where: {
        id: itemId
      },
      data: dataToUpdate
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error updating item:", error)
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

    await db.wishItem.delete({
      where: {
        id: itemId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting item:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}