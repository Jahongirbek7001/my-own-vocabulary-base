import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const unitId = searchParams.get('unitId');
  const modulId = searchParams.get('modulId');

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT v.* FROM vocabData v 
      JOIN unit u ON v.unitId = u.unitId
      WHERE v.unitId = ${unitId}
      AND u.modulId = ${modulId};`
    );
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return new NextResponse('Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { wordEng, wordUzb, unitId } = await req.json();

  try {
    const client = await pool.connect();

    const query = `
      INSERT INTO vocabData ( wordEng, wordUzb, unitId)
      VALUES ('${wordEng}', '${wordUzb}', ${unitId}) RETURNING *;
    `;

    const result = await client.query(query);
    client.release();

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Serverdagi xato:', error);

    return new NextResponse(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { wordid } = await req.json();

    if (!wordid) {
      return new Response(JSON.stringify({ error: 'Missing wordid' }), {
        status: 400,
      });
    }

    const client = await pool.connect();
    const result = await client.query('DELETE FROM vocabData WHERE wordId = $1', [wordid]);
    client.release();

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'No word found to delete' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: 'Deleted successfully' }), {
      status: 200,
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete' }), {
      status: 500,
    });
  }
}