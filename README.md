# WishFlow

A modern wishlist app that doesn't suck. Built with Next.js 13 App Router and some other cool tech I wanted to try out.

## What's This?

Got tired of using generic todo lists for gift planning, so built this instead. It's a wishlist app where you can:

- Create wishlists and share them (or keep private)
- Track prices in different currencies (uses exchange rate API)
- Add notes and images to items
- Organize stuff with categories
- View other people's public wishlists

Built this mainly to try out Next.js 13 App Router and play with some new tech. Also wanted a proper wishlist app for myself.

## Tech Stack

- Next.js 13 (App Router)
- TypeScript
- Prisma + PostgreSQL
- TailwindCSS 
- NextAuth
- Some cool UI libs like Radix UI, Framer Motion

## Running Locally

You need Node.js 18+ and pnpm installed.

```bash
# Clone it
git clone https://github.com/yourusername/wishflow.git
cd wishflow

# Install deps
pnpm install

# Setup env vars - check .env.example
cp .env.example .env.local

# Setup DB
pnpm prisma generate
pnpm prisma db push

# Run it
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and you should see the app.

## Project Structure

```
src/
  ├─ app/           # Pages and API routes
  ├─ components/    # React components
  ├─ lib/           # Utils, configs etc
  └─ types/         # TypeScript types
```

Check out `src/app/api` for the API routes and `src/components/ui` for reusable UI components.

## Environment Variables

You'll need these in your `.env.local`:

```bash
DATABASE_URL=          # Your PostgreSQL URL
NEXTAUTH_URL=          # http://localhost:3000 in dev
NEXTAUTH_SECRET=       # Generate with `openssl rand -base64 32`
```

## Deployment

I'm using Vercel, but should work fine on any platform that supports Next.js.

## Notes

- UI is inspired by cyberpunk aesthetics because why not
- Uses shadcn/ui components as base
- Has dark mode by default (who uses light mode anyway?)
- Mobile responsive but looks best on desktop

## License

MIT - do whatever you want with it

---

This started as a weekend project but turned into something bigger. Feel free to open issues if you find bugs or have suggestions!