import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const wishlists = await db.wishlist.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(wishlists)
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, description, categoryId, isPrivate } = await req.json()

    if (!title) {
      return new NextResponse("Title is required", { status: 400 })
    }

    // Check if the provided category ID is valid
    if (categoryId) {
      const categoryExists = await db.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!categoryExists) {
        return new NextResponse("Invalid category ID", { status: 400 });
      }
    }

    const wishlist = await db.wishlist.create({
      data: {
        title,
        description,
        userId: session.user.id,
        categoryId,
        isPrivate
      }
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Error creating wishlist:", error instanceof Error ? error.message : error);
    return new NextResponse("Internal error", { status: 500 })
  }
}