import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pangly | 100% Private Offline AI Vault',
    short_name: 'Pangly',
    description: 'The 100% private offline AI vault for Philippine IDs, family documents, vehicle maintenance, and passwords.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F1EB',
    theme_color: '#1B4332',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
