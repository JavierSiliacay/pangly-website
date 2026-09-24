// src/components/Hero.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, Cpu, Lock, CheckCircle2, AlertCircle, ArrowDown } from 'lucide-react';

interface HeroProps {
  initialSlots?: number;
}

export const Hero: React.FC<HeroProps> = ({ initialSlots = 0 }) => {
  const [claimedSlots, setClaimedSlots] = useState(initialSlots);
  const [mySlot, setMySlot] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    // 1. Check local storage first
    try {
      const savedSlot = localStorage.getItem('pangly_slot_number');
      if (savedSlot) {
        setMySlot(parseInt(savedSlot, 10));
      }
    } catch {}

    // 2. Fetch real live slot status from API with token verification
    const syncSlots = async () => {
      try {
        let token: string | null = null;
        try {
          token = localStorage.getItem('pangly_slot_token');
        } catch {}

        const res = await fetch('/api/slots', {
          headers: token ? { 'x-slot-token': token } : {}
        });
        const data = await res.json();
        
        if (typeof data.totalClaimed === 'number') {
          setClaimedSlots(data.totalClaimed);
        }
        if (data.isFull) {
          setIsFull(true);
        }
        if (data.mySlot) {
          setMySlot(data.mySlot);
          try {
            localStorage.setItem('pangly_slot_number', data.mySlot.toString());
            if (data.token) {
              localStorage.setItem('pangly_slot_token', data.token);
            }
          } catch {}
        }
      } catch (err) {
        console.error('Error syncing real slots:', err);
      }
    };

    syncSlots();
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      let token: string | null = null;
      try {
        token = localStorage.getItem('pangly_slot_token');
      } catch {}

      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();

      if (data.success && data.slotNumber) {
        setMySlot(data.slotNumber);
        setClaimedSlots(data.totalClaimed);
        try {
          localStorage.setItem('pangly_slot_number', data.slotNumber.toString());
          if (data.token) {
            localStorage.setItem('pangly_slot_token', data.token);
          }
        } catch {}
      } else if (data.isFull) {
        setIsFull(true);
      }
    } catch (err) {
      console.error('Error claiming slot:', err);
    }

    // Trigger direct APK download
    const apkUrl = process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL || '/downloads/Pangly_v1.3.20.apk';
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'Pangly_v1.3.20.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  const percentage = Math.min(100, Math.round((claimedSlots / 100) * 100));

  return (
    <section className="hero-section" style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', paddingTop: '110px', paddingBottom: '70px', overflow: 'hidden' }}>
      
      {/* Soft Ambient Background Highlights */}
      <div style={{ position: 'absolute', top: '15%', left: '35%', width: '550px', height: '550px', background: 'radial-gradient(circle, rgba(45, 106, 79, 0.08) 0%, rgba(245, 241, 235, 0) 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '40%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(180, 83, 9, 0.06) 0%, rgba(245, 241, 235, 0) 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* LEFT COLUMN: Staggered Entrance */}
          <div>
            {/* Version Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#EDE7DE', border: '1px solid #DDD5C7', borderRadius: '999px', marginBottom: '20px' }}
            >
              <span className="neon-dot" style={{ width: '8px', height: '8px' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2D6A4F', letterSpacing: '0.04em' }}>OFFICIAL RELEASE v1.3.20 • EARLY ACCESS</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#292524', marginBottom: '20px' }}
            >
              Store it. Ask it. <br />
              <span className="gradient-text">Own it.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#57534E', lineHeight: 1.6, maxWidth: '540px', marginBottom: '28px', fontWeight: 500 }}
            >
              The 100% private, offline AI vault built for Philippine IDs, family documents, vehicle maintenance, and passwords. Powered by on-device <strong style={{ color: '#2D6A4F' }}>On-Device AI Engine</strong>. Zero cloud. Zero leaks.
            </motion.p>

            {/* 100-User Real Live Early Access Slot Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="card-white" 
              style={{ padding: '22px 24px', marginBottom: '28px', maxWidth: '520px', border: '1px solid #DDD5C7' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#2D6A4F" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#292524' }}>Real-Time Pilot Quota</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2D6A4F' }}>
                  {claimedSlots} / 100 Claimed
                </div>
              </div>

              {/* Progress Bar with animated fill */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#EDE7DE', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)', 
                    borderRadius: '999px',
                  }} 
                />
              </div>

              {/* Real Slot Status Notice */}
              {mySlot ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(45, 106, 79, 0.08)', borderRadius: '10px', border: '1px solid rgba(45, 106, 79, 0.3)' }}>
                  <CheckCircle2 size={18} color="#2D6A4F" />
                  <span style={{ fontSize: '0.82rem', color: '#292524', fontWeight: 600 }}>
                    You have reserved <strong>Slot #{mySlot}</strong>. You can re-download anytime without consuming extra quota.
                  </span>
                </div>
              ) : isFull ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#BE123C' }}>
                  <AlertCircle size={15} color="#BE123C" />
                  <span>Pilot quota is full (100/100). Next batch opening soon.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#57534E' }}>
                  <AlertCircle size={15} color="#B45309" />
                  <span><strong>{100 - claimedSlots} slots remaining</strong>. Each device is assigned 1 verified slot.</span>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              id="download-section" 
              style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '24px' }}
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="btn-primary" 
                style={{ padding: '16px 28px', fontSize: '1.05rem', fontWeight: 700 }}
              >
                <Download size={20} className={isDownloading ? 'spin' : ''} />
                <span>
                  {mySlot ? `Re-download APK (Slot #${mySlot})` : isFull ? 'Pilot Full (100/100)' : 'Claim Slot & Download APK'}
                </span>
              </motion.button>

              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#interactive-demo" 
                className="btn-secondary" 
                style={{ padding: '16px 24px', fontSize: '1rem', textDecoration: 'none' }}
              >
                <span>Try Live Demo</span>
                <ArrowDown size={18} />
              </motion.a>
            </motion.div>

            {/* APK Metadata Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'center', fontSize: '0.82rem', color: '#57534E', fontWeight: 600 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#2D6A4F" />
                <span>Android 8.0+ (ARM64)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#2D6A4F" />
                <span>226 MB (Full Offline AI Bundle)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#2D6A4F" />
                <span>No Ads • No Telemetry</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: 3D Leaning Android Smartphone & Floating Badges */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            
            {/* Ambient Background Glow behind phone */}
            <div style={{ position: 'absolute', width: '380px', height: '520px', background: 'radial-gradient(ellipse, rgba(45, 106, 79, 0.12) 0%, rgba(245, 241, 235, 0) 70%)', filter: 'blur(30px)', zIndex: 0 }} />

            {/* Main Leaning Phone Image */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ 
                position: 'relative', 
                zIndex: 1, 
                width: '100%', 
                maxWidth: '440px',
                filter: 'drop-shadow(0 20px 35px rgba(41, 37, 36, 0.25))'
              }}
            >
              <Image 
                src="/images/pangly_hero_phone_leaning.png" unoptimized 
                alt="Pangly App running on Leaning Android Flagship Smartphone" 
                width={774} 
                height={1061} 
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority 
              />

              {/* Floating Pill 1: 100% Offline AI (Framer Motion Staggered Fade-in) */}
              <motion.div 
                initial={{ opacity: 0, y: 24, scale: 0.88 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -7, 0]
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.15 }
                }}
                style={{ 
                  position: 'absolute', 
                  top: '12%', 
                  left: '-20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px 16px', 
                  background: '#FFFFFF', 
                  border: '1px solid #DDD5C7', 
                  borderRadius: '16px',
                  boxShadow: '0 12px 28px rgba(41, 37, 36, 0.12)',
                  zIndex: 2
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(45, 106, 79, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={18} color="#2D6A4F" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#292524' }}>On-Device AI Engine</div>
                  <div style={{ fontSize: '0.68rem', color: '#57534E', fontWeight: 600 }}>Runs 100% On-Device</div>
                </div>
              </motion.div>

              {/* Floating Pill 2: AES-256 Vault (Framer Motion Staggered Fade-in) */}
              <motion.div 
                initial={{ opacity: 0, y: 24, scale: 0.88 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -7, 0]
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.45 }
                }}
                style={{ 
                  position: 'absolute', 
                  bottom: '18%', 
                  right: '-16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px 16px', 
                  background: '#FFFFFF', 
                  border: '1px solid #DDD5C7', 
                  borderRadius: '16px',
                  boxShadow: '0 12px 28px rgba(41, 37, 36, 0.12)',
                  zIndex: 2
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(180, 83, 9, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={18} color="#B45309" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#292524' }}>Zero Cloud Vault</div>
                  <div style={{ fontSize: '0.68rem', color: '#57534E', fontWeight: 600 }}>Biometric Hardware Keystore</div>
                </div>
              </motion.div>

              {/* Adorable Waving Mascot Peeking (Animated GIF) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.7, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  position: 'absolute', 
                  bottom: '-35px', 
                  left: '10px', 
                  width: '130px', 
                  height: '130px', 
                  zIndex: 2, 
                  filter: 'drop-shadow(0 8px 18px rgba(41, 37, 36, 0.2))'
                }}
              >
                <Image 
                  src="/images/pangly_waving.gif"
                  unoptimized
                  alt="Pangly 3D Mascot Waving" 
                  width={130}
                  height={130}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                />
              </motion.div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
