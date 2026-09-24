// src/app/api/download/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const downloadUrl = process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL || 'https://github.com/JavierSiliacay/pangly-website/releases/download/v1.3.20/Pangly_v1.3.20.apk';
  return NextResponse.redirect(downloadUrl, { status: 302 });
}

