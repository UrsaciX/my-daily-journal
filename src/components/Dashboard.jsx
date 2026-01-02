import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { LogOut, Plus, Search, User } from 'lucide-react'

export default function Dashboard({ onNewEntry }) {
  const [user, setUser] = useState(null)
  const [entries, setEntries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user))

    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
    setEntries(data || [])
  }

  const filtered = entries.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  )

  const name = user?.email?.includes('g.ursache') ? 'George' : 'Guest'

  const handleLogout = async () => await supabase.auth.signOut()

  return (
    <div className="min-h-screen pb-24">
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

      <div className="grid grid-cols-3 gap-4 mx-6 mt-8">
        {[
          { icon: '🔥', value: entries.length > 0 ? 'Active' : '0', label: 'Day Streak' },
          { icon: '📈', value: '1', label: 'Best Streak' },
          { icon: '📔', value: entries.length, label: 'Total Entries' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card mx-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-b border-slate-600 pb-2 focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No entries yet. Tap + to create one!</p>
          ) : (
            filtered.map(entry => (
              <div key={entry.id} className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold">{entry.title}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {new Date(entry.created_at).toLocaleDateString()} • {entry.mood || 'No mood'}
                </p>
                <div className="mt-2 text-sm opacity-80" dangerouslySetInnerHTML={{ __html: entry.content.slice(0, 200) + '...' }} />
              </div>
            ))
          )}
        </div>
      </div>

      <button onClick={onNewEntry} className="floating-plus fixed bottom-24 right-6 z-50">
        <Plus size={36} strokeWidth={3} />
      </button>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/50 backdrop-blur-lg border-t border-white/10 flex justify-around py-4">
        <button className="text-blue-400"><Home size={28} /></button>
        <div className="w-16" />
        <button className="text-slate-400"><Search size={28} /></button>
        <button className="text-slate-400"><User size={28} /></button>
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