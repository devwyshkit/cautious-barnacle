'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAddresses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return { error: 'Failed to fetch addresses' }

  return { addresses: addresses || [] }
}

export async function createAddress(payload: {
  type: string
  name: string
  phone: string
  address_line1: string
  address_line2?: string | null
  city: string
  state: string
  pincode: string
  country?: string
  latitude?: number | null
  longitude?: number | null
  is_default?: boolean
  gstin?: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (payload.is_default) {
    await supabase.from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data: address, error } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      type: payload.type,
      name: payload.name,
      phone: payload.phone,
      address_line1: payload.address_line1,
      address_line2: payload.address_line2 || null,
      city: payload.city,
      state: payload.state,
      pincode: payload.pincode,
      country: payload.country || 'India',
      latitude: payload.latitude,
      longitude: payload.longitude,
      is_default: payload.is_default || false,
      gstin: payload.gstin || null,
    })
    .select('id, type, name, phone, address_line1, address_line2, city, state, pincode, country, is_default, latitude, longitude, gstin')
    .single()

  if (error) return { error: 'Failed to create address' }

  revalidatePath('/checkout')
  revalidatePath('/profile')
  return { address }
}

export async function updateAddress(
  addressId: string,
  payload: Partial<{
    type: string
    name: string
    phone: string
    address_line1: string
    address_line2: string | null
    city: string
    state: string
    pincode: string
    country: string
    latitude: number | null
    longitude: number | null
    is_default: boolean
    gstin: string | null
  }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (payload.is_default) {
    await supabase.from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data, error } = await supabase.from('addresses')
    .update(payload)
    .eq('id', addressId)
    .eq('user_id', user.id)
    .select('id')
    .single()

  if (error) return { error: 'Failed to update address' }
  revalidatePath('/checkout')
  revalidatePath('/profile')
  return { address: data }
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', user.id)

  if (error) return { error: 'Failed to delete address' }

  revalidatePath('/checkout')
  revalidatePath('/profile')
  return { success: true }
}

export const getUserAddresses = getAddresses

export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  await supabase.from('addresses')
    .update({ is_default: false })
    .eq('user_id', user.id)

  const { error } = await supabase.from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', user.id)

  if (error) return { error: 'Failed to set default address' }

  revalidatePath('/checkout')
  revalidatePath('/profile')
  return { success: true }
}
