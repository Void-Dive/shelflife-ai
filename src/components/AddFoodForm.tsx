
import { useState, type FormEvent } from 'react'
import {
  foodItemSchema,
  type FoodItemInput,
} from '../models/foodItem'

type Props = {
  onSave: (item: FoodItemInput) => void
  onCancel: () => void
}

type FieldErrors = Partial<
  Record<keyof FoodItemInput, string>
>

const initialValues: FoodItemInput = {
  name: '',
  storageLocation: 'Fridge',
  dateKind: 'Best by',
  recordedDate: '',
  quantity: 1,
}

export default function AddFoodForm({
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState<FoodItemInput>(
    initialValues
  )
  const [errors, setErrors] = useState<FieldErrors>({})

  function update<K extends keyof FoodItemInput>(
    field: K,
    value: FoodItemInput[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = foodItemSchema.safeParse(form)

    if (!result.success) {
      const nextErrors: FieldErrors = {}

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FoodItemInput

        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message
        }
      }

      setErrors(nextErrors)
      return
    }

    setErrors({})
    onSave(result.data)
  }

  return (
    <form
      className="add-food-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2>Enter item details</h2>

      <label htmlFor="food-name">Food name *</label>
      <input
        id="food-name"
        value={form.name}
        onChange={(event) =>
          update('name', event.target.value)
        }
        aria-invalid={Boolean(errors.name)}
      />
      {errors.name && (
        <p className="field-error" role="alert">
          {errors.name}
        </p>
      )}

      <label htmlFor="storage-location">
        Storage location
      </label>
      <select
        id="storage-location"
        value={form.storageLocation ?? 'Fridge'}
        onChange={(event) =>
          update(
            'storageLocation',
            event.target.value as
              FoodItemInput['storageLocation']
          )
        }
      >
        <option value="Fridge">Fridge</option>
        <option value="Freezer">Freezer</option>
        <option value="Pantry">Pantry</option>
      </select>

      <label htmlFor="date-kind">Date type *</label>
      <select
        id="date-kind"
        value={form.dateKind}
        onChange={(event) =>
          update(
            'dateKind',
            event.target.value as FoodItemInput['dateKind']
          )
        }
      >
        <option value="Expiration">Expiration</option>
        <option value="Best by">Best by</option>
        <option value="Use by">Use by</option>
        <option value="Unknown">Unknown</option>
      </select>

      <label htmlFor="recorded-date">
        Recorded date *
      </label>
      <input
        id="recorded-date"
        type="date"
        value={form.recordedDate}
        onChange={(event) =>
          update('recordedDate', event.target.value)
        }
        aria-invalid={Boolean(errors.recordedDate)}
      />
      {errors.recordedDate && (
        <p className="field-error" role="alert">
          {errors.recordedDate}
        </p>
      )}

      <label htmlFor="quantity">Quantity *</label>
      <input
        id="quantity"
        type="number"
        min="1"
        step="1"
        value={form.quantity}
        onChange={(event) =>
          update('quantity', Number(event.target.value))
        }
        aria-invalid={Boolean(errors.quantity)}
      />
      {errors.quantity && (
        <p className="field-error" role="alert">
          {errors.quantity}
        </p>
      )}

      <button className="primary-button" type="submit">
        Save item
      </button>

      <button
        className="cancel-button"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  )
}
