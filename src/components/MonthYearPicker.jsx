import React, { useMemo } from 'react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function MonthYearPicker({ isOpen, year, month, onClose, onSelect }) {
  if (!isOpen) return null
  const years = useMemo(() => {
    const center = year || new Date().getFullYear()
    const start = center - 50
    return Array.from({ length: 101 }, (_, i) => start + i)
  }, [year])

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={(e)=>{if(e.target===e.currentTarget) onClose?.()}}>
      <div style={{width:720,maxWidth:'95vw',maxHeight:'85vh',background:'#fff',borderRadius:12,overflow:'hidden',display:'grid',gridTemplateColumns:'1fr 1fr'}}>
        <div style={{padding:12,borderRight:'1px solid #e2e8f0',overflowY:'auto'}}>
          <div style={{padding:'6px 0',fontWeight:800}}>Select Year</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
            {years.map(y => (
              <button key={y} onClick={()=>onSelect?.(y, month)} style={{padding:'8px 0',border:'1px solid #e2e8f0',borderRadius:8,background: y===year ? '#dbeafe' : '#fff',fontWeight:600}}>{y}</button>
            ))}
          </div>
        </div>
        <div style={{padding:12,overflowY:'auto'}}>
          <div style={{padding:'6px 0',fontWeight:800}}>Select Month</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {MONTHS.map((m, idx) => (
              <button key={m} onClick={()=>onSelect?.(year, idx)} style={{padding:'10px 0',border:'1px solid #e2e8f0',borderRadius:10,background: idx===month ? '#eef2ff' : '#fff',fontWeight:700}}>{m}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


