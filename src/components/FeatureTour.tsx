// src/components/FeatureTour.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileCheck, Cpu, KeyRound, BellRing } from 'lucide-react';

interface FeatureTab {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
  highlights: string[];
  imageSrc: string;
}

const TABS: FeatureTab[] = [
  {
    id: 'ph-vault',
    title: 'Philippine Documents',
    badge: 'Tailored for PH',
    icon: <FileCheck size={20} color="#2D6A4F" />,
    headline: 'Store PhilID, Passports, Senior IDs, and LTO Licenses with Auto-OCR',
    description: 'Tired of digging through photo galleries when transacting with government agencies or banks? Pangly categorizes your Philippine IDs, reads numbers automatically on-device with zero server uploads, and enables instant 1-tap sharing.',
    highlights: [
      'PhilID (National ID), Driver’s License, Passport, PRC, SSS, PhilHealth, UMID',
      'Senior Citizen & PWD booklets with dosage schedules',
      'LTO OR/CR Vehicle Registrations & Insurance Policies',
      'Pinch-to-zoom high-res inspection with local AES-256 storage'
    ],
    imageSrc: '/images/pangly_phone_ad.jpg'
  },
  {
    id: 'offline-ai',
    title: 'On-Device AI Engine',
    badge: 'Local Neural Brain',
    icon: <Cpu size={20} color="#2D6A4F" />,
    headline: 'An Intelligent Offline Assistant That Actually Knows Your Documents',
    description: 'Ask questions in natural language. Powered by the on-device local neural network running straight on your phone’s processor. No subscription, no API tokens, no telemetry.',
    highlights: [
      'Smart Context Builder extracts relevant dates, plate numbers, and IDs',
      'Full 6-turn multi-turn conversation memory',
      'Operates seamlessly on airplane mode or during typhoon brownouts',
      'Zero prompts sent to external cloud servers'
    ],
    imageSrc: '/images/pangly_hero_phone_leaning.png'
  },
  {
    id: 'zero-cloud',
    title: 'Zero-Cloud Passwords',
    badge: 'Biometric Keystore',
    icon: <KeyRound size={20} color="#2D6A4F" />,
    headline: 'Eliminate Password Managers That Store Your Secrets in the Cloud',
    description: 'Major password managers store your encrypted master file on public cloud servers—leaving you vulnerable to corporate breaches. Pangly locks everything inside your Android Hardware Keystore.',
    highlights: [
      'Biometric Fingerprint & Face Unlock integration',
      'Offline Master Recovery Key generation',
      'Encrypted JSON backup & restore without cloud dependency',
      'Wi-Fi passwords, bank pins, web credentials in one safe place'
    ],
    imageSrc: '/images/pangly_facebook_cover.jpg'
  },
  {
    id: 'alarms',
    title: 'Expiry & Vehicle Alarms',
    badge: 'Proactive Reminders',
    icon: <BellRing size={20} color="#2D6A4F" />,
    headline: 'Never Incur Late Penalties for LTO Renewals or Passport Expirations',
    description: 'Pangly automatically computes expiration dates from your stored IDs and vehicle OR/CR. It schedules persistent system alarms 60, 30, and 7 days before you incur heavy late fees.',
    highlights: [
      'LTO Vehicle Registration renewal alarm based on plate ending number',
      'Passport & Driver’s License renewal alerts',
      'Periodic vehicle maintenance (Oil change, brake pad inspection)',
      'Medicine prescription refills for senior family members'
    ],
    imageSrc: '/images/pangly_phone_ad_banner.jpg'
  }
];

export const FeatureTour: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeatureTab>(TABS[0]);

  return (
    <section id="features" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#EDE7DE', border: '1px solid #DDD5C7', borderRadius: '999px', marginBottom: '16px' }}>
            <Shield size={16} color="#2D6A4F" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2D6A4F' }}>CORE CAPABILITIES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#292524', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Designed for Real Life in the Philippines.
          </h2>
          <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Every feature was engineered to solve the real daily headaches of Filipino families, car owners, and privacy-conscious professionals.
          </p>
        </motion.div>

        {/* Tab Navigation with Animated Gliding Pill */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {TABS.map((tab) => {
            const active = tab.id === activeTab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: active ? '1px solid #2D6A4F' : '1px solid #DDD5C7',
                  background: active ? '#2D6A4F' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#57534E',
                  boxShadow: active ? '0 8px 20px rgba(45, 106, 79, 0.25)' : '0 2px 6px rgba(41, 37, 36, 0.05)',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                <span>{tab.title}</span>
                <span style={{ fontSize: '0.68rem', padding: '2px 7px', background: active ? 'rgba(255, 255, 255, 0.25)' : '#EDE7DE', borderRadius: '6px', color: active ? '#FFFFFF' : '#2D6A4F', fontWeight: 800 }}>
                  {tab.badge}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Tab Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="card-white" 
            style={{ padding: '40px', border: '1px solid #DDD5C7', borderRadius: '28px', boxShadow: '0 20px 40px rgba(41, 37, 36, 0.08)' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
              
              {/* Left Content */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(45, 106, 79, 0.1)', borderRadius: '8px', color: '#2D6A4F', fontSize: '0.78rem', fontWeight: 800, marginBottom: '16px' }}>
                  {activeTab.badge}
                </div>

                <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#292524', lineHeight: 1.2, marginBottom: '16px' }}>
                  {activeTab.headline}
                </h3>

                <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px', fontWeight: 500 }}>
                  {activeTab.description}
                </p>

                {/* Highlights Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeTab.highlights.map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                    >
                      <div style={{ marginTop: '3px', color: '#2D6A4F' }}>
                        <FileCheck size={18} />
                      </div>
                      <span style={{ fontSize: '0.92rem', color: '#292524', fontWeight: 600 }}>{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Media Graphic */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid #DDD5C7', boxShadow: '0 16px 32px rgba(41, 37, 36, 0.1)', maxHeight: '440px' }}
              >
                <Image 
                  src={activeTab.imageSrc} 
                  alt={activeTab.title} 
                  width={600} 
                  height={450} 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                />
              </motion.div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
