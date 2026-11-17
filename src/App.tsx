
import { useState } from 'react'
import type { FoodItemInput } from './models/foodItem'
import './App.css'

const sampleItems: FoodItemInput[] = [
  {
    name: 'Milk',
    storageLocation: 'Fridge',
    dateKind: 'Best by',
    recordedDate: '2026-11-15',
    quantity: 1,
  },
  {
    name: 'Spinach',
    storageLocation: 'Fridge',
    dateKind: 'Use by',
    recordedDate: '2026-11-20',
    quantity: 1,
  },
]

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

function App() {
  const [showEmpty, setShowEmpty] = useState(false)
  const items = showEmpty ? [] : sampleItems

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="brand">ShelfLife AI</span>
        <h1>Inventory</h1>
      </header>

      <main className="app-content">
        <div className="inventory-heading">
          <div>
            <h2>Your food at a glance</h2>
            <p className="inventory-count" aria-live="polite">
              {items.length} sample items
            </p>
          </div>

          <button
            className="preview-toggle"
            type="button"
            onClick={() => setShowEmpty(!showEmpty)}
            aria-pressed={showEmpty}
          >
            {showEmpty ? 'Show sample items' : 'Preview empty state'}
          </button>
        </div>

        {items.length === 0 ? (
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
              <li
                className="food-card"
                key={`${item.name}-${item.recordedDate}`}
              >
                <div className="food-icon" aria-hidden="true">
                  ●
                </div>

                <div className="food-details">
                  <h3>{item.name}</h3>
                  <p>
                    {item.dateKind} {formatDate(item.recordedDate)}
                  </p>
                </div>

                <span className="sample-badge">
                  Demo
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="inventory-actions">
          <button className="primary-button" disabled>
            + Add food
          </button>

          <button className="secondary-button" disabled>
            Scan a date
          </button>
        </div>

        <p className="development-note">
          Dashboard preview: adding food and scanning
          will be implemented in later tasks.
        </p>
      </main>

      <nav className="bottom-nav" aria-label="App sections">
        <span className="active-tab" aria-current="page">
          Home
        </span>
        <span>Add</span>
        <span>Scan</span>
        <span>Soon</span>
      </nav>
    </div>
  )
}

export default App
