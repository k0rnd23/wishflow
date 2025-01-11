"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function CreateWishlistPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/wishlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          categoryId: "default", // Hardcode categoryId to "default"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create wishlist");
      }

      toast({
        title: "Success",
        description: "Wishlist created successfully",
      });

      // Reset the form fields
      event.currentTarget.reset();
      router.push("/wishlists");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Wishlist</h1>

      <div className="max-w-2xl">
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
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <div className="mr-2 h-4 w-4 animate-spin" />}
            Create Wishlist
          </Button>
        </form>
      </div>
    </div>
  );
}