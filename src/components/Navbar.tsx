// src/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';

interface NavbarProps {
  initialSlots?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ initialSlots = 0 }) => {
  const [claimedSlots, setClaimedSlots] = useState(initialSlots);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLiveSlots = async () => {
      try {
        const res = await fetch('/api/slots');
        const data = await res.json();
        if (typeof data.totalClaimed === 'number') {
          setClaimedSlots(data.totalClaimed);
        }
      } catch {}
    };
    fetchLiveSlots();
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled ? 'rgba(245, 241, 235, 0.94)' : 'rgba(245, 241, 235, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid #DDD5C7' : '1px solid rgba(221, 213, 199, 0.6)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ position: 'relative', width: '42px', height: '42px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #DDD5C7', boxShadow: '0 4px 12px rgba(41, 37, 36, 0.08)' }}
          >
            <Image src="/images/icon.png" sizes="42px" alt="Pangly Icon" fill style={{ objectFit: 'cover' }} priority />
          </motion.div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#292524' }}>PANGLY</span>
              <span style={{ fontSize: '0.65rem', padding: '2px 7px', background: 'rgba(45, 106, 79, 0.12)', color: '#2D6A4F', borderRadius: '999px', fontWeight: 700, border: '1px solid rgba(45, 106, 79, 0.25)' }}>v1.3.20</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#57534E', margin: 0, fontWeight: 600 }}>100% Private Offline AI Vault</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          <Link href="#features" style={{ color: '#57534E', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}>Features</Link>
          <Link href="#interactive-demo" style={{ color: '#57534E', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}>Live Demo</Link>
          <Link href="#security" style={{ color: '#57534E', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}>Security</Link>
          <Link href="#install-guide" style={{ color: '#57534E', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}>Install Guide</Link>
          <Link href="#faq" style={{ color: '#57534E', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }}>FAQ</Link>
        </nav>

        {/* CTA Slot Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="slots-pill-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#EDE7DE', border: '1px solid #DDD5C7', borderRadius: '999px' }}>
            <span className="neon-dot" style={{ width: '6px', height: '6px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2D6A4F' }}>{claimedSlots}/100 Slots</span>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link href="#download-section" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
              <Download size={16} />
              <span>Download APK</span>
            </Link>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#292524', cursor: 'pointer', padding: '6px' }}
            className="mobile-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#F5F1EB', borderBottom: '1px solid #DDD5C7', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link onClick={() => setMobileMenuOpen(false)} href="#features" style={{ color: '#292524', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Features</Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="#interactive-demo" style={{ color: '#292524', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Live Demo</Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="#security" style={{ color: '#292524', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Security</Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="#install-guide" style={{ color: '#292524', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Install Guide</Link>
          <Link onClick={() => setMobileMenuOpen(false)} href="#faq" style={{ color: '#292524', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>FAQ</Link>
          <div style={{ height: '1px', background: '#DDD5C7', margin: '4px 0' }} />
          <Link onClick={() => setMobileMenuOpen(false)} href="#download-section" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={18} />
            <span>Download APK (v1.3.20)</span>
          </Link>
        </div>
      )}
    </motion.header>
  );
};
