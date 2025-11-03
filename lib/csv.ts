/**
 * Create a CSV string from an array of records.
 * Escapes quotes and joins with commas, keeping a header row.
 */
export function toCsv(headers: string[], rows: Array<Record<string, unknown>>): string {
  const csv: string[] = [headers.join(',')]
  for (const row of rows) {
    const line = headers.map((h) => {
      const value = row[h]
      if (value === null || value === undefined) return ''
      const s = String(value).replace(/"/g, '""')
      return `"${s}` + `"`
    }).join(',')
    csv.push(line)
  }
  return csv.join('\n')
}

/**
 * Trigger a client-side download of a CSV string as a file.
 */
export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}


