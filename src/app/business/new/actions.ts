'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitBusiness(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const payload = {
    name:         formData.get('name') as string,
    description:  formData.get('description') as string,
    category:     formData.get('category') as string,
    location:     formData.get('location') as string,
    address:      formData.get('address') as string || null,
    phone:        formData.get('phone') as string || null,
    website:      formData.get('website') as string || null,
    submitted_by: user.id,
    status:       'active',
    is_verified:  false,
  }

  const { error } = await supabase.from('businesses').insert(payload)
  if (error) throw new Error(error.message)

  redirect('/business')
}
