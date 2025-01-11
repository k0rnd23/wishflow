"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/ui/error-message"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full">
        <ErrorMessage
          title="Something went wrong!"
          message="An unexpected error occurred. Please try again."
          retry={reset}
        />
      </div>
    </div>
  )
}