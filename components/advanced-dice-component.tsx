"use client"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdvancedDiceComponentProps {
  className?: string
}

export function AdvancedDiceComponent({ className }: AdvancedDiceComponentProps) {
  // 骰子狀態管理
  const [diceValue, setDiceValue] = useState<number>(1)
  const [isRolling, setIsRolling] = useState(false)
  const [isAudioInitialized, setIsAudioInitialized] = useState(false)
  
  // 音效相關的 ref
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 音效初始化函數 - 手機友善版本
  const initializeAudio = useCallback(async () => {
    console.log('🎵 初始化音效系統...')
    try {
      // 播放一次骰子音效並立即暫停，以激活瀏覽器的音效權限
      const audio = new Audio('/audio/dice.mp3')
      audio.volume = 0.1 // 低音量播放，避免突兀
      await audio.play()
      setTimeout(() => {
        audio.pause()
        audio.currentTime = 0
        console.log('✅ 音效權限已激活並暫停')
      }, 100) // 播放100ms後暫停

      // 初始化實際的音效物件
      audioRef.current = new Audio('/audio/dice.mp3')
      audioRef.current.preload = 'auto'
      audioRef.current.volume = 1.0 // 骰子音效最大音量

      setIsAudioInitialized(true)
      console.log('✅ 音效系統初始化完成')
    } catch (error) {
      console.error('❌ 音效權限激活失敗或初始化錯誤:', error)
      // 即使失敗也嘗試初始化，讓使用者可以嘗試其他互動
      setIsAudioInitialized(true)
    }
  }, [])

  // 播放骰子音效的函數 - 完整播放並與動畫同步
  const playDiceSound = useCallback(async () => {
    if (!isAudioInitialized) {
      await initializeAudio()
    }
    
    try {
      console.log('🎵 開始播放骰子音效（完整播放）...')
      
      // 建立新的音效物件（確保每次都是新的）
      const audio = new Audio('/audio/dice.mp3')
      audio.volume = 1.0
      audio.muted = false
      
      // 等待音效載入完成
      await new Promise((resolve) => {
        audio.addEventListener('canplaythrough', resolve, { once: true })
      })
      
      // 從頭開始播放完整音效
      audio.currentTime = 0
      await audio.play()
      
      console.log('✅ 骰子音效開始播放（完整版本）')
      
    } catch (error) {
      console.log('❌ 骰子音效播放失敗:', error)
      console.log('💡 請檢查手機音量設定')
    }
  }, [isAudioInitialized, initializeAudio])

  // 擲骰邏輯 - 包含動畫和音效
  const rollDice = useCallback(async () => {
    if (isRolling) return
    
    console.log('🎲 開始擲骰...')
    setIsRolling(true)
    
    // 同步播放音效
    await playDiceSound()
    
    // 模擬骰子旋轉動畫 - 根據音效長度調整
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
    }, 80) // 每80ms更新一次點數，創造更流暢的旋轉效果
    
    // 根據音效長度調整動畫時長（假設音效約2-4秒）
    const animationDuration = 2500 // 2.5秒動畫，與音效配合
    
    setTimeout(() => {
      clearInterval(interval)
      const finalValue = Math.floor(Math.random() * 6) + 1
      setDiceValue(finalValue)
      setIsRolling(false)
      console.log(`🎲 擲骰結果: ${finalValue}`)
    }, animationDuration)
  }, [isRolling, playDiceSound])

  // 渲染骰子點數的函數
  const renderDots = (num: number) => {
    const dotPositions = {
      1: [{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }],
      2: [
        { top: "25%", left: "25%", transform: "translate(-50%, -50%)" },
        { bottom: "25%", right: "25%", transform: "translate(50%, 50%)" },
      ],
      3: [
        { top: "20%", left: "20%", transform: "translate(-50%, -50%)" },
        { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
        { bottom: "20%", right: "20%", transform: "translate(50%, 50%)" },
      ],
      4: [
        { top: "25%", left: "25%", transform: "translate(-50%, -50%)" },
        { top: "25%", right: "25%", transform: "translate(50%, -50%)" },
        { bottom: "25%", left: "25%", transform: "translate(-50%, 50%)" },
        { bottom: "25%", right: "25%", transform: "translate(50%, 50%)" },
      ],
      5: [
        { top: "20%", left: "20%", transform: "translate(-50%, -50%)" },
        { top: "20%", right: "20%", transform: "translate(50%, -50%)" },
        { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
        { bottom: "20%", left: "20%", transform: "translate(-50%, 50%)" },
        { bottom: "20%", right: "20%", transform: "translate(50%, 50%)" },
      ],
      6: [
        { top: "20%", left: "30%", transform: "translate(-50%, -50%)" },
        { top: "20%", right: "30%", transform: "translate(50%, -50%)" },
        { top: "50%", left: "30%", transform: "translate(-50%, -50%)" },
        { top: "50%", right: "30%", transform: "translate(50%, -50%)" },
        { bottom: "20%", left: "30%", transform: "translate(-50%, 50%)" },
        { bottom: "20%", right: "30%", transform: "translate(50%, 50%)" },
      ],
    }

    return dotPositions[num as keyof typeof dotPositions]?.map((position, index) => (
      <div 
        key={index} 
        className="absolute w-3 h-3 bg-white rounded-full shadow-sm" 
        style={position} 
      />
    ))
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-6 space-y-6", className)}>
      {/* 標題 */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🎲 高級骰子遊戲</h2>
      
      {/* 骰子顯示區域 */}
      <Card
        className={cn(
          "w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-all duration-300",
          "bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-blue-300",
          "hover:scale-105 hover:shadow-xl active:scale-95",
          "flex items-center justify-center relative overflow-hidden",
          // 旋轉動畫效果
          isRolling && "animate-spin"
        )}
        onClick={rollDice}
      >
        {/* 骰子背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg" />
        
        {/* 骰子點數 */}
        <div className="relative z-10">
          {renderDots(diceValue)}
        </div>
        
        {/* 旋轉時的閃光效果 */}
        {isRolling && (
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-lg" />
        )}
      </Card>

      {/* 狀態顯示 */}
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-2">
          {isRolling ? "🎲 擲骰中..." : `🎯 當前點數: ${diceValue}`}
        </p>
        <p className="text-sm text-gray-500">
          {isRolling ? "音效播放中..." : "點擊骰子開始遊戲"}
        </p>
      </div>

      {/* 擲骰按鈕 */}
      <Button
        onClick={rollDice}
        disabled={isRolling}
        className={cn(
          "px-8 py-3 text-lg font-bold rounded-xl transition-all duration-300",
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
          "hover:from-blue-500 hover:to-purple-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-lg hover:shadow-xl transform hover:scale-105"
        )}
      >
        {isRolling ? "🎲 擲骰中..." : "🎲 點擊擲骰"}
      </Button>

      {/* 音效狀態指示 */}
      <div className="text-xs text-gray-400 text-center max-w-sm">
        {isAudioInitialized ? "✅ 音效已就緒" : "🔊 首次點擊將激活音效"}
        <br />
        音效與動畫同步播放，完整體驗
      </div>
    </div>
  )
}
