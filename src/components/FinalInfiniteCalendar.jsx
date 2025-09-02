import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { addMonths, startOfMonth, isSameMonth, isSameDay } from 'date-fns'
import { formatDateKey } from '../utils/date'
import { getEntries, upsertEntry, deleteEntry, getAllDatedKeysSorted, getFlattenedEntriesSorted } from '../state/journalStore'
import FinalCardsOverlay from './FinalCardsOverlay'
import AddEntryModal from './AddEntryModal'

function generateStars(rating) {
  const full = Math.floor(rating || 0)
  const half = (rating || 0) % 1 !== 0
  return `${'★'.repeat(full)}${half ? '☆' : ''}`
}

function MonthBlock({ monthDate, onSelectDate, onOpenFromMini, selectedDate, anchorDate, setAnchorDate, setIsUserNavigating }) {
  // Build 6x7 grid
  const first = startOfMonth(monthDate)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  const days = []
  const cursor = new Date(start)
  for (let i = 0; i < 42; i++) {
    const dk = formatDateKey(cursor)
    const isCurrentMonth = isSameMonth(cursor, monthDate)
    // Only show entries for dates within the current month
    const entries = isCurrentMonth ? getEntries(dk) : []
    days.push({ date: new Date(cursor), dk, isCurrentMonth, isToday: isSameDay(cursor, new Date()), entries })
    cursor.setDate(cursor.getDate() + 1)
  }

  const label = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  return (
    <div className="month-block" data-month={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}>
      <div className="month-header">{label}</div>
      <div className="days-grid">
        {days.map((d) => (
          <div
            key={d.dk}
            className={`day-cell${d.isCurrentMonth ? '' : ' other-month'}${d.isToday ? ' today' : ''}${d.entries.length ? ' has-entry' : ''}${selectedDate && isSameDay(d.date, selectedDate) ? ' selected' : ''}`}
            data-date={d.dk}
            onClick={() => {
              // Only allow selection of dates within the current month
              if (!d.isCurrentMonth) return
              
              // Directly set selected date for immediate visual feedback
              setSelectedDate(d.date)
              
              // Use the centralized navigation function for scrolling
              navigateToDate(d.date)
            }}
          >
            <div className="day-header">
              <div className="day-number">{d.date.getDate()}</div>
              {d.entries.length > 1 && <div className="entry-count">{d.entries.length}</div>}
            </div>
            <div className="entry-preview-container">
              {d.entries.slice(0, 2).map((e) => (
                <div key={e.id} className="entry-mini-card" onClick={(ev) => { ev.stopPropagation(); onSelectDate(d.date); onOpenFromMini(e.id, d.dk) }}>
                  <div className="entry-mini-header">
                    {!!e.imgUrl && <img src={e.imgUrl} alt="Entry" className="entry-mini-image" onError={(ev)=>{ ev.currentTarget.style.display='none' }} />}
                    <div className="entry-mini-rating">
                      <span className="entry-mini-stars">{generateStars(e.rating)}</span>
                      <span>{Number(e.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="entry-mini-description">{e.description}</div>
                  <div className="entry-mini-categories">
                    {(e.categories || []).slice(0, 2).map((cat) => (<span key={cat} className="entry-mini-tag">{cat}</span>))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FinalInfiniteCalendar() {
  const [anchorDate, setAnchorDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isUserNavigating, setIsUserNavigating] = useState(false)
  const [pickerMode, setPickerMode] = useState('month') // header button active state
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerLevel, setPickerLevel] = useState('month') // 'year' | 'month' | 'day'
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear())
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth())
  const [pickerDay, setPickerDay] = useState(null)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayIndex, setOverlayIndex] = useState(0)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editInitial, setEditInitial] = useState(null)
  const [yearsStart, setYearsStart] = useState(() => new Date().getFullYear() - 500)
  const [yearsEnd, setYearsEnd] = useState(() => new Date().getFullYear() + 500)

  const viewportRef = useRef(null)
  const yearContainerRef = useRef(null)

  const yearsList = useMemo(() => {
    const list = []
    for (let y = yearsStart; y <= yearsEnd; y++) list.push(y)
    return list
  }, [yearsStart, yearsEnd])

  const months = useMemo(() => {
    const arr = []
    const start = new Date(anchorDate)
    start.setMonth(start.getMonth() - 24) // 2 years before
    for (let i = 0; i < 48; i++) { // 4 years total range (2 before, 2 after)
      const d = new Date(start)
      d.setMonth(start.getMonth() + i)
      arr.push(startOfMonth(d))
    }
    return arr
  }, [anchorDate])

  const flattened = useMemo(() => getFlattenedEntriesSorted(), [selectedDate, anchorDate, overlayOpen])

  const openFromMini = useCallback((entryId, dateKey) => {
    const keys = getAllDatedKeysSorted()
    let idx = 0
    for (const dk of keys) {
      const list = getEntries(dk)
      for (let i = 0; i < list.length; i++) {
        if (dk === dateKey && list[i].id === entryId) {
          setOverlayIndex(idx)
          setOverlayOpen(true)
          return
        }
        idx++
      }
    }
    setOverlayIndex(0)
    setOverlayOpen(true)
  }, [])

  const openForDateIndex = useCallback((date) => {
    const dk = formatDateKey(date)
    const idx = flattened.findIndex((e) => e.dateKey === dk)
    if (idx >= 0) { setOverlayIndex(idx); setOverlayOpen(true) }
  }, [flattened])

  // Helper function to navigate to any date (including distant years)
  const navigateToDate = useCallback((targetDate) => {
    const targetYear = targetDate.getFullYear()
    const anchorYear = anchorDate.getFullYear()
    const yearDiff = Math.abs(targetYear - anchorYear)
    
    // Note: selectedDate is set directly in onClick for immediate feedback
    
    if (yearDiff > 1) {
      // For distant dates, update anchor and scroll
      setIsUserNavigating(true)
      setAnchorDate(startOfMonth(targetDate))
      
      // Wait for months to regenerate, then scroll
      setTimeout(() => {
        const viewport = viewportRef.current
        if (!viewport) return
        
        const targetMonth = `${targetDate.getFullYear()}-${targetDate.getMonth()}`
        const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`)
        if (monthEl) {
          monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        
        setTimeout(() => setIsUserNavigating(false), 1000)
      }, 300)
    } else {
      // For nearby dates, just scroll to make visible
      setTimeout(() => {
        const viewport = viewportRef.current
        if (!viewport) return
        
        const dateKey = formatDateKey(targetDate)
        const dayEl = viewport.querySelector(`[data-date="${dateKey}"]`)
        if (dayEl) {
          const rect = dayEl.getBoundingClientRect()
          const viewportRect = viewport.getBoundingClientRect()
          if (rect.top < viewportRect.top || rect.bottom > viewportRect.bottom) {
            dayEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 100)
    }
  }, [anchorDate, setSelectedDate])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    function onScroll() {
      // Don't auto-update anchorDate when user is manually navigating
      if (isUserNavigating) return
      
      const edge = 1000
      if (el.scrollTop < edge) setAnchorDate((d) => addMonths(d, -20))
      if (el.scrollHeight - el.clientHeight - el.scrollTop < edge) setAnchorDate((d) => addMonths(d, 20))

      // Update header to reflect currently visible month
      try {
        const containerRect = el.getBoundingClientRect()
        const markerY = containerRect.top + 120
        const monthEls = el.querySelectorAll('.month-block')
        let visibleMonth = null
        monthEls.forEach((node) => {
          const rect = node.getBoundingClientRect()
          if (rect.top <= markerY && rect.bottom >= markerY) {
            visibleMonth = node.getAttribute('data-month')
          }
        })
        if (visibleMonth) {
          const [yy, mm] = visibleMonth.split('-').map(Number)
          const nextAnchor = new Date(yy, mm, 1)
          if (nextAnchor.toDateString() !== anchorDate.toDateString()) {
            setAnchorDate(nextAnchor)
          }
        }
      } catch {}
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [anchorDate, isUserNavigating])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setPickerOpen(false); setOverlayOpen(false) }
      else if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsUserNavigating(true);
        const newDate = addMonths(anchorDate, -1);
        setAnchorDate(newDate);
        setTimeout(() => {
          const viewport = viewportRef.current;
          if (viewport) {
            const targetMonth = `${newDate.getFullYear()}-${newDate.getMonth()}`;
            const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`);
            if (monthEl) {
              monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          setIsUserNavigating(false);
        }, 200);
      }
      else if (e.ctrlKey && e.key === 'ArrowRight') {
        e.preventDefault();
        setIsUserNavigating(true);
        const newDate = addMonths(anchorDate, 1);
        setAnchorDate(newDate);
        setTimeout(() => {
          const viewport = viewportRef.current;
          if (viewport) {
            const targetMonth = `${newDate.getFullYear()}-${newDate.getMonth()}`;
            const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`);
            if (monthEl) {
              monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          setIsUserNavigating(false);
        }, 200);
      }
      else if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        setIsUserNavigating(true);
        const newDate = new Date(anchorDate);
        newDate.setFullYear(newDate.getFullYear() - 1);
        setAnchorDate(newDate);
        setTimeout(() => {
          const viewport = viewportRef.current;
          if (viewport) {
            const targetMonth = `${newDate.getFullYear()}-${newDate.getMonth()}`;
            const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`);
            if (monthEl) {
              monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          setIsUserNavigating(false);
        }, 300);
      }
      else if (e.ctrlKey && e.key === 'ArrowDown') {
        e.preventDefault();
        setIsUserNavigating(true);
        const newDate = new Date(anchorDate);
        newDate.setFullYear(newDate.getFullYear() + 1);
        setAnchorDate(newDate);
        setTimeout(() => {
          const viewport = viewportRef.current;
          if (viewport) {
            const targetMonth = `${newDate.getFullYear()}-${newDate.getMonth()}`;
            const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`);
            if (monthEl) {
              monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          setIsUserNavigating(false);
        }, 300);
      }
      else if ((e.ctrlKey && (e.key === 't' || e.key === 'T'))) { 
        e.preventDefault();
        setIsUserNavigating(true);
        const t = new Date(); 
        setAnchorDate(t); 
        setSelectedDate(t);
        // Smooth scroll to today
        setTimeout(() => {
          const viewport = viewportRef.current;
          const todayEl = viewport?.querySelector('.today');
          if (todayEl) {
            todayEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          setIsUserNavigating(false);
        }, 1000);
      }
      else if (e.key === 'ArrowLeft' && overlayOpen) setOverlayIndex((i) => Math.max(0, i - 1))
      else if (e.key === 'ArrowRight' && overlayOpen) setOverlayIndex((i) => Math.min(flattened.length - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overlayOpen, flattened.length])

  // Initialize and manage year list and infinite scroll when opening the picker in year mode
  useEffect(() => {
    if (!pickerOpen || pickerLevel !== 'year') return
    const currentYear = anchorDate.getFullYear()
    setPickerYear(currentYear)
    setYearsStart(currentYear - 500)
    setYearsEnd(currentYear + 500)

    const container = yearContainerRef.current
    if (!container) return

    // Scroll current year into view
    setTimeout(() => {
      const selectedEl = container.querySelector('.picker-item.selected')
      if (selectedEl && selectedEl.scrollIntoView) selectedEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)

    function onScroll() {
      const edge = 200
      if (container.scrollTop < edge) {
        const firstYear = yearsStart
        const newStart = firstYear - 100
        setYearsStart(newStart)
        // Maintain scroll position roughly (100 items × ~40px)
        container.scrollTop = container.scrollTop + (100 * 40)
      }
      if (container.scrollHeight - container.clientHeight - container.scrollTop < edge) {
        const lastYear = yearsEnd
        const newEnd = lastYear + 100
        setYearsEnd(newEnd)
      }
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [pickerOpen, pickerLevel, anchorDate, yearsStart, yearsEnd])

  // Scroll to today on initial load
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    setTimeout(() => {
      const today = el.querySelector('.today')
      const month = today && today.closest('.month-block')
      if (month && month.scrollIntoView) month.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [])

  // Remove automatic scroll-to-date to prevent random jumping

  const selectedEntries = useMemo(() => {
    if (!selectedDate) return []
    const entries = getEntries(formatDateKey(selectedDate))
    console.log('selectedEntries updated for date:', selectedDate, 'entries:', entries.length)
    return entries
  }, [selectedDate])

  return (
    <div className="infinite-calendar">
      <div className="calendar-panel">
        <div className="calendar-header">
          <div className="current-month" id="currentMonth" onClick={() => { setPickerMode('month'); setPickerYear(anchorDate.getFullYear()); setPickerMonth(anchorDate.getMonth()); setPickerDay(null); setPickerLevel('month'); setPickerOpen(true); }}>{anchorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          <div className="date-toggle-row">
            <div className="current-date" id="currentDate">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="view-toggle">
              <button className={`toggle-btn ${pickerMode==='month' ? 'active' : ''}`} onClick={() => { setPickerMode('month'); setPickerYear(anchorDate.getFullYear()); setPickerMonth(anchorDate.getMonth()); setPickerDay(null); setPickerLevel('month'); setPickerOpen(true) }}>Month</button>
              <button className={`toggle-btn ${pickerMode==='year' ? 'active' : ''}`} onClick={() => { setPickerMode('year'); setPickerYear(anchorDate.getFullYear()); setPickerMonth(anchorDate.getMonth()); setPickerDay(null); setPickerLevel('year'); setPickerOpen(true) }}>Year</button>
            </div>
          </div>
          <div className="nav-controls">
            <div className="quick-nav">
              <button className="nav-btn" onClick={() => {
                setIsUserNavigating(true);
                setAnchorDate((d) => addMonths(d, -1));
                // Scroll to show the new month
                setTimeout(() => {
                  const viewport = viewportRef.current;
                  if (viewport) {
                    const newDate = addMonths(anchorDate, -1);
                    const targetMonth = `${newDate.getFullYear()}-${newDate.getMonth()}`;
                    const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`);
                    if (monthEl) {
                      monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                  setIsUserNavigating(false);
                }, 200);
              }}>← Prev</button>
              <button className="nav-btn" onClick={() => { 
                setIsUserNavigating(true);
                const t = new Date(); 
                setAnchorDate(t); 
                setSelectedDate(t);
                // Smooth scroll to today
                setTimeout(() => {
                  const viewport = viewportRef.current;
                  const todayEl = viewport?.querySelector('.today');
                  if (todayEl) {
                    todayEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                  setIsUserNavigating(false);
                }, 1000);
              }}>Today</button>
              <button className="nav-btn" onClick={() => {
                setIsUserNavigating(true);
                setAnchorDate((d) => addMonths(d, 1));
                // Scroll to show the new month
                setTimeout(() => {
                  const viewport = viewportRef.current;
                  if (viewport) {
                    const newDate = addMonths(anchorDate, 1);
                    const targetMonth = `${newDate.getFullYear()}-${newDate.getMonth()}`;
                    const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`);
                    if (monthEl) {
                      monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                  setIsUserNavigating(false);
                }, 200);
              }}>Next →</button>
            </div>
            <div className="quick-nav">
              <button className="nav-btn" onClick={() => {
                setIsUserNavigating(true);
                const newDate = new Date(anchorDate);
                newDate.setFullYear(newDate.getFullYear() - 1);
                setAnchorDate(newDate);
                // Scroll to show the new year
                setTimeout(() => {
                  const viewport = viewportRef.current;
                  if (viewport) {
                    const targetMonth = `${newDate.getFullYear()}-${newDate.getMonth()}`;
                    const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`);
                    if (monthEl) {
                      monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                  setIsUserNavigating(false);
                }, 300);
              }}>‹ Year</button>
              <button className="nav-btn" onClick={() => {
                setIsUserNavigating(true);
                const newDate = new Date(anchorDate);
                newDate.setFullYear(newDate.getFullYear() + 1);
                setAnchorDate(newDate);
                // Scroll to show the new year
                setTimeout(() => {
                  const viewport = viewportRef.current;
                  if (viewport) {
                    const targetMonth = `${newDate.getFullYear()}-${newDate.getMonth()}`;
                    const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`);
                    if (monthEl) {
                      monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                  setIsUserNavigating(false);
                }, 300);
              }}>Year ›</button>
            </div>
          </div>
        </div>
        <div className="weekdays-header">
          {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((d) => (<div key={d} className="weekday">{d}</div>))}
        </div>
        <div className="calendar-viewport" ref={viewportRef} id="calendarViewport">
          <div className="calendar-content" id="calendarContent">
            {months.map((m) => (
              <MonthBlock
                key={m.toISOString()}
                monthDate={m}
                onSelectDate={(d) => { setSelectedDate(d) }}
                onOpenFromMini={openFromMini}
                selectedDate={selectedDate}
                anchorDate={anchorDate}
                setAnchorDate={setAnchorDate}
                setIsUserNavigating={setIsUserNavigating}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="journal-panel">
        <div className="journal-header">
          <div className="journal-title">📖 Journal Entries</div>
          <div className="selected-date" id="selectedDate">
            {selectedDate ? (() => {
              const formatted = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
              console.log('Journal header updating with date:', selectedDate, 'formatted:', formatted)
              return formatted
            })() : 'Select a date to view entries'}
          </div>
        </div>
        <div className="journal-content" id="journalContent">
          <div style={{ display:'flex', gap: 8, marginBottom: 12 }}>
            <button className="add-entry-btn" onClick={() => {
              const date = selectedDate || new Date()
              setSelectedDate(date)
              setEditInitial(null)
              setAddModalOpen(true)
            }}>✏️ Add Journal Entry</button>
          </div>
          {(!selectedEntries || selectedEntries.length === 0) ? (
            <div className="no-entries">
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <h3>Your Journal Awaits</h3>
              <p>Click on any date to view or add journal entries</p>
              <p style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>💚 Green days have existing entries</p>
            </div>
          ) : (
            <>
              {selectedEntries.map((entry, idx) => (
                <div key={entry.id} className="journal-entry" onClick={() => openForDateIndex(selectedDate)}>
                  <div className="entry-actions">
                    <button className="entry-action-btn edit" onClick={(e)=>{ e.stopPropagation(); setEditInitial(entry); setAddModalOpen(true) }}>✏️</button>
                    <button className="entry-action-btn delete" onClick={(e)=>{ e.stopPropagation(); deleteEntry(formatDateKey(selectedDate), entry.id) }}>🗑️</button>
                  </div>
                  {!!entry.imgUrl && <img src={entry.imgUrl} alt={entry.categories?.[0]||''} className="entry-image" onError={(ev)=>{ev.currentTarget.style.display='none'}} />}
                  <div className="entry-header">
                    <div className="entry-rating">
                      <span className="stars">{generateStars(entry.rating)}</span>
                      <span className="rating-value">{Number(entry.rating||0).toFixed(1)}</span>
                    </div>
                    <div className="entry-date">{entry.date}</div>
                  </div>
                  <div className="entry-description">{entry.description}</div>
                  <div className="entry-categories">
                    {(entry.categories||[]).map((cat)=> (<span className="category-tag" key={cat}>{cat}</span>))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Picker overlay */}
      {pickerOpen && (
        <div className="picker-overlay active" id="pickerOverlay" onClick={(e)=>{ if (e.target === e.currentTarget) setPickerOpen(false) }}>
          <div className="picker-content">
            <div className="picker-header">
              <div className="picker-title" id="pickerTitle">{pickerLevel === 'year' ? 'Select Year' : pickerLevel === 'month' ? 'Select Month' : 'Select Day'}</div>
              <div id="pickerSubtitle">{pickerLevel === 'year' ? 'Infinite scroll - ANY year from BC to future!' : pickerLevel === 'month' ? pickerYear : new Date(pickerYear, pickerMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            </div>
            {pickerLevel === 'year' && (
              <div className="year-picker-container" id="yearPickerContainer" ref={yearContainerRef}>
                <div className="year-grid" id="yearGrid">
                  {yearsList.map((y) => {
                    const isSelected = pickerYear === y
                    const isCurrent = y === new Date().getFullYear()
                    return (
                      <div key={y} className={`picker-item${isSelected?' selected':''}${isCurrent?' current':''}`} onClick={()=>{ setPickerYear(y); setPickerLevel('month') }}>{y}{y<0?' BC':''}</div>
                    )
                  })}
                </div>
              </div>
            )}
            {pickerLevel === 'month' && (
              <div className="picker-grid" id="pickerGrid">
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, idx) => {
                  const isSelected = pickerMonth === idx
                  const now = new Date()
                  const isCurrent = idx === now.getMonth() && pickerYear === now.getFullYear()
                  return (
                    <div key={m} className={`picker-item${isSelected?' selected':''}${isCurrent?' current':''}`} onClick={()=>{ setPickerMonth(idx); setPickerLevel('day') }}>{m}</div>
                  )
                })}
              </div>
            )}
            {pickerLevel === 'day' && (
              <div className="days-grid" style={{ background: 'transparent', padding: 0 }}>
                {(() => {
                  const first = startOfMonth(new Date(pickerYear, pickerMonth, 1))
                  const start = new Date(first)
                  start.setDate(first.getDate() - first.getDay())
                  const cells = []
                  const cur = new Date(start)
                  for (let i = 0; i < 42; i++) {
                    const inMonth = cur.getMonth() === pickerMonth
                    const isSel = inMonth && pickerDay === cur.getDate()
                    const cls = `day-cell${inMonth?'':' other-month'}${isSel?' selected':''}`
                    const label = cur.getDate()
                    const key = `${cur.getFullYear()}-${cur.getMonth()}-${label}-${i}`
                    const dateForClick = new Date(cur)
                    cells.push(
                      <div key={key} className={cls} onClick={()=>{ setPickerDay(dateForClick.getDate()) }}>{label}</div>
                    )
                    cur.setDate(cur.getDate() + 1)
                  }
                  return cells
                })()}
              </div>
            )}
            <div className="picker-actions">
              <button className="picker-btn cancel" onClick={()=>setPickerOpen(false)}>Cancel</button>
              <button className="picker-btn confirm" onClick={() => {
                const y = pickerYear || anchorDate.getFullYear()
                const m = typeof pickerMonth === 'number' ? pickerMonth : anchorDate.getMonth()
                const d = pickerDay || 1
                const next = new Date(y, m, d)
                
                // For distant dates, update both anchor and selected
                setIsUserNavigating(true)
                setAnchorDate(next)
                setSelectedDate(next)
                setPickerDay(null)
                setPickerLevel('month')
                setPickerOpen(false)
                
                // Allow time for the month range to update, then scroll
                setTimeout(() => {
                  const viewport = viewportRef.current
                  if (viewport) {
                  const targetMonth = `${next.getFullYear()}-${next.getMonth()}`
                  const monthEl = viewport.querySelector(`[data-month="${targetMonth}"]`)
                    if (monthEl) {
                      monthEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  }
                  setTimeout(() => setIsUserNavigating(false), 1000)
                }, 200)
              }}>Go to Date</button>
            </div>
          </div>
        </div>
      )}

      {/* Entries overlay */}
      <FinalCardsOverlay
        isOpen={overlayOpen}
        entries={flattened}
        currentIndex={overlayIndex}
        onClose={()=>setOverlayOpen(false)}
        onPrev={()=>setOverlayIndex((i)=>Math.max(0, i-1))}
        onNext={()=>setOverlayIndex((i)=>Math.min(flattened.length-1, i+1))}
      />

      <AddEntryModal
        isOpen={addModalOpen}
        initial={editInitial}
        onCancel={()=>{ setAddModalOpen(false); setEditInitial(null) }}
        onSave={(payload)=>{
          const date = selectedDate || new Date()
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
          }
          setAddModalOpen(false)
        }}
      />
    </div>
  )
}


