import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 })
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    return new NextResponse(
      "Something went wrong",
      { status: 500 }
    )
  }
}