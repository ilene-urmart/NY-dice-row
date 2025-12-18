"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

type CardType = {
  title: string;
  desc?: string;
  cta?: string;
};

export default function NewYearDiceGame() {
  const [diceAValue, setDiceAValue] = useState<number>(1);
  const [diceBValue, setDiceBValue] = useState<string>("深蹲");
  const [diceBUnit, setDiceBUnit] = useState<string>("下");
  const [isRolling, setIsRolling] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [card, setCard] = useState<CardType | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [drawnCardIndexes, setDrawnCardIndexes] = useState<number[]>([]);
  const [cardType, setCardType] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [diceBNumber, setDiceBNumber] = useState<number>(0);
  const diceAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);

    const initializeApp = async () => {
      checkMobile();
      window.addEventListener("resize", checkMobile);

      const hasSeenIntro = sessionStorage.getItem("hasSeenIntroModal");
      if (!hasSeenIntro) {
        setShowIntroModal(true);
        sessionStorage.setItem("hasSeenIntroModal", "true");
      }

      // 裝置和瀏覽器檢測
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isMobileDevice = window.innerWidth < 900;

      // 根據裝置調整載入時間
      let loadingTime = 1500; // 預設載入時間

      if (isIOS) {
        loadingTime = 1200; // iOS 較短載入時間
      } else if (isSafari) {
        loadingTime = 1300; // Safari 較短載入時間
      } else if (isMobileDevice) {
        loadingTime = 1400; // 手機裝置較短載入時間
      }

      // 必須載入的關鍵圖片
      const criticalImages = ["/title.png", "/01-intro-bg.png"];

      // 載入圖片的 Promise（有超時保護）
      const loadImageWithTimeout = (src: string, timeout = 5000) => {
        return Promise.race([
          new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
            if (img.complete) resolve(true);
          }),
          new Promise<boolean>((resolve) =>
            setTimeout(() => resolve(false), timeout)
          ),
        ]);
      };

      // 等待關鍵圖片載入完成
      try {
        const imageLoadResults = await Promise.all(
          criticalImages.map((src) => loadImageWithTimeout(src))
        );

        // 檢查是否有圖片載入失敗
        const allImagesLoaded = imageLoadResults.every(
          (result) => result === true
        );
        if (!allImagesLoaded) {
          console.warn(
            "Some critical images failed to load, but continuing..."
          );
        }
      } catch (error) {
        console.warn("Error loading critical images:", error);
      }

      // 預載入其他重要圖片（不阻塞載入完成）
      const preloadOtherImages = () => {
        const otherImages = [
          "/02-bg-mobile.png",
          "/02-dice-result-bg.png",
          "/02-chance-front.png",
          "/02-destiny-front.png",
        ];
        otherImages.forEach((src) => {
          const img = new Image();
          img.src = src;
        });
      };

      preloadOtherImages();

      // 確保最少載入時間（避免載入太快）
      await new Promise<void>((resolve) => setTimeout(resolve, loadingTime));

      setIsLoading(false);
    };

    initializeApp();

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (showIntroModal) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setShowIntroModal(false);
          setIsClosing(false);
        }, 700);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [showIntroModal]);

  const exercises = [
    { name: "深蹲", unit: "下" },
    { name: "波比跳", unit: "下" },
    { name: "伏地挺身", unit: "下" },
    { name: "仰臥起坐", unit: "下" },
    { name: "平板撐", unit: "秒" },
    { name: "開合跳", unit: "下" },
  ];

  const chanceCards: CardType[] = [
    { title: "過年期間吃飽睡好，精神抖擻，再度獲得一次擲骰子的機會" },
    {
      title:
        "若你目前擁有的商品種類少於 2 種，獲得一次抽命運卡的機會（可以選擇不抽）",
    },
    { title: "年夜飯不小心吃太飽，下回擲骰子點數 -1 點" },
    {
      title:
        "估算一下今天已攝入的蛋白質含量，如達自身體重同等克數，前進一步，未達則後退一步",
    },
    { title: "在 10 秒內快速說出 5 個蛋白粉品牌，成功可選擇任一蛋白點心" },
    {
      title:
        "在 10 秒內快速說出 3 個你最近買過的蛋白粉口味，成功可獲得一根蛋白酥脆條",
    },
    {
      title:
        "擲骰子一次，擲出奇數可以獲得任一蛋白點心，擲出偶數則將自己任一款蛋白點心送給右邊的人",
    },
    {
      title:
        "跟你左邊的人組成一組！一個人平板撐，一個人在他背上立水瓶；成功的話兩人可各選擇一款想要的蛋白點心",
    },
    {
      title:
        "邀請在場所有人模仿自己在健身房裡最討厭聽到的一句話（例如「你還有幾組？」），投票最像的人可前進兩格",
    },
    { title: "平板支撐 30 秒，成功就獲得一根蛋白酥條" },
    { title: "說出三個蛋白質含量高的年菜，成功就能拿一塊蛋白堅果巧克力棒" },
    { title: "隨機指定一人做 30 下開合跳，若他完成，你們兩人各得一包即食肌酸" },
    {
      title:
        "你是今天的教練！你可以指定任一玩家做 30 秒指定動作，成功可獲得一根蛋白酥條與一塊蛋白巧克力棒 (自由分配)",
    },
    { title: "和左邊的玩家比誰能最快做完 10 下波比跳，贏的人獲得一包透明乳清" },
    {
      title:
        "跟右邊的人比賽 10 秒內誰可以說出較多種的運動，輸的人把自己任一款蛋白點心放回禮盒中",
    },
    { title: "指定一名玩家玩猜拳，輸的人把自己任一款蛋白點心放回禮盒中" },
    { title: "跟右邊的人比賽拇指摔角，贏的人可以拿一塊蛋白堅果巧克磚" },
    {
      title:
        "拿出手機，秀出你最近一次健身紀錄，若在 7 天內，獲得一根蛋白酥脆條",
    },
    { title: "可選擇與你右邊的人交換一塊蛋白點心" },
    { title: "可選擇與淺藍色啞鈴玩家人交換一款蛋白點心" },
    { title: "可選擇讓你左邊的人將任一蛋白點心贈予你" },
    { title: "可選擇跟在場任一你指定的人交換一款蛋白點心" },
    {
      title:
        "分享跟朋友遊玩的照片並分享到自己的 Instagram 限時動態並加註 #UrMart過年禮盒，完成可自由選擇獲得任一點心",
    },
    {
      title:
        "邀請任一玩家跟你比賽伏地挺身，做比較多下的可以獲得一塊蛋白堅果巧克磚",
    },
    { title: "邀請任一玩家跟你比平板撐，輸的人倒退 3 格" },
  ];

  const destinyCards: CardType[] = [
    {
      title: "想去的健身房週年期間休息，暫停一次",
    },
    {
      title: "遇到健身房人潮爆滿，改天再來，重新擲一次骰子",
    },
    {
      title: "過年期間依然保持運動，早上晨跑了 30 分鐘，前進三步",
    },
    {
      title: "肌肉痠痛中！暫停一次",
    },
    {
      title: "新年新希望許下今年要更健康，抽一張肌會卡",
    },
    {
      title: "休息是為了更好的增肌，暫停一次",
    },
    {
      title: "沒抵擋住過年餐桌上的零食誘惑，把自己的蛋白堅果巧克力磚吃掉",
    },
    {
      title:
        "過年媽媽問你有沒有什麼比較健康的餅乾可以吃，你推薦了 UrP!CK 蛋白酥脆條，獲得一根",
    },
    {
      title: "吃完年夜飯想來點甜的，獲得一塊蛋白堅果巧克力磚",
    },
    {
      title:
        "今天跟朋友去健身房的時候櫃檯在做補充肌酸的推廣活動，獲得一包即吞肌酸",
    },
    {
      title:
        "跟朋友去 UrMart 實體店的時候發現了新上架的酷東西，獲得一包即吞肌酸",
    },
    {
      title:
        "想喝蛋白粉的你發現家裡的庫存喝完了忘記囤貨，如你有透明乳清請放回禮盒中",
    },
    {
      title:
        "剛健身了 1 個小時後喝了蛋白粉補充體力；把一盒透明乳清放回禮盒中並前進 2 格",
    },
    {
      title: "寫日記的時候發現兩個禮拜沒運動了，倒退 2 格",
    },
    {
      title: "年夜飯不小心吃太飽了，臨時起意做 30 下仰臥起坐",
    },
    {
      title: "年夜飯吃了很多澱粉類，獲得滿滿能量；做 15 下波比跳",
    },
    {
      title: "過年期間打算跟朋友一起去爬山踏青，全體一起做了 20 下深蹲當作熱身",
    },
    {
      title:
        "在運動的時候遇見藍色啞鈴玩家，分享給他你最近吃到覺得很好吃的 UrP!CK 蛋白堅果巧克力磚；把你有的蛋白巧克磚送給他",
    },
    {
      title: "去健身房前補充了肌酸，即將即吞肌酸放回禮盒中",
    },
    {
      title:
        "今天早上出去運動的你現在有點餓了；如果你有蛋白酥脆條，請吃掉一根補充體力",
    },
    {
      title: "如果你現在沒有蛋白堅果巧克力磚，補給一塊！",
    },
    {
      title: "如果你現在沒有蛋白酥脆條，補給一根！",
    },
    {
      title: "如果你現在已經有 3 種不一樣的點心，倒退 2 格",
    },
    {
      title: "如果你現在已經有 2 種不一樣的點心，倒退 2 格",
    },
    {
      title: "如果你現在沒有任一蛋白點心，前進 2 格",
    },
    {
      title:
        "🎉 恭喜發財！你抽中 UrMart 紅包啦，獲得全站 9 折優惠碼！輸入「2026GIFTBOX9」領取優惠",
      desc: "＊記得先截圖優惠碼喔！＊使用時間：即刻起～2026/7/31",
      cta: "https://urmart.com/claim-coupon/9158",
    },
    {
      title:
        "🧧 新春好運到！你在蛋白之神的祝福下，獲得 UrMart $99 免運券！輸入「2026GIFTBOX99FS」領取優惠",
      desc: "＊記得先截圖優惠碼喔！＊使用時間：即刻起～2026/7/31",
      cta: "https://urmart.com/claim-coupon/9159",
    },
    {
      title:
        "🥛 你被財神爺光顧了！你獲得一包 UrP!CK 的透明乳清啦！輸入「2026GIFTBOXGIFT」可以於下次購物滿額時免費領取喔 ",
      desc: "於獲得當下～2026/2/28 於 UrMart 消費滿 $799 時可免費獲得一包 UrP!CK 透明乳清（口味任選，贈完為止，不累贈）",
      cta: "https://urmart.com/claim-coupon/9161",
    },
  ];

  const gameEnded = new Date() > new Date("2026-07-30T23:59:59");

  const bannerData = [
    {
      path: "https://urmart.com/category/1784?page=1",
      src: "/01-bn-01.png",
      alt: "差異化品項",
    },
    {
      path: "https://urmart.com/category/450?page=1&couponid=4063",
      src: "/01-bn-02.jpg",
      alt: "蛋白新手修煉手冊",
    },
    {
      path: "https://urmart.com/tag/11342?page=1",
      src: "/01-bn-03.jpg",
      alt: "UrP!CK",
    },
  ];

  const initializeAudio = useCallback(async () => {
    const audio = new Audio("/audio/dice.mp3");
    audio.volume = 0.1;
    await audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 100);

    diceAudioRef.current = new Audio("/audio/dice.mp3");
    diceAudioRef.current.preload = "auto";
    diceAudioRef.current.volume = 1.0;

    setIsAudioInitialized(true);
  }, []);

  const playDiceSound = useCallback(async () => {
    if (!isAudioInitialized) {
      await initializeAudio();
    }

    const audio = new Audio("/audio/dice.mp3");
    audio.volume = 1.0;
    audio.muted = false;

    await new Promise((resolve) => {
      audio.addEventListener("canplaythrough", resolve, { once: true });
    });

    audio.currentTime = 1.0;
    await audio.play();

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 1000);
  }, [isAudioInitialized, initializeAudio]);

  const startGame = useCallback(async () => {
    await initializeAudio();
    setGameStarted(true);
  }, [initializeAudio]);

  const rollDice = async () => {
    if (isRolling) return;
    setIsRolling(true);
    setShowResultPopup(false);

    await playDiceSound();

    const newDiceAValue = Math.floor(Math.random() * 6) + 1;
    const newExercise = exercises[Math.floor(Math.random() * exercises.length)];
    if (newExercise.name === "平板撐" || newExercise.name === "開合跳") {
      setDiceBNumber(newDiceAValue * 10);
    } else {
      setDiceBNumber(newDiceAValue);
    }

    setTimeout(() => {
      setDiceAValue(newDiceAValue);
      setDiceBValue(newExercise.name);
      setDiceBUnit(newExercise.unit);
      setIsRolling(false);

      setTimeout(() => {
        setShowResultPopup(true);
      }, 1000);
    }, 1000);
  };

  const drawCard = <T,>(
    cardList: T[],
    drawnIndexes: number[],
    setDrawnCardIndexes: React.Dispatch<React.SetStateAction<number[]>>,
    setCard: React.Dispatch<React.SetStateAction<T | null>>,
    setShowCardModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const availableIndexes = cardList
      .map((_, idx) => idx)
      .filter((idx) => !drawnIndexes.includes(idx));
    const indexesToDraw =
      availableIndexes.length > 0
        ? availableIndexes
        : cardList.map((_, idx) => idx);
    const randomIdx =
      indexesToDraw[Math.floor(Math.random() * indexesToDraw.length)];
    setCard(cardList[randomIdx]);
    setDrawnCardIndexes((prev) =>
      availableIndexes.length === 0 ? [randomIdx] : [...prev, randomIdx]
    );
    setShowCardModal(true);
  };

  const closeChanceCardModal = () => {
    setShowCardModal(false);
    setTimeout(() => setCard(null), 300);
  };

  const closeIntroModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowIntroModal(false);
      setIsClosing(false);
    }, 700);
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

  const getFinalRotationForExercise = (exerciseName: string) => {
    const exerciseIndex = exercises.findIndex((e) => e.name === exerciseName);
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
                  duration: 1,
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
                    duration: 1,
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
          <div className="dice-face dice-face-front bg-gradient-to-br from-white via-white to-gray-200 shadow-lg">
            {renderDots(1)}
          </div>
          <div className="dice-face dice-face-right bg-gradient-to-br from-white via-white to-gray-200 shadow-lg">
            {renderDots(2)}
          </div>
          <div className="dice-face dice-face-back bg-gradient-to-br from-white via-white to-gray-200 shadow-lg">
            {renderDots(3)}
          </div>
          <div className="dice-face dice-face-left bg-gradient-to-br from-white via-white to-gray-200 shadow-lg">
            {renderDots(4)}
          </div>
          <div className="dice-face dice-face-top bg-gradient-to-br from-white via-white to-gray-200 shadow-lg">
            {renderDots(5)}
          </div>
          <div className="dice-face dice-face-bottom bg-gradient-to-br from-white via-white to-gray-200 shadow-lg">
            {renderDots(6)}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const LoadingScreen = () => {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex flex-col justify-center items-center z-[9999]">
        <div className="text-center">
          <img
            src="/title.png"
            alt="Loading..."
            className="w-64 sm:w-96 mb-8 animate-pulse"
          />
          <div className="flex justify-center gap-2 mb-4">
            <div
              className="w-3 h-3 sm:w-5 sm:h-5 bg-[#eab569] border-2 sm:border-4 border-red-800 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 sm:w-5 sm:h-5 bg-[#eab569] border-2 sm:border-4 border-red-800 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 sm:w-5 sm:h-5 bg-[#eab569] border-2 sm:border-4 border-red-800 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
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
                  duration: 1,
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
                    duration: 1,
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
                className={`dice-face ${faceClasses[index]} bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 shadow-lg flex items-center justify-center`}
              >
                <div className="text-white font-bold text-sm sm:text-lg text-center leading-tight px-1 sm:px-2 drop-shadow-lg">
                  {exercise.name}
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (gameEnded) {
    return (
      <main className="bg-[url('/02-bg-mobile.jpg')] sm:bg-[url('/02-bg-web.jpg')] bg-cover bg-center min-h-screen flex justify-center items-center">
        <h1 className="text-4xl sm:text-7xl font-bold text-[#D4A554]">
          活動已結束
        </h1>
      </main>
    );
  }

  if (!gameStarted) {
    return (
      <main className="main-first-container">
        {showIntroModal && (
          <div
            className={`card-modal-overlay relative intro-modal-animate ${
              isClosing ? "closing" : ""
            }`}
            onClick={closeIntroModal}
          >
            <img
              src="/01-intro-bg.png"
              alt=""
              className="absolute z-[-100] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px]"
            />
            <div className="text-center w-full sm:w-[750px] h-[150px] sm:h-[380px] flex flex-col items-center justify-center gap-4 sm:gap-8 relative px-6 sm:px-18">
              <button
                className="card-modal-close text-red-800 border-4 border-red-800 bg-yellow-50 absolute top-0 right-2 scale-75 sm:scale-100 sm:top-6 sm:right-6"
                onClick={closeIntroModal}
              >
                X
              </button>
              <p className="text-sm sm:text-3xl sm:leading-12 text-red-900 font-light">
                🎉 健康生活，一整年都很努力 🎉
                <br />
                辛苦啦，也該好好犒賞自己了
                <br />
                <span className="font-semibold text-2xl sm:text-5xl text-red-800">
                  UrP!CK 2026 新年禮盒
                </span>
                <br />
                邀你和親友一起玩蛋白大富翁
                <br />
                吃得開心，也不忘營養
                <br />
                好好享受團聚時光
              </p>
            </div>
          </div>
        )}
        <section className="text-center py-2 sm:py-6 md:py-8 px-6 sm:px-8 md:px-10 w-full sm:w-[50%] self-center sm:self-end flex flex-col gap-2 sm:gap-0">
          <header className={isMobile ? "mt-4" : ""}>
            <img
              src="/title.png"
              alt="馬上成為蛋白富翁"
              className={isMobile ? "scale-[1.1]" : ""}
            />
          </header>
          <section className="text-base sm:text-lg md:text-xl text-yellow-300">
            <img
              src={isMobile ? "/01-desc-mobile.png" : "/01-desc-web.png"}
              alt="獲勝方式"
              className={isMobile ? "scale-[1.1]" : "scale-[1.15]"}
            />
          </section>
          <button
            onClick={startGame}
            className={`cursor-pointer ${isMobile ? "p-0 mt-4" : "p-5"}`}
          >
            <img
              src="/01-cta.png"
              alt="開始遊戲"
              className="translate-y-[-40px] transition-all duration-300 heartbeat"
            />
          </button>
        </section>
        <section className="cursor-pointer translate-y-[-20px] sm:translate-y-[-50px]">
          <div className={isMobile ? "translate-y-[-20px]" : ""}>
            <Swiper
              navigation={true}
              modules={[Navigation, Autoplay]}
              style={{
                width: `${isMobile ? "95vw" : "60vw"}`,
                height: "300px",
              }}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
            >
              {bannerData.map((banner, index) => (
                <SwiperSlide key={index}>
                  <a
                    href={banner.path}
                    target="_blank"
                  >
                    <img
                      src={banner.src}
                      alt={banner.alt}
                      className="w-full h-full object-contain rounded-lg shadow-lg"
                    />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-second-bg min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex flex-col relative overflow-hidden p-2 sm:p-10 relative">
      <button
        className="text-[#fbbf24] text-[10px] sm:text-lg absolute top-2 sm:top-4 left-2 sm:left-4 cursor-pointer bg-red-900 px-2 sm:px-4 rounded-lg sm:rounded-2xl border border-[#fbbf24] transition-all duration-300 z-10 glow-rotate hover:scale-102"
        onClick={() => setGameStarted(false)}
      >
        &lt; 再看一次規則
      </button>
      {showCardModal && card && (
        <div
          className={`card-modal-overlay ${isMobile ? "p-0" : "p-[20px]"}`}
          onClick={closeChanceCardModal}
        >
          <div
            className={`card-modal ${
              cardType === "chance"
                ? "card-modal-chance-bg"
                : "card-modal-destiny-bg"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`card-modal-close text-black border-5 top-6 right-6 ${
                cardType === "chance"
                  ? "text-black border-black"
                  : "text-yellow-200 border-yellow-100"
              }`}
              onClick={closeChanceCardModal}
            >
              X
            </button>
            <div className="card-modal-content">
              <h2
                className={`font-bold text-xl sm:text-lg md:text-xl 
    ${card?.desc ? "lg:text-xl" : "lg:text-2xl"} mb-4 text-center ${
                  cardType === "chance" ? "" : "text-yellow-50"
                }`}
              >
                {card?.title}
              </h2>
              {card?.desc && (
                <div>
                  <div className="card-modal-desc font-normal text-base sm:text-md md:text-md text-brown-100">
                    {card?.desc &&
                      card.desc
                        .split("＊")
                        .filter(Boolean)
                        .map((line, idx) => <p key={idx}>＊{line}</p>)}
                  </div>
                  <button onClick={() => window.open(card?.cta, "_blank")}>
                    <img
                      src="/02-card-cta.png"
                      alt="前往領取"
                      className="cursor-pointer hover:scale-105 transition-all duration-300 shake"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showResultPopup && (
        <div
          className="card-modal-overlay relative"
          onClick={() => setShowResultPopup(false)}
        >
          <img
            src="/02-dice-result-bg.png"
            alt=""
            className="absolute z-[-100] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px]"
          />
          <div className="text-center w-full sm:w-[750px] h-[150px] sm:h-[380px] flex flex-col items-center justify-end sm:pb-14 gap-4 sm:gap-8 relative">
            <button
              className="card-modal-close text-red-800 border-4 border-red-800 bg-yellow-50 absolute top-0 right-2 scale-75 sm:scale-100 sm:top-6 sm:right-6"
              onClick={closeChanceCardModal}
            >
              X
            </button>
            <div className="grid grid-cols-6  w-full items-center text-xl sm:text-4xl">
              <div className="col-span-2 text-right">
                前進{" "}
                <span className="text-red-800 text-4xl sm:text-7xl font-bold">
                  {diceAValue}
                </span>{" "}
                步
              </div>
              <div className="col-span-1 flex h-full w-full col-span-1 flex w-full justify-center items-center">
                {" "}
                <div className="bg-yellow-600 w-[4px] h-[65%]"></div>{" "}
              </div>
              <div className="col-span-3 text-left">
                做{" "}
                <span className="text-red-800 text-4xl sm:text-7xl font-bold">
                  {diceBNumber}
                </span>{" "}
                {diceBUnit}
                <span className="text-red-800 font-bold"> {diceBValue}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowResultPopup(false);
                rollDice();
              }}
              className="w-[50%]"
            >
              <img
                src="/02-dice-result-cta.png"
                alt="再骰一次"
                className="cursor-pointer shake"
              />
            </button>
          </div>
        </div>
      )}

      <div
        className={`main-second-container flex ${isMobile ? "flex-wrap" : ""}`}
      >
        <section
          className={`flex ${
            isMobile ? "justify-center w-[50%]" : "justify-end"
          } items-center `}
        >
          <img
            src="/02-chance-front.png"
            alt="肌會卡"
            className={`w-[80%] sm:w-[45%] hover:-rotate-4 transition-all duration-300 cursor-pointer ${
              isMobile ? "" : "translate-y-18"
            }`}
            onClick={() => {
              setCardType("chance");
              drawCard(
                chanceCards,
                drawnCardIndexes,
                setDrawnCardIndexes,
                setCard,
                setShowCardModal
              );
            }}
          />
        </section>

        <section
          className={`w-full sm:w-[45%] flex flex-col ${
            isMobile ? "gap-4" : "gap-10"
          }`}
          style={{ order: isMobile ? "-1" : "" }}
        >
          <header className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 drop-shadow-lg text-balance">
            <img
              src="/title.png"
              alt="馬上成為蛋白富翁"
              className={isMobile ? "scale-[1.05]" : "scale-110"}
            />
          </header>
          <div className="flex justify-center gap-14">
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
          <button
            className="p-6"
            onClick={rollDice}
            disabled={isRolling}
          >
            <img
              src="/02-cta.png"
              alt="點擊擲骰子"
              className="w-full h-full cursor-pointer transition-all duration-300 heartbeat disabled:opacity-50"
            />
          </button>
        </section>

        <section
          className={`flex ${
            isMobile ? "justify-center w-[50%]" : "justify-start"
          } items-center `}
        >
          <img
            src="/02-destiny-front.png"
            alt="命運卡"
            className={`w-[80%] sm:w-[45%] hover:rotate-4 transition-all duration-300 cursor-pointer ${
              isMobile ? "" : "translate-y-18"
            }`}
            onClick={() => {
              setCardType("destiny");
              drawCard(
                destinyCards,
                drawnCardIndexes,
                setDrawnCardIndexes,
                setCard,
                setShowCardModal
              );
            }}
          />
        </section>
      </div>
    </main>
  );
}
