import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
// Bloka CORS
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ filename: string[] }> }
// ) {
//   const { filename } = await context.params;
//   const filePath = filename.join('/');

//   const { data, error } = await supabase
//     .storage
//     .from(process.env.SUPABASE_BUCKET!)
//     .download(filePath);

//   if (error || !data) {
//     return NextResponse.json({ error: 'File not found' }, { status: 404 });
//   }

//   try {
//     const text = await data.text();
//     const json = JSON.parse(text);
//     return NextResponse.json(json);
//   } catch {
//     return NextResponse.json({ error: 'Invalid JSON format' }, { status: 500 });
//   }
// }

//=============================================================
// BEZ BLOKADY CORS ALE POZNIJE ZMIEŃ NA KONKRETNĄ DOMENE 
//=============================================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string[] }> } // <- WAŻNE w Next 15!
) {
  const { filename } = await context.params;
  const filePath = filename.join('/');

  const { data, error } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET!) // upewnij się, że masz ENV ustawione
    .download(filePath);

  if (error || !data) {
    return NextResponse.json(
      { error: 'File not found' },
      {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*', // ← albo konkretny domain
        },
      }
    );
  }

  try {
    const text = await data.text();
    const json = JSON.parse(text);

    return NextResponse.json(json, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // ← TO JEST KLUCZOWE
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON format' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}