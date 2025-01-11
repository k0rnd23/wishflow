import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface ErrorMessageProps {
  title?: string
  message: string
  retry?: () => void
}

export function ErrorMessage({ 
  title = "Error", 
  message, 
  retry 
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        {message}
        {retry && (
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            className="ml-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}