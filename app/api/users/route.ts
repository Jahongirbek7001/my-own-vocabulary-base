import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true }) // yoki kerakli ustun bo'yicha

    if (error) {
      console.error('GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Xatolik:', error)
    return new NextResponse('Server Error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, username, email, password } = await req.json()

    const { data, error } = await supabase
      .from('users')
      .insert([{ userId, username, email, password }])
      .select()
      .single()

    if (error) {
      console.error('POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Serverdagi xato:', error)
    return new NextResponse(JSON.stringify({ error: 'Server Error' }), { status: 500 })
  }
}
