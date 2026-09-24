// src/components/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ borderTop: '1px solid #DDD5C7', background: '#EDE7DE', padding: '60px 0 40px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', overflow: 'hidden', position: 'relative', border: '1px solid #DDD5C7' }}>
                <Image src="/images/icon.png" sizes="38px" alt="Pangly Logo" fill style={{ objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#292524' }}>PANGLY</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.6, maxWidth: '320px', fontWeight: 500 }}>
              The 100% private, offline AI document and password vault. Zero cloud servers. Your personal data stays in your hands forever.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#292524', marginBottom: '16px' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', fontWeight: 600 }}>
              <Link href="#features" style={{ color: '#57534E', textDecoration: 'none' }}>Core Features</Link>
              <Link href="#interactive-demo" style={{ color: '#57534E', textDecoration: 'none' }}>Live Demo Simulator</Link>
              <Link href="#security" style={{ color: '#57534E', textDecoration: 'none' }}>Security Matrix</Link>
              <Link href="#install-guide" style={{ color: '#57534E', textDecoration: 'none' }}>Installation Guide</Link>
              <Link href="#faq" style={{ color: '#57534E', textDecoration: 'none' }}>Frequently Asked Questions</Link>
            </div>
          </div>

          {/* Official Community */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#292524', marginBottom: '16px' }}>Community & Creator</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <a 
                href="https://facebook.com/Pangly" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  color: '#2D6A4F', 
                  textDecoration: 'none', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontWeight: 700 
                }}
              >
                {/* Official Facebook Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" style={{ flexShrink: 0 }}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Official Facebook Page</span>
                <ExternalLink size={14} />
              </a>
              <span style={{ color: '#57534E', fontWeight: 500 }}>Designed & Engineered with ❤️ by <strong>Javier Siliacay</strong></span>
              <span style={{ color: '#8C857B', fontSize: '0.82rem', fontWeight: 600 }}>Cagayan De Oro City, Misamis Oriental, Philippines 🇵🇭</span>
            </div>
          </div>

          {/* Download Direct */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#292524', marginBottom: '16px' }}>Get Pangly</h4>
            <a href="/api/download" download className="btn-primary" style={{ padding: '12px 20px', fontSize: '0.88rem' }}>
              <Download size={16} />
              <span>Direct APK (v1.3.20)</span>
            </a>
            <p style={{ fontSize: '0.75rem', color: '#57534E', marginTop: '10px', fontWeight: 600 }}>
              SHA-256 verified package • 226 MB
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #DDD5C7', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#57534E', fontWeight: 500 }}>
          <div>© {new Date().getFullYear()} Pangly. All rights reserved. Open early access build.</div>
          <div style={{ display: 'flex', gap: '16px', fontWeight: 600 }}>
            <span>Zero Tracking</span>
            <span>Zero Cookies</span>
            <span>Zero Analytics</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
