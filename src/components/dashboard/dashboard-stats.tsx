"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PriceFormatter } from "@/components/ui/price-formatter"
import { 
  List,
  CheckSquare,
  DollarSign,
  Bookmark
} from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalWishlists: number
    totalItems: number
    completedItems: number
    totalValue: number
    currency: string
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Wishlists
          </CardTitle>
          <List className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalWishlists}</div>
          <p className="text-xs text-muted-foreground">
            Active wishlists
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Items
          </CardTitle>
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalItems}</div>
          <p className="text-xs text-muted-foreground">
            Across all wishlists
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Items
          </CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((stats.completedItems / stats.totalItems) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.completedItems} of {stats.totalItems} items
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Value
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <PriceFormatter amount={stats.totalValue} currency={stats.currency} />
          </div>
          <p className="text-xs text-muted-foreground">
            All items combined
          </p>
        </CardContent>
      </Card>
    </div>
  )
}