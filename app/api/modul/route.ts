import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM modul');
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return new NextResponse('Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { modulName, modulId } = await req.json();

  try {
    const client = await pool.connect();

    const query = `
      INSERT INTO modul (modulId, modulName)
      VALUES ( ${modulId}, '${modulName}') RETURNING *;
    `;

    const result = await client.query(query);
    client.release();

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Serverdagi xato:', error);

    return new NextResponse(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}