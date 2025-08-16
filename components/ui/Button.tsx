import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const button = cva(
  "inline-flex items-center justify-center rounded-[12px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium",
  {
    variants: {
      variant: {
        primary: "bg-[var(--primary)] text-white hover:bg-empress-plum focus:ring-empress-lilac",
        outline:
          "border border-empress-ink/15 text-empress-ink hover:border-empress-ink/30 bg-white hover:bg-empress-sand/50",
        link: "text-[var(--primary)] underline underline-offset-4 hover:text-empress-plum",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-3 text-sm",
        lg: "px-6 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />
}
