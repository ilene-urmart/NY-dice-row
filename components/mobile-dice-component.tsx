"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRef, useEffect, useState } from "react"

interface MobileDiceComponentProps {
  value: number | string
  isRolling: boolean
  onClick: () => void
  type: "number" | "exercise"
}

export function MobileDiceComponent({ value, isRolling, onClick, type }: MobileDiceComponentProps) {
  // 音效相關的 ref 和狀態
  const diceAudioRef = useRef<HTMLAudioElement | null>(null)
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null)
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  // 初始化音效系統
  useEffect(() => {
    console.log('🎵 初始化音效系統...')
    
    // 骰子音效初始化
    const diceAudioUrl = '/audio/dice.mp3'
    diceAudioRef.current = new Audio(diceAudioUrl)
    diceAudioRef.current.preload = 'auto'
    diceAudioRef.current.volume = 1.0
    
    // 背景音樂初始化
    const backgroundAudioUrl = '/audio/background.mp3'
    backgroundAudioRef.current = new Audio(backgroundAudioUrl)
    backgroundAudioRef.current.preload = 'auto'
    backgroundAudioRef.current.volume = 0.3
    backgroundAudioRef.current.loop = true

    console.log('✅ 音效系統初始化完成')
    
    // 清理函數
    return () => {
      if (diceAudioRef.current) {
        diceAudioRef.current.pause()
        diceAudioRef.current = null
      }
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause()
        backgroundAudioRef.current = null
      }
    }
  }, [])

  // 首次使用者互動 - 激活音效權限
  const initializeAudio = async () => {
    if (hasUserInteracted) return
    
    setIsInitializing(true)
    console.log('🎵 首次使用者互動 - 激活音效權限...')
    
    try {
      // 播放一次骰子音效來激活音效權限
      const audio = new Audio('/audio/dice.mp3')
      audio.volume = 0.1 // 低音量播放
      await audio.play()
      
      // 立即暫停
      setTimeout(() => {
        audio.pause()
        setHasUserInteracted(true)
        setIsInitializing(false)
        console.log('✅ 音效權限已激活！')
      }, 100)
      
    } catch (error) {
      console.log('❌ 音效權限激活失敗:', error)
      // 即使失敗也標記為已互動，避免卡住
      setHasUserInteracted(true)
      setIsInitializing(false)
    }
  }

  // 播放骰子音效的函數
  const playDiceSound = async () => {
    if (!hasUserInteracted) {
      console.log('⚠️ 請先點擊「開始遊戲」激活音效權限')
      return
    }
    
    console.log('🎵 播放骰子音效...')
    
    try {
      const audio = new Audio('/audio/dice.mp3')
      audio.volume = 1.0
      audio.muted = false
      
      await audio.play()
      console.log('✅ 骰子音效播放成功!')
    } catch (error) {
      console.log('❌ 骰子音效播放失敗:', error)
    }
  }

  // 切換背景音樂的函數
  const toggleBackgroundMusic = async () => {
    if (!hasUserInteracted) {
      console.log('⚠️ 請先點擊「開始遊戲」激活音效權限')
      return
    }
    
    console.log('🎵 切換背景音樂...')
    
    if (isBackgroundPlaying) {
      // 停止背景音樂
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause()
        backgroundAudioRef.current = null
      }
      setIsBackgroundPlaying(false)
      console.log('🔇 背景音樂已停止')
    } else {
      try {
        // 建立新的背景音樂物件
        const audio = new Audio('/audio/background.mp3')
        audio.volume = 0.3
        audio.loop = true
        audio.muted = false
        
        await audio.play()
        backgroundAudioRef.current = audio
        setIsBackgroundPlaying(true)
        console.log('🔊 背景音樂已開始播放')
      } catch (error) {
        console.log('❌ 背景音樂播放失敗:', error)
      }
    }
  }

  // 處理點擊事件
  const handleClick = async () => {
    if (!hasUserInteracted) {
      console.log('⚠️ 請先點擊「開始遊戲」激活音效權限')
      return
    }
    
    // 播放音效
    await playDiceSound()
    // 執行原本的點擊邏輯
    onClick()
  }

  // 渲染骰子點數
  const renderDots = (num: number) => {
    const dots = []
    for (let i = 0; i < num; i++) {
      dots.push(<div key={i} className="w-3 h-3 bg-secondary rounded-full shadow-sm" />)
    }
    return dots
  }

  // 如果還沒有使用者互動，顯示開始遊戲按鈕
  if (!hasUserInteracted) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🎲 骰子遊戲</h2>
          <p className="text-gray-300 mb-6">點擊開始遊戲以激活音效功能</p>
        </div>
        
        <button
          onClick={initializeAudio}
          disabled={isInitializing}
          className={cn(
            "px-8 py-4 text-lg rounded-xl transition-all duration-200",
            "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500",
            "text-white font-bold shadow-xl border-2 border-green-400",
            "w-full max-w-xs min-h-[60px] flex items-center justify-center",
            isInitializing && "opacity-50 cursor-not-allowed"
          )}
        >
          {isInitializing ? "🎵 激活音效中..." : "🎮 開始遊戲"}
        </button>
        
        <div className="text-xs text-gray-400 text-center max-w-xs">
          首次使用需要激活音效權限，請確保手機音量已開啟
        </div>
      </div>
    )
  }

  // 正常遊戲界面
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
        onClick={handleClick}
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
      
      {/* 音效控制按鈕區域 */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {/* 骰子音效測試按鈕 */}
        <button
          onClick={playDiceSound}
          className={cn(
            "px-6 py-3 text-base rounded-xl transition-all duration-200",
            "bg-blue-600 hover:bg-blue-700 text-white font-bold",
            "border-3 border-blue-400 shadow-xl",
            "w-full min-h-[50px] flex items-center justify-center"
          )}
        >
          🔊 測試骰子音效
        </button>
        
        {/* 背景音樂控制按鈕 */}
        <button
          onClick={toggleBackgroundMusic}
          className={cn(
            "px-6 py-3 text-base rounded-xl transition-all duration-200",
            "bg-green-600 hover:bg-green-700 text-white font-bold",
            "border-3 border-green-400 shadow-xl",
            "w-full min-h-[50px] flex items-center justify-center"
          )}
        >
          {isBackgroundPlaying ? "🔇 停止背景音樂" : "🎵 播放背景音樂"}
        </button>
        
        {/* 除錯資訊 */}
        <div className="text-xs text-gray-500 text-center">
          ✅ 音效權限已激活 | 如果沒有聲音，請檢查手機音量設定
        </div>
      </div>
    </div>
  )
}
