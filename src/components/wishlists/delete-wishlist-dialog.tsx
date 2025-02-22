"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface DeleteWishlistDialogProps {
  wishlistId: string
  wishlistTitle: string
}

export function DeleteWishlistDialog({ wishlistId, wishlistTitle }: DeleteWishlistDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/wishlists/${wishlistId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete wishlist')
      }

      toast({
        title: "Wishlist deleted",
        description: "Your wishlist has been successfully deleted.",
      })
      router.push('/wishlists')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the wishlist. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-destructive/90 hover:text-white"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 text-destructive hover:text-white" />
        <span className="sr-only">Delete Wishlist</span>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{wishlistTitle}&quot;? This action cannot be undone
              and all items within this wishlist will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                'Delete Wishlist'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}