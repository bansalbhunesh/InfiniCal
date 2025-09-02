import React, { useEffect, useMemo, useRef, useState } from 'react'
import { addMonths, startOfMonth, isSameMonth, isSameDay } from 'date-fns'
import { buildMonthGrid, getAdjacentMonths, formatDateKey, formatDisplayDate } from '../utils/date'
import { getEntries, upsertEntry, deleteEntry, getFlattenedEntriesSorted } from '../state/journalStore'
import Toast from './Toast'
import JournalOverlay from './JournalOverlay'
import AddEntryModal from './AddEntryModal'
import YearPicker from './YearPicker'

export default function InfiniteCalendar() {
  const [anchorDate, setAnchorDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayIndex, setOverlayIndex] = useState(0)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [yearPickerOpen, setYearPickerOpen] = useState(false)

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
      if (e.ctrlKey && (e.key === 't' || e.key === 'T')) { e.preventDefault(); setSelectedDate(new Date()) }
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

  const openEntriesOverlay = (initialIndex = 0) => { setOverlayIndex(initialIndex); setOverlayOpen(true) }

  // Infinite month loading using sentinels
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function onScroll() {
      const edge = 200
      if (el.scrollTop < edge) setAnchorDate(d => addMonths(d, -1))
      if (el.scrollHeight - el.clientHeight - el.scrollTop < edge) setAnchorDate(d => addMonths(d, 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="card" style={{ width: '100%', maxWidth: 1200, padding: 16, display:'grid', gridTemplateColumns:'1fr 360px', gap:16, margin:'16px auto' }}>
      <div className="calendar-header">
        <div className="nav-controls">
          <div className="quick-nav">
            <button className="nav-btn" onClick={()=>setAnchorDate(d=>addMonths(d,-1))}>Prev Month</button>
            <button className="nav-btn" onClick={()=>setAnchorDate(d=>addMonths(d,1))}>Next Month</button>
          </div>
          <div className="calendar-title" onClick={()=>setYearPickerOpen(true)}>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          <div className="quick-nav">
            <button className="nav-btn" onClick={()=>setAnchorDate(d=>{ const n = new Date(d); n.setFullYear(n.getFullYear()-1); return n })}>Prev Year</button>
            <button className="nav-btn" onClick={()=>setAnchorDate(d=>{ const n = new Date(d); n.setFullYear(n.getFullYear()+1); return n })}>Next Year</button>
            <button className="chip" onClick={()=>setSelectedDate(new Date())}>Today</button>
          </div>
        </div>
        <div className="calendar-subtitle">Use Ctrl+Arrows for faster navigation</div>
      </div>
      <div ref={containerRef} className="scroll-viewport" style={{ maxHeight: '70vh' }}>
        {monthBlocks.map(({ monthDate, days, label }) => (
          <div key={monthDate.toISOString()} style={{ marginBottom: 12, borderBottom: '1px solid #e2e8f0' }}>
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
                    onClick={() => setSelectedDate(day)}
                    onDoubleClick={() => openEntriesOverlay(0)}
                    className={`day-cell${disabled?' day-outside':''}${isToday?' day-today':''}${isSelected?' day-selected':''}`}
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
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{formatDisplayDate(selectedDate)}</div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={()=>setAddModalOpen(true)}>Add Entry</button>
          <button onClick={()=>setSelectedDate(new Date())}>Today</button>
          {!!entriesForSelected.length && (
            <button onClick={()=>openEntriesOverlay(0)}>Open</button>
          )}
        </div>
        <div style={{ overflowY:'auto' }}>
          {entriesForSelected.length === 0 && (
            <div style={{ color:'#94a3b8', fontSize: 14 }}>No entries yet</div>
          )}
          {entriesForSelected.map((e, idx) => (
            <div key={e.id} style={{border:'1px solid #e2e8f0', borderRadius:10, padding:10, marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{color:'#f59e0b',fontWeight:700}}>{'★'.repeat(Math.round(e.rating || 0))}</div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>{ setOverlayIndex(idx); setOverlayOpen(true) }}>View</button>
                  <button onClick={()=>{ deleteEntry(formatDateKey(selectedDate), e.id); setToast('🗑️ Journal entry deleted successfully!') }}>Delete</button>
                </div>
              </div>
              <div style={{fontSize:12,color:'#64748b',margin:'6px 0'}}>{Array.isArray(e.categories) ? e.categories.join(', ') : ''}</div>
              <div style={{whiteSpace:'pre-wrap',fontSize:14}}>{e.description}</div>
            </div>
          ))}
        </div>
      </div>

      <JournalOverlay
        isOpen={overlayOpen}
        entries={entriesForSelected}
        currentIndex={overlayIndex}
        onClose={()=>setOverlayOpen(false)}
        onPrev={()=>setOverlayIndex(i=>Math.max(0, i-1))}
        onNext={()=>setOverlayIndex(i=>Math.min(entriesForSelected.length-1, i+1))}
      />

      <AddEntryModal
        isOpen={addModalOpen}
        onCancel={()=>setAddModalOpen(false)}
        onSave={(payload)=>{
          const date = selectedDate
          const dateKey = formatDateKey(date)
          const entry = {
            id: `entry-${Date.now()}`,
            description: payload.description,
            rating: payload.rating,
            categories: payload.categories?.length ? payload.categories : ['Personal'],
            imgUrl: payload.imgUrl || 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
            date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            dateObject: date,
            dateKey
          }
          upsertEntry(dateKey, entry)
          setAddModalOpen(false)
          setToast('✅ Journal entry saved successfully!')
        }}
      />

      <YearPicker
        isOpen={yearPickerOpen}
        year={selectedDate.getFullYear()}
        onClose={()=>setYearPickerOpen(false)}
        onSelect={(y)=>{ const next = new Date(selectedDate); next.setFullYear(y); setSelectedDate(next); setAnchorDate(next) }}
      />

      {toast && <Toast message={toast} onDone={()=>setToast(null)} />}
    </div>
  )
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTH_HEIGHT = 320;
const BUFFER_MONTHS = 6;

// Sample journal data
const generateSampleData = () => {
  const entries = [];
  const today = new Date();
  const moods = ['😊', '😔', '😴', '🤔', '🎉', '😌', '🤗'];
  const titles = ['Morning Reflections', 'Creative Breakthrough', 'Weekend Adventures', 'Gratitude Practice'];
  
  for (let i = -30; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    if (Math.random() > 0.7) {
      entries.push({
        id: `entry-${dateString}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        content: 'This is a sample journal entry with some thoughtful content.',
        date: date,
        dateString: dateString,
        mood: moods[Math.floor(Math.random() * moods.length)]
      });
    }
  }
  
  return entries;
};

const journalEntries = generateSampleData();

const getEntriesForDate = (dateString) => {
  return journalEntries.filter(entry => entry.dateString === dateString);
};

// Date utilities
const generateCalendarDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === new Date().toDateString(),
      dateString: currentDate.toISOString().split('T')[0]
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
};

const generateMonths = (centerDate, range = 12) => {
  const months = [];
  
  for (let i = -range; i <= range; i++) {
    const monthDate = new Date(centerDate.getFullYear(), centerDate.getMonth() + i, 1);
    months.push({
      date: monthDate,
      key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
      displayName: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days: generateCalendarDays(monthDate)
    });
  }
  
  return months;
};

// Components
const CalendarHeader = ({ currentMonth, isScrolling }) => (
  <motion.div 
    className="calendar-header"
    animate={{ 
      backgroundColor: isScrolling ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 1)',
      backdropFilter: isScrolling ? 'blur(10px)' : 'blur(0px)'
    }}
    transition={{ duration: 0.2 }}
  >
    <div className="header-content">
      <motion.h1 
        key={currentMonth}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="month-title"
      >
        {currentMonth}
      </motion.h1>
      <div className="weekday-labels">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday-label">
            {day}
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const CalendarMonth = ({ month, onEntryClick }) => (
  <div className="calendar-month">
    <div className="calendar-grid">
      {month.days.map((day) => {
        const entries = getEntriesForDate(day.dateString);
        const hasEntries = entries.length > 0;
        
        return (
          <motion.div
            key={day.dateString}
            className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (hasEntries) {
                onEntryClick(entries[0], entries);
              }
            }}
          >
            <div className="day-number">
              {day.date.getDate()}
            </div>
            
            {hasEntries && (
              <div className="entry-indicators">
                {entries.slice(0, 3).map((entry, entryIndex) => (
                  <motion.div
                    key={entry.id}
                    className="entry-dot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: entryIndex * 0.1 }}
                    style={{ backgroundColor: '#22c55e' }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  </div>
);

const JournalCard = ({ entry, allEntries, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(
    allEntries.findIndex(e => e.id === entry.id)
  );
  
  const currentEntry = allEntries[currentIndex];

  return (
    <motion.div
      className="journal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="journal-card-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header">
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
          <div className="card-pagination">
            {currentIndex + 1} of {allEntries.length}
          </div>
        </div>

        <div className="journal-card">
          <div className="card-content">
            <div className="entry-header">
              <div className="entry-mood">{currentEntry.mood}</div>
              <div className="entry-meta">
                <div className="entry-date">
                  {currentEntry.date.toLocaleDateString()}
                </div>
              </div>
            </div>

            <h2 className="entry-title">{currentEntry.title}</h2>
            <p className="entry-content">{currentEntry.content}</p>
          </div>
        </div>

        <div className="card-navigation">
          <button 
            className={`nav-button prev ${currentIndex === 0 ? 'disabled' : ''}`}
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          
          <div className="swipe-hint">
            Tap to navigate
          </div>
          
          <button 
            className={`nav-button next ${currentIndex === allEntries.length - 1 ? 'disabled' : ''}`}
            onClick={() => currentIndex < allEntries.length - 1 && setCurrentIndex(currentIndex + 1)}
            disabled={currentIndex === allEntries.length - 1}
          >
            Next →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const InfiniteCalendar = () => {
  const [currentDate] = useState(new Date());
  const [months, setMonths] = useState(() => generateMonths(currentDate, 24));
  const [visibleMonthIndex, setVisibleMonthIndex] = useState(24);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const newVisibleIndex = Math.round(scrollTop / MONTH_HEIGHT);
    
    setVisibleMonthIndex(newVisibleIndex);
    isScrollingRef.current = true;

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const initialScrollTop = 24 * MONTH_HEIGHT;
      containerRef.current.scrollTop = initialScrollTop;
    }
  }, []);

  const handleEntryClick = useCallback((entry, allDayEntries) => {
    setSelectedEntry(entry);
    setSelectedEntries(allDayEntries);
  }, []);

  const currentMonth = months[Math.max(0, Math.min(visibleMonthIndex, months.length - 1))];

  return (
    <div className="infinite-calendar">
      <CalendarHeader 
        currentMonth={currentMonth?.displayName || ''} 
        isScrolling={isScrollingRef.current}
      />
      
      <div 
        ref={containerRef}
        className="calendar-container"
        onScroll={handleScroll}
      >
        <div 
          className="calendar-content"
          style={{ height: months.length * MONTH_HEIGHT }}
        >
          {months.map((month, index) => {
            const topOffset = index * MONTH_HEIGHT;
            const isVisible = Math.abs(index - visibleMonthIndex) <= BUFFER_MONTHS;
            
            if (!isVisible) {
              return (
                <div 
                  key={month.key} 
                  style={{ 
                    height: MONTH_HEIGHT, 
                    position: 'absolute',
                    top: topOffset,
                    width: '100%'
                  }} 
                />
              );
            }

            return (
              <div
                key={month.key}
                style={{ 
                  position: 'absolute',
                  top: topOffset,
                  width: '100%',
                  height: MONTH_HEIGHT
                }}
              >
                <CalendarMonth 
                  month={month}
                  onEntryClick={handleEntryClick}
                />
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedEntry && (
          <JournalCard
            entry={selectedEntry}
            allEntries={selectedEntries}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfiniteCalendar;
