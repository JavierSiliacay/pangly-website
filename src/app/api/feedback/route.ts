// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { and, count, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { customerFeedbacks, earlyAccessSlots } from '@/db/schema';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip || 'unknown-ip').digest('hex').substring(0, 16);
}

// 1. GET: Fetch public feedbacks
export async function GET() {
  try {
    const records = await db
      .select({
        id: customerFeedbacks.id,
        category: customerFeedbacks.category,
        rating: customerFeedbacks.rating,
        message: customerFeedbacks.message,
        name: customerFeedbacks.name,
        slotNumber: customerFeedbacks.slotNumber,
        createdAt: customerFeedbacks.createdAt,
        updatedAt: customerFeedbacks.updatedAt,
      })
      .from(customerFeedbacks)
      .orderBy(desc(customerFeedbacks.createdAt));

    let totalRatings = 0;
    let ratingCount = 0;
    const categoryCounts: Record<string, number> = {
      all: records.length,
      feature_request: 0,
      bug_report: 0,
      review: 0,
      general: 0,
    };

    records.forEach((r) => {
      if (r.rating && r.rating >= 1 && r.rating <= 5) {
        totalRatings += r.rating;
        ratingCount += 1;
      }
      if (r.category in categoryCounts) {
        categoryCounts[r.category] += 1;
      }
    });

    const averageRating = ratingCount > 0 ? (totalRatings / ratingCount).toFixed(1) : '5.0';

    return NextResponse.json({
      success: true,
      feedbacks: records,
      stats: {
        total: records.length,
        averageRating: Number(averageRating),
        ratingCount,
        categoryCounts,
      },
    });
  } catch (err) {
    console.error('Error fetching feedbacks from Neon DB:', err);
    return NextResponse.json({
      success: true,
      feedbacks: [],
      stats: {
        total: 0,
        averageRating: 5.0,
        ratingCount: 0,
        categoryCounts: { all: 0, feature_request: 0, bug_report: 0, review: 0, general: 0 },
      },
    });
  }
}

// 2. POST: Submit a new feedback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, message, rating, name, contact, pilotToken } = body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please enter your name or handle (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: 'Please enter a message with at least 3 characters.' },
        { status: 400 }
      );
    }

    if (message.length > 2500) {
      return NextResponse.json(
        { success: false, message: 'Feedback message is too long (maximum 2,500 characters).' },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const ipHash = hashIp(ip);
    const userAgent = req.headers.get('user-agent') || undefined;

    // Rate limiting: allow maximum 10 submissions per IP to avoid spam
    const recentSubmissions = await db
      .select({ value: count() })
      .from(customerFeedbacks)
      .where(eq(customerFeedbacks.ipHash, ipHash));
    const countTotal = Number(recentSubmissions[0]?.value ?? 0);

    if (countTotal >= 10) {
      return NextResponse.json(
        { success: false, message: 'You have submitted multiple feedbacks already. Thank you for your support!' },
        { status: 429 }
      );
    }

    // Dynamic Pilot Verification: Check if submitter has a genuine claimed slot
    const slotCookieToken = req.cookies.get('pangly_slot_token')?.value;
    const candidateToken = (typeof pilotToken === 'string' && pilotToken.trim()) || slotCookieToken;
    let verifiedSlotNumber: number | null = null;

    if (candidateToken) {
      const slotRec = await db
        .select({ slotNumber: earlyAccessSlots.slotNumber })
        .from(earlyAccessSlots)
        .where(eq(earlyAccessSlots.token, candidateToken))
        .limit(1);

      if (slotRec.length > 0) {
        verifiedSlotNumber = slotRec[0].slotNumber;
      }
    }

    const safeCategory = ['feature_request', 'bug_report', 'review', 'general'].includes(category)
      ? category
      : 'feature_request';

    const safeRating = typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : null;

    // Generate unique authorToken for this user to allow editing/deleting later
    const authorToken = `auth_${crypto.randomUUID().replace(/-/g, '')}`;

    const inserted = await db
      .insert(customerFeedbacks)
      .values({
        category: safeCategory,
        rating: safeRating,
        message: message.trim(),
        name: name.trim().substring(0, 100),
        contact: contact && typeof contact === 'string' ? contact.trim().substring(0, 150) : null,
        slotNumber: verifiedSlotNumber,
        userAgent: userAgent ? userAgent.substring(0, 255) : undefined,
        ipHash,
        authorToken,
      })
      .returning({ id: customerFeedbacks.id });

    const feedbackId = inserted[0]?.id;

    return NextResponse.json({
      success: true,
      feedbackId,
      authorToken,
      verifiedSlotNumber,
      message: 'Maraming salamat! Your feedback has been received.',
    });
  } catch (err) {
    console.error('Error saving feedback in Neon DB:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to submit feedback. Please try again.' },
      { status: 500 }
    );
  }
}

// 3. PUT: Edit existing feedback (Verified by authorToken)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, authorToken, message, category, rating, name } = body || {};

    if (!id || !authorToken) {
      return NextResponse.json(
        { success: false, message: 'Missing feedback ID or authorization token.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: 'Please enter a message with at least 3 characters.' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(customerFeedbacks)
      .where(and(eq(customerFeedbacks.id, Number(id)), eq(customerFeedbacks.authorToken, String(authorToken))))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Feedback not found or you are not authorized to edit it.' },
        { status: 403 }
      );
    }

    const safeCategory = ['feature_request', 'bug_report', 'review', 'general'].includes(category)
      ? category
      : existing[0].category;

    const safeRating = typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : existing[0].rating;

    await db
      .update(customerFeedbacks)
      .set({
        category: safeCategory,
        rating: safeRating,
        message: message.trim(),
        name: name !== undefined ? (name ? name.trim().substring(0, 100) : null) : existing[0].name,
        updatedAt: new Date(),
      })
      .where(eq(customerFeedbacks.id, Number(id)));

    return NextResponse.json({
      success: true,
      message: 'Your feedback has been successfully updated!',
    });
  } catch (err) {
    console.error('Error updating feedback in Neon DB:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update feedback. Please try again.' },
      { status: 500 }
    );
  }
}

// 4. DELETE: Delete feedback (Verified by authorToken)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, authorToken } = body || {};

    if (!id || !authorToken) {
      return NextResponse.json(
        { success: false, message: 'Missing feedback ID or authorization token.' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db
      .select()
      .from(customerFeedbacks)
      .where(and(eq(customerFeedbacks.id, Number(id)), eq(customerFeedbacks.authorToken, String(authorToken))))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Feedback not found or you are not authorized to delete it.' },
        { status: 403 }
      );
    }

    await db.delete(customerFeedbacks).where(eq(customerFeedbacks.id, Number(id)));

    return NextResponse.json({
      success: true,
      message: 'Your feedback has been permanently deleted.',
    });
  } catch (err) {
    console.error('Error deleting feedback in Neon DB:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete feedback. Please try again.' },
      { status: 500 }
    );
  }
}
