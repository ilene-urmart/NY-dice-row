"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CardDeckProps {
  type: "chance" | "destiny"
}

const chanceCards = [
  "🎉 恭喜！獲得 20% 折扣碼",
  "🧧 新年紅包！獲得 100 元優惠券",
  "😅 小懲罰：做 10 個深蹲",
  "🎊 幸運！免費獲得一份小禮品",
  "💪 挑戰：完成 1 分鐘平板支撐",
  "🎁 驚喜！獲得神秘禮物一份",
]

const destinyCards = [
  "🌟 命運之星！今日運勢極佳",
  "🍀 四葉草！幸運加倍",
  "⚡ 能量爆發！獲得額外獎勵",
  "🎯 精準射手！下次必中大獎",
  "🔥 火力全開！連續好運來襲",
  "💎 鑽石運氣！珍貴獎勵等著你",
]

export function CardDeck({ type }: CardDeckProps) {
  const [drawnCard, setDrawnCard] = useState<string | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const cards = type === "chance" ? chanceCards : destinyCards
  const deckColor = type === "chance" ? "from-primary to-primary/80" : "from-secondary to-secondary/80"
  const deckTitle = type === "chance" ? "機會" : "命運"

  const drawCard = () => {
    if (isFlipping) return

    setIsFlipping(true)
    setShowResult(false)

    setTimeout(() => {
      const randomCard = cards[Math.floor(Math.random() * cards.length)]
      setDrawnCard(randomCard)
      setIsFlipping(false)
      setShowResult(true)
    }, 600)
  }

  const resetCard = () => {
    setDrawnCard(null)
    setShowResult(false)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Card Deck */}
      <div className="relative">
        {/* Stack effect - multiple cards */}
        <Card className="absolute w-24 h-36 md:w-28 md:h-40 bg-gradient-to-br from-muted to-muted/80 border-2 border-border transform rotate-2 translate-x-1 translate-y-1" />
        <Card className="absolute w-24 h-36 md:w-28 md:h-40 bg-gradient-to-br from-muted to-muted/80 border-2 border-border transform -rotate-1 translate-x-0.5 translate-y-0.5" />

        {/* Main card */}
        <Card
          className={cn(
            "w-24 h-36 md:w-28 md:h-40 cursor-pointer transition-all duration-300 relative",
            `bg-gradient-to-br ${deckColor} border-2 border-secondary`,
            "hover:scale-105 hover:shadow-xl active:scale-95",
            "flex items-center justify-center",
            isFlipping && "flip-animation pointer-events-none",
          )}
          onClick={drawCard}
        >
          {/* Red envelope design */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg" />
          <div className="text-center p-2">
            <div className="text-2xl mb-1">🧧</div>
            <div className="text-xs font-bold text-primary-foreground">{deckTitle}</div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full opacity-60" />
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-secondary rounded-full opacity-60" />
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">{isFlipping ? "翻牌中..." : "點擊抽卡"}</p>

      {/* Drawn Card Result */}
      {showResult && drawnCard && (
        <Card className={cn("max-w-xs p-4 bg-card border-2 border-secondary/50 bounce-in", "text-center shadow-lg")}>
          <div className="text-sm font-medium text-card-foreground mb-3">{drawnCard}</div>
          <Button size="sm" variant="outline" onClick={resetCard} className="text-xs bg-transparent">
            重新抽卡
          </Button>
        </Card>
      )}
    </div>
  )
}
