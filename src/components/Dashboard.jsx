import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { LogOut, Plus, Search, User, Menu } from 'lucide-react'

export default function Dashboard({ onNewEntry }) {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user))
  }, [])

  const handleLogout = async () => await supabase.auth.signOut()

  const name = user?.email?.includes('g.ursache') ? 'George' : 'Guest'

  return (
    <div className="min-h-screen">
      {/* Top Header with Menu */}
      <div className="card mx-6 mt-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hello, {name}!</h1>
          <p className="text-slate-400 mt-1">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-3 hover:bg-white/10 rounded-xl">
            <Menu size={28} className="colorful-icon" />
          </button>
          <button onClick={handleLogout} className="p-3 hover:bg-white/10 rounded-xl">
            <LogOut size={28} className="colorful-icon" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="card mx-6 mt-4 absolute right-6 z-50 w-48">
          <button className="w-full text-left p-4 hover:bg-white/10 rounded-t-xl flex items-center gap-3">
            <Home size={24} className="colorful-icon" /> Home
          </button>
          <button className="w-full text-left p-4 hover:bg-white/10 flex items-center gap-3">
            <Search size={24} className="colorful-icon" /> Search
          </button>
          <button className="w-full text-left p-4 hover:bg-white/10 rounded-b-xl flex items-center gap-3">
            <User size={24} className="colorful-icon" /> Profile
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mx-6 mt-8">
        {[
          { icon: '🔥', value: '1', label: 'Day Streak' },
          { icon: '📈', value: '1', label: 'Best Streak' },
          { icon: '📔', value: '3', label: 'Total Entries' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className="text-5xl mb-3">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-slate-400 text-sm mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="card mx-6 mt-8">
        <h2 className="text-xl font-semibold mb-6">Your Journal Calendar</h2>
        <div className="grid grid-cols-7 gap-3 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-slate-400 font-medium">{d}</div>)}
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <div
              key={day}
              className={`py-4 rounded-2xl text-lg font-medium transition hover:bg-white/10 ${day === new Date().getDate() ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Floating + Button1 */}
      <button onClick={onNewEntry} className="floating-plus fixed bottom-24 right-6 z-50">
        <Plus size={36} strokeWidth={3} />
      </button>

      {/* Gradient definition for icons */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function Home() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}