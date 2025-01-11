import { db } from "@/lib/db"
import { hash } from "bcryptjs"

async function main() {
  try {
    // Create default category if it doesn't exist
    const existingCategory = await db.category.findUnique({
      where: { id: "default" }
    })

    if (!existingCategory) {
      await db.category.create({
        data: {
          id: "default",
          name: "General"
        }
      })
    }

    // Check if a user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email: "test@example.com" }
    })

    if (!existingUser) {
      // Create a test user with hashed password
      const hashedPassword = await hash("testpassword", 12)
      const user = await db.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: hashedPassword,
          preferredCurrency: "USD"
        }
      })

      // Optionally create a sample wishlist
      await db.wishlist.create({
        data: {
          title: "My First Wishlist",
          description: "Sample wishlist for testing",
          userId: user.id,
          categoryId: "default",
          isPrivate: false
        }
      })
    }

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Seeding error:", error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

main()
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })