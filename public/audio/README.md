# 音效資料夾

這個資料夾用於存放專案中的音效檔案。

## 📁 資料夾結構
```
public/
└── audio/           # 音效檔案存放位置
    ├── dice-roll.mp3    # 骰子音效
    ├── background.mp3   # 背景音樂（可選）
    └── README.md        # 說明檔案
```

## 🎵 音效檔案說明

### 建議的音效檔案：
- `dice-roll.mp3` - 骰子滾動音效
- `background.mp3` - 背景音樂（可選）

### 音效檔案要求：
- 格式：MP3 或 WAV
- 大小：建議小於 1MB
- 品質：44.1kHz, 16-bit 或以上

## 🔗 在程式碼中使用

在 React/Next.js 專案中，可以直接使用以下路徑引用音效：

```javascript
// 引用骰子音效
const audioUrl = '/audio/dice-roll.mp3'

// 引用背景音樂
const backgroundUrl = '/audio/background.mp3'
```

## 📝 注意事項

1. **檔案路徑**：使用 `/audio/檔名.mp3` 格式
2. **瀏覽器相容性**：建議使用 MP3 格式以確保最佳相容性
3. **檔案大小**：避免過大的音效檔案影響載入速度
4. **版權**：確保使用的音效檔案有適當的使用授權

## 🎮 使用範例

```tsx
// 在 React 元件中使用
const audioRef = useRef<HTMLAudioElement | null>(null)

useEffect(() => {
  audioRef.current = new Audio('/audio/dice-roll.mp3')
  audioRef.current.preload = 'auto'
}, [])

const playSound = () => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0
    audioRef.current.play()
  }
}
```
