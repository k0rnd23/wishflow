"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface Activity {
  id: string
  type: "item_added" | "item_completed" | "wishlist_created"
  wishlistId: string
  wishlistTitle: string
  itemTitle?: string
  timestamp: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/dashboard/activity")
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error("Failed to fetch activities:", error)
    }
  }

  const getActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case "item_added":
        return `Added "${activity.itemTitle}" to "${activity.wishlistTitle}"`
      case "item_completed":
        return `Completed "${activity.itemTitle}" in "${activity.wishlistTitle}"`
      case "wishlist_created":
        return `Created new wishlist "${activity.wishlistTitle}"`
      default:
        return ""
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0"
          >
            <div>
              <p className="text-sm">{getActivityMessage(activity)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}