
import { supabase } from './supabase'
import type {
  FoodItemInput,
  FoodItemRecord,
} from '../models/foodItem'

type FoodItemRow = {
  id: string
  user_id: string
  name: string
  storage_location: FoodItemInput['storageLocation'] | null
  date_kind: FoodItemInput['dateKind']
  recorded_date: string
  quantity: number
  created_at: string
  updated_at: string
}

function toFoodItem(row: FoodItemRow): FoodItemRecord {
  return {
    id: row.id,
    ownerId: row.user_id,
    name: row.name,
    storageLocation: row.storage_location ?? undefined,
    dateKind: row.date_kind,
    recordedDate: row.recorded_date,
    quantity: row.quantity,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function loadFoodItems(): Promise<FoodItemRecord[]> {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Could not load inventory: ${error.message}`)
  }

  return (data as FoodItemRow[]).map(toFoodItem)
}

export async function saveFoodItem(
  item: FoodItemInput
): Promise<void> {
  const { error } = await supabase
    .from('food_items')
    .insert({
      name: item.name,
      storage_location: item.storageLocation ?? null,
      date_kind: item.dateKind,
      recorded_date: item.recordedDate,
      quantity: item.quantity,
    })

  if (error) {
    throw new Error(`Could not save food: ${error.message}`)
  }
}


export async function updateFoodItem(
  id: string,
  item: FoodItemInput
): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Please sign in again to edit food.')
  }

  const { data, error } = await supabase
    .from('food_items')
    .update({
      name: item.name,
      storage_location: item.storageLocation ?? null,
      date_kind: item.dateKind,
      recorded_date: item.recordedDate,
      quantity: item.quantity,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle()

  if (error) {
    throw new Error(`Could not update food: ${error.message}`)
  }

  if (!data) {
    throw new Error(
      'Food item not found or you do not have permission to edit it.'
    )
  }
}
