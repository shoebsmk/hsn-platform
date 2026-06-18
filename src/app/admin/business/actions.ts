'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function updateBusinessStatus(id: string, status: 'active' | 'rejected') {
  const supabase = createAdminClient()
  await supabase.from('businesses').update({ status }).eq('id', id)
  revalidatePath('/admin/business')
  revalidatePath('/business')
}

export async function toggleVerified(id: string, is_verified: boolean) {
  const supabase = createAdminClient()
  await supabase.from('businesses').update({ is_verified }).eq('id', id)
  revalidatePath('/admin/business')
  revalidatePath('/business')
}
