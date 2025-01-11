"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CurrencySelector } from "@/components/currency-selector" // Import

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(
    session?.user?.preferredCurrency || "USD"
  )

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          preferredCurrency: selectedCurrency,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update settings")
      }

      await updateSession()

      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={session?.user?.name || ""}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={session?.user?.email || ""}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <CurrencySelector
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <div className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}