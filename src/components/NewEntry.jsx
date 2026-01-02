import { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Camera, MapPin, Mic, ArrowLeft } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function NewEntry({ onBack }) {
  const [title, setTitle] = useState('')
  const [mood, setMood] = useState('')
  const [location, setLocation] = useState('')
  const [photos, setPhotos] = useState([])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write your thoughts here...' }),
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

    if (error) {
      alert('Error: ' + error.message)
    } else {
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
        <div className="card p-5 bg-yellow-900/30">
          <p className="text-sm opacity-80">Today's Prompt</p>
          <p className="text-lg font-semibold mt-2">What would make tomorrow even better?</p>
        </div>

        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-slate-800/50 border border-slate-600"
        />

        <div className="card">
          <EditorContent editor={editor} className="prose prose-invert max-w-none p-5 min-h-64" />
          <div className="border-t border-slate-700 p-4 flex justify-end">
            <button onClick={handleVoice} className="p-3 hover:bg-slate-700 rounded-xl">
              <Mic size={24} />
            </button>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {photos.map((src, i) => (
              <img key={i} src={src} alt="preview" className="rounded-2xl object-cover h-32 w-full" />
            ))}
          </div>
        )}

        <div className="card text-center">
          <p className="mb-4 font-medium">Photos & Videos</p>
          <div className="flex justify-center gap-12">
            <label className="cursor-pointer">
              <Camera size={40} />
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
            </label>
            <label className="cursor-pointer">
              <div className="bg-slate-700 border-2 border-dashed rounded-2xl w-16 h-16" />
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handlePhoto} />
            </label>
          </div>
        </div>

        <button
          onClick={() => navigator.geolocation.getCurrentPosition(
            pos => setLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`),
            () => alert('Location denied')
          )}
          className="card w-full flex items-center justify-center gap-4 py-5"
        >
          <MapPin size={24} />
          <span>{location || 'Add Location'}</span>
        </button>

        <div className="card text-center">
          <p className="mb-6 font-medium text-lg">How are you feeling?</p>
          <div className="flex justify-center gap-8">
            {moods.map(emoji => (
              <button
                key={emoji}
                onClick={() => setMood(emoji)}
                className={`text-6xl p-5 rounded-full transition ${mood === emoji ? 'bg-blue-600/50 scale-110' : 'hover:bg-slate-700'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="accent w-full py-5 text-xl">
          Save Entry
        </button>
      </div>
    </div>
  )
}