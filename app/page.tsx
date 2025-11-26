"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NewYearDiceGame() {
  const [diceAValue, setDiceAValue] = useState<number>(1);
  const [diceBValue, setDiceBValue] = useState<string>("深蹲");
  const [isRolling, setIsRolling] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [chanceCard, setChanceCard] = useState<string | null>(null);
  const [showChanceCardModal, setShowChanceCardModal] = useState(false);
  const [isChanceCardAnimating, setIsChanceCardAnimating] = useState(false);

  // 遊戲開始狀態
  const [gameStarted, setGameStarted] = useState(false);

  // 音效相關的狀態和 ref
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] =
    useState(false);
  const diceAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  const exercises = [
    "深蹲",
    "伏地挺身",
    "仰臥起坐",
    "平板支撐 10秒",
    "深蹲",
    "伏地挺身",
  ];

  // 音效相關函數
  const initializeAudio = useCallback(async () => {
    console.log("🎵 初始化音效系統...");
    try {
      // 播放一次骰子音效並立即暫停，以激活瀏覽器的音效權限
      const audio = new Audio("/audio/dice.mp3");
      audio.volume = 0.1; // 低音量播放，避免突兀
      await audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log("✅ 音效權限已激活並暫停");
      }, 100); // 播放100ms後暫停

      // 初始化實際的音效物件
      diceAudioRef.current = new Audio("/audio/dice.mp3");
      diceAudioRef.current.preload = "auto";
      diceAudioRef.current.volume = 1.0; // 骰子音效最大音量

      setIsAudioInitialized(true);
      console.log("✅ 音效系統初始化完成");
    } catch (error) {
      console.error("❌ 音效權限激活失敗或初始化錯誤:", error);
      // 即使失敗也嘗試初始化，讓使用者可以嘗試其他互動
      setIsAudioInitialized(true);
    }
  }, []);

  // 播放骰子音效的函數 - 從第1秒開始播放3秒
  const playDiceSound = useCallback(async () => {
    if (!isAudioInitialized) {
      await initializeAudio();
    }

    try {
      console.log("🎵 開始播放骰子音效（從第1秒開始，播放3秒）...");
      // 建立新的音效物件（確保每次都是新的）
      const audio = new Audio("/audio/dice.mp3");
      audio.volume = 1.0;
      audio.muted = false;

      // 等待音效載入完成
      await new Promise((resolve) => {
        audio.addEventListener("canplaythrough", resolve, { once: true });
      });

      // 從第1秒開始播放
      audio.currentTime = 1.0;
      await audio.play();

      // 3.5秒後停止播放
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log("🔇 骰子音效已在3.5秒後停止");
      }, 3500);

      console.log("✅ 骰子音效播放成功（從第1秒開始，播放3.5秒）!");
    } catch (error) {
      console.log("❌ 骰子音效播放失敗:", error);
      console.log("💡 請檢查手機音量設定");
    }
  }, [isAudioInitialized, initializeAudio]);

  // 背景音樂控制函數
  const toggleBackgroundMusic = useCallback(() => {
    if (backgroundAudioRef.current) {
      if (isBackgroundMusicPlaying) {
        backgroundAudioRef.current.pause();
        setIsBackgroundMusicPlaying(false);
        console.log("🔇 背景音樂已暫停");
      } else {
        backgroundAudioRef.current.play();
        setIsBackgroundMusicPlaying(true);
        console.log("🔊 背景音樂已播放");
      }
    }
  }, [isBackgroundMusicPlaying]);

  // 開始遊戲函數
  const startGame = useCallback(async () => {
    console.log("🎮 開始遊戲...");
    try {
      // 播放背景音樂
      if (!backgroundAudioRef.current) {
        backgroundAudioRef.current = new Audio("/audio/bg.mp3");
        backgroundAudioRef.current.loop = true;
        backgroundAudioRef.current.volume = 0.3;
        backgroundAudioRef.current.preload = "auto";

        // 只播放前30秒
        backgroundAudioRef.current.addEventListener("timeupdate", () => {
          if (
            backgroundAudioRef.current &&
            backgroundAudioRef.current.currentTime >= 30
          ) {
            backgroundAudioRef.current.currentTime = 0;
          }
        });

        try {
          await backgroundAudioRef.current.play();
          setIsBackgroundMusicPlaying(true);
          console.log("🎵 背景音樂開始播放");
        } catch (audioError) {
          console.log("⚠️ 背景音樂播放失敗，繼續遊戲");
        }
      }

      // 初始化骰子音效
      try {
        await initializeAudio();
      } catch (audioError) {
        console.log("⚠️ 骰子音效初始化失敗，繼續遊戲");
      }

      // 隱藏開始按鈕，顯示遊戲內容
      setGameStarted(true);
      console.log("✅ 遊戲開始完成");
    } catch (error) {
      console.error("❌ 開始遊戲失敗:", error);
      // 即使背景音樂失敗，也繼續遊戲
      setGameStarted(true);
    }
  }, [initializeAudio]);

  const chanceCards = [
    "🎉 恭喜！獲得 20% 折扣碼",
    "🧧 新年紅包！獲得 100 元優惠券",
    "😅 小懲罰：做 10 個深蹲",
    "🎊 幸運！免費獲得一份小禮品",
    "💪 挑戰：完成 1 分鐘平板支撐",
    "🎁 驚喜！獲得神秘禮物一份",
  ];

  const rollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);
    setShowResultPopup(false);

    // 播放骰子音效
    await playDiceSound();

    // 生成最終結果
    const newDiceAValue = Math.floor(Math.random() * 6) + 1;
    const newDiceBValue =
      exercises[Math.floor(Math.random() * exercises.length)];

    // 3.5秒後顯示結果
    setTimeout(() => {
      setDiceAValue(newDiceAValue);
      setDiceBValue(newDiceBValue);
      setIsRolling(false);

      setTimeout(() => {
        setShowResultPopup(true);
      }, 1000); // 延長到1秒，讓最終點數顯示更久
    }, 3500); // 3.5秒動畫與音效同步
  };

  const drawChanceCard = () => {
    if (isChanceCardAnimating) return;
    setIsChanceCardAnimating(true);
    const randomCard =
      chanceCards[Math.floor(Math.random() * chanceCards.length)];
    setChanceCard(randomCard);
    setTimeout(() => {
      setShowChanceCardModal(true);
      setIsChanceCardAnimating(false);
    }, 300);
  };

  const closeChanceCardModal = () => {
    setShowChanceCardModal(false);
    setTimeout(() => setChanceCard(null), 300);
  };

  const getFinalRotationForNumber = (num: number) => {
    const rotations = {
      1: { x: 0, y: 0, z: 0 },
      2: { x: 0, y: -90, z: 0 },
      3: { x: 0, y: 180, z: 0 },
      4: { x: 0, y: 90, z: 0 },
      5: { x: -90, y: 0, z: 0 },
      6: { x: 90, y: 0, z: 0 },
    };
    return rotations[num as keyof typeof rotations];
  };

  const getFinalRotationForExercise = (exercise: string) => {
    const exerciseIndex = exercises.indexOf(exercise);
    return getFinalRotationForNumber((exerciseIndex % 6) + 1);
  };

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
    };

    return positions[num as keyof typeof positions]?.map((position, index) => (
      <div
        key={index}
        className="dice-dot absolute"
        style={position}
      />
    ));
  };

  const render3DDiceA = () => {
    return (
      <motion.div
        className="dice-container"
        animate={
          isRolling
            ? {
                x: [0, 20, -15, 10, 0],
                y: [0, -15, 25, -10, 0],
                transition: {
                  duration: 3.5,
                  times: [0, 0.17, 0.43, 0.71, 1],
                  ease: "easeInOut",
                },
              }
            : {
                x: 0,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              }
        }
      >
        <motion.div
          className="dice-cube"
          animate={
            isRolling
              ? {
                  rotateX: [
                    0,
                    1800,
                    3600,
                    5400,
                    getFinalRotationForNumber(diceAValue).x,
                  ],
                  rotateY: [
                    0,
                    1800,
                    3600,
                    5400,
                    getFinalRotationForNumber(diceAValue).y,
                  ],
                  rotateZ: [
                    0,
                    1800,
                    3600,
                    5400,
                    getFinalRotationForNumber(diceAValue).z,
                  ],
                  transition: {
                    duration: 3.5,
                    times: [0, 0.14, 0.43, 0.71, 1],
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }
              : {
                  rotateX: getFinalRotationForNumber(diceAValue).x,
                  rotateY: getFinalRotationForNumber(diceAValue).y,
                  rotateZ: getFinalRotationForNumber(diceAValue).z,
                  transition: { duration: 0.5, ease: "easeOut" },
                }
          }
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
        </motion.div>
      </motion.div>
    );
  };

  const render3DDiceB = () => {
    return (
      <motion.div
        className="dice-container"
        animate={
          isRolling
            ? {
                x: [0, -20, 15, -10, 0],
                y: [0, 15, -25, 10, 0],
                transition: {
                  duration: 3.5,
                  times: [0, 0.17, 0.43, 0.71, 1],
                  ease: "easeInOut",
                },
              }
            : {
                x: 0,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              }
        }
      >
        <motion.div
          className="dice-cube"
          animate={
            isRolling
              ? {
                  rotateX: [
                    0,
                    1800,
                    3600,
                    5400,
                    getFinalRotationForExercise(diceBValue).x,
                  ],
                  rotateY: [
                    0,
                    1800,
                    3600,
                    5400,
                    getFinalRotationForExercise(diceBValue).y,
                  ],
                  rotateZ: [
                    0,
                    1800,
                    3600,
                    5400,
                    getFinalRotationForExercise(diceBValue).z,
                  ],
                  transition: {
                    duration: 3.5,
                    times: [0, 0.14, 0.43, 0.71, 1],
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }
              : {
                  rotateX: getFinalRotationForExercise(diceBValue).x,
                  rotateY: getFinalRotationForExercise(diceBValue).y,
                  rotateZ: getFinalRotationForExercise(diceBValue).z,
                  transition: { duration: 0.5, ease: "easeOut" },
                }
          }
        >
          {exercises.map((exercise, index) => {
            const faceClasses = [
              "dice-face-front",
              "dice-face-right",
              "dice-face-back",
              "dice-face-left",
              "dice-face-top",
              "dice-face-bottom",
            ];
            return (
              <div
                key={index}
                className={`dice-face ${faceClasses[index]} bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg flex items-center justify-center`}
              >
                <div className="text-white font-bold text-xs sm:text-sm text-center leading-tight px-1 sm:px-2 drop-shadow-lg">
                  {exercise}
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    );
  };

  // 如果遊戲還沒開始，顯示開始遊戲畫面
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex items-center justify-center relative overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 text-4xl sm:text-6xl animate-bounce">
            🏮
          </div>
          <div
            className="absolute top-4 right-4 text-4xl sm:text-6xl animate-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            🏮
          </div>
          <div className="absolute top-16 left-1/4 text-2xl sm:text-4xl animate-pulse">
            🎆
          </div>
          <div
            className="absolute top-20 right-1/4 text-2xl sm:text-4xl animate-pulse"
            style={{ animationDelay: "1s" }}
          >
            🎇
          </div>
          <div className="absolute bottom-20 left-6 sm:left-12 text-2xl sm:text-3xl animate-spin">
            🪙
          </div>
          <div
            className="absolute bottom-24 right-8 sm:right-16 text-2xl sm:text-3xl animate-spin"
            style={{ animationDelay: "2s" }}
          >
            🪙
          </div>
        </div>

        {/* 開始遊戲按鈕 */}
        <div className="z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-8 drop-shadow-lg">
            馬上成為蛋白富翁
          </h1>
          <div className="text-base sm:text-lg md:text-xl text-yellow-300 mb-12">
            🏆 獲勝方式：集齊 3 種 不同蛋白點心並 跨越終點，即算勝利！ <br />
            🎲 如擲出之骰子結果無法成功完成指定動作，即視為不成功，無法往前進
            <br />
            ❗️每個人可以準備一張衛生紙放蛋白點心喔！
          </div>
          <Button
            onClick={startGame}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-red-800 font-bold text-xl sm:text-2xl md:text-3xl px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 rounded-xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 border-2 border-yellow-300 w-full max-w-xs sm:max-w-sm"
          >
            🎲 開始遊戲
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex flex-col relative overflow-hidden">
      {showChanceCardModal && chanceCard && (
        <div
          className="card-modal-overlay"
          onClick={closeChanceCardModal}
        >
          <div
            className="card-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="card-modal-close"
              onClick={closeChanceCardModal}
            >
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
              <h3 className="text-red-800 font-bold text-xl sm:text-2xl mb-4">
                🎲 投擲結果 🎲
              </h3>
              <div className="flex gap-4 sm:gap-8 items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-red-700 text-3xl sm:text-4xl font-bold">
                    {diceAValue}
                  </div>
                </div>
                <div className="text-yellow-600 text-2xl sm:text-3xl">|</div>
                <div className="text-center">
                  <div className="text-red-700 text-lg sm:text-xl font-bold">
                    {diceBValue}
                  </div>
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
        <div className="absolute top-4 left-4 sm:left-8 text-4xl sm:text-6xl animate-bounce">
          🏮
        </div>
        <div
          className="absolute top-4 right-4 sm:right-8 text-4xl sm:text-6xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          🏮
        </div>
        <div className="absolute top-16 left-1/4 text-2xl sm:text-4xl animate-pulse">
          🎆
        </div>
        <div
          className="absolute top-20 right-1/4 text-2xl sm:text-4xl animate-pulse"
          style={{ animationDelay: "1s" }}
        >
          🎇
        </div>
        <div className="absolute bottom-20 left-6 sm:left-12 text-2xl sm:text-3xl animate-spin">
          🪙
        </div>
        <div
          className="absolute bottom-24 right-8 sm:right-16 text-2xl sm:text-3xl animate-spin"
          style={{ animationDelay: "2s" }}
        >
          🪙
        </div>
      </div>

      <div className="text-center py-4 sm:py-8 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 drop-shadow-lg text-balance">
          禮盒 X Urmart 骰子遊戲
        </h1>
        <div className="text-lg sm:text-xl md:text-2xl text-yellow-300">
          🐎 Urmart 祝馬年行大運!! 🐎
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center pt-4 sm:pt-8 px-4">
        <div className="p-4 sm:p-8 md:p-12 rounded-2xl w-full max-w-2xl">
          <div className="flex flex-row gap-6 sm:gap-12 md:gap-16 items-center justify-center">
            <div className="flex flex-col items-center">
              <div
                className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={rollDice}
              >
                {render3DDiceA()}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={rollDice}
              >
                {render3DDiceB()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-4 gap-4">
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
                className={`cursor-pointer hover:scale-105 transition-all duration-300 ${
                  isChanceCardAnimating ? "animate-pulse" : ""
                }`}
                onClick={drawChanceCard}
                style={{
                  width: "var(--card-width)",
                  height: "var(--card-height)",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 border-3 sm:border-4 border-yellow-400 hover:shadow-2xl relative overflow-hidden rounded-xl flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                  <div className="text-yellow-400 font-bold text-sm sm:text-lg md:text-xl z-10">
                    肌會
                  </div>
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 text-yellow-400 text-base sm:text-xl md:text-2xl">
                    🧧
                  </div>
                  <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 text-yellow-400 text-xs sm:text-base md:text-lg">
                    💰
                  </div>
                </div>
              </div>
              <div
                className={`cursor-pointer hover:scale-105 transition-all duration-300 ${
                  isChanceCardAnimating ? "animate-pulse" : ""
                }`}
                onClick={drawChanceCard}
                style={{
                  width: "var(--card-width)",
                  height: "var(--card-height)",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 border-3 sm:border-4 border-yellow-400 hover:shadow-2xl relative overflow-hidden rounded-xl flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                  <div className="text-yellow-400 font-bold text-sm sm:text-lg md:text-xl z-10">
                    命運
                  </div>
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

      {/* 背景音樂控制按鈕 */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={toggleBackgroundMusic}
          className="bg-yellow-500 hover:bg-yellow-400 text-red-800 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 border-2 border-yellow-300"
          title={isBackgroundMusicPlaying ? "暫停背景音樂" : "播放背景音樂"}
        >
          <span className="text-lg sm:text-xl">
            {isBackgroundMusicPlaying ? "🔊" : "🔇"}
          </span>
        </button>
      </div>

      <div className="text-center py-4 sm:py-8 px-4">
        <div className="text-sm sm:text-base text-yellow-300 mb-2">
          🎊 新年快樂！祝您馬年行大運！ 🎊
        </div>
        <div className="text-xs sm:text-sm text-yellow-200">
          Urmart 禮盒 - 讓您的新年更精彩！
        </div>
      </div>
    </div>
  );
}
