# WishFlow

A modern wishlist management platform built with Next.js 13 App Router and advanced technologies.

## Project Overview

<div align="center">
  <img src="/public/screenshots/dashboard.png" alt="WishFlow Dashboard" width="800"/>
  <p align="center">WishFlow Dashboard: Centralized wishlist management</p>
</div>

WishFlow is a comprehensive wishlist application designed to streamline gift planning and personal item tracking. The platform offers robust features for creating, managing, and sharing wishlists while maintaining a sleek, cyberpunk-inspired interface.

## Core Features

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
  <div>
    <img src="/public/screenshots/wishlists.png" alt="Wishlist Management" width="400"/>
    <p align="center">Organized Wishlist Management</p>
  </div>
  <div>
    <img src="/public/screenshots/items.png" alt="Item Details" width="400"/>
    <p align="center">Detailed Item Tracking</p>
  </div>
</div>

- Advanced wishlist creation with privacy controls
- Real-time currency conversion across multiple currencies
- Comprehensive media attachment system
- Intuitive category organization
- Public wishlist discovery

## Technology Stack

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

## Interface Overview

<div align="center">
  <img src="/public/screenshots/mainmenu.png" alt="Main Interface" width="800"/>
  <p align="center">Intuitive Main Interface with Cyberpunk Aesthetics</p>
</div>

- Secure Authentication (NextAuth.js)
- Real-time Currency Conversion
- Rich Media Support
- Category Management
- Social Discovery
- Mobile Responsive Design

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
