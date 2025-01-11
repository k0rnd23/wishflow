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

    const activities = await db.activity.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      include: {
        wishlist: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json(activities)
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}