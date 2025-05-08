import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wordId = searchParams.get('wordId');

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT wordEng from vocabData WHERE wordID = ${wordId}`
    );
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return new NextResponse('Server Error', { status: 500 });
  }
}