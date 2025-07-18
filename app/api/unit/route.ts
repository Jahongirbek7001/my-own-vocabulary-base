import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    const modulId = req.nextUrl.searchParams.get('modulId')

    let query = supabase.from('unit').select('*').order('unitid', { ascending: true })

    if (modulId) {
      query = query.eq('modulid', modulId)
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return new NextResponse('Server Error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { unitname, modulid } = await req.json()

  try {
    const { data, error } = await supabase
      .from('unit')
      .insert([{ unitname, modulid }])
      .select()
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Serverdagi xato:', error)
    return new NextResponse(JSON.stringify({ error: 'Server Error' }), { status: 500 })
  }
}
