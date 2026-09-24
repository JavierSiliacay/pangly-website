// src/components/InteractiveDemo.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ShieldCheck } from 'lucide-react';

interface SimulatedDoc {
  title: string;
  category: string;
  details: string;
  dateBadge?: string;
}

interface DemoScenario {
  id: string;
  prompt: string;
  shortLabel: string;
  response: string;
  docs: SimulatedDoc[];
}

const SCENARIOS: DemoScenario[] = [
  {
    id: 'mama-maintenance',
    prompt: "Where is mama's maintenance?",
    shortLabel: "Mama's Maintenance",
    response: "Found Mama's prescription under Healthcare records. She is currently taking Amlodipine 5mg (once daily after breakfast) and Losartan 50mg (once daily after dinner). The prescription was issued by Dr. Santos at Taguig Health Center.",
    docs: [
      {
        title: "Prescription Slip - Taguig Health Center",
        category: "Healthcare",
        details: "Dr. Santos • Amlodipine 5mg + Losartan 50mg",
        dateBadge: "Valid until Nov 2026"
      },
      {
        title: "Senior Citizen ID - Erlinda Siliacay",
        category: "Government ID",
        details: "OSCA ID #2019-847291 • Taguig City",
        dateBadge: "Active"
      }
    ]
  },
  {
    id: 'driver-license',
    prompt: "When does my driver's license expire?",
    shortLabel: "Driver's License Expiry",
    response: "Your Philippine Non-Professional Driver's License expires on November 14, 2027 (in 1 year, 1 month). Pangly has scheduled an alarm 30 days before expiration for your renewal at LTO East Avenue.",
    docs: [
      {
        title: "LTO Driver's License",
        category: "Government ID",
        details: "Lic # N02-18-092812 • Blood Type O+",
        dateBadge: "Expires Nov 14, 2027"
      }
    ]
  },
  {
    id: 'wifi-password',
    prompt: "Show my home Wi-Fi password",
    shortLabel: "Home Wi-Fi Password",
    response: "Decrypted from your secure local vault using hardware biometric keys: SSID: PLDTHOME_FIBER_9B42 | Password: [FiberSecure2026!]",
    docs: [
      {
        title: "Home Living Room Wi-Fi",
        category: "Password Vault",
        details: "WPA3 Personal • PLDT Home Fiber 500Mbps",
        dateBadge: "Last updated 2 mos ago"
      }
    ]
  },
  {
    id: 'car-maintenance',
    prompt: "When is my next oil change and vehicle registration due?",
    shortLabel: "Vehicle Maintenance & OR/CR",
    response: "Your 2022 Toyota Vios (Plate # NBT 8291) has an oil change due at 25,000 KM (currently at 23,450 KM). The LTO OR/CR annual registration renewal is scheduled for March 2027 based on plate ending '1'.",
    docs: [
      {
        title: "LTO Official Receipt & Certificate of Reg (OR/CR)",
        category: "Vehicle Document",
        details: "Plate # NBT 8291 • 2022 Toyota Vios 1.3E",
        dateBadge: "Due March 2027"
      },
      {
        title: "Shell Helix Ultra Maintenance Receipt",
        category: "Receipts & Services",
        details: "5W-40 Synthetic • Shell C5 Taguig Branch",
        dateBadge: "Service at 20,000 KM"
      }
    ]
  }
];

