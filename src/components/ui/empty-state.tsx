import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h3 className="mt-2 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {action && (
          <div className="mt-6">
            <Button onClick={action.onClick}>{action.label}</Button>
          </div>
        )}
      </div>
    </div>
  )
}