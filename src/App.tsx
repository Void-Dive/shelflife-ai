
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import AddFoodForm from './components/AddFoodForm'
import AuthForm from './components/AuthForm'
import { loadFoodItems, saveFoodItem } from './lib/foodItems'
import { supabase } from './lib/supabase'
import type {
  FoodItemInput,
  FoodItemRecord,
} from './models/foodItem'
import './App.css'

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  )
}

function InventoryApp() {
  const [items, setItems] = useState<FoodItemRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [signOutError, setSignOutError] = useState('')
  const [page, setPage] =
    useState<'inventory' | 'add'>('inventory')

  useEffect(() => {
    let cancelled = false

    loadFoodItems()
      .then((loaded) => {
        if (!cancelled) setItems(loaded)
      })
      .catch((cause) => {
        if (!cancelled) {
          setLoadError(
            cause instanceof Error
              ? cause.message
              : 'Could not load inventory.'
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function refreshItems() {
    setLoading(true)
    setLoadError('')

    try {
      const loaded = await loadFoodItems()
      setItems(loaded)
    } catch (cause) {
      setLoadError(
        cause instanceof Error
          ? cause.message
          : 'Could not load inventory.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(item: FoodItemInput) {
    // A failed save throws and keeps the Add Food form open.
    await saveFoodItem(item)

    // Only leave the form after the database accepts the item.
    setPage('inventory')
    void refreshItems()
  }

  async function handleSignOut() {
    setSignOutError('')

    const { error } = await supabase.auth.signOut()

    if (error) {
      setSignOutError(error.message)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-top">
          <span className="brand">ShelfLife AI</span>
          <button
            className="sign-out-button"
            type="button"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
        <h1>{page === 'add' ? 'Add food' : 'Inventory'}</h1>
      </header>

      <main className="app-content">
        {signOutError && (
          <p className="field-error" role="alert">
            {signOutError}
          </p>
        )}

        {page === 'add' ? (
          <AddFoodForm
            onSave={handleSave}
            onCancel={() => setPage('inventory')}
          />
        ) : (
          <>
            <div className="inventory-heading">
              <div>
                <h2>Your food at a glance</h2>
                <p className="inventory-count" aria-live="polite">
                  {loading
                    ? 'Loading...'
                    : `${items.length} ${
                        items.length === 1 ? 'item' : 'items'
                      }`}
                </p>
              </div>
            </div>

            {loading ? (
              <p role="status">Loading inventory...</p>
            ) : loadError ? (
              <section>
                <p className="field-error" role="alert">
                  {loadError}
                </p>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => void refreshItems()}
                >
                  Retry loading
                </button>
              </section>
            ) : items.length === 0 ? (
              <section className="empty-state">
                <div className="empty-icon" aria-hidden="true">
                  🥬
                </div>
                <h3>Your inventory is empty</h3>
                <p>
                  Food items you save will appear here,
                  along with their recorded dates.
                </p>
              </section>
            ) : (
              <ul className="inventory-grid">
                {items.map((item) => (
                  <li className="food-card" key={item.id}>
                    <div className="food-icon" aria-hidden="true">
                      ●
                    </div>

                    <div className="food-details">
                      <h3>{item.name}</h3>
                      <p>
                        {item.dateKind}{' '}
                        {formatDate(item.recordedDate)}
                      </p>
                    </div>

                    <span className="sample-badge">
                      {item.quantity}{' '}
                      {item.quantity === 1
                        ? 'item'
                        : 'items'}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="inventory-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => setPage('add')}
              >
                + Add food
              </button>

              <button
                className="secondary-button"
                type="button"
                disabled
              >
                Scan a date
              </button>
            </div>

            <p className="development-note">
              Inventory is saved to Supabase for your
              signed-in account.
            </p>
          </>
        )}
      </main>

      <nav className="bottom-nav" aria-label="App sections">
        <button
          type="button"
          className={page === 'inventory' ? 'active-tab' : ''}
          onClick={() => setPage('inventory')}
        >
          Home
        </button>

        <button
          type="button"
          className={page === 'add' ? 'active-tab' : ''}
          onClick={() => setPage('add')}
        >
          Add
        </button>

        <span>Scan</span>
        <span>Soon</span>
      </nav>
    </div>
  )
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    let active = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!active) return

        setSession(nextSession)
        setCheckingAuth(false)
      }
    )

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return

        setSession(data.session)
        setCheckingAuth(false)
      })
      .catch(() => {
        if (active) setCheckingAuth(false)
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (checkingAuth) {
    return (
      <div className="app-shell">
        <main className="app-content">
          <p>Checking your session...</p>
        </main>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <span className="brand">ShelfLife AI</span>
          <h1>Welcome</h1>
        </header>

        <main className="app-content">
          <AuthForm />
        </main>
      </div>
    )
  }

  return <InventoryApp key={session.user.id} />
}

export default App
