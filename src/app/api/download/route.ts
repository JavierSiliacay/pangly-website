// src/app/api/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { claimSlot } from '@/lib/slotStorage';

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
  const userAgent = req.headers.get('user-agent') || undefined;

  // Claim or verify slot against Neon DB
  const result = await claimSlot(token, ip, userAgent);

  const downloadUrl =
    process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL ||
    'https://github.com/JavierSiliacay/pangly-website/releases/download/v1.3.20/Pangly-v1.3.20.apk';

  if (!result.success && result.isFull) {
    // Quota reached, redirect back to homepage with modal trigger
    const siteUrl = req.nextUrl.origin || '';
    return NextResponse.redirect(`${siteUrl}/?quota_full=true#download-section`, { status: 307 });
  }

  const response = NextResponse.redirect(downloadUrl, { status: 302 });

  if (result.token) {
    response.cookies.set('pangly_slot_token', result.token, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }

  return response;
}
