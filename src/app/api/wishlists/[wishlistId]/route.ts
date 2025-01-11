import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

interface RouteContext {
  params: { wishlistId: string };
}

export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { wishlistId } = params;

    // Verify the wishlist belongs to the user
    const wishlist = await db.wishlist.findFirst({
      where: {
        id: wishlistId,
        userId: session.user.id,
      },
    });

    if (!wishlist) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Delete all related items and notes first
    await db.note.deleteMany({
      where: {
        wishItem: {
          wishlistId: wishlistId
        }
      }
    });

    await db.wishItem.deleteMany({
      where: {
        wishlistId: wishlistId
      }
    });

    // Finally delete the wishlist
    await db.wishlist.delete({
      where: {
        id: wishlistId,
      },
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}