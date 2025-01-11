"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface AddNoteDialogProps {
  itemId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddNoteDialog({
  itemId,
  open,
  onOpenChange,
  onSuccess,
}: AddNoteDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await fetch(`/api/items/${itemId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: formData.get("content"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add note")
      }

      toast({
        title: "Success",
        description: "Note added successfully",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Note</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Add your note here..."
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Note
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}