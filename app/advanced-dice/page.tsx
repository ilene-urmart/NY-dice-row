import { AdvancedDiceComponent } from "@/components/advanced-dice-component"

export default function AdvancedDiceTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">
          🎲 高級骰子元件測試
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          這個元件包含旋轉動畫、完整音效播放、手機友善設計，以及完整的骰子遊戲邏輯。
        </p>
      </div>
      
      <AdvancedDiceComponent />
      
      <div className="mt-8 text-center max-w-2xl">
        <h3 className="text-xl font-bold text-gray-700 mb-4">✨ 功能特色</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-blue-600 mb-2">🎵 音效功能</h4>
            <ul className="text-left space-y-1">
              <li>• 自動激活音效權限</li>
              <li>• 完整音效播放</li>
              <li>• 與動畫同步播放</li>
              <li>• 手機瀏覽器相容</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-purple-600 mb-2">🎨 視覺效果</h4>
            <ul className="text-left space-y-1">
              <li>• CSS 旋轉動畫</li>
              <li>• 漸層背景設計</li>
              <li>• 響應式布局</li>
              <li>• 懸停互動效果</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-green-600 mb-2">🎯 遊戲邏輯</h4>
            <ul className="text-left space-y-1">
              <li>• 隨機1-6點數</li>
              <li>• 旋轉動畫效果</li>
              <li>• 狀態管理</li>
              <li>• 防重複點擊</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-orange-600 mb-2">📱 手機優化</h4>
            <ul className="text-left space-y-1">
              <li>• 觸控友善設計</li>
              <li>• 音效權限處理</li>
              <li>• 響應式按鈕</li>
              <li>• 效能優化</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
