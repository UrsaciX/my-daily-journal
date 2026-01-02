import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import NewEntry from './components/NewEntry'

function App() {
  const [session, setSession] = useState(null)
  const [page, setPage] = useState('dashboard')

  useEffect(() => {
    document.documentElement.classList.add('dark') // force dark mode

    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!session) return <Login />

  return (
    <>
      {page === 'dashboard' && <Dashboard onNewEntry={() => setPage('new')} />}
      {page === 'new' && <NewEntry onBack={() => setPage('dashboard')} />}
    </>
  )
}

export default App