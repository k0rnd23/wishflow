import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

interface RouteContext {
  params: { itemId: string }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { itemId } = await context.params
    const { content } = await req.json()

    if (!content) {
      return new NextResponse("Content is required", { status: 400 })
    }

    // Verify the item belongs to the user's wishlist
    const item = await db.wishItem.findFirst({
      where: {
        id: itemId,
        wishlist: {
          userId: session.user.id
        }
      }
    })

    if (!item) {
      return new NextResponse("Not found", { status: 404 })
    }

    const note = await db.note.create({
      data: {
        content,
        wishItemId: itemId
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error creating note:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { itemId } = await context.params
    const { searchParams } = new URL(req.url)
    const noteId = searchParams.get('noteId')

    if (!noteId) {
      return new NextResponse("Note ID is required", { status: 400 })
    }

    // Verify the item and note belong to the user
    const item = await db.wishItem.findFirst({
      where: {
        id: itemId,
        wishlist: {
          userId: session.user.id
        },
        notes: {
          some: {
            id: noteId
          }
        }
      }
    })

    if (!item) {
      return new NextResponse("Not found", { status: 404 })
    }

    await db.note.delete({
      where: {
        id: noteId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting note:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}