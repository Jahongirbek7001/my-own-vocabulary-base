import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const unitid = searchParams.get('unitid')
  const modulid = searchParams.get('modulid')

  try {
    if (!unitid || !modulid) {
      return NextResponse.json({ error: 'unitid yoki modulid yo‘q' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('vocabdata')
      .select('*, unit!inner(modulid)')
      .eq('unitid', unitid)
      .eq('unit.modulid', modulid)

    if (error) {
      console.error('GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return new NextResponse('Server Error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { wordeng, worduzb, unitid } = await req.json()

  try {
    const { data, error } = await supabase
      .from('vocabdata')
      .insert([{ wordeng, worduzb, unitid }])
      .select()
      .single()

    if (error) {
      console.error('POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('POST catch error:', error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { wordid } = await req.json()

  if (!wordid) {
    return NextResponse.json({ error: 'wordid yetishmayapti' }, { status: 400 })
  }

  try {
    const { error, count } = await supabase
      .from('vocabdata')
      .delete()
      .eq('wordid', wordid)
      .select()
      .single()

    if (error) {
      console.error('DELETE error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    console.error('DELETE catch error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
