"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"

interface ShareDialogProps {
  wishlistId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({
  wishlistId,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/shared/${wishlistId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Wishlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Share this link with your friends to let them see your wishlist.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}