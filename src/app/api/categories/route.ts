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

    const categories = await db.category.findMany({
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(categories)
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

    const { name } = await req.json()

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const category = await db.category.create({
      data: {
        name
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 })
  }
}