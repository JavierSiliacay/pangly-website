// src/app/api/reset-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const siteUrl = req.nextUrl.origin || 'http://localhost:3000';
  const response = NextResponse.redirect(siteUrl, { status: 302 });

  // Delete slot cookie
  response.cookies.delete('pangly_slot_token');

  // Browser standard header to wipe cookies, localStorage, and cache in 1 step!
  response.headers.set('Clear-Site-Data', '"cookies", "storage"');

  return response;
}
