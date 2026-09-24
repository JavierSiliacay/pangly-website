// src/app/api/slots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSlotStatus, claimSlot } from '@/lib/slotStorage';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('pangly_slot_token')?.value || req.headers.get('x-slot-token');
  const ip = getClientIp(req);

  const status = getSlotStatus(token, ip);
  return NextResponse.json(status);
}

export async function POST(req: NextRequest) {
  let bodyToken: string | undefined;
  try {
    const body = await req.json();
    bodyToken = body?.token;
  } catch {
    // Body is optional
  }

  const cookieToken = req.cookies.get('pangly_slot_token')?.value;
  const headerToken = req.headers.get('x-slot-token');
  const token = bodyToken || cookieToken || headerToken;
  const ip = getClientIp(req);
  const userAgent = req.headers.get('user-agent') || undefined;

  const result = claimSlot(token, ip, userAgent);

  const res = NextResponse.json(result);

  // Set long-lived cookie if token was issued/confirmed
  if (result.token) {
    res.cookies.set('pangly_slot_token', result.token, {
      path: '/',
      httpOnly: false, // Accessible to client script to sync with localStorage
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }

  return res;
}
