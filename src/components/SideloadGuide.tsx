// src/components/SideloadGuide.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2 } from 'lucide-react';

export const SideloadGuide: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Download the APK',
      desc: 'Tap the Download button above to save Pangly_v1.3.20.apk (226 MB) directly to your Android device.',
      badge: 'Direct Mirror'
    },
    {
      num: '02',
      title: 'Tap "Download Anyway"',
      desc: 'Android will show a default alert: "File might be harmful". This appears for all direct APK installs outside Google Play. Tap "Download anyway".',
      badge: 'Normal Android Alert'
    },
    {
      num: '03',
      title: 'Open & Install',
      desc: 'Tap the downloaded file from your browser notification or Downloads folder. If prompted, toggle "Allow from this source", then tap Install.',
      badge: 'Ready to Run'
    }
  ];

  return (
    <section id="install-guide" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#EDE7DE', border: '1px solid #DDD5C7', borderRadius: '999px', marginBottom: '16px' }}>
            <Download size={16} color="#2D6A4F" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2D6A4F' }}>EASY INSTALLATION GUIDE</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#292524', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            How to Install Pangly on Android.
          </h2>
          <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Installing an APK directly is fast and simple. Follow these 3 easy steps to get started in less than two minutes.
          </p>
        </motion.div>

        {/* 3 Step Cards with Hover Spring */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {steps.map((s, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -6, boxShadow: '0 20px 35px rgba(41, 37, 36, 0.1)' }}
              className="card-white" 
              style={{ 
                padding: '32px 24px', 
                borderRadius: '20px', 
                border: '1px solid #DDD5C7', 
                background: '#FFFFFF',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(41, 37, 36, 0.05)',
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#2D6A4F', opacity: 0.7 }}>{s.num}</span>
                <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(45, 106, 79, 0.1)', color: '#2D6A4F', borderRadius: '6px', fontWeight: 800 }}>
                  {s.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#292524', marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#57534E', lineHeight: 1.6, fontWeight: 500 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Reassurance Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ maxWidth: '800px', margin: '36px auto 0 auto', padding: '16px 20px', background: 'rgba(45, 106, 79, 0.08)', border: '1px solid rgba(45, 106, 79, 0.25)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <CheckCircle2 size={24} color="#2D6A4F" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.88rem', color: '#292524', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
            <strong>100% Virus-Free & Safe:</strong> Pangly is compiled directly from the open React Native codebase. It requests only essential camera & biometric permissions.
          </p>
        </motion.div>

      </div>
    </section>
  );
};
