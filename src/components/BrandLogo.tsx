import { IconBuildingStore } from "@tabler/icons-react"

export function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
        <IconBuildingStore className="size-5" />
      </div>
      <span className="font-heading text-lg font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
        The Smart Bills
      </span>
    </div>
  )
}
