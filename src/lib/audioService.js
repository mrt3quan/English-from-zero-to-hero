import speechClips from '../data/speechClips.js'

const VOICE_SETTINGS_KEY = 'bunny_english_voice_settings_v2'
const KOKORO_MODULE_URL = 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm'
const KOKORO_MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX'

const DEFAULT_SETTINGS = Object.freeze({
  provider: 'kokoro',
  teacherVoice: 'af_heart',
  listeningFemaleVoice: 'af_bella',
  listeningMaleVoice: 'am_michael',
  slowSpeed: 0.5,
})

let kokoroPromise = null
let kokoroInstance = null
let audioContext = null
let activeSource = null
let loadState = 'idle'
let lastError = null

function canUseWindow(){ return typeof window !== 'undefined' }
// Lesson text carries teaching marks that must never be read aloud: the ✓/✗/→ symbols,
// the "|" used to separate parts of a sentence, and IPA written between slashes
// ("/m/ /æ/ /p/") — which every TTS engine otherwise pronounces as the word "slash".
export function cleanText(text){
  return String(text || '')
    .replace(/[✓✗→|]/g, ' ')
    .replace(/\/([^/]+)\//g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function emit(name, detail){
  if(canUseWindow()) window.dispatchEvent(new CustomEvent(name, { detail }))
}

function safeReadSettings(){
  if(!canUseWindow()) return { ...DEFAULT_SETTINGS }
  try {
    const raw = window.localStorage.getItem(VOICE_SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function safeWriteSettings(settings){
  if(!canUseWindow()) return
  try { window.localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(settings)) } catch {}
  emit('bunny-voice-settings-updated', settings)
}

function stableParity(text){
  let total=0
  for(const char of String(text||'')) total=(total+char.charCodeAt(0))%997
  return total%2
}

function chooseVoice(settings, voiceRole='teacher', explicitVoice, text=''){
  if(explicitVoice) return explicitVoice
  if(voiceRole === 'female') return settings.listeningFemaleVoice
  if(voiceRole === 'male') return settings.listeningMaleVoice
  if(voiceRole === 'listening') return stableParity(text) ? settings.listeningFemaleVoice : settings.listeningMaleVoice
  return settings.teacherVoice
}

function ensureAudioContext(){
  if(!canUseWindow()) return null
  const Ctor = window.AudioContext || window.webkitAudioContext
  if(!Ctor) return null
  if(!audioContext) audioContext = new Ctor()
  if(audioContext.state === 'suspended'){
    // Calling resume while still inside the learner's click helps preserve playback permission
    // even if model loading/generation takes several seconds.
    try { audioContext.resume() } catch {}
  }
  return audioContext
}

function cleanupPlayer(){
  if(activeSource){
    try { activeSource.stop() } catch {}
    try { activeSource.disconnect() } catch {}
    activeSource = null
  }
}

async function playBlob(blob){
  const context = ensureAudioContext()
  if(!context){
    const url = URL.createObjectURL(blob)
    const player = new Audio(url)
    player.addEventListener('ended',()=>URL.revokeObjectURL(url),{once:true})
    await player.play()
    return true
  }
  if(context.state === 'suspended') await context.resume()
  const buffer = await blob.arrayBuffer()
  const decoded = await context.decodeAudioData(buffer.slice(0))
  cleanupPlayer()
  const source = context.createBufferSource()
  activeSource = source
  source.buffer = decoded
  source.connect(context.destination)
  source.onended = ()=>{ try{source.disconnect()}catch{};if(activeSource===source)activeSource=null }
  source.start(0)
  return true
}

const FEMALE_VOICE_HINTS = ['female','zira','eva','aria','jenny','michelle','samantha','victoria','karen',
  'moira','tessa','susan','allison','ava','nicky','google us english','joanna','salli','kimberly','ivy','kendra']

// Pre-rendered Kokoro clips.
//
// The course speaks a fixed set of phrases, so every one of them is synthesised
// at build time (scripts/generate-speech.mjs) and served as a small MP3 from our
// own origin. This is the normal path: it plays immediately, needs no model
// download, and works on networks that block jsDelivr/Hugging Face.
const CLIP_BASE = `${import.meta.env?.BASE_URL ?? '/'}voice/`

function clipKey(voice, speed, text){
  return `${voice}|${speed}|${cleanText(text)}`
}

function findClip(settings, { speed = 'normal', voiceRole = 'teacher', voice } = {}, text){
  const selectedVoice = chooseVoice(settings, voiceRole, voice, text)
  const rate = speed === 'slow' ? Number(settings.slowSpeed || 0.5) : 1
  const id = speechClips.clips?.[clipKey(selectedVoice, rate, text)]
  return id ? `${CLIP_BASE}${id}.mp3` : null
}

async function playClip(url){
  const context = ensureAudioContext()
  if(!context){
    const player = new Audio(url)
    await player.play()
    return true
  }
  if(context.state === 'suspended') await context.resume()
  const response = await fetch(url)
  if(!response.ok) throw new Error(`clip ${response.status}`)
  const decoded = await context.decodeAudioData(await response.arrayBuffer())
  cleanupPlayer()
  const source = context.createBufferSource()
  activeSource = source
  source.buffer = decoded
  source.connect(context.destination)
  source.onended = ()=>{ try{source.disconnect()}catch{};if(activeSource===source)activeSource=null }
  source.start(0)
  return true
}

function browserTtsSupported(){ return canUseWindow() && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined' }

function browserSpeak(text,{speed='normal',voiceRole='teacher'}={}){
  if(!browserTtsSupported()) return false
  cleanupPlayer()
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(cleanText(text))
  utterance.lang = 'en-US'
  utterance.rate = speed === 'slow' ? 0.5 : 0.9
  utterance.pitch = 1.05
  const voices = window.speechSynthesis.getVoices?.() || []
  const english = voices.filter(v => v.lang?.toLowerCase().startsWith('en'))
  const preferred = voiceRole === 'male'
    ? english.find(v => /male|david|mark|daniel|guy/i.test(v.name))
    : english.find(v => FEMALE_VOICE_HINTS.some(hint => v.name?.toLowerCase().includes(hint)))
  const enUS = preferred || english.find(v => v.lang?.toLowerCase() === 'en-us') || english[0]
  if(enUS) utterance.voice = enUS
  window.speechSynthesis.speak(utterance)
  return true
}

async function loadKokoro(){
  if(kokoroInstance) return kokoroInstance
  if(kokoroPromise) return kokoroPromise
  if(!canUseWindow()) throw new Error('browser-required')

  loadState = 'loading'
  lastError = null
  emit('bunny-voice-status-updated', { state: loadState, provider: 'kokoro' })
  kokoroPromise = (async()=>{
    try {
      // Runtime import keeps the initial app bundle small and pins the reviewed library version.
      const mod = await import(/* @vite-ignore */ KOKORO_MODULE_URL)
      const KokoroTTS = mod.KokoroTTS
      if(!KokoroTTS) throw new Error('KokoroTTS export not found')
      const tts = await KokoroTTS.from_pretrained(KOKORO_MODEL_ID, {
        dtype: 'q8',
        device: 'wasm',
      })
      kokoroInstance = tts
      loadState = 'ready'
      emit('bunny-voice-status-updated', { state: loadState, provider: 'kokoro' })
      return tts
    } catch(error) {
      kokoroPromise = null
      loadState = 'error'
      lastError = error?.message || String(error)
      emit('bunny-voice-status-updated', { state: loadState, provider: 'kokoro', error: lastError })
      throw error
    }
  })()
  return kokoroPromise
}

function rawAudioToBlob(audio){
  if(!audio) throw new Error('No audio returned by Kokoro')
  if(typeof audio.toBlob === 'function') return audio.toBlob()
  if(typeof audio.toWav === 'function'){
    const wav = audio.toWav()
    if(wav instanceof Blob) return wav
    return new Blob([wav], { type: 'audio/wav' })
  }
  if(audio.buffer) return new Blob([audio.buffer], { type: 'audio/wav' })
  throw new Error('Unsupported Kokoro audio output')
}

async function playKokoro(text,{speed='normal',voiceRole='teacher',voice}={}){
  const settings = safeReadSettings()
  const tts = await loadKokoro()
  const selectedVoice = chooseVoice(settings, voiceRole, voice, text)
  const speechSpeed = speed === 'slow' ? Number(settings.slowSpeed || 0.5) : 1
  const generated = await tts.generate(cleanText(text), { voice: selectedVoice, speed: speechSpeed })
  const blob = rawAudioToBlob(generated)
  cleanupPlayer()
  if(browserTtsSupported()) window.speechSynthesis.cancel()
  return playBlob(blob)
}

export const AudioService = {
  supported(){ return canUseWindow() && (browserTtsSupported() || !!(window.AudioContext || window.webkitAudioContext)) },
  browserFallbackSupported: browserTtsSupported,
  getSettings(){ return safeReadSettings() },
  getStatus(){ return { state: loadState, provider: safeReadSettings().provider, error: lastError } },
  setProvider(provider){
    const current = safeReadSettings()
    const next = { ...current, provider: provider === 'browser' ? 'browser' : 'kokoro' }
    safeWriteSettings(next)
    return next
  },
  setTeacherVoice(voice){ const next={...safeReadSettings(),teacherVoice:voice};safeWriteSettings(next);return next },
  setListeningFemaleVoice(voice){ const next={...safeReadSettings(),listeningFemaleVoice:voice};safeWriteSettings(next);return next },
  setListeningMaleVoice(voice){ const next={...safeReadSettings(),listeningMaleVoice:voice};safeWriteSettings(next);return next },
  hasClip(text, options={}){ return !!findClip(safeReadSettings(), options, text) },
  async prepare(){
    const settings = safeReadSettings()
    if(settings.provider === 'browser') return browserTtsSupported()
    try { await loadKokoro(); return true } catch { return false }
  },
  async speak(text, options={}){
    if(!canUseWindow()) return false
    // Unlock Web Audio immediately while this function is still running from a click/tap.
    ensureAudioContext()
    const settings = safeReadSettings()
    const clip = findClip(settings, options, text)
    if(clip){
      try {
        if(browserTtsSupported()) window.speechSynthesis.cancel()
        return await playClip(clip)
      } catch(error) {
        console.warn('[Bunny English] Pre-rendered clip unavailable, falling back.', error)
      }
    }
    if(settings.provider === 'browser') return browserSpeak(text, options)
    try {
      return await playKokoro(text, options)
    } catch(error) {
      // High-quality voice is optional: never block a lesson if the model/CDN/device fails.
      console.warn('[Bunny English] Kokoro voice unavailable, using browser fallback.', error)
      return browserSpeak(text, options)
    }
  },
  async preview(voice){ return this.speak('Hello! I am Bunny. Let us learn English together.', { voice, speed:'normal' }) },
  stop(){
    cleanupPlayer()
    if(browserTtsSupported()) window.speechSynthesis.cancel()
  },
  resetHighQualityVoice(){ kokoroPromise=null;kokoroInstance=null;loadState='idle';lastError=null },
  voices: {
    teacher: [
      { id:'af_heart', label:'Heart · US female' },
      { id:'af_bella', label:'Bella · US female' },
      { id:'af_jessica', label:'Jessica · US female' },
      { id:'am_michael', label:'Michael · US male' },
    ],
    listeningFemale: [
      { id:'af_bella', label:'Bella · US female' },
      { id:'af_sarah', label:'Sarah · US female' },
      { id:'af_sky', label:'Sky · US female' },
    ],
    listeningMale: [
      { id:'am_michael', label:'Michael · US male' },
      { id:'am_eric', label:'Eric · US male' },
      { id:'am_liam', label:'Liam · US male' },
    ],
  },
}
