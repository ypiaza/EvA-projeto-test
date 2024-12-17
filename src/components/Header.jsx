import { useState } from "react"

const Header = () => {
  return (
    <div className="absolute w-full border-b border-b-white/10 flex items-center justify-between px-4 py-1 sm:px-8 sm:py-3">
        <div>
            <h1 className="font-bold text-teal-500 ">EvA<span className="font-normal text-xs text-red-600 ">.v1</span></h1>
        </div>
        <div>
            o
        </div>
    </div>
  )
}

export default Header