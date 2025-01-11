"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { WishlistCard } from "@/components/wishlists/wishlist-card";
import { CreateWishlistDialog } from "@/components/wishlists/create-wishlist-dialog";
import { CategoryManageDialog } from "@/components/wishlists/category-manage-dialog";
import type { Wishlist } from "@prisma/client";

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlists = async () => {
    try {
      const response = await fetch("/api/wishlists");
      const data = await response.json();
      setWishlists(data);
    } catch (error) {
      console.error("Failed to fetch wishlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-0.5"
          >
            <h1 className="text-4xl font-bold tracking-tight">My Wishlists</h1>
            <p className="text-muted-foreground">Manage your wishlists</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2"
          >
            <Button
              onClick={() => setIsCategoryDialogOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <Settings className="mr-2 h-4 w-4" />
              Categories
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="default"
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Wishlist
            </Button>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[200px] animate-pulse bg-muted rounded-lg"
              />
            ))}
          </div>
        ) : wishlists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[400px] gap-4"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">No wishlists yet</h2>
              <p className="text-muted-foreground">
                Create your first wishlist to get started
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="default"
              size="lg"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create First Wishlist
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {wishlists.map((wishlist) => (
              <WishlistCard key={wishlist.id} wishlist={wishlist} />
            ))}
          </motion.div>
        )}
      </motion.div>

      <CreateWishlistDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchWishlists}
      />

      <CategoryManageDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSuccess={fetchWishlists}
      />
    </div>
  );
}