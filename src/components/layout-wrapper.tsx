"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LoadingScreen } from "./loading-screen"
import { useState, useEffect } from "react"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for demo
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="min-h-screen bg-gradient-to-b from-black via-emerald-950/30 to-black"
        >
          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(16,185,129,0.1),transparent)]" />
            <motion.div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
              animate={{
                backgroundPosition: ["0px 0px", "100px 100px"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </div>
          
          {/* Main content */}
          <div className="relative">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}