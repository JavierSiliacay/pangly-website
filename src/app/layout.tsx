// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pangly.vercel.app';

export const viewport: Viewport = {
  themeColor: '#1B4332',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pangly | Store it. Ask it. Own it. | 100% Private Offline AI Vault',
    template: '%s | Pangly',
  },
  description:
    'The 100% private offline AI vault for Philippine IDs, family documents, vehicle maintenance, and passwords. Powered by on-device private AI. Zero cloud servers. Zero data collection.',
  applicationName: 'Pangly',
  authors: [{ name: 'Javier Siliacay', url: 'https://github.com/JavierSiliacay' }],
  generator: 'Next.js',
  keywords: [
    'Pangly',
    'Pangly AI',
    'Offline AI Vault',
    'Philippine Documents Vault',
    'PhilID digital storage',
    'Philippine National ID offline',
    'Driver License digital organizer',
    'Private Document Scanner Philippines',
    'Offline Password Manager Android',
    'Zero Cloud Vault',
    'On-Device AI Philippines',
    'Local AI Assistant Android',
    'Javier Siliacay',
    'Pangly APK download',
  ],
  creator: 'Javier Siliacay',
  publisher: 'Pangly',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Pangly | Store it. Ask it. Own it. | 100% Private Offline AI Vault',
    description:
      'The 100% private offline AI vault for Philippine IDs, family documents, vehicle maintenance, and passwords. Powered by on-device private AI with zero cloud servers.',
    url: siteUrl,
    siteName: 'Pangly',
    images: [
      {
        url: '/images/pangly_facebook_cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Pangly - 100% Private Offline AI Vault',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pangly | Store it. Ask it. Own it. | 100% Private Offline AI Vault',
    description:
      '100% Private Offline AI Vault for Philippine documents, IDs, and passwords. Zero cloud servers.',
    images: ['/images/pangly_facebook_cover.jpg'],
    creator: '@javiersiliacay',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

const jsonLdSoftwareApp = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'Pangly',
  operatingSystem: 'Android 8.0 and up',
  applicationCategory: 'SecurityApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PHP',
  },
  description:
    '100% private offline AI vault for Philippine IDs, family documents, vehicle maintenance, and passwords. Powered by on-device private AI with zero cloud servers.',
  softwareVersion: '1.3.20',
  fileSize: '226MB',
  downloadUrl: `${siteUrl}/api/download`,
  author: {
    '@type': 'Person',
    name: 'Javier Siliacay',
    url: 'https://github.com/JavierSiliacay',
  },
  image: `${siteUrl}/images/pangly_facebook_cover.jpg`,
  screenshot: `${siteUrl}/images/pangly_phone_ad.jpg`,
};

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much storage space does Pangly need on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The direct APK download is 226 MB. Once installed, Pangly occupies ~398 MB of internal storage because it bundles the complete native neural network and on-device AI runtime with zero cloud dependencies. After installation is complete, you can safely delete the downloaded .apk installer file to free up space.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can anyone else—including Pangly’s developers—see my files?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. Pangly has zero backend servers, zero databases, and zero analytics telemetry. All documents, images, and passwords are encrypted using AES-256 GCM using keys stored exclusively in your smartphone's hardware biometric Keystore. If our website disappeared tomorrow, your app would continue functioning identically.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the 100 Early Access slot limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To ensure direct, high-touch support and feedback collection during the v1.3.20 release pilot, we limit new slot issuance to 100 early testers. Once you claim a slot, your device keeps its slot token permanently, allowing you to re-download or update without losing access.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I lose or switch my Android phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pangly includes an encrypted Backup & Export feature in Settings. You can export an AES-256 encrypted archive to a USB flash drive or your SD card, protected by your custom Master Recovery Key. When you get a new phone, simply import the file and enter your key.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which Android phones are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pangly supports any Android smartphone running Android 8.0 (Oreo) or higher with an ARM64 processor and at least 3GB of RAM. Flagship and mid-range devices from Samsung, Xiaomi, Transsion (Infinix/Tecno), Vivo, Realme, and Google Pixel run the offline engine with exceptional speed.',
      },
    },
  ],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Pangly',
  url: siteUrl,
  description: '100% Private Offline AI Vault for Philippine Documents and Passwords.',
  publisher: {
    '@type': 'Person',
    name: 'Javier Siliacay',
  },
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
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
