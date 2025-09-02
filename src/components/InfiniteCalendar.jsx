import React, { useEffect, useMemo, useRef, useState } from 'react'
import { addMonths, startOfMonth, isSameMonth, isSameDay } from 'date-fns'
import { buildMonthGrid, getAdjacentMonths, formatDateKey, formatDisplayDate } from '../utils/date'
import { getEntries, upsertEntry, deleteEntry, getFlattenedEntriesSorted } from '../state/journalStore'
import Toast from './Toast.jsx'
import JournalOverlay from './JournalOverlay'
import AddEntryModal from './AddEntryModal'
import YearPicker from './YearPicker'
import MonthYearPicker from './MonthYearPicker'

export default function InfiniteCalendar() {
  const [anchorDate, setAnchorDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isUserNavigating, setIsUserNavigating] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayIndex, setOverlayIndex] = useState(0)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editInitial, setEditInitial] = useState(null)
  const [toast, setToast] = useState(null)
  const [yearPickerOpen, setYearPickerOpen] = useState(false)
  const [monthYearOpen, setMonthYearOpen] = useState(false)

  const months = useMemo(() => getAdjacentMonths(anchorDate, 2), [anchorDate])

  const containerRef = useRef(null)

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setOverlayOpen(false); setAddModalOpen(false); setYearPickerOpen(false) }
      if (e.ctrlKey && e.key === 'ArrowLeft') { e.preventDefault(); setAnchorDate(d=>addMonths(d,-1)) }
      if (e.ctrlKey && e.key === 'ArrowRight') { e.preventDefault(); setAnchorDate(d=>addMonths(d,1)) }
      if (e.ctrlKey && e.key === 'ArrowUp') { e.preventDefault(); setAnchorDate(d=>{ const n = new Date(d); n.setFullYear(n.getFullYear()-1); return n }) }
      if (e.ctrlKey && e.key === 'ArrowDown') { e.preventDefault(); setAnchorDate(d=>{ const n = new Date(d); n.setFullYear(n.getFullYear()+1); return n }) }
      if (e.ctrlKey && (e.key === 't' || e.key === 'T')) { 
        e.preventDefault(); 
        const today = new Date();
        setSelectedDate(today);
        setAnchorDate(today);
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const monthBlocks = months.map(m => {
    const { days } = buildMonthGrid(m)
    const monthLabel = m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    return { monthDate: m, days, label: monthLabel }
  })

  const entriesForSelected = useMemo(() => getEntries(formatDateKey(selectedDate)), [selectedDate])
  const flattenedEntries = useMemo(() => getFlattenedEntriesSorted(), [selectedDate, addModalOpen, overlayOpen, toast])

  const openEntriesOverlay = (initialIndex = 0) => { setOverlayIndex(initialIndex); setOverlayOpen(true) }
  const openEntriesForDate = (date) => {
    const dk = formatDateKey(date)
    const idx = flattenedEntries.findIndex(e => e.dateKey === dk)
    if (idx >= 0) {
      setOverlayIndex(idx)
      setOverlayOpen(true)
    }
  }

  // Infinite month loading using sentinels
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function onScroll() {
      // Don't auto-update when user is manually navigating
      if (isUserNavigating) return
      
      const edge = 200
      if (el.scrollTop < edge) setAnchorDate(d => addMonths(d, -1))
      if (el.scrollHeight - el.clientHeight - el.scrollTop < edge) setAnchorDate(d => addMonths(d, 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isUserNavigating])

  // Scroll to the current month on load
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setTimeout(() => {
      const todayEl = el.querySelector('[aria-current="date"]')
      const monthBlock = todayEl && todayEl.closest('[data-month-block]')
      if (monthBlock && monthBlock.scrollIntoView) monthBlock.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [])

  return (
    <div className="card" style={{ width: '100%', maxWidth: 1400, padding: 16, display:'grid', gridTemplateColumns:'minmax(720px, 1fr) 420px', gap:16, margin:'16px auto', height: 'calc(100vh - 32px)' }}>
      <div className="calendar-header">
        <div className="nav-controls">
          <div className="quick-nav">
            <button className="nav-btn" onClick={()=>setAnchorDate(d=>addMonths(d,-1))}>Prev Month</button>
            <button className="nav-btn" onClick={()=>setAnchorDate(d=>addMonths(d,1))}>Next Month</button>
          </div>
          <div className="calendar-title" onClick={()=>setMonthYearOpen(true)}>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          <div className="quick-nav">
            <button className="nav-btn" onClick={()=>setAnchorDate(d=>{ const n = new Date(d); n.setFullYear(n.getFullYear()-1); return n })}>Prev Year</button>
            <button className="nav-btn" onClick={()=>setAnchorDate(d=>{ const n = new Date(d); n.setFullYear(n.getFullYear()+1); return n })}>Next Year</button>
            <button className="chip" onClick={()=>{ const t=new Date(); setSelectedDate(t); setAnchorDate(t); const el = containerRef.current; if(el){ setTimeout(()=>{ const m = el.querySelector('[aria-current="date"]')?.closest('[data-month-block]'); m&&m.scrollIntoView({behavior:'smooth',block:'center'}) },100)} }}>Today</button>
      </div>
    </div>
        <div className="calendar-subtitle">Use Ctrl+Arrows for faster navigation</div>
            </div>
      <div ref={containerRef} className="scroll-viewport" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {monthBlocks.map(({ monthDate, days, label }) => (
          <div key={monthDate.toISOString()} data-month-block style={{ marginBottom: 12, borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'sticky', top: 0, background: '#fff', padding: 8, fontWeight: 700, zIndex: 10 }}>{label}</div>
            <div className="week-header">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="weekday">{d}</div>
                ))}
              </div>
            <div className="day-grid">
              {days.map(day => {
                const disabled = !isSameMonth(day, monthDate)
                const isToday = isSameDay(day, new Date())
                const isSelected = isSameDay(day, selectedDate)
                const dateKey = formatDateKey(day)
                const entryCount = getEntries(dateKey).length
                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => {
                      setIsUserNavigating(true)
                      setSelectedDate(day)
                      // Ensure the selected date's month is visible
                      if (!isSameMonth(day, anchorDate)) {
                        setAnchorDate(startOfMonth(day))
                      }
                      setTimeout(() => setIsUserNavigating(false), 1000)
                    }}
                    onDoubleClick={() => openEntriesForDate(day)}
                    className={`day-cell${disabled?' day-outside':''}${isToday?' day-today':''}${isSelected?' day-selected':''}`}
                    style={{ minHeight: 54 }}
                    aria-current={isToday ? 'date' : undefined}
                    aria-selected={isSelected}
                    role="gridcell"
                  >
                    {day.getDate()}
                    {!!entryCount && (<span className="badge">{entryCount}</span>)}
                  </div>
                )
      })}
    </div>
  </div>
        ))}
        </div>

      {/* Right side journal panel */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, height: '100%', minHeight: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{formatDisplayDate(selectedDate)}</div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={()=>setAddModalOpen(true)}>Add Entry</button>
          <button onClick={()=>setSelectedDate(new Date())}>Today</button>
          {!!entriesForSelected.length && (
            <button onClick={()=>openEntriesOverlay(0)}>Open</button>
          )}
        </div>
        <div style={{ overflowY:'auto', flex: 1, minHeight: 0 }}>
          {entriesForSelected.length === 0 && (
            <div style={{ color:'#94a3b8', fontSize: 14 }}>No entries yet</div>
          )}
          {entriesForSelected.map((e, idx) => (
            <div key={e.id} style={{border:'1px solid #e2e8f0', borderRadius:10, padding:10, marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{color:'#f59e0b',fontWeight:700}}>{'★'.repeat(Math.round(e.rating || 0))}</div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>{ const gi = flattenedEntries.findIndex(x=>x.id===e.id); if (gi>=0) { setOverlayIndex(gi); setOverlayOpen(true) } }}>View</button>
                  <button onClick={()=>{ setEditInitial(e); setAddModalOpen(true) }}>Edit</button>
                  <button onClick={()=>{ deleteEntry(formatDateKey(selectedDate), e.id); setToast('🗑️ Journal entry deleted successfully!') }}>Delete</button>
                </div>
              </div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',margin:'6px 0'}}>
                {Array.isArray(e.categories) && e.categories.map(cat => (
                  <span key={cat} style={{fontSize:11,color:'#334155',background:'#e2e8f0',padding:'2px 8px',borderRadius:999,fontWeight:700}}>{cat}</span>
                ))}
              </div>
              <div style={{whiteSpace:'pre-wrap',fontSize:14}}>{e.description}</div>
            </div>
          ))}
          </div>
        </div>

      <JournalOverlay
        isOpen={overlayOpen}
        entries={flattenedEntries}
        currentIndex={overlayIndex}
        onClose={()=>setOverlayOpen(false)}
        onPrev={()=>setOverlayIndex(i=>Math.max(0, i-1))}
        onNext={()=>setOverlayIndex(i=>Math.min(flattenedEntries.length-1, i+1))}
      />

      <AddEntryModal
        isOpen={addModalOpen}
        initial={editInitial}
        onCancel={()=>{ setAddModalOpen(false); setEditInitial(null) }}
        onSave={(payload)=>{
          const date = selectedDate
          const dateKey = formatDateKey(date)
          if (editInitial) {
            const updated = {
              ...editInitial,
              description: payload.description,
              rating: Number(payload.rating),
              categories: payload.categories?.length ? payload.categories : ['Personal'],
              imgUrl: payload.imgUrl || editInitial.imgUrl || 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
              date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
              dateObject: date,
              dateKey
            }
            upsertEntry(dateKey, updated)
            setToast('✅ Journal entry updated successfully!')
            setEditInitial(null)
          } else {
            const entry = {
              id: `entry-${Date.now()}`,
              description: payload.description,
              rating: Number(payload.rating),
              categories: payload.categories?.length ? payload.categories : ['Personal'],
              imgUrl: payload.imgUrl || 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
              date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
              dateObject: date,
              dateKey
            }
            upsertEntry(dateKey, entry)
            setToast('✅ Journal entry saved successfully!')
          }
          setAddModalOpen(false)
        }}
      />

      <YearPicker
        isOpen={yearPickerOpen}
        year={selectedDate.getFullYear()}
        onClose={()=>setYearPickerOpen(false)}
        onSelect={(y)=>{ const next = new Date(selectedDate); next.setFullYear(y); setSelectedDate(next); setAnchorDate(next) }}
      />

      <MonthYearPicker
        isOpen={monthYearOpen}
        year={selectedDate.getFullYear()}
        month={selectedDate.getMonth()}
        onClose={()=>setMonthYearOpen(false)}
        onSelect={(y, m)=>{ const next = new Date(selectedDate); next.setFullYear(y); next.setMonth(m); setSelectedDate(next); setAnchorDate(next); setMonthYearOpen(false) }}
      />

      {toast && <Toast message={toast} onDone={()=>setToast(null)} />}
    </div>
  )
}
