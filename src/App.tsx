
import { useState } from 'react'
import AddFoodForm from './components/AddFoodForm'
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
  const [items, setItems] = useState<FoodItemInput[]>(sampleItems)
  const [showEmpty, setShowEmpty] = useState(false)
  const [page, setPage] = useState<'inventory' | 'add'>('inventory')

  const visibleItems = showEmpty ? [] : items

  function handleSave(item: FoodItemInput) {
    setItems((previous) => [...previous, item])
    setShowEmpty(false)
    setPage('inventory')
  }

  function handleCancel() {
    setPage('inventory')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="brand">ShelfLife AI</span>
        <h1>{page === 'add' ? 'Add food' : 'Inventory'}</h1>
      </header>

      <main className="app-content">
        {page === 'add' ? (
          <AddFoodForm
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <div className="inventory-heading">
              <div>
                <h2>Your food at a glance</h2>
                <p className="inventory-count" aria-live="polite">
                  {visibleItems.length} items
                </p>
              </div>

              <button
                className="preview-toggle"
                type="button"
                onClick={() => setShowEmpty(!showEmpty)}
              >
                {showEmpty
                  ? 'Show inventory'
                  : 'Preview empty state'}
              </button>
            </div>

            {visibleItems.length === 0 ? (
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
                {visibleItems.map((item, index) => (
                  <li className="food-card" key={index}>
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
                      {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
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
              Inventory is stored in memory for this
              development preview.
            </p>
          </>
        )}
      </main>

      <nav className="bottom-nav" aria-label="App sections">
        <button
          type="button"
          className={page === 'inventory' ? 'active-tab' : ''}
          onClick={() => setPage('inventory')}
          aria-current={page === 'inventory' ? 'page' : undefined}
        >
          Home
        </button>

        <button
          type="button"
          className={page === 'add' ? 'active-tab' : ''}
          onClick={() => setPage('add')}
          aria-current={page === 'add' ? 'page' : undefined}
        >
          Add
        </button>

        <span>Scan</span>
        <span>Soon</span>
      </nav>
    </div>
  )
}

export default App
