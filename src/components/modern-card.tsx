"use client"

import type { ReactNode, CSSProperties } from "react"
import { cn } from "@/lib/utils"

interface ModernCardProps {
  children: ReactNode
  className?: string
  backgroundImage?: string
  overlay?: boolean
  overlayOpacity?: number
  style?: CSSProperties
  width?: number | string
  height?: number | string
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  padding?: "sm" | "md" | "lg" | "xl"
}

const ModernCard = ({
  children,
  className,
  backgroundImage,
  overlay = true,
  overlayOpacity = 0.3,
  style,
  width = "auto",
  height = "auto",
  rounded = "xl",
  padding = "lg",
  ...props
}: ModernCardProps) => {
  const defaultBgColor = "#2D3748" // Dark navy/charcoal color from the image

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
  }

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  }

  const cardStyle: CSSProperties = {
    width,
    height,
    backgroundColor: backgroundImage ? "transparent" : defaultBgColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    ...style,
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl",
        roundedClasses[rounded],
        paddingClasses[padding],
        className,
      )}
      style={cardStyle}
      {...props}
    >
      {/* Overlay for better text readability when using background images */}
      {backgroundImage && overlay && <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default ModernCard
