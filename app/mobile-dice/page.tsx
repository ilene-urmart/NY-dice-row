"use client"

import { MobileDiceComponent } from "@/components/mobile-dice-component"
import { useState } from "react"

export default function MobileDicePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          📱 手機友善骰子遊戲
        </h1>
        <p className="text-lg text-blue-200">
          專為手機瀏覽器優化的音效體驗
        </p>
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
        <MobileDiceComponent
          value={diceValue}
          isRolling={isRolling}
          onClick={rollDice}
          type="number"
        />
      </div>
      
      <div className="mt-8 text-center text-white max-w-md">
        <h3 className="text-lg font-bold mb-4">🎯 功能特色</h3>
        <div className="text-sm space-y-2">
          <p>✅ 首次互動激活音效權限</p>
          <p>✅ 點擊骰子播放音效</p>
          <p>✅ 背景音樂循環播放</p>
          <p>✅ 手機瀏覽器完全相容</p>
          <p>✅ 使用者互動觸發音效</p>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
          <p className="text-yellow-200 text-sm">
            💡 <strong>使用提示：</strong><br/>
            1. 首次使用請點擊「開始遊戲」<br/>
            2. 確保手機音量已開啟<br/>
            3. 允許瀏覽器播放音效
          </p>
        </div>
      </div>
    </div>
  )
}
