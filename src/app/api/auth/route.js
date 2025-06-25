import { cookies } from 'next/headers';

export async function POST(request) {
  const { token } = await request.json();
  const expires = new Date(Date.now() + 10 * 1000); // 10s session

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 });
  }

  await cookies().set('session', token, {
    expires,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  return new Response(JSON.stringify({ success: true }));
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('refresh');

  return new Response(JSON.stringify({ success: true }));
}

export async function GET() {
  const session = await cookies().get('session');
  return new Response(JSON.stringify({ authenticated: !!session }));
}
