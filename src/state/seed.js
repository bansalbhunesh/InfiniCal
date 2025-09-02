// Optional dataset seeding merged with localStorage
// Call seedIfEmpty() on app start if you want demo data

import { upsertEntry } from './journalStore'
import { format } from 'date-fns'

function randomBetween(min, max) { return Math.random() * (max - min) + min }

export function seedIfEmpty() {
  try {
    const existing = localStorage.getItem('journalEntries')
    if (existing && existing !== '{}' && existing !== 'null') return
  } catch {}

  const today = new Date()
  for (let i = -20; i <= 20; i++) {
    if (Math.random() < 0.5) continue
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dateKey = format(d, 'yyyy-MM-dd')
    const entry = {
      id: `seed-${dateKey}-${Math.floor(Math.random()*10000)}`,
      description: 'Seeded journal entry for demo purposes.',
      rating: Number(randomBetween(3, 5).toFixed(1)),
      categories: ['Personal'],
      imgUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
      date: d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      dateObject: d,
      dateKey
    }
    upsertEntry(dateKey, entry)
  }
}


