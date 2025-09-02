import { addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, format } from 'date-fns'

export function formatDateKey(date) {
  return format(date, 'yyyy-MM-dd')
}

export function formatDisplayDate(date) {
  return format(date, 'EEE, MMM d, yyyy')
}

export function buildMonthGrid(activeDate) {
  const monthStart = startOfMonth(activeDate)
  const monthEnd = endOfMonth(activeDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = []
  let day = gridStart
  while (day <= gridEnd) {
    days.push(day)
    day = addDays(day, 1)
  }
  return { days, monthStart }
}

export function getAdjacentMonths(anchorDate, countAround = 2) {
  const months = []
  for (let i = -countAround; i <= countAround; i++) {
    months.push(startOfMonth(addMonths(anchorDate, i)))
  }
  return months
}

export function isSameDayDate(a, b) {
  return isSameDay(a, b)
}

export { addMonths, startOfMonth, isSameMonth, isSameDay }


