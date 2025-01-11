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
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface DeleteItemDialogProps {
  itemId: string
  itemTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteItemDialog({ 
  itemId, 
  itemTitle, 
  open,
  onOpenChange,
  onSuccess 
}: DeleteItemDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      toast({
        title: "Item deleted",
        description: "The item has been successfully deleted.",
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border border-red-500/20 bg-black/90 backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">Delete Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{itemTitle}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="border-red-500/20 hover:bg-red-950/30"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white border-none"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}