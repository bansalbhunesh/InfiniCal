// Optional dataset seeding merged with localStorage
// Call seedIfEmpty() on app start if you want demo data

import { upsertEntry } from './journalStore'
import { format } from 'date-fns'

function randomBetween(min, max) { return Math.random() * (max - min) + min }

const sampleDescriptions = [
  'Morning run by the lake. Felt great! 🏃‍♂️',
  'Tried a new recipe; surprisingly good. 🍳',
  'Worked on side project; lots of progress. 💻',
  'Met friends for coffee; lovely chat. ☕',
  'Read a few chapters of a novel. 📚',
  'Explored a new hiking trail. 🥾',
  'Watched a documentary about space. 🚀',
  'Practiced guitar for 30 minutes. 🎸',
  'Cleaned the house and organized desk. 🧹',
  'Took photos during golden hour. 📸',
  'Spa day hair mask treatment, curls looked shiny. 💆‍♀️',
  'Tried a new protective hairstyle. 🧵',
  'Deep conditioning session with heat cap. 🔥',
  'Trimmed split ends; hair feels light. ✂️',
  'Wash day: clarifying shampoo and light leave-in. 💧',
]

const sampleCategories = [
  ['Fitness','Outdoor'],
  ['Food','Home'],
  ['Coding','Learning'],
  ['Friends','Coffee'],
  ['Reading','Relax'],
  ['Hiking','Nature'],
  ['Science','Film'],
  ['Music','Practice'],
  ['Chores','Productivity'],
  ['Photography','Art'],
  ['Hair','Mask'],
  ['Hair','Protective'],
  ['Hair','Conditioning'],
  ['Hair','Trim'],
  ['Hair','Washday']
]

const sampleImages = [
  // Fitness & Running
  'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Food & Cooking
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Coding & Work
  'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Coffee & Social
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Reading & Books
  'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/159866/books-book-pages-read-159866.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Hiking & Nature
  'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Space & Science
  'https://images.pexels.com/photos/586030/pexels-photo-586030.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=800',
  
  // Music & Guitar
  'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Home & Organization
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Photography
  'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=800',
  
  // Hair Care & Beauty
  'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3738373/pexels-photo-3738373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3738388/pexels-photo-3738388.jpeg?auto=compress&cs=tinysrgb&w=800',
]

function seedEntriesForDateRange(startDate, endDate, entryPrefix = 'seed') {
  const current = new Date(startDate)
  while (current <= endDate) {
    const entriesCount = Math.floor(Math.random() * 5) // 0..4 entries per day
    for (let j = 0; j < entriesCount; j++) {
      const pick = Math.floor(Math.random() * sampleDescriptions.length)
      const rating = Number(randomBetween(3, 5).toFixed(1))
      const cats = sampleCategories[pick % sampleCategories.length]
      const img = sampleImages[pick % sampleImages.length]
      const dateKey = format(current, 'yyyy-MM-dd')
      const entry = {
        id: `${entryPrefix}-${dateKey}-${j}-${Math.floor(Math.random()*100000)}`,
        description: sampleDescriptions[pick],
        rating,
        categories: cats,
        imgUrl: img,
        date: current.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        dateObject: new Date(current),
        dateKey
      }
      upsertEntry(dateKey, entry)
    }
    current.setDate(current.getDate() + 1)
  }
}

export function seedIfEmpty() {
  try {
    const existing = localStorage.getItem('journalEntries')
    if (existing && existing !== '{}' && existing !== 'null') return
  } catch {}

  const today = new Date()
  
  // Seed recent data (past 90 days to next 90 days)
  const recentStart = new Date(today)
  recentStart.setDate(today.getDate() - 90)
  const recentEnd = new Date(today)
  recentEnd.setDate(today.getDate() + 90)
  seedEntriesForDateRange(recentStart, recentEnd, 'recent')
  
  // Seed 2020 data (full year with some memorable dates having more entries)
  const year2020Start = new Date('2020-01-01')
  const year2020End = new Date('2020-12-31')
  seedEntriesForDateRange(year2020Start, year2020End, '2020')
  
  // Add some special 2020 entries for memorable dates
  const specialDates2020 = [
    { date: '2020-01-01', desc: 'New Year resolution: learn React! 🎉', rating: 5.0, cats: ['Goals', 'Learning'] },
    { date: '2020-03-15', desc: 'Started working from home. Strange times. 🏠', rating: 3.5, cats: ['Work', 'Life'] },
    { date: '2020-07-04', desc: 'Virtual 4th of July celebration with family. 🎆', rating: 4.2, cats: ['Family', 'Holiday'] },
    { date: '2020-12-25', desc: 'Christmas at home, but grateful for health. ❤️', rating: 4.8, cats: ['Family', 'Gratitude'] },
    { date: '2020-12-31', desc: 'What a year! Ready for 2021 and new projects. 🚀', rating: 4.5, cats: ['Reflection', 'Goals'] }
  ]
  
  specialDates2020.forEach(({ date, desc, rating, cats }) => {
    const [year, month, day] = date.split('-')
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const entry = {
      id: `special-${date}-${Math.floor(Math.random()*100000)}`,
      description: desc,
      rating,
      categories: cats,
      imgUrl: sampleImages[Math.floor(Math.random() * sampleImages.length)],
      date: d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      dateObject: d,
      dateKey: date
    }
    upsertEntry(date, entry)
  })
}


