import React, { useEffect, useMemo } from 'react'

export default function FinalCardsOverlay({ isOpen, entries, currentIndex, onClose, onPrev, onNext }) {
  const windowed = useMemo(() => {
    const w = []
    for (let i = -2; i <= 2; i++) {
      const idx = currentIndex + i
      if (idx < 0 || idx >= entries.length) continue
      w.push({ entry: entries[idx], offset: i, idx })
    }
    return w
  }, [entries, currentIndex])

  useEffect(() => {
    function onKey(e) {
      if (!isOpen) return
      if (e.key === 'Escape') onClose?.()
      else if (e.key === 'ArrowLeft') onPrev?.()
      else if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, onPrev, onNext])

  useEffect(() => {
    if (!isOpen) return
    let startX = 0
    function onStart(e) { startX = (e.changedTouches?.[0]?.screenX) || 0 }
    function onEnd(e) {
      const endX = (e.changedTouches?.[0]?.screenX) || 0
      const delta = startX - endX
      if (Math.abs(delta) > 50) { if (delta > 0) onNext?.(); else onPrev?.() }
    }
    const el = document.getElementById('swipableContainer')
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
  const total = entries.length

  return (
    <div className="swipable-overlay active" id="swipableOverlay" onClick={(e)=>{ if (e.target === e.currentTarget) onClose?.() }}>
      <div className="swipable-container" id="swipableContainer">
        <div className="cards-carousel" id="cardsCarousel" style={{ position:'relative', padding: '0 64px' }}>
          {windowed.map(({ entry: e, offset, idx }) => {
            let cls = 'swipable-card'
            if (offset === -2) cls += ' far-prev'
            else if (offset === -1) cls += ' prev'
            else if (offset === 0) cls += ' current'
            else if (offset === 1) cls += ' next'
            else if (offset === 2) cls += ' far-next'
            const z = offset === 0 ? 3 : offset === -1 || offset === 1 ? 2 : 1
            const transition = 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 300ms ease'
            return (
              <div key={idx} className={cls} style={{ zIndex: z, transition }} onClick={()=>{ if (offset < 0) onPrev?.(); else if (offset > 0) onNext?.() }}>
                <div className="card-header">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                    <div className="card-counter">Entry {idx+1} of {total}</div>
                    <div style={{ color: '#667eea', fontWeight: 600 }}>{new Date(e.dateObject || e.date || Date.now()).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div style={{ color: '#718096' }}>{(e.entryIndex ?? 0) + 1} of {(e.siblingCount ?? 1)} entries on this date</div>
                  </div>
                  {offset === 0 && (
                    <button className="close-btn" onClick={onClose}>×</button>
                  )}
                </div>
                {e.imgUrl && (
                  <img src={e.imgUrl} alt="Entry" className="card-image" onError={(ev)=>{ ev.currentTarget.style.display='none' }} />
                )}
                <div className="card-rating">
                  <div className="entry-rating">
                    <span className="stars">{'★'.repeat(Math.floor(e.rating || 0))}{(e.rating||0)%1? '☆' : ''}</span>
                    <span className="rating-value">{Number(e.rating || 0).toFixed(1)}/5.0</span>
                  </div>
                  <div className="entry-date">{e.date}</div>
                </div>
                <div className="entry-description">{e.description}</div>
                <div className="entry-categories">
                  {Array.isArray(e.categories) && e.categories.map(cat => (
                    <span key={cat} className="category-tag">{cat}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="swipe-navigation" style={{ zIndex: 4 }}>
          <button className="nav-arrow" onClick={onPrev} disabled={currentIndex <= 0}>←</button>
          <div className="swipe-hint" style={{ textAlign: 'center', lineHeight: 1.3 }}>
            <div>🎴 Carousel View - See Previous & Next</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Swipe, click cards, or use ← → keys</div>
          </div>
          <button className="nav-arrow" onClick={onNext} disabled={currentIndex >= total - 1}>→</button>
        </div>
      </div>
    </div>
  )
}


