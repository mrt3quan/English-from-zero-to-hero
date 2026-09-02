const base = (process.env.PRONUNCIATION_API_URL || process.env.VITE_PRONUNCIATION_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
try {
  const response = await fetch(`${base}/health`)
  const text = await response.text()
  if (!response.ok) {
    console.error(`Pronunciation backend returned HTTP ${response.status}: ${text}`)
    process.exit(1)
  }
  console.log(`Pronunciation backend OK: ${base}`)
  console.log(text)
} catch (error) {
  console.error(`Cannot reach pronunciation backend at ${base}`)
  console.error(error?.message || error)
  process.exit(1)
}
