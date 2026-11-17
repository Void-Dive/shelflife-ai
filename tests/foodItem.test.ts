/// <reference types="node" />
import test from 'node:test'
import assert from 'node:assert/strict'
import { foodItemSchema } from '../src/models/foodItem.ts'

const base = {
  name: 'Spinach',
  storageLocation: 'Fridge',
  dateKind: 'Use by',
  recordedDate: '2026-11-20',
  quantity: 1,
}

// Five valid food-item examples
const validCases = [
  { label: 'Spinach', input: base },
  { label: 'Milk', input: { ...base, name: 'Milk', dateKind: 'Best by' } },
  { label: 'Tomatoes', input: { ...base, name: 'Tomatoes', storageLocation: 'Pantry' } },
  { label: 'Frozen peas', input: { ...base, name: 'Frozen peas', storageLocation: 'Freezer' } },
  { label: 'Unknown date type', input: { ...base, name: 'Rice', dateKind: 'Unknown' } },
]

// Five invalid food-item examples
const invalidCases = [
  { label: 'Blank name', input: { ...base, name: '   ' } },
  { label: 'Impossible date', input: { ...base, recordedDate: '2026-02-30' } },
  { label: 'Zero quantity', input: { ...base, quantity: 0 } },
  { label: 'Fractional quantity', input: { ...base, quantity: 1.5 } },
  { label: 'Unsupported date type', input: { ...base, dateKind: 'Sell by' } },
]

for (const { label, input } of validCases) {
  test(`Accepts: ${label}`, () => {
    const result = foodItemSchema.safeParse(input)
    assert.equal(result.success, true)
  })
}

for (const { label, input } of invalidCases) {
  test(`Rejects: ${label}`, () => {
    const result = foodItemSchema.safeParse(input)
    assert.equal(result.success, false)
  })
}
