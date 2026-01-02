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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">My Daily Journal</h2>
          <p className="mt-2 text-gray-600">Welcome Back</p>
          <p className="text-sm">Sign in to continue your journaling journey</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 border rounded-lg" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 border rounded-lg" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-gray-500">OR</div>

        <button onClick={handleGuest} className="w-full py-3 bg-gray-200 rounded-lg font-medium hover:bg-gray-300">
          Continue as Guest
        </button>
        <button onClick={handleGuest} className="w-full mt-3 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
          Try the app as George
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <a href="#" className="text-blue-600">Sign Up</a>
        </p>
      </div>
    </div>
  )
}