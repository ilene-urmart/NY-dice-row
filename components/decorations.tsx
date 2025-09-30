"use client"

export function Decorations() {
  return (
    <>
      {/* Floating lanterns */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: "0s" }}>
        🏮
      </div>
      <div className="absolute top-20 right-16 text-3xl animate-bounce" style={{ animationDelay: "1s" }}>
        🏮
      </div>
      <div className="absolute top-32 left-1/4 text-2xl animate-bounce" style={{ animationDelay: "2s" }}>
        🎊
      </div>
      <div className="absolute top-16 right-1/3 text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>
        🧧
      </div>

      {/* Fireworks */}
      <div className="absolute top-24 left-1/2 text-2xl animate-pulse" style={{ animationDelay: "1.5s" }}>
        🎆
      </div>
      <div className="absolute top-40 right-20 text-2xl animate-pulse" style={{ animationDelay: "2.5s" }}>
        🎇
      </div>

      {/* Bottom decorations */}
      <div className="absolute bottom-20 left-8 text-3xl animate-bounce" style={{ animationDelay: "3s" }}>
        🐉
      </div>
      <div className="absolute bottom-32 right-12 text-2xl animate-bounce" style={{ animationDelay: "1.8s" }}>
        🎋
      </div>
      <div className="absolute bottom-16 left-1/3 text-2xl animate-pulse" style={{ animationDelay: "0.8s" }}>
        ✨
      </div>
      <div className="absolute bottom-28 right-1/4 text-2xl animate-pulse" style={{ animationDelay: "2.2s" }}>
        🌟
      </div>

      {/* Mobile-friendly smaller decorations */}
      <div className="md:hidden absolute top-8 right-8 text-xl animate-bounce" style={{ animationDelay: "1.2s" }}>
        🧧
      </div>
      <div className="md:hidden absolute bottom-12 left-4 text-xl animate-pulse" style={{ animationDelay: "2.8s" }}>
        🎊
      </div>
    </>
  )
}
