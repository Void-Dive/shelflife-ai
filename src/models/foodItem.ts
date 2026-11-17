
import { z } from 'zod'

// Ensure dates are real calendar dates, not just formatted correctly.
function isRealDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`)

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  )
}

export const foodItemSchema = z.object({
  name: z.string().trim().min(1, 'Food name is required').max(100),

  storageLocation: z.enum([
    'Fridge',
    'Freezer',
    'Pantry',
  ]).optional(),

  dateKind: z.enum([
    'Expiration',
    'Best by',
    'Use by',
    'Unknown',
  ]),

  recordedDate: z.iso.date().refine(isRealDate, {
    message: 'Enter a valid calendar date',
  }),

  quantity: z.number().int().positive(),
})

export type FoodItemInput = z.infer<typeof foodItemSchema>

// Additional fields for records stored under a user account.
export type FoodItemRecord = FoodItemInput & {
  id: string
  ownerId: string
  createdAt: string
  updatedAt: string
}
