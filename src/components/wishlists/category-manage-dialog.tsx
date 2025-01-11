"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Tag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Category } from "@prisma/client"

interface CategoryManageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CategoryManageDialog({
  open,
  onOpenChange,
  onSuccess,
}: CategoryManageDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")

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
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      toast({
        title: "Success",
        description: "Category created successfully",
      })

      setNewCategoryName("")
      onSuccess()
      fetchCategories()
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

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })

      fetchCategories()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        
        {/* Current Categories */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 rounded-md bg-secondary group relative"
                >
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  {category.id !== "default" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute right-1"
                      onClick={() => handleDelete(category.id)}
                    >
                      <X className="h-3 w-3 text-destructive" />
                      <span className="sr-only">Delete category</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Category Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">New Category Name</Label>
              <div className="flex space-x-2">
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !newCategoryName.trim()}
                  size="icon"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}