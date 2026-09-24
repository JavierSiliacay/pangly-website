// src/components/FaqSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Why is the Pangly APK download size 226 MB?",
    answer: "Unlike web wrappers that require an internet connection, Pangly embeds the complete native on-device AI runtime and neural network model bundle directly into the app. Once installed, it will work forever without ever using your mobile data or Wi-Fi."
  },
  {
    question: "Can anyone else—including Pangly’s developers—see my files?",
    answer: "No. Pangly has zero backend servers, zero databases, and zero analytics telemetry. All documents, images, and passwords are encrypted using AES-256 GCM using keys stored exclusively in your smartphone's hardware biometric Keystore. If our website disappeared tomorrow, your app would continue functioning identically."
  },
  {
    question: "What is the 100 Early Access slot limit?",
    answer: "To ensure direct, high-touch support and feedback collection during the v1.3.20 release pilot, we limit new slot issuance to 100 early testers. Once you claim a slot, your device keeps its slot token permanently, allowing you to re-download or update without losing access."
  },
  {
    question: "What happens if I lose or switch my Android phone?",
    answer: "Pangly includes an encrypted Backup & Export feature in Settings. You can export an AES-256 encrypted archive to a USB flash drive or your SD card, protected by your custom Master Recovery Key. When you get a new phone, simply import the file and enter your key."
  },
  {
    question: "Which Android phones are supported?",
    answer: "Pangly supports any Android smartphone running Android 8.0 (Oreo) or higher with an ARM64 processor and at least 3GB of RAM. Flagship and mid-range devices from Samsung, Xiaomi, Transsion (Infinix/Tecno), Vivo, Realme, and Google Pixel run the offline engine with exceptional speed."
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" style={{ padding: '80px 0', position: 'relative' }}>
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
            <HelpCircle size={16} color="#2D6A4F" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2D6A4F' }}>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#292524', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Everything You Need to Know.
          </h2>
          <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Have questions about offline security, file storage, or model performance? We have answers.
          </p>
        </motion.div>

        {/* Accordions */}
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                style={{ 
                  borderRadius: '16px', 
                  border: isOpen ? '1px solid #2D6A4F' : '1px solid #DDD5C7',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                  boxShadow: isOpen ? '0 10px 24px rgba(45, 106, 79, 0.12)' : '0 2px 6px rgba(41, 37, 36, 0.04)'
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isOpen ? '#2D6A4F' : '#292524' }}>
                    {faq.question}
                  </span>
                  <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ flexShrink: 0 }}
                  >
                    <ChevronDown size={20} color={isOpen ? '#2D6A4F' : '#57534E'} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 24px 20px 24px', color: '#57534E', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
