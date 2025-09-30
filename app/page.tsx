"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function NewYearDiceGame() {
  const [diceAValue, setDiceAValue] = useState<number>(1)
  const [diceBValue, setDiceBValue] = useState<string>("深蹲")
  const [isRolling, setIsRolling] = useState(false)
  const [showResultPopup, setShowResultPopup] = useState(false)
  const [chanceCard, setChanceCard] = useState<string | null>(null)
  const [showChanceCardModal, setShowChanceCardModal] = useState(false)
  const [isChanceCardAnimating, setIsChanceCardAnimating] = useState(false)
  const [diceARotation, setDiceARotation] = useState({ x: 0, y: 0, z: 0 })
  const [diceBRotation, setDiceBRotation] = useState({ x: 0, y: 0, z: 0 })
  const [diceAPosition, setDiceAPosition] = useState({ x: 0, y: 0 })
  const [diceBPosition, setDiceBPosition] = useState({ x: 0, y: 0 })

  const exercises = ["深蹲", "伏地挺身", "仰臥起坐", "平板支撐 10秒", "深蹲", "伏地挺身"]

  const chanceCards = [
    "🎉 恭喜！獲得 20% 折扣碼",
    "🧧 新年紅包！獲得 100 元優惠券",
    "😅 小懲罰：做 10 個深蹲",
    "🎊 幸運！免費獲得一份小禮品",
    "💪 挑戰：完成 1 分鐘平板支撐",
    "🎁 驚喜！獲得神秘禮物一份",
  ]

  const rollDice = () => {
    if (isRolling) return
    setIsRolling(true)
    setShowResultPopup(false)

    const randomRotationsA = {
      x: Math.random() * 1800 + 900,
      y: Math.random() * 1800 + 900,
      z: Math.random() * 1800 + 900,
    }
    const randomRotationsB = {
      x: Math.random() * 1800 + 900,
      y: Math.random() * 1800 + 900,
      z: Math.random() * 1800 + 900,
    }

    const isMobile = window.innerWidth < 640
    const moveRange = isMobile ? 60 : 100
    const moveRangeY = isMobile ? 40 : 60

    const randomPositionA = {
      x: (Math.random() - 0.5) * moveRange,
      y: (Math.random() - 0.5) * moveRangeY,
    }
    const randomPositionB = {
      x: (Math.random() - 0.5) * moveRange,
      y: (Math.random() - 0.5) * moveRangeY,
    }

    setDiceARotation(randomRotationsA)
    setDiceBRotation(randomRotationsB)
    setDiceAPosition(randomPositionA)
    setDiceBPosition(randomPositionB)

    setTimeout(() => {
      const newDiceAValue = Math.floor(Math.random() * 6) + 1
      const newDiceBValue = exercises[Math.floor(Math.random() * exercises.length)]

      setDiceAValue(newDiceAValue)
      setDiceBValue(newDiceBValue)

      const bounceRotationA = {
        ...getFinalRotationForNumber(newDiceAValue),
        x: getFinalRotationForNumber(newDiceAValue).x + (Math.random() - 0.5) * 30,
        y: getFinalRotationForNumber(newDiceAValue).y + (Math.random() - 0.5) * 30,
      }
      const bounceRotationB = {
        ...getFinalRotationForExercise(newDiceBValue),
        x: getFinalRotationForExercise(newDiceBValue).x + (Math.random() - 0.5) * 30,
        y: getFinalRotationForExercise(newDiceBValue).y + (Math.random() - 0.5) * 30,
      }

      setDiceARotation(bounceRotationA)
      setDiceBRotation(bounceRotationB)
      const bounceRange = isMobile ? 30 : 40
      const bounceRangeY = isMobile ? 15 : 20
      setDiceAPosition({ x: (Math.random() - 0.5) * bounceRange, y: (Math.random() - 0.5) * bounceRangeY })
      setDiceBPosition({ x: (Math.random() - 0.5) * bounceRange, y: (Math.random() - 0.5) * bounceRangeY })

      setTimeout(() => {
        const rollAdjustA = {
          ...getFinalRotationForNumber(newDiceAValue),
          z: getFinalRotationForNumber(newDiceAValue).z + (Math.random() - 0.5) * 15,
        }
        const rollAdjustB = {
          ...getFinalRotationForExercise(newDiceBValue),
          z: getFinalRotationForExercise(newDiceBValue).z + (Math.random() - 0.5) * 15,
        }

        setDiceARotation(rollAdjustA)
        setDiceBRotation(rollAdjustB)
        const rollRange = isMobile ? 15 : 20
        const rollRangeY = isMobile ? 8 : 10
        setDiceAPosition({ x: (Math.random() - 0.5) * rollRange, y: (Math.random() - 0.5) * rollRangeY })
        setDiceBPosition({ x: (Math.random() - 0.5) * rollRange, y: (Math.random() - 0.5) * rollRangeY })

        setTimeout(() => {
          setDiceARotation(getFinalRotationForNumber(newDiceAValue))
          setDiceBRotation(getFinalRotationForExercise(newDiceBValue))
          setDiceAPosition({ x: 0, y: 0 })
          setDiceBPosition({ x: 0, y: 0 })

          setIsRolling(false)

          setTimeout(() => {
            setShowResultPopup(true)
          }, 1500)
        }, 800)
      }, 600)
    }, 2800)
  }

  const drawChanceCard = () => {
    if (isChanceCardAnimating) return
    setIsChanceCardAnimating(true)
    const randomCard = chanceCards[Math.floor(Math.random() * chanceCards.length)]
    setChanceCard(randomCard)
    setTimeout(() => {
      setShowChanceCardModal(true)
      setIsChanceCardAnimating(false)
    }, 300)
  }

  const closeChanceCardModal = () => {
    setShowChanceCardModal(false)
    setTimeout(() => setChanceCard(null), 300)
  }

  const getFinalRotationForNumber = (num: number) => {
    const rotations = {
      1: { x: 0, y: 0, z: 0 },
      2: { x: 0, y: -90, z: 0 },
      3: { x: 0, y: 180, z: 0 },
      4: { x: 0, y: 90, z: 0 },
      5: { x: -90, y: 0, z: 0 },
      6: { x: 90, y: 0, z: 0 },
    }
    return rotations[num as keyof typeof rotations]
  }

  const getFinalRotationForExercise = (exercise: string) => {
    const exerciseIndex = exercises.indexOf(exercise)
    return getFinalRotationForNumber((exerciseIndex % 6) + 1)
  }

  const renderDots = (num: number) => {
    const positions = {
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

    return positions[num as keyof typeof positions]?.map((position, index) => (
      <div key={index} className="dice-dot absolute" style={position} />
    ))
  }

  const render3DDiceA = () => {
    return (
      <div
        className="dice-container"
        style={{
          transform: `translate(${diceAPosition.x}px, ${diceAPosition.y}px)`,
          transition: isRolling
            ? diceAPosition.x === 0 && diceAPosition.y === 0
              ? "transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
              : "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          className="dice-cube"
          style={{
            transform: `rotateX(${diceARotation.x}deg) rotateY(${diceARotation.y}deg) rotateZ(${diceARotation.z}deg)`,
            transition: isRolling
              ? Math.abs(diceARotation.x) > 500
                ? "transform 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : Math.abs(diceARotation.x - getFinalRotationForNumber(diceAValue).x) > 20
                  ? "transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                  : "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)"
              : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="dice-face dice-face-front bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg">
            {renderDots(1)}
          </div>
          <div className="dice-face dice-face-right bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg">
            {renderDots(2)}
          </div>
          <div className="dice-face dice-face-back bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg">
            {renderDots(3)}
          </div>
          <div className="dice-face dice-face-left bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg">
            {renderDots(4)}
          </div>
          <div className="dice-face dice-face-top bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg">
            {renderDots(5)}
          </div>
          <div className="dice-face dice-face-bottom bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg">
            {renderDots(6)}
          </div>
        </div>
      </div>
    )
  }

  const render3DDiceB = () => {
    return (
      <div
        className="dice-container"
        style={{
          transform: `translate(${diceBPosition.x}px, ${diceBPosition.y}px)`,
          transition: isRolling
            ? diceBPosition.x === 0 && diceBPosition.y === 0
              ? "transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
              : "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          className="dice-cube"
          style={{
            transform: `rotateX(${diceBRotation.x}deg) rotateY(${diceBRotation.y}deg) rotateZ(${diceBRotation.z}deg)`,
            transition: isRolling
              ? Math.abs(diceBRotation.x) > 500
                ? "transform 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : Math.abs(diceBRotation.x - getFinalRotationForExercise(diceBValue).x) > 20
                  ? "transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                  : "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)"
              : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {exercises.map((exercise, index) => {
            const faceClasses = [
              "dice-face-front",
              "dice-face-right",
              "dice-face-back",
              "dice-face-left",
              "dice-face-top",
              "dice-face-bottom",
            ]
            return (
              <div
                key={index}
                className={`dice-face ${faceClasses[index]} bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg flex items-center justify-center`}
              >
                <div className="text-white font-bold text-xs sm:text-sm text-center leading-tight px-1 sm:px-2 drop-shadow-lg">
                  {exercise}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex flex-col relative overflow-hidden">

      {showChanceCardModal && chanceCard && (
        <div className="card-modal-overlay" onClick={closeChanceCardModal}>
          <div className="card-modal" onClick={(e) => e.stopPropagation()}>
            <button className="card-modal-close" onClick={closeChanceCardModal}>
              ×
            </button>
            <div className="card-modal-content">{chanceCard}</div>
          </div>
        </div>
      )}

      {showResultPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-yellow-400 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-red-800 font-bold text-xl sm:text-2xl mb-4">🎲 投擲結果 🎲</h3>
              <div className="flex gap-4 sm:gap-8 items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-red-700 text-3xl sm:text-4xl font-bold">{diceAValue}</div>
                </div>
                <div className="text-yellow-600 text-2xl sm:text-3xl">|</div>
                <div className="text-center">
                  <div className="text-red-700 text-lg sm:text-xl font-bold">{diceBValue}</div>
                </div>
              </div>
              <Button
                onClick={() => setShowResultPopup(false)}
                className="bg-gradient-to-br from-red-600 to-red-700 text-yellow-400 border-2 border-yellow-400 hover:from-red-500 hover:to-red-600 px-6 py-2 rounded-lg font-bold"
              >
                確定
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-4 left-4 sm:left-8 text-4xl sm:text-6xl animate-bounce">🏮</div>
        <div
          className="absolute top-4 right-4 sm:right-8 text-4xl sm:text-6xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          🏮
        </div>
        <div className="absolute top-16 left-1/4 text-2xl sm:text-4xl animate-pulse">🎆</div>
        <div className="absolute top-20 right-1/4 text-2xl sm:text-4xl animate-pulse" style={{ animationDelay: "1s" }}>
          🎇
        </div>
        <div className="absolute bottom-20 left-6 sm:left-12 text-2xl sm:text-3xl animate-spin">🪙</div>
        <div
          className="absolute bottom-24 right-8 sm:right-16 text-2xl sm:text-3xl animate-spin"
          style={{ animationDelay: "2s" }}
        >
          🪙
        </div>
      </div>

      <div className="text-center py-4 sm:py-8 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 drop-shadow-lg text-balance">
          禮盒 X Umrart 骰子遊戲
        </h1>
        <div className="text-lg sm:text-xl md:text-2xl text-yellow-300">🐎 Urmart 祝馬年行大運 🐎</div>
      </div>

      <div className="flex-1 flex items-center justify-center pt-4 sm:pt-8 px-4">
        <div className="p-4 sm:p-8 md:p-12 rounded-2xl w-full max-w-2xl">
          <div className="flex flex-row gap-6 sm:gap-12 md:gap-16 items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="cursor-pointer transform transition-all duration-300 hover:scale-105" onClick={rollDice}>
                {render3DDiceA()}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="cursor-pointer transform transition-all duration-300 hover:scale-105" onClick={rollDice}>
                {render3DDiceB()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-4">
        <Button
          onClick={rollDice}
          disabled={isRolling}
          className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-red-800 border-3 sm:border-4 border-red-600 hover:from-yellow-300 hover:to-yellow-500 px-4 sm:px-12 py-4 sm:py-6 rounded-full text-lg sm:text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:opacity-50"
        >
          {isRolling ? "🎲 擲骰中..." : "🎲 點擊擲骰"}
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12">
            <div className="flex gap-3 sm:gap-6">
              <div
                className={`cursor-pointer hover:scale-105 transition-all duration-300 ${isChanceCardAnimating ? "animate-pulse" : ""}`}
                onClick={drawChanceCard}
                style={{
                  width: "var(--card-width)",
                  height: "var(--card-height)",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 border-3 sm:border-4 border-yellow-400 hover:shadow-2xl relative overflow-hidden rounded-xl flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                  <div className="text-yellow-400 font-bold text-sm sm:text-lg md:text-xl z-10">機會</div>
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 text-yellow-400 text-base sm:text-xl md:text-2xl">
                    🧧
                  </div>
                  <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 text-yellow-400 text-xs sm:text-base md:text-lg">
                    💰
                  </div>
                </div>
              </div>
              <div
                className={`cursor-pointer hover:scale-105 transition-all duration-300 ${isChanceCardAnimating ? "animate-pulse" : ""}`}
                onClick={drawChanceCard}
                style={{
                  width: "var(--card-width)",
                  height: "var(--card-height)",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 border-3 sm:border-4 border-yellow-400 hover:shadow-2xl relative overflow-hidden rounded-xl flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                  <div className="text-yellow-400 font-bold text-sm sm:text-lg md:text-xl z-10">命運</div>
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 text-yellow-400 text-base sm:text-xl md:text-2xl">
                    🧧
                  </div>
                  <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 text-yellow-400 text-xs sm:text-base md:text-lg">
                    💰
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4 sm:py-8 px-4">
        <div className="text-sm sm:text-base text-yellow-300 mb-2">🎊 新年快樂！祝您馬年行大運！ 🎊</div>
        <div className="text-xs sm:text-sm text-yellow-200">Urmart 禮盒 - 讓您的新年更精彩！</div>
      </div>
    </div>
  )
}
