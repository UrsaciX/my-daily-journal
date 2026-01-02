import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) alert(error.message)
  }

  const handleGuest = async () => {
    const { error } = await supabase.auth.signInAnonymously()
    if (error) alert(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">My Daily Journal</h1>
        <p className="text-center text-slate-400 mb-8">Welcome Back</p>
        <p className="text-center text-slate-400 mb-8">Sign in to continue your journaling journey</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
          <button type="submit" disabled={loading} className="accent w-full">
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center my-6 text-slate-400">OR</div>

        <button onClick={handleGuest} className="w-full py-3 bg-slate-700 rounded-xl hover:bg-slate-600">
          Continue as Guest
        </button>
        <button onClick={handleGuest} className="accent w-full mt-3">
          Try the app as George
        </button>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account? <a className="text-blue-400">Sign Up</a>
        </p>
      </div>
    </div>
  )
}