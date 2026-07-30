import { IconLoader2 } from "@tabler/icons-react"

export function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-4 space-y-4">
      <div className="relative flex items-center justify-center">
        <IconLoader2 className="w-10 h-10 text-primary animate-spin" />
        <div className="absolute w-6 h-6 rounded-full border border-primary/20 animate-ping" />
      </div>
      <p className="text-xs font-semibold text-muted-foreground/80 tracking-wide animate-pulse">
        Loading fresh menu...
      </p>
    </div>
  )
}
