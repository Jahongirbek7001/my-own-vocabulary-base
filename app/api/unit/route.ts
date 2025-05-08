import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  try {
    const modulId = req.nextUrl.searchParams.get('modulId');

    const client = await pool.connect();

    let result;

    if (modulId) {
      result = await client.query('SELECT * FROM unit WHERE modulid = $1', [modulId]);
    } else {
      result = await client.query('SELECT * FROM unit');
    }

    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return new NextResponse('Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { unitName, modulId } = await req.json();

  try {
    const client = await pool.connect();

    const query = `
      INSERT INTO unit (unitName, modulId)
      VALUES ('${unitName}', ${modulId}) RETURNING *;
    `;

    const result = await client.query(query);
    client.release();

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Serverdagi xato:', error);

    return new NextResponse(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}