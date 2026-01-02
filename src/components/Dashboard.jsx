import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { LogOut, Plus, Search, User } from 'lucide-react'

export default function Dashboard({ onNewEntry }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user))
  }, [])

  const handleLogout = async () => await supabase.auth.signOut()

  const name = user?.email?.includes('g.ursache') ? 'George' : 'Guest'

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="card mx-6 mt-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Hello, {name}!</h1>
            <p className="text-slate-400 mt-1">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg">
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mx-6 mt-8">
        {[
          { icon: '🔥', value: '1', label: 'Day Streak' },
          { icon: '📈', value: '1', label: 'Best Streak' },
          { icon: '📔', value: '3', label: 'Total Entries' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="card mx-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Journal Calendar</h2>
        <div className="grid grid-cols-7 gap-3 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-slate-400">{d}</div>)}
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <div
              key={day}
              className={`py-3 rounded-xl ${day === 2 ? 'bg-blue-600 text-white font-bold' : 'hover:bg-white/10'}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Floating + Button */}
      <button
        onClick={onNewEntry}
        className="floating-plus fixed bottom-24 right-6 z-50"
      >
        <Plus size={36} strokeWidth={3} />
      </button>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/50 backdrop-blur-lg border-t border-white/10 flex justify-around py-4">
        <button className="text-blue-400">
          <Home size={28} />
        </button>
        <div className="w-16" /> {/* spacer for + button */}
        <button className="text-slate-400">
          <Search size={28} />
        </button>
        <button className="text-slate-400">
          <User size={28} />
        </button>
      </div>
    </div>
  )
}

function Home() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}