export const InteractiveDemo: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(SCENARIOS[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState(SCENARIOS[0].response);

  const handleSelectScenario = (scenario: DemoScenario) => {
    if (scenario.id === activeScenario.id) return;
    setActiveScenario(scenario);
    setIsTyping(true);
    setDisplayedText('');

    let currentIdx = 0;
    const fullText = scenario.response;
    const interval = setInterval(() => {
      currentIdx += 3;
      if (currentIdx >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(fullText.substring(0, currentIdx));
      }
    }, 16);
  };

  return (
    <section id="interactive-demo" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#EDE7DE', border: '1px solid #DDD5C7', borderRadius: '999px', marginBottom: '16px' }}>
            <ShieldCheck size={16} color="#2D6A4F" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2D6A4F' }}>TEST THE OFFLINE AI BRAIN</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#292524', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Ask Pangly Anything. <br />
            <span className="gradient-text">Instant Answers Without Cloud.</span>
          </h2>
          <p style={{ color: '#57534E', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
            Tap any of the sample questions below to simulate how Pangly analyzes your encrypted offline vault in milliseconds using the on-device AI engine.
          </p>
        </motion.div>

        {/* Demo Interactive Wrapper */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '900px', margin: '0 auto', background: '#FFFFFF', border: '1px solid #DDD5C7', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 36px rgba(41, 37, 36, 0.08)' }}
        >
          
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #EAE4D9', background: '#F5F1EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', overflow: 'hidden', position: 'relative', border: '1px solid #DDD5C7' }}>
                <Image src="/images/icon.png" sizes="38px" alt="Pangly" fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#292524', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Ask Pangly
                  <span style={{ fontSize: '0.68rem', padding: '2px 7px', background: 'rgba(45, 106, 79, 0.12)', color: '#2D6A4F', borderRadius: '999px', fontWeight: 700 }}>OFFLINE NPU</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#57534E', fontWeight: 500 }}>Zero internet connection required</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#2D6A4F', fontWeight: 700 }}>
              <span className="neon-dot" style={{ width: '6px', height: '6px' }} />
              <span>Smart Context v1.3.20 Active</span>
            </div>
          </div>

          {/* Quick Scenario Chips */}
          <div style={{ padding: '16px 24px', background: '#EDE7DE', borderBottom: '1px solid #DDD5C7', display: 'flex', gap: '10px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {SCENARIOS.map((item) => {
              const active = item.id === activeScenario.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectScenario(item)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    border: active ? '1px solid #2D6A4F' : '1px solid #DDD5C7',
                    background: active ? '#2D6A4F' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#57534E',
                    boxShadow: active ? '0 4px 10px rgba(45, 106, 79, 0.2)' : '0 1px 3px rgba(41, 37, 36, 0.05)'
                  }}
                >
                  {item.shortLabel}
                </motion.button>
              );
            })}
          </div>

          {/* Chat Body */}
          <div style={{ padding: '28px 24px', minHeight: '340px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#FFFFFF' }}>
            
            {/* User Message */}
            <motion.div 
              key={`user-${activeScenario.id}`}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ alignSelf: 'flex-end', maxWidth: '80%' }}
            >
              <div style={{ padding: '12px 18px', background: 'rgba(45, 106, 79, 0.1)', border: '1px solid rgba(45, 106, 79, 0.25)', borderRadius: '18px 18px 4px 18px', color: '#292524', fontSize: '0.95rem', fontWeight: 600 }}>
                {activeScenario.prompt}
              </div>
            </motion.div>

            {/* AI Pangly Message */}
            <div style={{ alignSelf: 'flex-start', maxWidth: '88%', display: 'flex', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', position: 'relative', flexShrink: 0, border: '1px solid #DDD5C7', background: '#EDE7DE' }}>
                <Image src="/images/pangly_pose_celebrate.png" sizes="42px" alt="Pangly Mascot" fill style={{ objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ padding: '16px 20px', background: '#F5F1EB', border: '1px solid #EAE4D9', borderRadius: '4px 18px 18px 18px', color: '#292524', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line', fontWeight: 500 }}>
                  {displayedText}
                  {isTyping && <span className="blinking-cursor">|</span>}
                </div>

                {/* Referenced Encrypted Documents */}
                {!isTyping && activeScenario.docs.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ marginTop: '16px' }}
                  >
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#57534E', fontWeight: 800, marginBottom: '8px' }}>
                      Linked Documents from Vault:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                      {activeScenario.docs.map((doc, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          style={{ padding: '12px 14px', background: '#EDE7DE', border: '1px solid #DDD5C7', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#292524' }}>{doc.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#57534E' }}>{doc.details}</div>
                          </div>
                          {doc.dateBadge && (
                            <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(45, 106, 79, 0.12)', color: '#2D6A4F', borderRadius: '6px', fontWeight: 700 }}>
                              {doc.dateBadge}
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </div>
            </div>

          </div>

          {/* Fake Input Bar */}
          <div style={{ padding: '16px 24px', background: '#F5F1EB', borderTop: '1px solid #EAE4D9', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              readOnly 
              value={activeScenario.prompt}
              style={{ flex: 1, background: '#FFFFFF', border: '1px solid #DDD5C7', borderRadius: '12px', padding: '12px 16px', color: '#292524', fontSize: '0.9rem', outline: 'none', fontWeight: 500 }}
            />
            <motion.button 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary" 
              style={{ padding: '12px 20px', borderRadius: '12px' }} 
              onClick={() => handleSelectScenario(activeScenario)}
            >
              <RefreshCw size={16} />
              <span>Simulate</span>
            </motion.button>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
