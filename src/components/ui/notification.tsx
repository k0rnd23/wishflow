interface NotificationProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function Notification({
  title,
  description,
  action,
}: NotificationProps) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg bg-background shadow-lg ring-1 ring-black/5">
      <div className="p-4">
        <div className="flex items-start">
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            {action && (
              <div className="mt-3 flex space-x-7">
                <button
                  type="button"
                  onClick={action.onClick}
                  className="rounded-md text-sm font-medium text-primary hover:text-primary/90"
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}