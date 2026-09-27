// src/components/SlotLimitModal.tsx
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';

interface SlotLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlotLimitModal: React.FC<SlotLimitModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          
          {/* Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(41, 37, 36, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              maxHeight: '92vh',
              overflowY: 'auto',
              backgroundColor: '#FDFBF7',
              border: '1px solid #DDD5C7',
              borderRadius: '20px',
              padding: '24px 20px 20px 20px',
              boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            {/* Close 'X' Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #DDD5C7',
                background: '#EDE7DE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#57534E',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E2DBD0';
                e.currentTarget.style.color = '#292524';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#EDE7DE';
                e.currentTarget.style.color = '#57534E';
              }}
            >
              <X size={16} />
            </button>

            {/* Thinking Pangly Mascot GIF */}
            <div style={{ position: 'relative', width: '85px', height: '85px', margin: '0 auto 12px auto' }}>
              <Image
                src="/images/pangly_thinking.gif"
                unoptimized
                alt="Pangly Mascot Thinking"
                width={85}
                height={85}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>

            {/* Quota Reached Badge - Clean & Professional */}
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                padding: '4px 10px', 
                background: '#EDE7DE', 
                border: '1px solid #DDD5C7', 
                borderRadius: '999px',
                marginBottom: '10px' 
              }}
            >
              <ShieldCheck size={13} color="#2D6A4F" />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2D6A4F', letterSpacing: '0.02em' }}>
                PILOT SLOTS FULL (100/100)
              </span>
            </div>

            {/* Headline */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#292524', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Early Access Quota Reached
            </h3>

            {/* Polite & Professional Description */}
            <p style={{ fontSize: '0.86rem', color: '#57534E', lineHeight: 1.55, marginBottom: '18px', fontWeight: 500 }}>
              Thank you so much for your interest and support for <strong>Pangly</strong>! The 100 early pilot tester slots for this release are currently full.
              <br /><br />
              For upcoming announcements, new releases, and latest updates, keep in touch with us on our official Facebook page.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Primary: Facebook Page Link */}
              <a
                href="https://facebook.com/PanglyApp"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  padding: '12px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                }}
              >
                {/* Official Facebook Icon */}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#FFFFFF" style={{ flexShrink: 0 }}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Follow Pangly on Facebook</span>
                <ExternalLink size={14} />
              </a>

              {/* Secondary: Close / Got it */}
              <button
                onClick={onClose}
                style={{
                  padding: '10px 16px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#78716C',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#292524';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#78716C';
                }}
              >
                Close
              </button>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
