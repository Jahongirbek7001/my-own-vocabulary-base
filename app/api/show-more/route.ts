import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wordid = searchParams.get('wordId');

  if (!wordid) {
    return NextResponse.json({ error: 'wordId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('vocabdata')
    .select('wordeng')
    .eq('wordid', wordid)
    .single();

  if (error) {
    console.error('Supabase error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch word' }, { status: 500 });
  }

  return NextResponse.json(data);
}
