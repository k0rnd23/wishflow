import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name, email, preferredCurrency } = await req.json()

    if (!name || !email) {
      return new NextResponse("Name and email are required", { status: 400 })
    }

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await db.user.findUnique({
        where: {
          email,
          NOT: {
            id: session.user.id
          }
        }
      })

      if (existingUser) {
        return new NextResponse("Email already taken", { status: 400 })
      }
    }

    const user = await db.user.update({
      where: {
        id: session.user.id
      },
      data: {
        name,
        email,
        preferredCurrency,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}