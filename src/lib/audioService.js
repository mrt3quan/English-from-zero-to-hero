// The Web Speech API exposes no real gender field, so picking a "female" voice
// is a best-effort name match against common female system/browser voices.
const FEMALE_VOICE_HINTS = [
  'female', 'zira', 'eva', 'aria', 'jenny', 'michelle',
  'samantha', 'victoria', 'karen', 'moira', 'tessa', 'susan', 'allison', 'ava', 'nicky',
  'google us english', 'joanna', 'salli', 'kimberly', 'ivy', 'kendra',
]

function pickVoice(voices) {
  const en = voices.filter(v => v.lang?.toLowerCase().startsWith('en'))
  const enUS = en.filter(v => v.lang?.toLowerCase() === 'en-us')
  const pool = enUS.length ? enUS : en.length ? en : voices
  const female = pool.find(v => FEMALE_VOICE_HINTS.some(hint => v.name?.toLowerCase().includes(hint)))
  return female || pool[0] || null
}

// Chrome/Edge load the voice list asynchronously; without this, the very first
// speak() call can run before any voices are available and silently skip the
// female-voice preference.
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices())
}

export const AudioService = {
  supported(){ return typeof window !== 'undefined' && 'speechSynthesis' in window },
  speak(text,{speed='normal'}={}){
    if(!this.supported()) return false
    window.speechSynthesis.cancel()
    const utterance=new SpeechSynthesisUtterance(String(text).replace(/[✓✗→]/g,' '))
    utterance.lang='en-US'
    utterance.rate=speed==='slow' ? 0.68 : 0.9
    utterance.pitch=1.05
    const voice=pickVoice(window.speechSynthesis.getVoices?.() || [])
    if(voice) utterance.voice=voice
    window.speechSynthesis.speak(utterance)
    return true
  },
  stop(){ if(this.supported()) window.speechSynthesis.cancel() }
}
