"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Gift, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Plus,
  Globe,
  LogOut,
  Bell
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { CreateWishlistDialog } from "@/components/wishlists/create-wishlist-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Activity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
}

interface DashboardStats {
  totalWishlists: number;
  totalItems: number;
  totalValue: {
    amount: number;
    formatted: string;
    currency: string;
  };
  completedItems: number;
  completionRate: number;
  recentActivity: Activity[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchDashboardData();
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    currency,
    symbol,
  }: {
    title: string;
    value: number;
    icon: any;
    currency?: string;
    symbol?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="hologram" className="relative overflow-hidden group">
        <div className="p-6 flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-rajdhani text-emerald-500/70">
              {title}
            </p>
            <p className="text-3xl font-orbitron font-bold text-emerald-400">
              {title === "Total Value"
                ? formatCurrency(value, currency || "USD")
                : `${value}${symbol ? symbol : ""}`}
            </p>
          </div>
          <div className="rounded-full p-3 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
            <Icon className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-orbitron font-bold tracking-tighter text-emerald-500">
            Dashboard
          </h1>
          <p className="text-emerald-500/70 font-rajdhani">
            Overview of your wishlists and activity
          </p>
        </div>
        <Button 
          variant="destructive" 
          onClick={() => setIsLogoutDialogOpen(true)}
          className="bg-red-500 hover:bg-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Wishlists"
          value={stats?.totalWishlists || 0}
          icon={Gift}
        />
        <MetricCard
          title="Total Items"
          value={stats?.totalItems || 0}
          icon={Plus}
        />
        <MetricCard
          title="Total Value"
          value={stats?.totalValue?.amount || 0}
          currency={stats?.totalValue?.currency}
          icon={DollarSign}
        />
        <MetricCard
          title="Completion Rate"
          value={stats?.completionRate || 0}
          icon={Clock}
          symbol="%"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Button
            variant="cyber"
            size="wide"
            className="w-full font-orbitron py-8"
            onClick={() => setIsDialogOpen(true)}
          >
            Create New Wishlist
            <Plus className="ml-2 h-4 w-4" />
          </Button>
          <Link href="/wishlists" className="w-full">
            <Button
              variant="matrix"
              size="wide"
              className="w-full font-orbitron py-8"
            >
              View All Wishlists
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/discover" className="w-full">
            <Button
              variant="cyber"
              size="wide"
              className="w-full font-orbitron py-8 group"
            >
              Discover Wishlists
              <Globe className="ml-2 h-4 w-4 transform transition-transform group-hover:rotate-12" />
            </Button>
          </Link>
          <Link href="/settings" className="w-full">
            <Button
              variant="hologram"
              size="wide"
              className="w-full font-orbitron py-8"
            >
              Manage Settings
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-emerald-400">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {stats?.recentActivity?.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors border border-emerald-500/20"
                  >
                    <p className="text-sm text-emerald-300">{activity.title}</p>
                    <p className="text-xs text-emerald-500/50 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CreateWishlistDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to log in again to access your wishlists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}