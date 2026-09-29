// src/components/FeedbackWidget.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquarePlus, 
  X, 
  Star, 
  Send, 
  Lightbulb, 
  Bug, 
  MessageSquare, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

type CategoryType = 'feature_request' | 'bug_report' | 'review' | 'general';

interface CategoryOption {
  id: CategoryType;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; fill?: string }>;
  color: string;
  placeholder: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'feature_request',
    label: 'Feature Request',
    icon: Lightbulb,
    color: '#2D6A4F',
    placeholder: 'e.g., Please add Senior Citizen booklet OCR and medicine discount tracking...',
  },
  {
    id: 'bug_report',
    label: 'Bug Report',
    icon: Bug,
    color: '#DC2626',
    placeholder: 'e.g., Camera ID scanner is blurry on my Samsung Galaxy A12...',
  },
  {
    id: 'review',
    label: 'Review / Praise',
    icon: Star,
    color: '#F59E0B',
    placeholder: 'e.g., Loving the zero-cloud offline vault! Super fast search...',
  },
  {
    id: 'general',
    label: 'General Idea',
    icon: MessageSquare,
    color: '#57534E',
    placeholder: 'e.g., Any feedback, suggestions, or thoughts for the team...',
  },
];

const QUICK_IDEAS = [
  '+ Senior Citizen Booklet',
  '+ PhilHealth QR Code',
  '+ LTO OR/CR Scanner',
  '+ PRC ID Renewal Alert',
];

