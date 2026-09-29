// src/app/feedbacks/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Star,
  MessageSquarePlus, 
  Search, 
  Lightbulb,
  Bug,
  MessageSquare,
  ShieldCheck,
  Send,
  X,
  Pencil,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface PublicFeedback {
  id: number;
  category: 'feature_request' | 'bug_report' | 'review' | 'general';
  rating: number | null;
  message: string;
  name: string;
  slotNumber?: number | null;
  createdAt: string;
  updatedAt?: string | null;
}

interface FeedbackStats {
  total: number;
  averageRating: number;
  ratingCount: number;
  categoryCounts: {
    all: number;
    feature_request: number;
    bug_report: number;
    review: number;
    general: number;
  };
}

const CATEGORY_MAP: Record<string, { label: string; icon: React.ComponentType<{ size?: number; color?: string; fill?: string }>; color: string; bg: string; border: string }> = {
  feature_request: {
    label: 'Feature Request',
    icon: Lightbulb,
    color: '#2D6A4F',
    bg: '#E8F5E9',
    border: '#C8E6C9',
  },
  bug_report: {
    label: 'Bug Report',
    icon: Bug,
    color: '#DC2626',
    bg: '#FEE2E2',
    border: '#FECACA',
  },
  review: {
    label: 'Pilot Review',
    icon: Star,
    color: '#B45309',
    bg: '#FEF3C7',
    border: '#FDE68A',
  },
  general: {
    label: 'General Feedback',
    icon: MessageSquare,
    color: '#4B5563',
    bg: '#F3F4F6',
    border: '#E5E7EB',
  },
};

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<PublicFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    averageRating: 5.0,
    ratingCount: 0,
    categoryCounts: { all: 0, feature_request: 0, bug_report: 0, review: 0, general: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Helper to highlight matching text in feedback messages and author names
  const highlightMatch = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <mark
              key={i}
              style={{
                background: '#FEF3C7',
                color: '#92400E',
                padding: '1px 3px',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };
  
  // Author ownership tokens stored in localStorage: { [id]: token }
  const [myTokens, setMyTokens] = useState<Record<number, string>>({});

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<'feature_request' | 'bug_report' | 'review' | 'general'>('feature_request');
  const [formRating, setFormRating] = useState<number>(5);
  const [formMessage, setFormMessage] = useState('');
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mySlotNumber, setMySlotNumber] = useState<number | null>(null);

  // Load local author tokens & claimed slot from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pangly_my_feedbacks');
      if (saved) {
        setMyTokens(JSON.parse(saved));
      }
      const slot = localStorage.getItem('pangly_slot_number');
      if (slot) {
        setMySlotNumber(parseInt(slot, 10));
      }
    } catch {}
  }, []);

  // Global Keyboard Accessibility: Escape to close modal, "/" or "Ctrl+K" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSubmitModal) {
          setShowSubmitModal(false);
          return;
        }
        if (document.activeElement === searchInputRef.current) {
          if (searchQuery) {
            setSearchQuery('');
          } else {
            searchInputRef.current?.blur();
          }
          return;
        }
      }

      // Check if user is typing in another input/textarea
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSubmitModal, searchQuery]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success && Array.isArray(data.feedbacks)) {
        setFeedbacks(data.feedbacks);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      const matchesCategory = activeTab === 'all' || item.category === activeTab;
      const matchesSearch =
        searchQuery === '' ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [feedbacks, activeTab, searchQuery]);

  // Pagination Configuration: 9 cards per page (3x3 desktop grid)
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-reset to page 1 whenever category or search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedFeedbacks = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredFeedbacks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFeedbacks, safePage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === safePage) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('feedbacks-grid-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const getPaginationPages = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  // Open modal for new submission
  const handleOpenNew = () => {
    setEditingId(null);
    setFormCategory('feature_request');
    setFormRating(5);
    setFormMessage('');
    setFormName('');
    setFormContact('');
    setSubmitError('');
    setShowSubmitModal(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item: PublicFeedback) => {
    setEditingId(item.id);
    setFormCategory(item.category);
    setFormRating(item.rating || 5);
    setFormMessage(item.message);
    setFormName(item.name || '');
    setFormContact('');
    setSubmitError('');
    setShowSubmitModal(true);
  };

  // Delete feedback
  const handleDelete = async (id: number) => {
    const authorToken = myTokens[id];
    if (!authorToken) return;

    try {
      const res = await fetch('/api/feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, authorToken }),
      });
      const data = await res.json();

      if (data.success) {
        // Remove locally
        const updatedTokens = { ...myTokens };
        delete updatedTokens[id];
        setMyTokens(updatedTokens);
        localStorage.setItem('pangly_my_feedbacks', JSON.stringify(updatedTokens));

        setFeedbacks((prev) => prev.filter((item) => item.id !== id));
        fetchFeedbacks();
      } else {
        alert(data.message || 'Failed to delete feedback.');
      }
    } catch {
      alert('Network error while deleting.');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Submit (Create or Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim().length < 2) {
      setSubmitError('Please enter your name or handle (at least 2 characters).');
      return;
    }
    if (formMessage.trim().length < 3) {
      setSubmitError('Please enter at least a short message.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      if (editingId) {
        // UPDATE existing feedback
        const authorToken = myTokens[editingId];
        const res = await fetch('/api/feedback', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            authorToken,
            category: formCategory,
            rating: formRating > 0 ? formRating : undefined,
            message: formMessage.trim(),
            name: formName.trim(),
          }),
        });
        const data = await res.json();

        if (data.success) {
          setSubmitSuccess(true);
          fetchFeedbacks();
          setTimeout(() => {
            setSubmitSuccess(false);
            setShowSubmitModal(false);
            setEditingId(null);
          }, 1800);
        } else {
          setSubmitError(data.message || 'Failed to update feedback.');
        }
      } else {
        // CREATE new feedback with dynamic pilot token verification
        const pilotToken = typeof window !== 'undefined' 
          ? (localStorage.getItem('pangly_slot_token') || localStorage.getItem('pangly_pilot_token')) 
          : undefined;
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: formCategory,
            rating: formRating > 0 ? formRating : undefined,
            message: formMessage.trim(),
            name: formName.trim(),
            contact: formContact.trim() || undefined,
            pilotToken: pilotToken || undefined,
          }),
        });

        const data = await res.json();
        if (data.success) {
          if (data.feedbackId && data.authorToken) {
            const updated = { ...myTokens, [data.feedbackId]: data.authorToken };
            setMyTokens(updated);
            localStorage.setItem('pangly_my_feedbacks', JSON.stringify(updated));
          }

          setSubmitSuccess(true);
          fetchFeedbacks();
          setTimeout(() => {
            setSubmitSuccess(false);
            setShowSubmitModal(false);
            setFormMessage('');
            setFormName('');
            setFormContact('');
          }, 2000);
        } else {
          setSubmitError(data.message || 'Failed to submit feedback.');
        }
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F1EB', color: '#292524' }}>
      <Navbar />

      <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '1060px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Breadcrumb & Navigation */}
          <div style={{ marginBottom: '28px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#57534E',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#EDE7DE',
                border: '1px solid #DDD5C7',
                transition: 'all 0.15s ease',
              }}
            >
              <ArrowLeft size={15} />
              <span>Back to Pangly Home</span>
            </Link>
          </div>

          {/* Header Banner */}
          <div
            style={{
              position: 'relative',
              background: '#FDFBF7',
              border: '1px solid #DDD5C7',
              borderRadius: '24px',
              padding: '36px 32px',
              marginBottom: '36px',
              boxShadow: '0 12px 30px rgba(41, 37, 36, 0.05)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '680px', position: 'relative', zIndex: 1 }}>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', padding: '5px 12px', background: '#EDE7DE', border: '1px solid #DDD5C7', borderRadius: '999px' }}>
                <span className="neon-dot" style={{ width: '7px', height: '7px' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2D6A4F', letterSpacing: '0.04em' }}>
                  PANGLY COMMUNITY BOARD
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#292524', margin: 0 }}>
                Built for Filipinos. <br />
                <span className="gradient-text">Shaped by You.</span>
              </h1>

              <p style={{ fontSize: '0.98rem', color: '#57534E', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                Explore requested Philippine IDs, feature proposals, and reviews from early pilot testers. Your feedback directly determines what features and document types we support next in Pangly.
              </p>

              {/* Action Button & Live Metrics */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
                <button
                  onClick={handleOpenNew}
                  className="btn-primary"
                  style={{
                    padding: '12px 22px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <MessageSquarePlus size={17} />
                  <span>Submit Feedback or Request an ID</span>
                </button>

                {/* Rating KPI */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #DDD5C7', borderRadius: '14px' }}>
                  <Star size={18} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#292524' }}>
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>
                    Average Rating
                  </span>
                </div>

                {/* Total Contributions */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #DDD5C7', borderRadius: '14px' }}>
                  <MessageSquarePlus size={16} color="#2D6A4F" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#292524' }}>
                    {stats.total}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>
                    Contributions
                  </span>
                </div>
              </div>

            </div>

            {/* Mascot Visual on Desktop */}
            <div
              style={{
                position: 'absolute',
                right: '32px',
                bottom: '-25px',
                width: '160px',
                height: '160px',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 10px 20px rgba(41, 37, 36, 0.15))',
              }}
              className="mascot-desktop"
            >
              <Image
                src="/images/pangly_waving.gif"
                unoptimized
                alt="Pangly Mascot Waving"
                width={160}
                height={160}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Anchor for smooth scroll upon page change */}
          <div id="feedbacks-grid-anchor" style={{ scrollMarginTop: '100px' }} />

          {/* Controls: Segmented Filter Tabs & Keyword Search */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '24px',
            }}
          >
            {/* Segmented Filter Pills with Clean SVG Icons */}
            <div className="feedback-filter-tabs">
              {[
                { id: 'all', label: 'All', icon: null, count: stats.total },
                { id: 'feature_request', label: 'Features', icon: Lightbulb, color: '#2D6A4F', count: stats.categoryCounts.feature_request },
                { id: 'review', label: 'Reviews', icon: Star, color: '#F59E0B', count: stats.categoryCounts.review },
                { id: 'bug_report', label: 'Bugs', icon: Bug, color: '#DC2626', count: stats.categoryCounts.bug_report },
                { id: 'general', label: 'General', icon: MessageSquare, color: '#57534E', count: stats.categoryCounts.general },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="feedback-filter-tab-btn"
                    style={{
                      fontWeight: isActive ? 700 : 600,
                      background: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#2D6A4F' : '#57534E',
                      border: isActive ? '1px solid #DDD5C7' : '1px solid transparent',
                      boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                    }}
                  >
                    {TabIcon && <TabIcon size={14} color={isActive ? '#2D6A4F' : tab.color} />}
                    <span>{tab.label}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        background: isActive ? '#EDE7DE' : 'rgba(0,0,0,0.06)',
                        color: isActive ? '#2D6A4F' : '#78716C',
                        fontWeight: 700,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input with Keyboard Shortcut & Focus Ring */}
            <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '340px' }}>
              <Search
                size={16}
                color={isSearchFocused ? '#2D6A4F' : '#78716C'}
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  pointerEvents: 'none',
                  transition: 'color 0.15s ease',
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ideas, IDs, features..."
                style={{
                  width: '100%',
                  padding: searchQuery ? '9px 36px 9px 36px' : '9px 40px 9px 36px',
                  fontSize: '0.84rem',
                  fontFamily: 'inherit',
                  color: '#292524',
                  backgroundColor: '#FFFFFF',
                  border: isSearchFocused ? '1px solid #2D6A4F' : '1px solid #DDD5C7',
                  boxShadow: isSearchFocused ? '0 0 0 3px rgba(45, 106, 79, 0.14)' : '0 1px 3px rgba(41, 37, 36, 0.04)',
                  borderRadius: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.18s ease',
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />

              {/* Clear button (when typing) */}
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search query"
                  title="Clear search (Esc)"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#EDE7DE',
                    border: 'none',
                    color: '#78716C',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#DDD5C7')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#EDE7DE')}
                >
                  <X size={12} />
                </button>
              ) : (
                /* Keyboard shortcut pill "/" */
                <div
                  title="Press / anywhere to search"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px 6px',
                    background: '#EDE7DE',
                    border: '1px solid #DDD5C7',
                    borderRadius: '5px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#8C857B',
                    pointerEvents: 'none',
                  }}
                >
                  /
                </div>
              )}
            </div>
          </div>

          {/* Quick Filter Tag Suggestions (Click to search) */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', fontSize: '0.78rem' }}>
            <span style={{ color: '#8C857B', fontWeight: 600 }}>Quick search:</span>
            {['PhilID', 'Senior ID', 'Driver’s License', 'Offline AI', 'LTO'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  searchInputRef.current?.focus();
                }}
                style={{
                  background: searchQuery.toLowerCase() === tag.toLowerCase() ? '#2D6A4F' : '#EDE7DE',
                  color: searchQuery.toLowerCase() === tag.toLowerCase() ? '#FFFFFF' : '#57534E',
                  border: '1px solid #DDD5C7',
                  borderRadius: '999px',
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (searchQuery.toLowerCase() !== tag.toLowerCase()) {
                    e.currentTarget.style.background = '#E5DDD0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (searchQuery.toLowerCase() !== tag.toLowerCase()) {
                    e.currentTarget.style.background = '#EDE7DE';
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Active Search Result Status Banner */}
          {searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                background: '#FFFFFF',
                border: '1px solid #DDD5C7',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 2px 6px rgba(41, 37, 36, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#292524' }}>
                <Search size={15} color="#2D6A4F" />
                <span>
                  Found <strong>{filteredFeedbacks.length}</strong> {filteredFeedbacks.length === 1 ? 'result' : 'results'} for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2D6A4F',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EDE7DE')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span>Clear filter</span>
                <X size={13} />
              </button>
            </motion.div>
          )}

          {/* Feedback Cards Masonry Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#78716C' }}>
              <p style={{ fontWeight: 600 }}>Loading community feedback...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            /* Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#FDFBF7',
                border: '1px solid #DDD5C7',
                borderRadius: '20px',
              }}
            >
              <div style={{ width: '80px', height: '80px', margin: '0 auto 14px auto' }}>
                <Image
                  src="/images/pangly_thinking.gif"
                  unoptimized
                  alt="Pangly Mascot Thinking"
                  width={80}
                  height={80}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#292524', marginBottom: '8px' }}>
                No feedback found
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#57534E', maxWidth: '420px', margin: '0 auto 20px auto' }}>
                {searchQuery
                  ? `No suggestions matching "${searchQuery}". Try a different keyword.`
                  : 'Be the first to share an idea, request a Philippine ID format, or leave a review!'}
              </p>
              <button
                onClick={handleOpenNew}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.85rem' }}
              >
                + Submit the First Idea
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px',
              }}
            >
              <AnimatePresence>
                {paginatedFeedbacks.map((item, index) => {
                  const categoryMeta = CATEGORY_MAP[item.category] || CATEGORY_MAP.general;
                  const IconComponent = categoryMeta.icon;
                  const isMyPost = !!myTokens[item.id];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      style={{
                        background: '#FFFFFF',
                        border: isMyPost ? '1.5px solid #2D6A4F' : '1px solid #DDD5C7',
                        borderRadius: '18px',
                        padding: '22px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '16px',
                        boxShadow: '0 4px 14px rgba(41, 37, 36, 0.04)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 24px rgba(41, 37, 36, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(41, 37, 36, 0.04)';
                      }}
                    >
                      <div>
                        {/* Card Header: Category Badge + Timestamp + Author Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 0 }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 9px',
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: categoryMeta.color,
                                background: categoryMeta.bg,
                                border: `1px solid ${categoryMeta.border}`,
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              <IconComponent size={12} color={categoryMeta.color} />
                              <span>{categoryMeta.label}</span>
                            </span>

                            <span style={{ fontSize: '0.72rem', color: '#8C857B', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                              {formatRelativeTime(item.createdAt)}
                            </span>
                          </div>

                          {/* Author Actions (Edit & Delete for the original author) */}
                          {isMyPost && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                              {deleteConfirmId === item.id ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      height: '24px',
                                      padding: '0 8px',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      borderRadius: '6px',
                                      background: '#DC2626',
                                      color: '#FFFFFF',
                                      border: 'none',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <Trash2 size={11} />
                                    <span>Yes, Delete</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    title="Cancel deletion"
                                    aria-label="Cancel deletion"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      height: '24px',
                                      padding: '0 6px',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      borderRadius: '6px',
                                      background: '#EDE7DE',
                                      color: '#57534E',
                                      border: '1px solid #DDD5C7',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      lineHeight: 1,
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(item)}
                                    title="Edit your feedback"
                                    aria-label="Edit your feedback"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      height: '24px',
                                      padding: '0 8px',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      borderRadius: '6px',
                                      background: '#EDE7DE',
                                      border: '1px solid #DDD5C7',
                                      color: '#2D6A4F',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <Pencil size={11} />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(item.id)}
                                    title="Delete your feedback"
                                    aria-label="Delete your feedback"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      height: '24px',
                                      width: '24px',
                                      borderRadius: '6px',
                                      background: '#FEE2E2',
                                      border: '1px solid #FECACA',
                                      color: '#DC2626',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Star Rating (if present) */}
                        {item.rating && item.rating > 0 && (
                          <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                color={s <= item.rating! ? '#F59E0B' : '#DDD5C7'}
                                fill={s <= item.rating! ? '#F59E0B' : 'transparent'}
                              />
                            ))}
                          </div>
                        )}

                        {/* Message Body */}
                        <p style={{ fontSize: '0.92rem', color: '#292524', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                          &ldquo;{highlightMatch(item.message, searchQuery)}&rdquo;
                        </p>
                      </div>

                      {/* Card Footer: User & Verification Badge */}
                      <div
                        style={{
                          borderTop: '1px solid #F0EAE1',
                          paddingTop: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: '#EDE7DE',
                              color: '#2D6A4F',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                            }}
                          >
                            {(item.name ? item.name.charAt(0) : 'P').toUpperCase()}
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#292524' }}>
                            {item.name ? highlightMatch(item.name, searchQuery) : 'Early Pilot Tester'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isMyPost && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2D6A4F', background: 'rgba(45, 106, 79, 0.12)', padding: '2px 7px', borderRadius: '6px' }}>
                              You
                            </span>
                          )}
                          {item.slotNumber ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: '#2D6A4F',
                                background: '#E8F5E9',
                                border: '1px solid #C8E6C9',
                                padding: '2px 8px',
                                borderRadius: '999px',
                              }}
                              title={`Verified pilot slot holder #${item.slotNumber}`}
                            >
                              <ShieldCheck size={11} color="#2D6A4F" />
                              <span>Tester #{item.slotNumber}</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                color: '#78716C',
                                background: '#EDE7DE',
                                border: '1px solid #DDD5C7',
                                padding: '2px 8px',
                                borderRadius: '999px',
                              }}
                            >
                              <span>Community</span>
                            </span>
                          )}
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Numbered Pagination Bar */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '1px solid #DDD5C7',
                }}
              >
                {/* Result count range */}
                <div style={{ fontSize: '0.82rem', color: '#78716C', fontWeight: 600 }}>
                  Showing{' '}
                  <strong style={{ color: '#292524' }}>
                    {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredFeedbacks.length)}
                  </strong>{' '}
                  of <strong style={{ color: '#292524' }}>{filteredFeedbacks.length}</strong> feedbacks
                </div>

                {/* Numbered Page Buttons with Prev & Next */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#EDE7DE',
                    padding: '6px',
                    borderRadius: '16px',
                    border: '1px solid #DDD5C7',
                    boxShadow: '0 2px 8px rgba(41, 37, 36, 0.04)',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {/* Previous Button */}
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => handlePageChange(safePage - 1)}
                    aria-label="Previous Page"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      height: '36px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: safePage === 1 ? 'transparent' : '#FFFFFF',
                      color: safePage === 1 ? '#A8A29E' : '#292524',
                      border: safePage === 1 ? '1px solid transparent' : '1px solid #DDD5C7',
                      cursor: safePage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Prev</span>
                  </button>

                  {/* Page Numbers */}
                  {getPaginationPages(safePage, totalPages).map((p, idx) => {
                    if (p === '...') {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          style={{
                            width: '32px',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            color: '#78716C',
                            fontWeight: 700,
                          }}
                        >
                          ...
                        </span>
                      );
                    }

                    const isCurrent = p === safePage;
                    return (
                      <button
                        key={`page-${p}`}
                        type="button"
                        onClick={() => handlePageChange(p as number)}
                        aria-label={`Go to page ${p}`}
                        aria-current={isCurrent ? 'page' : undefined}
                        style={{
                          minWidth: '36px',
                          height: '36px',
                          padding: '0 8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '10px',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          background: isCurrent ? '#2D6A4F' : '#FFFFFF',
                          color: isCurrent ? '#FFFFFF' : '#292524',
                          border: isCurrent ? '1px solid #2D6A4F' : '1px solid #DDD5C7',
                          boxShadow: isCurrent ? '0 4px 12px rgba(45, 106, 79, 0.25)' : 'none',
                          cursor: isCurrent ? 'default' : 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => handlePageChange(safePage + 1)}
                    aria-label="Next Page"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      height: '36px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: safePage === totalPages ? 'transparent' : '#FFFFFF',
                      color: safePage === totalPages ? '#A8A29E' : '#292524',
                      border: safePage === totalPages ? '1px solid transparent' : '1px solid #DDD5C7',
                      cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        </div>
      </main>

      {/* Interactive Modal: Submit or Edit Feedback */}
      <AnimatePresence>
        {showSubmitModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(41, 37, 36, 0.7)',
                backdropFilter: 'blur(8px)',
              }}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '460px',
                maxHeight: '92vh',
                overflowY: 'auto',
                backgroundColor: '#FDFBF7',
                border: '1px solid #DDD5C7',
                borderRadius: '24px',
                padding: '26px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
                zIndex: 10,
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSubmitModal(false)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
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
                }}
              >
                <X size={16} />
              </button>

              {submitSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ width: '85px', height: '85px', margin: '0 auto 14px auto' }}>
                    <Image
                      src="/images/pangly_celebrate.gif"
                      unoptimized
                      alt="Pangly Celebrate"
                      width={85}
                      height={85}
                      style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                    />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2D6A4F', marginBottom: '8px' }}>
                    {editingId ? 'Changes Saved! 🇵🇭' : 'Maraming Salamat!'}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#57534E', margin: 0, lineHeight: 1.55 }}>
                    {editingId 
                      ? 'Your feedback has been successfully updated on the community board.'
                      : 'Your feedback is now live on the community board and saved directly to our roadmap! You can edit or delete it anytime.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Header with mobile padding right to avoid overlapping X button */}
                  <div style={{ paddingRight: '40px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#292524', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                      {editingId ? 'Edit Your Feedback' : 'Share Feedback or Request an ID'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#78716C', margin: 0 }}>
                      {editingId 
                        ? 'Update your message, rating, or category.'
                        : 'What document, feature, or improvement should Pangly build next?'}
                    </p>
                  </div>

                  {/* Verified Pilot Slot Status (if claimed) */}
                  {mySlotNumber && !editingId && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 700, color: '#2D6A4F', background: '#E8F5E9', border: '1px solid #C8E6C9', padding: '3px 9px', borderRadius: '8px', width: 'fit-content' }}>
                      <ShieldCheck size={12} color="#2D6A4F" />
                      <span>Posting as Tester #{mySlotNumber}</span>
                    </div>
                  )}

                  {/* Category Selection with Clean SVG Icons */}
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Category
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                      {[
                        { id: 'feature_request', label: 'Feature Request', icon: Lightbulb, color: '#2D6A4F' },
                        { id: 'review', label: 'Pilot Review', icon: Star, color: '#F59E0B' },
                        { id: 'bug_report', label: 'Bug Report', icon: Bug, color: '#DC2626' },
                        { id: 'general', label: 'General Idea', icon: MessageSquare, color: '#57534E' },
                      ].map((cat) => {
                        const isSelected = formCategory === cat.id;
                        const CatIcon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormCategory(cat.id as any)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 10px',
                              fontSize: '0.78rem',
                              fontWeight: isSelected ? 700 : 500,
                              borderRadius: '10px',
                              border: isSelected ? '1.5px solid #2D6A4F' : '1px solid #DDD5C7',
                              backgroundColor: isSelected ? '#EDE7DE' : '#FFFFFF',
                              color: isSelected ? '#2D6A4F' : '#57534E',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <CatIcon size={14} color={isSelected ? '#2D6A4F' : cat.color} />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Rating (Optional)
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          aria-label={`${star} star${star > 1 ? 's' : ''}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Star
                            size={20}
                            color={star <= formRating ? '#F59E0B' : '#DDD5C7'}
                            fill={star <= formRating ? '#F59E0B' : 'transparent'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', display: 'block' }}>
                        Your Message / Suggestion *
                      </label>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: formMessage.trim().length >= 3 ? '#2D6A4F' : '#A8A29E' }}>
                        {formMessage.trim().length === 0 ? 'Min 3 chars' : formMessage.trim().length < 3 ? `${3 - formMessage.trim().length} more chars` : `${formMessage.trim().length} chars`}
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="e.g. Please add PhilHealth QR code scanner and Senior Citizen booklet tracking..."
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '0.86rem',
                        fontFamily: 'inherit',
                        color: '#292524',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #DDD5C7',
                        borderRadius: '12px',
                        outline: 'none',
                        resize: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#2D6A4F')}
                      onBlur={(e) => (e.target.style.borderColor = '#DDD5C7')}
                    />
                  </div>

                  {/* Required Name Input */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>
                        Your Name or Handle *
                      </label>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: formName.trim().length >= 2 ? '#2D6A4F' : '#A8A29E' }}>
                        {formName.trim().length === 0 ? 'Required' : formName.trim().length < 2 ? 'Min 2 chars' : 'Ready'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Marco • Cebu or Kuya Dan"
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        fontSize: '0.84rem',
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

                  {submitError && (
                    <div style={{ fontSize: '0.78rem', color: '#B91C1C', background: '#FEE2E2', padding: '6px 10px', borderRadius: '8px' }}>
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || formMessage.trim().length < 3 || formName.trim().length < 2}
                    className="btn-primary"
                    style={{
                      padding: '12px 18px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: isSubmitting || formMessage.trim().length < 3 || formName.trim().length < 2 ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting || formMessage.trim().length < 3 || formName.trim().length < 2 ? 0.6 : 1,
                    }}
                  >
                    <Send size={15} />
                    <span>
                      {isSubmitting 
                        ? 'Saving...' 
                        : editingId 
                          ? 'Save Changes' 
                          : 'Post to Community Board'}
                    </span>
                  </button>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
