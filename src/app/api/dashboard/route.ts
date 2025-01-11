import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { convertCurrency, formatCurrency } from "@/lib/currency";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's preferred currency from the database
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        preferredCurrency: true,
      },
    });

    // Get preferred currency from query or user's setting, default to USD
    const url = new URL(req.url);
    const preferredCurrency =
      url.searchParams.get("currency") || user?.preferredCurrency || "USD";

    const [wishlists, items] = await Promise.all([
      // Get all wishlists
      db.wishlist.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          items: {
            select: {
              price: true,
              currency: true,
              completed: true,
              updatedAt: true,
              notes: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      }),

      // Get all items for recent activity
      db.wishItem.findMany({
        where: {
          wishlist: {
            userId: session.user.id,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
        include: {
          wishlist: {
            select: {
              title: true,
            },
          },
          notes: true,
        },
      }),
    ]);

    // Calculate stats
    let totalValue = 0;
    let totalItems = 0;
    let completedItems = 0;

    // Convert all prices to preferred currency
    await Promise.all(
      wishlists.flatMap((wishlist) =>
        wishlist.items.map(async (item) => {
          if (item.price !== null) {
            const convertedPrice = await convertCurrency(
              item.price,
              item.currency,
              preferredCurrency
            );

            if (typeof convertedPrice === "number") {
              totalValue += convertedPrice;
            }
          }
          if (item.price === null) {
            console.log(
              `Item with ID ${item.id} has a null price. Skipping...`
            );
          }
          totalItems++;
          if (item.completed) completedItems++;
        })
      )
    );

    // Calculate completion rate
    const completionRate =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Sort items by note count for popularity
    const popularItems = items
      .sort((a, b) => b.notes.length - a.notes.length)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        title: item.title,
        wishlistTitle: item.wishlist.title,
        noteCount: item.notes.length,
      }));

    // Format recent activity
    const recentActivity = items.map((item) => ({
      id: item.id,
      type: "update",
      title: `Updated "${item.title}" in ${item.wishlist.title}`,
      timestamp: item.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      totalWishlists: wishlists.length,
      totalItems,
      completedItems,
      completionRate,
      totalValue: {
        amount: totalValue,
        formatted: formatCurrency(totalValue, preferredCurrency),
        currency: preferredCurrency,
      },
      recentActivity,
      popularItems,
      currency: preferredCurrency,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}