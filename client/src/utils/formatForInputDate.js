export default function formatForInputDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}
// This function takes a date string (e.g., '2023-10-01') and formats it for input type="date"
// by converting it to 'YYYY-MM-DD' format, which is required by HTML date inputs.
