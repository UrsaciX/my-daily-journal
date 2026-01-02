import { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Camera, MapPin, ArrowLeft } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function NewEntry({ onBack }) {
  const [title, setTitle] = useState('')
  const [mood, setMood] = useState('')
  const [location, setLocation] = useState('')
  const [photos, setPhotos] = useState([])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write your thoughts here..' }),
    ],
    content: '',
  })

  const moods = ['😄', '😊', '😐', '😔', '😠']

  const handleVoice = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        editor?.chain().focus().insertContent(transcript + ' ').run()
      }
      recognition.start()
    } else {
      alert('Voice-to-text not supported in this browser')
    }
  }

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => URL.createObjectURL(file))
    setPhotos(prev => [...prev, ...previews])
  }

  const handleSave = async () => {
    const content = editor?.getHTML() || ''
    const { data: { session } } = await supabase.auth.getSession()

    const { error } = await supabase.from('entries').insert({
      title: title || 'Untitled',
      content,
      mood,
      location,
      photos,
      user_id: session?.user?.id || null,
    })

    if (error) alert('Error: ' + error.message)
    else {
      alert('Entry saved successfully!')
      onBack()
    }
  }

  return (
    <div className="min-h-screen">
      <div className="card mx-6 mt-8 flex items-center gap-4">
        <button onClick={onBack}><ArrowLeft size={28} /></button>
        <div>
          <h1 className="text-2xl font-bold">New Entry</h1>
          <p className="text-slate-400">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="mx-6 mt-8 space-y-6">
        <div className="glass card p-5 border border-white/10">
          <p className="text-sm opacity-80">Today's Prompt</p>
          <p className="text-xl font-semibold mt-2">What would make tomorrow even better?</p>
        </div>

        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl bg-slate-800/70 border border-slate-600 text-lg"
        />

        <div className="card">
          <EditorContent editor={editor} className="prose prose-invert max-w-none p-6 min-h-80" />
          <div className="border-t border-slate-700 p-4 flex justify-end">
            <button onClick={handleVoice} className="mic-button">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {photos.map((src, i) => (
              <img key={i} src={src} alt="preview" className="photo-preview" />
            ))}
          </div>
        )}

        <div className="card text-center">
          <p className="mb-6 font-medium text-lg">Photos & Videos</p>
          <div className="flex justify-center gap-12">
            <label className="cursor-pointer">
              <Camera size={48} />
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
            </label>
            <label className="cursor-pointer">
              <div className="bg-slate-700 border-2 border-dashed rounded-2xl w-20 h-20" />
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handlePhoto} />
            </label>
          </div>
        </div>

        <button
          onClick={() => navigator.geolocation.getCurrentPosition(
            pos => setLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`),
            () => alert('Location denied')
          )}
          className="card w-full flex items-center justify-center gap-4 py-6 text-lg"
        >
          <MapPin size={28} />
          <span>{location || 'Add Location'}</span>
        </button>

        <div className="card text-center">
          <p className="mb-8 font-medium text-xl">How are you feeling?</p>
          <div className="flex justify-center gap-8">
            {moods.map(emoji => (
              <button
                key={emoji}
                onClick={() => setMood(emoji)}
                className="mood-emoji"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="accent w-full py-6 text-2xl">
          Save Entry
        </button>
      </div>
    </div>
  )
}