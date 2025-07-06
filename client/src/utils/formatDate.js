// src/utils/formatDate.js

export default function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr // fallback if not a valid date
  return date.toLocaleDateString('en-GB') // returns dd/mm/yyyy
}
