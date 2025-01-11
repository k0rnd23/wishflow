import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteContext {
  params: { wishlistId: string }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { wishlistId } = context.params;

    // Verify the wishlist exists and belongs to the user
    const wishlist = await db.wishlist.findFirst({
      where: {
        id: wishlistId,
        userId: session.user.id
      }
    });

    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    const items = await db.wishItem.findMany({
      where: {
        wishlistId,
        wishlist: {
          userId: session.user.id
        }
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
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { wishlistId } = context.params;

    // Verify the wishlist exists and belongs to the user
    const wishlist = await db.wishlist.findFirst({
      where: {
        id: wishlistId,
        userId: session.user.id
      }
    });

    if (!wishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // If no category is provided, use the default category
    const categoryId = body.categoryId || "default";

    const item = await db.wishItem.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        url: body.url,
        wishlistId,
        currency: "KZT" // Default currency
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}