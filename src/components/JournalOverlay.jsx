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

  if (!isOpen) return null

  const entry = entries[currentIndex]

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={(e)=>{if(e.target===e.currentTarget) onClose?.()}}>
      <div style={{width:560,maxWidth:'90vw',maxHeight:'90vh',background:'#fff',borderRadius:12,overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 10px 30px rgba(0,0,0,0.25)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:16,borderBottom:'1px solid #e2e8f0'}}>
          <div style={{fontWeight:700}}>{entry ? formatDisplayDate(new Date(entry.dateObject || entry.date || Date.now())) : 'Entry'}</div>
          <button onClick={onClose} aria-label="Close" style={{fontSize:20,lineHeight:1,background:'transparent',border:'none',cursor:'pointer'}}>×</button>
        </div>
        {entry && (
          <div style={{padding:16,overflowY:'auto'}}>
            {entry.imgUrl && (
              <img src={entry.imgUrl} alt="" style={{width:'100%',borderRadius:8,marginBottom:12,display:'block'}} onError={(e)=>{e.currentTarget.style.display='none'}} />
            )}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{color:'#f59e0b',fontWeight:700}}>{'★'.repeat(Math.round(entry.rating || 0))}</div>
              <div style={{fontSize:12,color:'#64748b'}}>{Array.isArray(entry.categories) ? entry.categories.join(', ') : ''}</div>
            </div>
            <div style={{whiteSpace:'pre-wrap'}}>{entry.description}</div>
          </div>
        )}
        <div style={{display:'flex',gap:8,padding:12,borderTop:'1px solid #e2e8f0',justifyContent:'space-between'}}>
          <button onClick={onPrev} disabled={currentIndex<=0} className="overlay-nav">‹ Prev</button>
          <div style={{flex:1}} />
          <button onClick={onNext} disabled={currentIndex>=entries.length-1} className="overlay-nav">Next ›</button>
        </div>
      </div>
    </div>
  )
}


