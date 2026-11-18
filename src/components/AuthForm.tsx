
import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setError('')

    try {
      if (mode === 'signup') {
        const { data, error: authError } =
          await supabase.auth.signUp({
            email,
            password,
          })

        if (authError) throw authError

        setMessage(
          data.session
            ? 'Account created successfully.'
            : 'Check your email to confirm your account before signing in.'
        )
      } else {
        const { error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })

        if (authError) throw authError
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Authentication failed. Please try again.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-form">
      <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
      <p>Access your ShelfLife AI inventory.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          autoComplete={
            mode === 'signup' ? 'new-password' : 'current-password'
          }
          minLength={12}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p role="alert" className="field-error">{error}</p>}
        {message && <p role="status">{message}</p>}

        <button
          className="primary-button"
          type="submit"
          disabled={busy}
        >
          {busy
            ? 'Please wait...'
            : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        className="cancel-button"
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'signup' : 'login')
          setError('')
          setMessage('')
        }}
      >
        {mode === 'login'
          ? 'Need an account? Sign up'
          : 'Already have an account? Sign in'}
      </button>
    </section>
  )
}