export const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<CategoryType>('feature_request');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [mySlotNumber, setMySlotNumber] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync claimed pilot slot from localStorage
  useEffect(() => {
    try {
      const slot = localStorage.getItem('pangly_slot_number');
      if (slot) setMySlotNumber(parseInt(slot, 10));
    } catch {}
  }, [isOpen]);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeCategory = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  const handleAppendIdea = (idea: string) => {
    const cleanIdea = idea.replace('+', '').trim();
    if (message.includes(cleanIdea)) return;
    setMessage((prev) => (prev ? `${prev}, ${cleanIdea}` : `Please support ${cleanIdea}`));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setErrorMessage('Please enter your name or handle (at least 2 characters).');
      return;
    }
    if (message.trim().length < 3) {
      setErrorMessage('Please type at least a short message.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const pilotToken = typeof window !== 'undefined' 
      ? (localStorage.getItem('pangly_slot_token') || localStorage.getItem('pangly_pilot_token')) 
      : undefined;

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          rating: rating > 0 ? rating : undefined,
          message: message.trim(),
          name: name.trim(),
          contact: contact.trim() || undefined,
          pilotToken: pilotToken || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Save authorToken locally so user can edit/delete their feedback later
        if (data.feedbackId && data.authorToken) {
          try {
            const existing = JSON.parse(localStorage.getItem('pangly_my_feedbacks') || '{}');
            existing[data.feedbackId] = data.authorToken;
            localStorage.setItem('pangly_my_feedbacks', JSON.stringify(existing));
          } catch {}
        }

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
          setMessage('');
          setRating(0);
          setName('');
          setContact('');
        }, 3000);
      } else {
        setErrorMessage(data.message || 'Failed to submit feedback.');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={widgetRef}
      className="feedback-widget-fixed"
      style={{
        fontFamily: 'inherit',
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: '56px',
              right: '0',
              width: 'min(380px, calc(100vw - 36px))',
              maxHeight: '84vh',
              overflowY: 'auto',
              backgroundColor: '#FDFBF7',
              border: '1px solid #DDD5C7',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 20px 45px -10px rgba(41, 37, 36, 0.25)',
              color: '#292524',
            }}
          >
            {/* Clean Close Button positioned neatly inside modal corner */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback widget"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #DDD5C7',
                background: '#EDE7DE',
                color: '#57534E',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                zIndex: 2,
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
              <X size={15} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px', paddingRight: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#EDE7DE', border: '1px solid #DDD5C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageSquarePlus size={16} color="#2D6A4F" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#292524', letterSpacing: '-0.01em' }}>
                    Share Feedback
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#78716C', fontWeight: 500 }}>
                    Help shape the next release of Pangly 🇵🇭
                  </p>
                </div>
              </div>
            </div>

            {/* Success View */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '24px 10px' }}
              >
                <div style={{ width: '80px', height: '80px', margin: '0 auto 12px auto' }}>
                  <Image
                    src="/images/pangly_celebrate.gif"
                    unoptimized
                    alt="Pangly Celebrate"
                    width={80}
                    height={80}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2D6A4F', marginBottom: '6px' }}>
                  Maraming Salamat!
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#57534E', lineHeight: 1.5, margin: 0 }}>
                  Thanks for helping make Pangly better for Filipinos everywhere. We read and appreciate every idea!
                </p>
              </motion.div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Verified Pilot Slot Status (if claimed) */}
                {mySlotNumber && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#2D6A4F', background: '#E8F5E9', border: '1px solid #C8E6C9', padding: '3px 8px', borderRadius: '8px', width: 'fit-content' }}>
                    <ShieldCheck size={12} color="#2D6A4F" />
                    <span>Posting as Tester #{mySlotNumber}</span>
                  </div>
                )}
                
                {/* Category Chips with Clean Lucide SVG Icons */}
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                    What kind of feedback?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {CATEGORIES.map((cat) => {
                      const isSelected = category === cat.id;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            fontSize: '0.78rem',
                            fontWeight: isSelected ? 700 : 500,
                            border: isSelected ? '1.5px solid #2D6A4F' : '1px solid #DDD5C7',
                            backgroundColor: isSelected ? '#EDE7DE' : '#FFFFFF',
                            color: isSelected ? '#2D6A4F' : '#57534E',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Icon size={14} color={isSelected ? '#2D6A4F' : cat.color} />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating Stars (Optional) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Overall Rating (Optional)
                    </label>
                    {rating > 0 && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706' }}>
                        {rating} / 5 Stars
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star === rating ? 0 : star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                        }}
                      >
                        <Star
                          size={18}
                          color={star <= (hoverRating || rating) ? '#F59E0B' : '#DDD5C7'}
                          fill={star <= (hoverRating || rating) ? '#F59E0B' : 'transparent'}
                          style={{ transition: 'all 0.12s ease' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Ideas (Feature Requests) */}
                {category === 'feature_request' && (
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {QUICK_IDEAS.map((idea) => (
                        <button
                          key={idea}
                          type="button"
                          onClick={() => handleAppendIdea(idea)}
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            background: '#FFFFFF',
                            border: '1px solid #DDD5C7',
                            borderRadius: '999px',
                            color: '#57534E',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.12s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#2D6A4F';
                            e.currentTarget.style.color = '#2D6A4F';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#DDD5C7';
                            e.currentTarget.style.color = '#57534E';
                          }}
                        >
                          {idea}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Message *
                    </label>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: message.trim().length >= 3 ? '#2D6A4F' : '#A8A29E' }}>
                      {message.trim().length === 0 ? 'Min 3 chars' : message.trim().length < 3 ? `${3 - message.trim().length} more chars` : `${message.trim().length} chars`}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={activeCategory.placeholder}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '0.84rem',
                      fontFamily: 'inherit',
                      color: '#292524',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DDD5C7',
                      borderRadius: '12px',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2D6A4F')}
                    onBlur={(e) => (e.target.style.borderColor = '#DDD5C7')}
                  />
                </div>

                {/* Required Name Input */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Your Name or Handle *
                    </label>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: name.trim().length >= 2 ? '#2D6A4F' : '#A8A29E' }}>
                      {name.trim().length === 0 ? 'Required' : name.trim().length < 2 ? 'Min 2 chars' : 'Ready'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marco • Cebu or Kuya Dan"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      fontFamily: 'inherit',
                      color: '#292524',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DDD5C7',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2D6A4F')}
                    onBlur={(e) => (e.target.style.borderColor = '#DDD5C7')}
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#B91C1C', background: '#FEE2E2', padding: '6px 10px', borderRadius: '8px' }}>
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || message.trim().length < 3 || name.trim().length < 2}
                  className="btn-primary"
                  style={{
                    padding: '10px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isSubmitting || message.trim().length < 3 || name.trim().length < 2 ? 0.6 : 1,
                    cursor: isSubmitting || message.trim().length < 3 || name.trim().length < 2 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
                </button>

                {/* Public Board Link for Community Transparency */}
                <div style={{ marginTop: '2px', paddingTop: '10px', borderTop: '1px solid #EFEAE2', display: 'flex', justifyContent: 'center' }}>
                  <Link
                    href="/feedbacks"
                    onClick={() => setIsOpen(false)}
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#2D6A4F',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EDE7DE')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span>View Public Feedback Board</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

              </form>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Pill */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          backgroundColor: '#2D6A4F',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '999px',
          boxShadow: '0 8px 24px rgba(45, 106, 79, 0.35)',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.01em',
          transition: 'all 0.15s ease',
        }}
      >
        <MessageSquarePlus size={17} />
        <span>Feedback</span>
      </motion.button>
    </div>
  );
};
