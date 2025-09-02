import React from 'react'

export default function YearPicker({ isOpen, year, onClose, onSelect }) {
  if (!isOpen) return null
  const start = year - 50
  const years = Array.from({ length: 101 }, (_, i) => start + i)
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={(e)=>{if(e.target===e.currentTarget) onClose?.()}}>
      <div style={{width:520,maxWidth:'90vw',maxHeight:'80vh',background:'#fff',borderRadius:12,overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div style={{padding:12,borderBottom:'1px solid #e2e8f0',fontWeight:700}}>Select Year</div>
        <div style={{padding:12,display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:8,overflowY:'auto'}}>
          {years.map(y => (
            <button key={y} onClick={()=>{ onSelect?.(y); onClose?.() }} style={{padding:'10px 0',border:'1px solid #e2e8f0',borderRadius:8,background: y===year ? '#dbeafe' : '#fff',fontWeight:600}}>{y}</button>
          ))}
        </div>
      </div>
    </div>
  )
}


