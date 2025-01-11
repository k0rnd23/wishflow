"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Category } from "@prisma/client"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  categories: Category[]
}

export function CategoryDialog({
  open,
  onOpenChange,
  onSuccess,
  categories,
}: CategoryDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      toast({
        title: "Success",
        description: "Category created successfully",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Existing Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 rounded-md bg-secondary"
                >
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">New Category Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter category name"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Category
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}