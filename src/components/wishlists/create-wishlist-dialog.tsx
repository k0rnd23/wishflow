"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Settings, Lock, Globe, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CategoryManageDialog } from "./category-manage-dialog"
import type { Category } from "@prisma/client"

interface CreateWishlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateWishlistDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateWishlistDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("default")
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)

  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await fetch("/api/wishlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          categoryId: selectedCategory,
          isPrivate: isPrivate
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create wishlist")
      }

      toast({
        title: "Success",
        description: "Wishlist created successfully",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wishlist",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="My Wishlist"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What's this wishlist for?"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Category</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setIsCategoryDialogOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="private">Visibility</Label>
                <div className="flex items-center text-sm text-muted-foreground">
                  {isPrivate ? (
                    <Lock className="mr-2 h-4 w-4" />
                  ) : (
                    <Globe className="mr-2 h-4 w-4" />
                  )}
                  {isPrivate ? "Private - Only you can see this" : "Public - Anyone with the link can view"}
                </div>
              </div>
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Wishlist
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <CategoryManageDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSuccess={fetchCategories}
      />
    </>
  )
}