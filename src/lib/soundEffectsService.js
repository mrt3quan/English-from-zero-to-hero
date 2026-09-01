import { readJson, writeJson } from './storage.js'

const KEY='bunny-english-sound-settings-v1'
const defaults={enabled:true,volume:'medium'}
const gainMap={low:0.045,medium:0.08,high:0.13}
let ctx=null

function settings(){return {...defaults,...readJson(KEY,{})}}
function save(next){const value={...settings(),...next};writeJson(KEY,value);if(typeof window!=='undefined')window.dispatchEvent(new Event('bunny-sound-settings-updated'));return value}
function audioContext(){if(typeof window==='undefined')return null;const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return null;if(!ctx)ctx=new Ctx();if(ctx.state==='suspended')ctx.resume().catch(()=>{});return ctx}
function tone({frequency=440,start=0,duration=.08,type='sine',gain=.08}){
  const context=audioContext();if(!context)return false
  const now=context.currentTime+start
  const osc=context.createOscillator();const amp=context.createGain()
  osc.type=type;osc.frequency.setValueAtTime(frequency,now)
  amp.gain.setValueAtTime(0.0001,now);amp.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),now+.012);amp.gain.exponentialRampToValueAtTime(.0001,now+duration)
  osc.connect(amp);amp.connect(context.destination);osc.start(now);osc.stop(now+duration+.02);return true
}
function playPattern(pattern){const s=settings();if(!s.enabled)return false;const g=gainMap[s.volume]||gainMap.medium;return pattern.reduce((played,item)=>tone({...item,gain:g*(item.gainScale||1)})||played,false)}

export const SoundEffectsService={
  supported:()=>typeof window!=='undefined'&&!!(window.AudioContext||window.webkitAudioContext),
  getSettings:settings,
  setEnabled:enabled=>save({enabled:!!enabled}),
  setVolume:volume=>save({volume:['low','medium','high'].includes(volume)?volume:'medium'}),
  toggle:()=>save({enabled:!settings().enabled}),
  feedback:ok=>ok?SoundEffectsService.correct():SoundEffectsService.incorrect(),
  correct:()=>playPattern([
    {frequency:523.25,duration:.08,type:'sine'},
    {frequency:659.25,start:.065,duration:.11,type:'sine',gainScale:.9},
  ]),
  incorrect:()=>playPattern([
    {frequency:329.63,duration:.075,type:'sine',gainScale:.78},
    {frequency:293.66,start:.06,duration:.095,type:'sine',gainScale:.66},
  ]),
  lessonComplete:()=>playPattern([
    {frequency:523.25,duration:.08},{frequency:659.25,start:.075,duration:.09},{frequency:783.99,start:.15,duration:.14,gainScale:.95},
  ]),
  levelComplete:()=>playPattern([
    {frequency:523.25,duration:.08},{frequency:659.25,start:.07,duration:.08},{frequency:783.99,start:.14,duration:.1},{frequency:1046.5,start:.23,duration:.2,gainScale:.95},
  ]),
  preview:kind=>kind==='incorrect'?SoundEffectsService.incorrect():SoundEffectsService.correct(),
}
