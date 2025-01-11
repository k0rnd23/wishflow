export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function logError(context: string, error: unknown): void {
  console.error(`[${context}] Error:`, error);
}