"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DiceComponentProps {
  value: number | string
  isRolling: boolean
  onClick: () => void
  type: "number" | "exercise"
}

export function DiceComponent({ value, isRolling, onClick, type }: DiceComponentProps) {
  const renderDots = (num: number) => {
    const dots = []
    for (let i = 0; i < num; i++) {
      dots.push(<div key={i} className="w-3 h-3 bg-secondary rounded-full shadow-sm" />)
    }
    return dots
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card
        className={cn(
          "w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-all duration-300",
          "bg-gradient-to-br from-primary to-primary/80 border-4 border-secondary",
          "hover:scale-105 hover:shadow-xl active:scale-95",
          "flex items-center justify-center relative overflow-hidden",
          isRolling && "roll-animation pointer-events-none",
          !isRolling && "glow-effect",
        )}
        onClick={onClick}
      >
        {/* Red envelope pattern background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="absolute top-2 left-2 w-6 h-6 border-2 border-secondary rounded-full opacity-30" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-secondary rounded-full opacity-30" />

        {/* Content */}
        <div className="relative z-10 text-center">
          {type === "number" ? (
            <div
              className={cn(
                "grid gap-1",
                value === 1 && "grid-cols-1",
                value === 2 && "grid-cols-1",
                value === 3 && "grid-cols-1",
                value === 4 && "grid-cols-2",
                value === 5 && "grid-cols-2",
                value === 6 && "grid-cols-2",
              )}
            >
              {typeof value === "number" && renderDots(value)}
            </div>
          ) : (
            <div className="text-secondary font-bold text-sm md:text-base px-2 text-center leading-tight">{value}</div>
          )}
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-secondary/20 to-transparent opacity-50" />
      </Card>

      <p className="text-sm text-muted-foreground">{isRolling ? "擲骰中..." : "點擊擲骰"}</p>
    </div>
  )
}
