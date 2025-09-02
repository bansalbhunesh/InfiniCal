import React, { useEffect, useMemo } from 'react'
import { formatDisplayDate } from '../utils/date'

export default function JournalOverlay({ isOpen, entries, onClose, onPrev, onNext, currentIndex }) {
  useEffect(() => {
    function onKey(e) {
      if (!isOpen) return
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, onPrev, onNext])

  // Touch swipe events
  useEffect(() => {
    if (!isOpen) return
    let startX = 0
    function onStart(e) { startX = (e.changedTouches?.[0]?.screenX) || 0 }
    function onEnd(e) {
      const endX = (e.changedTouches?.[0]?.screenX) || 0
      const delta = startX - endX
      if (Math.abs(delta) > 50) { if (delta > 0) onNext?.(); else onPrev?.() }
    }
    const el = document.getElementById('journal-overlay-swipe')
    if (!el) return
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchend', onEnd)
    }
  }, [isOpen, onPrev, onNext])

  if (!isOpen) return null

  const entry = entries[currentIndex]
  const windowed = []
  for (let i = -2; i <= 2; i++) {
    const idx = currentIndex + i
    if (idx < 0 || idx >= entries.length) continue
    windowed.push({ entry: entries[idx], offset: i, idx })
  }

  return (
    <div id="journal-overlay-swipe" style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={(e)=>{if(e.target===e.currentTarget) onClose?.()}}>
      <div style={{width:560,maxWidth:'90vw',maxHeight:'90vh',background:'#fff',borderRadius:12,overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 10px 30px rgba(0,0,0,0.25)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:16,borderBottom:'1px solid #e2e8f0'}}>
          <div style={{fontWeight:700}}>{entry ? formatDisplayDate(new Date(entry.dateObject || entry.date || Date.now())) : 'Entry'}</div>
          <button onClick={onClose} aria-label="Close" style={{fontSize:20,lineHeight:1,background:'transparent',border:'none',cursor:'pointer'}}>×</button>
        </div>
        <div style={{ position:'relative', height: 420, overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'stretch', justifyContent:'center' }}>
            {windowed.map(({ entry: e, offset, idx }) => (
              <div key={idx} onClick={()=>{ if (offset<0) onPrev?.(); else if (offset>0) onNext?.() }} style={{
                width: offset===0 ? 520 : 420,
                margin: '0 8px',
                transform: `translateX(${offset*440}px) scale(${offset===0?1:0.92})`,
                opacity: offset===0 ? 1 : 0.6,
                transition:'transform 0.25s ease, opacity 0.25s ease',
                pointerEvents: offset===0 ? 'auto' : 'auto',
                background:'#fafafa',
                border:'1px solid #e5e7eb',
                borderRadius:12,
                overflow:'hidden'
              }}>
                {e.imgUrl && (
                  <img src={e.imgUrl} alt="" style={{width:'100%',display:'block',maxHeight:240,objectFit:'cover'}} onError={(ev)=>{ev.currentTarget.style.display='none'}} />
                )}
                <div style={{padding:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <div style={{color:'#f59e0b',fontWeight:700}}>{'★'.repeat(Math.round(e.rating || 0))}</div>
                    <div style={{fontSize:12,color:'#64748b'}}>{Array.isArray(e.categories) ? e.categories.join(', ') : ''}</div>
                  </div>
                  <div style={{whiteSpace:'pre-wrap'}}>{e.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',gap:8,padding:12,borderTop:'1px solid #e2e8f0',justifyContent:'space-between'}}>
          <button onClick={onPrev} disabled={currentIndex<=0} className="overlay-nav">‹ Prev</button>
          <div style={{flex:1}} />
          <button onClick={onNext} disabled={currentIndex>=entries.length-1} className="overlay-nav">Next ›</button>
        </div>
      </div>
    </div>
  )
}


