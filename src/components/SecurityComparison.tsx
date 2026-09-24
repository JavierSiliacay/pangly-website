// src/components/SecurityComparison.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, X, ServerOff } from 'lucide-react';

export const SecurityComparison: React.FC = () => {
  const comparisonData = [
    {
      feature: 'Cloud Storage & Server Breaches',
      pangly: 'Zero Cloud (100% on phone)',
      others: 'Stored on AWS / Google Cloud servers',
    },
    {
      feature: 'AI Intelligence Privacy',
      pangly: '100% On-Device (No API leaks)',
      others: 'Sent to OpenAI / Anthropic APIs',
    },
    {
      feature: 'Internet Connection Needed',
      pangly: 'Never (Works on Airplane Mode)',
      others: 'Requires active internet',
    },
    {
      feature: 'Philippine Documents OCR & Context',
      pangly: 'Built-in (PhilID, LTO, Senior ID)',
      others: 'Generic US formats only',
    },
    {
      feature: 'Monthly Subscription Cost',
      pangly: '₱0 Free (Open Early Access)',
      others: '₱200 - ₱600 / month',
    },
    {
      feature: 'Biometric Hardware Key Encryption',
      pangly: 'Android Keystore AES-256 GCM',
      others: 'Master password on company servers',
    }
  ];

  return (
    <section id="security" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#EDE7DE', border: '1px solid #DDD5C7', borderRadius: '999px', marginBottom: '16px' }}>
            <ServerOff size={16} color="#2D6A4F" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2D6A4F' }}>PRIVACY ARCHITECTURE</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#292524', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Why Cloud Vaults Put You At Risk.
          </h2>
          <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
            When a cloud password manager or photo storage company gets hacked, your family’s most sensitive IDs and passwords are exposed. Pangly mathematically removes that risk by having zero backend servers.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '900px', margin: '0 auto', background: '#FFFFFF', border: '1px solid #DDD5C7', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 36px rgba(41, 37, 36, 0.08)' }}
        >
          
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr', padding: '20px 24px', background: '#F5F1EB', borderBottom: '1px solid #DDD5C7' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#57534E', textTransform: 'uppercase' }}>Feature Matrix</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '22px', position: 'relative' }}>
                <Image src="/images/icon.png" sizes="22px" alt="Pangly" fill style={{ objectFit: 'contain' }} />
              </div>
              Pangly (Offline)
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#57534E' }}>Cloud Vaults & Notes</div>
          </div>

          {/* Table Rows with Hover Highlight */}
          {comparisonData.map((row, index) => (
            <motion.div 
              key={index} 
              whileHover={{ backgroundColor: 'rgba(45, 106, 79, 0.04)' }}
              transition={{ duration: 0.2 }}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1.5fr 1.5fr', 
                padding: '18px 24px', 
                borderBottom: index < comparisonData.length - 1 ? '1px solid #EAE4D9' : 'none',
                background: index % 2 === 0 ? '#FFFFFF' : '#FAFAF8',
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#292524' }}>{row.feature}</div>
              
              {/* Pangly Column */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2D6A4F', fontSize: '0.85rem', fontWeight: 800 }}>
                <Check size={18} />
                <span>{row.pangly}</span>
              </div>

              {/* Cloud Column */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#BE123C', fontSize: '0.85rem', fontWeight: 600 }}>
                <X size={18} />
                <span style={{ color: '#57534E' }}>{row.others}</span>
              </div>
            </motion.div>
          ))}

        </motion.div>

      </div>
    </section>
  );
};
