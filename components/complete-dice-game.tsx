'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * 完整的骰子遊戲元件
 * 包含首次互動、背景音樂控制、骰子動畫和音效
 */
export default function CompleteDiceGame() {
  // === 狀態管理 ===
  const [gameStarted, setGameStarted] = useState(false) // 遊戲是否開始
  const [diceValue, setDiceValue] = useState(1) // 骰子點數
  const [isRolling, setIsRolling] = useState(false) // 是否正在擲骰
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false) // 背景音樂是否播放
  const [isAudioInitialized, setIsAudioInitialized] = useState(false) // 音效是否已初始化

  // === 音效引用 ===
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null)
  const diceAudioRef = useRef<HTMLAudioElement | null>(null)

  // === 初始化音效系統 ===
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

      // 初始化背景音樂
      backgroundAudioRef.current = new Audio('/audio/bg.mp3')
      backgroundAudioRef.current.loop = true
      backgroundAudioRef.current.volume = 0.3
      backgroundAudioRef.current.preload = 'auto'

      // 初始化骰子音效
      diceAudioRef.current = new Audio('/audio/dice.mp3')
      diceAudioRef.current.preload = 'auto'
      diceAudioRef.current.volume = 1.0

      setIsAudioInitialized(true)
      console.log('✅ 音效系統初始化完成')
    } catch (error) {
      console.error('❌ 音效權限激活失敗或初始化錯誤:', error)
      // 即使失敗也嘗試初始化，讓使用者可以嘗試其他互動
      setIsAudioInitialized(true)
    }
  }, [])

  // === 開始遊戲函數 ===
  const startGame = useCallback(async () => {
    console.log('🎮 開始遊戲...')
    try {
      // 初始化音效系統
      await initializeAudio()
      
      // 播放背景音樂
      if (backgroundAudioRef.current) {
        try {
          await backgroundAudioRef.current.play()
          setIsBackgroundPlaying(true)
          console.log('🎵 背景音樂開始播放')
        } catch (audioError) {
          console.log('⚠️ 背景音樂播放失敗，繼續遊戲')
        }
      }
      
      // 隱藏開始按鈕，顯示遊戲內容
      setGameStarted(true)
      console.log('✅ 遊戲開始完成')
    } catch (error) {
      console.error('❌ 開始遊戲失敗:', error)
      // 即使背景音樂失敗，也繼續遊戲
      setGameStarted(true)
    }
  }, [initializeAudio])

  // === 背景音樂控制 ===
  const toggleBackgroundMusic = useCallback(async () => {
    if (!backgroundAudioRef.current) return

    try {
      if (isBackgroundPlaying) {
        backgroundAudioRef.current.pause()
        setIsBackgroundPlaying(false)
        console.log('🔇 背景音樂已暫停')
      } else {
        await backgroundAudioRef.current.play()
        setIsBackgroundPlaying(true)
        console.log('🔊 背景音樂已播放')
      }
    } catch (error) {
      console.error('❌ 背景音樂控制失敗:', error)
    }
  }, [isBackgroundPlaying])

  // === 播放骰子音效（截取中段3秒）===
  const playDiceSound = useCallback(async () => {
    if (!isAudioInitialized) {
      await initializeAudio()
    }
    
    try {
      console.log('🎵 開始播放骰子音效（中段3秒）...')
      // 建立新的音效物件（確保每次都是新的）
      const audio = new Audio('/audio/dice.mp3')
      audio.volume = 1.0
      audio.muted = false
      
      // 等待音效載入完成
      await new Promise((resolve) => {
        audio.addEventListener('canplaythrough', resolve, { once: true })
      })
      
      // 從第1秒開始播放（截取中段3秒）
      audio.currentTime = 1.0
      await audio.play()
      
      // 3秒後停止播放
      setTimeout(() => {
        audio.pause()
        audio.currentTime = 0
        console.log('🔇 骰子音效已在3秒後停止')
      }, 3000)
      
      console.log('✅ 骰子音效播放成功（中段3秒）!')
    } catch (error) {
      console.log('❌ 骰子音效播放失敗:', error)
      console.log('💡 請檢查手機音量設定')
    }
  }, [isAudioInitialized, initializeAudio])

  // === 擲骰子函數 ===
  const rollDice = useCallback(async () => {
    if (isRolling) return
    setIsRolling(true)
    
    // 播放骰子音效
    await playDiceSound()

    // 生成最終結果
    const newDiceValue = Math.floor(Math.random() * 6) + 1

    // 3秒後顯示結果（與音效同步）
    setTimeout(() => {
      setDiceValue(newDiceValue)
      setIsRolling(false)
      console.log(`🎲 骰子結果: ${newDiceValue}`)
    }, 3000)
  }, [isRolling, playDiceSound])

  // === 首次載入時顯示開始遊戲畫面 ===
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex items-center justify-center relative overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 新年裝飾動畫 */}
          <div className="absolute top-10 left-10 animate-bounce">
            <span className="text-4xl">🏮</span>
          </div>
          <div className="absolute top-20 right-20 animate-pulse">
            <span className="text-3xl">🎆</span>
          </div>
          <div className="absolute bottom-20 left-20 animate-bounce delay-1000">
            <span className="text-2xl">🪙</span>
          </div>
          <div className="absolute bottom-10 right-10 animate-pulse delay-500">
            <span className="text-3xl">🎊</span>
          </div>
        </div>

        {/* 開始遊戲按鈕 */}
        <div className="text-center z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-8 drop-shadow-lg">
            禮盒 X Umrart 骰子遊戲
          </h1>
          <div className="text-xl sm:text-2xl md:text-3xl text-yellow-300 mb-12">🐎 Urmart 祝馬年行大運 🐎</div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-red-800 font-bold px-8 py-4 text-xl rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-110 border-2 border-yellow-300"
          >
            🎲 開始遊戲
          </button>
        </div>
      </div>
    )
  }

  // === 主要遊戲界面 ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex items-center justify-center relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-bounce">
          <span className="text-4xl">🏮</span>
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <span className="text-3xl">🎆</span>
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce delay-1000">
          <span className="text-2xl">🪙</span>
        </div>
        <div className="absolute bottom-10 right-10 animate-pulse delay-500">
          <span className="text-3xl">🎊</span>
        </div>
      </div>

      {/* 背景音樂控制按鈕 */}
      <button
        onClick={toggleBackgroundMusic}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/30 transition-all duration-300 shadow-lg"
        title={isBackgroundPlaying ? '暫停背景音樂' : '播放背景音樂'}
      >
        {isBackgroundPlaying ? '🔊' : '🔇'}
      </button>

      {/* 主要遊戲內容 */}
      <div className="text-center z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-8 drop-shadow-lg">
          禮盒 X Umrart 骰子遊戲
        </h1>
        <div className="text-xl sm:text-2xl md:text-3xl text-yellow-300 mb-12">🐎 Urmart 祝馬年行大運 🐎</div>
        
        {/* 骰子顯示區域 */}
        <div className="mb-8">
          <motion.div
            className="w-32 h-32 mx-auto bg-white rounded-2xl shadow-2xl flex items-center justify-center text-6xl font-bold text-red-600 border-4 border-yellow-400"
            animate={isRolling ? {
              rotateX: [0, 360, 720, 1080, 1440],
              rotateY: [0, 180, 360, 540, 720],
              rotateZ: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1, 0.9, 1]
            } : {}}
            transition={isRolling ? {
              duration: 3,
              times: [0, 0.17, 0.5, 0.83, 1],
              ease: [0.25, 0.46, 0.45, 0.94]
            } : {}}
          >
            {diceValue}
          </motion.div>
        </div>

        {/* 擲骰按鈕 */}
        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`px-8 py-4 rounded-2xl text-2xl font-bold shadow-2xl transform transition-all duration-300 ${
            isRolling
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 text-red-800 hover:scale-110'
          }`}
        >
          {isRolling ? '🎲 擲骰中...' : '🎲 擲骰'}
        </button>

        {/* 遊戲說明 */}
        <div className="mt-8 text-yellow-200 text-lg">
          <p>🎵 點擊擲骰享受音效與動畫</p>
          <p>🔊 左下角可控制背景音樂</p>
        </div>
      </div>
    </div>
  )
}
