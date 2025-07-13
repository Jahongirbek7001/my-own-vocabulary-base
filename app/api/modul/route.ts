import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // const userid = '0b93b786-874a-4529-ae6b-0fd72f7c198a'
    const userid = 'e35cfbd3-3e49-41aa-9189-e3b5e3e7aa46'
    const { data, error } = await supabase
      .from('modul')
      .select('*')
      .eq('userid', userid)

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Catch error:', error);
    return new NextResponse('Server Error', { status: 500 });
  }
}



export async function POST(req: NextRequest) {
  const { modulname } = await req.json()

  try {
    const userid = 'e35cfbd3-3e49-41aa-9189-e3b5e3e7aa46'

    const { data, error } = await supabase
      .from('modul')
      .insert([{ modulname, userid }])
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
