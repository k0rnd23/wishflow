"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Pencil, 
  Plus, 
  ExternalLink, 
  Image as ImageIcon, 
  Check, 
  Loader2, 
  Search, 
  Trash2, 
  MessageCircle 
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { AddNoteDialog } from "./add-note-dialog"
import { EditItemDialog } from "./edit-item-dialog"
import { DeleteItemDialog } from "./delete-item-dialog"
import { ImageViewDialog } from "./image-view-dialog"
import { useToast } from "@/components/ui/use-toast"
import { convertCurrency, formatCurrency } from "@/lib/currency"
import { CurrencySelector } from "@/components/currency-selector"
import type { WishItem, Note } from "@prisma/client"

interface WishItemCardProps {
  item: WishItem & { notes: Note[] }
  onUpdate: () => void
  preferredCurrency?: string
  isShared?: boolean
}

export function WishItemCard({ 
  item, 
  onUpdate,
  preferredCurrency = 'USD',
  isShared = false 
}: WishItemCardProps) {
  const { toast } = useToast()
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null)
  const [isImageViewOpen, setIsImageViewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedCurrency, setSelectedCurrency] = useState(preferredCurrency)

  useEffect(() => {
    const convertPrice = async () => {
      if (item.price) {
        try {
          const converted = await convertCurrency(
            item.price,
            item.currency,
            selectedCurrency
          )
          setConvertedPrice(converted)
        } catch (error) {
          console.error('Failed to convert price:', error)
          setConvertedPrice(item.price)
        }
      }
    }
    convertPrice()
  }, [item.price, item.currency, selectedCurrency])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const base64 = await convertToBase64(file)
      const response = await fetch(`/api/items/${item.id}/image`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 })
      })

      if (!response.ok) throw new Error("Failed to upload image")
      onUpdate()
      toast({ title: "Success", description: "Image uploaded successfully" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !item.completed })
      })

      if (!response.ok) throw new Error("Failed to update item")
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive"
      })
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card className={cn(
        "relative backdrop-blur-sm border-emerald-500/20 transition-all duration-300",
        "hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10",
        item.completed ? "opacity-75" : ""
      )}>
        {/* Top Actions Bar */}
        {!isShared && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleComplete}
              disabled={isCompleting}
              className="h-8 w-8 hover:bg-emerald-500/10"
            >
              {isCompleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className={cn(
                  "h-4 w-4 transition-colors",
                  item.completed ? "text-emerald-500" : "text-muted-foreground"
                )} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              className="h-8 w-8 hover:bg-emerald-500/10"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-8 w-8 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        )}
        
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className={cn(
              "text-xl font-orbitron text-emerald-400",
              item.completed ? "line-through opacity-50" : ""
            )}>
              {item.title}
            </CardTitle>
          </div>
          
          {item.price !== null && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">
                {convertedPrice !== null
                  ? formatCurrency(convertedPrice, selectedCurrency)
                  : formatCurrency(item.price, item.currency)}
              </Badge>
              <CurrencySelector
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {item.image && (
            <div 
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group/image"
              onClick={() => setIsImageViewOpen(true)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
          
          {item.description && (
            <p className="text-muted-foreground">{item.description}</p>
          )}
          
          {item.notes.length > 0 && (
            <div className="space-y-2">
              {item.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg relative group/note hover:bg-emerald-500/10 transition-all duration-300"
                >
                  <p className="text-sm text-emerald-300">{note.content}</p>
                  <p className="text-xs text-emerald-500/50 mt-1">
                    {formatDate(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-between pt-4 border-t border-emerald-500/10">
          {!isShared && (
            <div className="flex gap-2">
              <Button
                variant="cyber"
                size="sm"
                onClick={() => setIsNoteDialogOpen(true)}
                className="group/note"
              >
                <MessageCircle className="h-4 w-4 mr-2 group-hover/note:rotate-12 transition-transform" />
                Add Note
              </Button>
              
              <Button
                variant="cyber"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="group/image"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4 mr-2 group-hover/image:scale-110 transition-transform" />
                )}
                {item.image ? "Change Image" : "Add Image"}
              </Button>
            </div>
          )}

          {item.url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(item.url, "_blank")}
              className="hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Dialogs */}
      <AddNoteDialog
        itemId={item.id}
        open={isNoteDialogOpen}
        onOpenChange={setIsNoteDialogOpen}
        onSuccess={onUpdate}
      />

      <EditItemDialog
        item={item}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={onUpdate}
      />

      <DeleteItemDialog
        itemId={item.id}
        itemTitle={item.title}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={onUpdate}
      />

      {item.image && (
        <ImageViewDialog
          src={item.image}
          alt={item.title}
          open={isImageViewOpen}
          onOpenChange={setIsImageViewOpen}
        />
      )}
    </motion.div>
  )
}

function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}