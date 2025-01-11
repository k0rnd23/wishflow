"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SortAsc, SortDesc } from "lucide-react"

type SortOption = "price-asc" | "price-desc" | "date-asc" | "date-desc"

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {value.includes("asc") ? (
            <SortAsc className="h-4 w-4 mr-2" />
          ) : (
            <SortDesc className="h-4 w-4 mr-2" />
          )}
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onChange("price-asc")}>
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("price-desc")}>
          Price: High to Low
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("date-asc")}>
          Date: Oldest First
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("date-desc")}>
          Date: Newest First
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}