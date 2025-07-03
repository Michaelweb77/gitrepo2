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

// BEZ BLOKADY CORS ALE POZNIJE ZMIEŃ NA KONKRETNĄ DOMENE 
export async function GET(
  req: Request,
  context: { params: { filename: string[] } }
) {
  const filePath = context.params.filename.join('/');

  const { data, error } = await supabase
    .storage
    .from('your-bucket-name') // <- zamień na swoją nazwę bucketa
    .download(filePath);

  if (error || !data) {
    return new NextResponse(
      JSON.stringify({ error: 'Nie znaleziono pliku JSON' }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // <-- TO DODAJ
        }
      }
    );
  }

  const fileContent = await data.text();

  return new NextResponse(fileContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // <-- TO DODAJ
    }
  });
}