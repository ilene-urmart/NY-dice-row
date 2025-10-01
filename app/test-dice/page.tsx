"use client"

import { DiceComponent } from "@/components/dice-component"
import { useState } from "react"

export default function TestDicePage() {
  const [diceValue, setDiceValue] = useState<number>(1)
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    if (isRolling) return
    
    setIsRolling(true)
    
    // 模擬擲骰動畫
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1
      setDiceValue(newValue)
      setIsRolling(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        🎲 音效測試頁面 🎲
      </h1>
      
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
        <DiceComponent
          value={diceValue}
          isRolling={isRolling}
          onClick={rollDice}
          type="number"
        />
      </div>
      
      <div className="mt-8 text-center text-white">
        <p className="text-lg mb-2">測試說明：</p>
        <p className="text-sm mb-1">1. 點擊骰子播放音效</p>
        <p className="text-sm mb-1">2. 點擊藍色按鈕測試骰子音效</p>
        <p className="text-sm mb-1">3. 點擊綠色按鈕測試背景音樂</p>
        <p className="text-sm text-yellow-300">請確保手機音量已開啟！</p>
      </div>
    </div>
  )
}
