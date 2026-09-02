function mediaRecorderSupported() {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'
}

function preferredMimeType() {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') return ''
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
  return candidates.find(type => MediaRecorder.isTypeSupported(type)) || ''
}

export function audioRecordingSupported() {
  return mediaRecorderSupported()
}

export const AudioRecorderService = {
  supported: audioRecordingSupported,

  async start({ maxDurationMs = 12000, onStart, onStop, onError } = {}) {
    if (!mediaRecorderSupported()) return { started: false, stop() {} }
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } })
      const mimeType = preferredMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks = []
      let timer = null
      let stopped = false

      const cleanup = () => {
        if (timer) clearTimeout(timer)
        timer = null
        stream?.getTracks?.().forEach(track => track.stop())
      }

      recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data) }
      recorder.onerror = event => {
        cleanup()
        onError?.(event?.error?.message || 'recording-error')
      }
      recorder.onstop = () => {
        if (stopped) return
        stopped = true
        cleanup()
        const type = recorder.mimeType || mimeType || 'audio/webm'
        const blob = new Blob(chunks, { type })
        onStop?.({ blob, mimeType: type, durationLimited: false })
      }
      recorder.start()
      onStart?.()
      timer = setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop()
      }, Math.max(2000, maxDurationMs))

      return {
        started: true,
        stop() {
          if (recorder.state !== 'inactive') recorder.stop()
        },
      }
    } catch (error) {
      stream?.getTracks?.().forEach(track => track.stop())
      onError?.(error?.name === 'NotAllowedError' ? 'not-allowed' : (error?.message || 'recording-start-failed'))
      return { started: false, stop() {} }
    }
  },
}
