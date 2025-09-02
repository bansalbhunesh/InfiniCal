import React, { useEffect, useState } from 'react'

export default function Toast({ message, onDone, duration = 2500 }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => setVisible(false), duration)
    const t2 = setTimeout(() => onDone?.(), duration + 320)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [duration, onDone])
  return (
    <div style={{position:'fixed', top:20, right:20, zIndex:2000, transform:`translateX(${visible?0:120}%)`, transition:'transform 0.3s ease'}}>
      <div style={{background:'linear-gradient(135deg,#48bb78,#38a169)',color:'#fff',padding:'10px 16px',borderRadius:10,fontWeight:700,boxShadow:'0 6px 18px rgba(0,0,0,0.2)'}}>
        {message}
      </div>
    </div>
  )
}


