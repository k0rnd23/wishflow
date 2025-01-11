"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WishlistStats {
  totalItems: number
  totalValue: number
  completedItems: number
  categories: {
    name: string
    count: number
  }[]
}

interface WishlistStatsProps {
  stats: WishlistStats
}

export function WishlistStats({ stats }: WishlistStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalItems}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalValue.toLocaleString()} KZT
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.categories.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((stats.completedItems / stats.totalItems) * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>
    </div>
  )
}