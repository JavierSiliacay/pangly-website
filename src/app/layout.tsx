// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://pangly.vercel.app'),
  title: 'Pangly | Store it. Ask it. Own it. | 100% Private Offline AI Vault',
  description: 'The 100% private offline AI vault for Philippine IDs, family documents, vehicle maintenance, and passwords. Powered by 100% on-device private AI. Zero cloud servers.',
  keywords: ['Pangly', 'Offline AI Vault', 'Philippine Documents', 'PhilID', 'Driver License', 'Zero Cloud', 'Pangly On-Device AI', 'Javier Siliacay', 'Android APK'],
  authors: [{ name: 'Javier Siliacay' }],
  openGraph: {
    title: 'Pangly | Store it. Ask it. Own it.',
    description: 'The 100% private offline AI vault for Philippine IDs, family documents, vehicle maintenance, and passwords.',
    url: 'https://pangly.vercel.app',
    siteName: 'Pangly Official',
    images: [
      {
        url: '/images/pangly_facebook_cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Pangly Offline AI Vault'
      }
    ],
    locale: 'en_PH',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pangly | Store it. Ask it. Own it.',
    description: '100% Private Offline AI Vault for Philippine documents and passwords.',
    images: ['/images/pangly_facebook_cover.jpg']
  },
  icons: {
    icon: [
      { url: '/icon.png' },
      { url: '/favicon.ico' }
    ],
    apple: '/apple-icon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
