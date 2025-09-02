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
  'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
  'https://images.pexels.com/photos/3992649/pexels-photo-3992649.jpeg',
  'https://images.pexels.com/photos/3993012/pexels-photo-3993012.jpeg',
  'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg',
  'https://images.pexels.com/photos/3738373/pexels-photo-3738373.jpeg',
  'https://images.pexels.com/photos/3738388/pexels-photo-3738388.jpeg',
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  'https://images.pexels.com/photos/853199/pexels-photo-853199.jpeg',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800',
]

export function seedIfEmpty() {
  try {
    const existing = localStorage.getItem('journalEntries')
    if (existing && existing !== '{}' && existing !== 'null') return
  } catch {}

  const today = new Date()
  // Seed across the past/next 90 days with 0-4 entries per day
  for (let i = -90; i <= 90; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const entriesCount = Math.floor(Math.random() * 5) // 0..4
    for (let j = 0; j < entriesCount; j++) {
      const pick = Math.floor(Math.random() * sampleDescriptions.length)
      const rating = Number(randomBetween(3, 5).toFixed(1))
      const cats = sampleCategories[pick % sampleCategories.length]
      const img = sampleImages[pick % sampleImages.length]
      const dateKey = format(d, 'yyyy-MM-dd')
      const entry = {
        id: `seed-${dateKey}-${j}-${Math.floor(Math.random()*100000)}`,
        description: sampleDescriptions[pick],
        rating,
        categories: cats,
        imgUrl: img,
        date: d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        dateObject: d,
        dateKey
      }
      upsertEntry(dateKey, entry)
    }
  }
}


