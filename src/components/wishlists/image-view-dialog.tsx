"use client"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageViewDialogProps {
  src: string
  alt: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageViewDialog({
  src,
  alt,
  open,
  onOpenChange,
}: ImageViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] p-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-50"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="relative w-full max-h-[90vh] overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}