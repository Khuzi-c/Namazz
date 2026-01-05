import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // Clear guest mode cookie
    const cookieStore = await cookies()
    cookieStore.delete('guest-mode')

    return redirect('/login')
}

export async function GET(request: Request) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // Clear guest mode cookie
    const cookieStore = await cookies()
    cookieStore.delete('guest-mode')

    return redirect('/login')
}
