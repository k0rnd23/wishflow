import "@/styles/globals.css"
import { Orbitron, Rajdhani } from 'next/font/google'
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site.config"
import NavBar from "@/components/nav-bar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Analytics } from '@vercel/analytics/react'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Wishlist",
    "Gift Registry",
    "Gift Management",
    "Social Wishlists",
  ],
  authors: [
    {
      name: siteConfig.creator,
    },
  ],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: siteConfig.creator,
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteConfig.name,
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#000000',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions)

  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={cn(
        'dark',
        orbitron.variable,
        rajdhani.variable,
      )}
    >
      <head />
      <body className={cn(
        "min-h-screen bg-background font-rajdhani antialiased",
        "selection:bg-emerald-500/20 selection:text-emerald-500",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-emerald-600/20 hover:scrollbar-thumb-emerald-500/30",
      )}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {/* Animated background patterns */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(16,185,129,0.1),transparent)]" />
              <div
                className="absolute inset-0 opacity-[0.02] bg-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Main layout */}
            <LayoutWrapper>
              <div className="relative flex min-h-screen flex-col">
                <NavBar />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </LayoutWrapper>

            {/* Toast notifications */}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  )
}