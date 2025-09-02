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
