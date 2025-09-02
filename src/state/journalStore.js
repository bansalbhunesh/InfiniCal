// Simple in-memory store with localStorage persistence
// Entries keyed by yyyy-MM-dd -> array of { id, description, rating, categories[], imgUrl, date }

const STORAGE_KEY = 'journalEntries'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed
  } catch {}
  return {}
}

const journalDb = loadInitial()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journalDb))
  } catch {}
}

export function getEntries(dateKey) {
  return journalDb[dateKey] ? [...journalDb[dateKey]] : []
}

export function upsertEntry(dateKey, entry) {
  if (!journalDb[dateKey]) journalDb[dateKey] = []
  const existingIndex = journalDb[dateKey].findIndex(e => e.id === entry.id)
  if (existingIndex >= 0) {
    journalDb[dateKey][existingIndex] = { ...journalDb[dateKey][existingIndex], ...entry }
  } else {
    journalDb[dateKey].push(entry)
  }
  journalDb[dateKey].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  persist()
}

export function deleteEntry(dateKey, entryId) {
  if (!journalDb[dateKey]) return
  const idx = journalDb[dateKey].findIndex(e => e.id === entryId)
  if (idx >= 0) {
    journalDb[dateKey].splice(idx, 1)
    if (journalDb[dateKey].length === 0) delete journalDb[dateKey]
    persist()
  }
}

export function getAllDatedKeysSorted() {
  return Object.keys(journalDb).sort()
}

export function getFlattenedEntriesSorted() {
  const keys = getAllDatedKeysSorted()
  const flattened = []
  for (const dateKey of keys) {
    const entries = journalDb[dateKey] || []
    for (let i = 0; i < entries.length; i++) {
      flattened.push({ ...entries[i], dateKey, entryIndex: i })
    }
  }
  return flattened
}


