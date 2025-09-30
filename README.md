# 🎲 骰子遊戲 (Dice Game)

一個具有流暢動畫效果的響應式骰子遊戲，使用 Next.js 和 React 構建。

## ✨ 功能特色

- **🎲 骰子互動** - 點擊骰子會旋轉、彈跳、滾動，具有自然的動畫效果
- **🃏 卡片翻牌** - 點擊機會卡片會翻牌並顯示內容
- **📱 響應式設計** - 在桌面、平板、手機上都能完美顯示
- **🎨 流暢動畫** - 使用 CSS3 動畫和過渡效果

## 🚀 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建靜態文件
npm run build
```

## 🌐 GitHub Pages 部署

這個項目已經配置為支持 GitHub Pages 靜態部署：

1. **推送代碼到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用戶名/Game_0930.git
   git push -u origin main
   ```

2. **啟用 GitHub Pages**
   - 進入 GitHub 倉庫的 Settings
   - 滾動到 "Pages" 部分
   - 選擇 "Deploy from a branch"
   - 選擇 "main" 分支和 "/ (root)" 文件夾
   - 點擊 "Save"

3. **自動部署**
   - 每次推送到 main 分支時，GitHub Pages 會自動重新部署
   - 部署完成後，您的網站將在 `https://你的用戶名.github.io/Game_0930/` 上可用

## 📁 項目結構

```
Game_0930/
├── app/
│   ├── page.tsx          # 主頁面組件
│   ├── globals.css       # 全局樣式
│   └── layout.tsx        # 布局組件
├── components/
│   └── ui/               # UI 組件
├── public/               # 靜態資源
├── next.config.mjs       # Next.js 配置
└── package.json          # 項目配置
```

## 🛠️ 技術棧

- **Next.js 14** - React 框架
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式框架
- **CSS3 動畫** - 流暢的動畫效果

## 📝 使用說明

1. **擲骰子** - 點擊骰子開始遊戲
2. **抽卡片** - 點擊機會卡片或命運卡片
3. **查看結果** - 遊戲結果會顯示在彈窗中

## 🎯 遊戲規則

- 骰子會隨機顯示 1-6 的數字
- 機會卡片提供隨機的遊戲事件
- 命運卡片提供隨機的命運事件

## 🔧 自定義

您可以通過修改以下文件來自定義遊戲：

- `app/page.tsx` - 修改遊戲邏輯和內容
- `app/globals.css` - 修改樣式和動畫
- `next.config.mjs` - 修改部署配置

## 📄 許可證

MIT License
