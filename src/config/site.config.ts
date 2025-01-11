export const siteConfig = {
  name: "WishFlow",
  description: "Smart Wishlist Management Platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "https://your-domain.com/og.jpg",
  links: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourusername/wishflow"
  },
  creator: "Your Name"
}

export type SiteConfig = typeof siteConfig