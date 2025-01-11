import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { categoryId } = params

    // Don't allow deletion of default category
    if (categoryId === "default") {
      return new NextResponse("Cannot delete default category", { status: 400 })
    }

    // Move all wishlists from this category to default category
    await db.wishlist.updateMany({
      where: {
        categoryId
      },
      data: {
        categoryId: "default"
      }
    })

    // Delete the category
    await db.category.delete({
      where: {
        id: categoryId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}