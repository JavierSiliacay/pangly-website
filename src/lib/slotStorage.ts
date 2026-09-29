// src/lib/slotStorage.ts
import crypto from 'crypto';
import { count, desc, eq, or } from 'drizzle-orm';
import { db } from '@/db';
import { earlyAccessSlots } from '@/db/schema';

export interface SlotRecord {
  slot: number;
  token: string;
  ipHash: string;
  claimedAt: string;
  downloadsCount: number;
  userAgent?: string;
}

const MAX_SLOTS = 100;

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip || 'unknown-ip').digest('hex').substring(0, 16);
}

export async function getSlotStatus(token?: string | null, ip?: string | null) {
  try {
    const ipHash = ip ? hashIp(ip) : '';

    // Check count of claimed slots
    const countRes = await db.select({ value: count() }).from(earlyAccessSlots);
    const totalClaimed = Number(countRes[0]?.value ?? 0);

    // Check if this visitor already claimed a slot by their unique browser token
    let existing;
    if (token) {
      const records = await db
        .select()
        .from(earlyAccessSlots)
        .where(eq(earlyAccessSlots.token, token))
        .limit(1);
      existing = records[0];
    }

    return {
      totalClaimed,
      maxSlots: MAX_SLOTS,
      remaining: Math.max(0, MAX_SLOTS - totalClaimed),
      isFull: totalClaimed >= MAX_SLOTS,
      mySlot: existing ? existing.slotNumber : null,
      token: existing ? existing.token : null,
      isExisting: !!existing,
    };
  } catch (err) {
    console.error('Error fetching slot status from Neon DB:', err);
    return {
      totalClaimed: 0,
      maxSlots: MAX_SLOTS,
      remaining: MAX_SLOTS,
      isFull: false,
      mySlot: null,
      token: null,
      isExisting: false,
    };
  }
}

export async function claimSlot(token?: string | null, ip?: string | null, userAgent?: string) {
  try {
    const ipHash = ip ? hashIp(ip) : '';

    // 1. Check if user already has a slot by their unique browser token
    let existing;
    if (token) {
      const records = await db
        .select()
        .from(earlyAccessSlots)
        .where(eq(earlyAccessSlots.token, token))
        .limit(1);
      existing = records[0];
    }

    if (existing) {
      // Duplicate detected! Increment download count for this slot holder without consuming quota
      await db
        .update(earlyAccessSlots)
        .set({ downloadsCount: (existing.downloadsCount || 1) + 1 })
        .where(eq(earlyAccessSlots.id, existing.id));

      const countRes = await db.select({ value: count() }).from(earlyAccessSlots);
      const totalClaimed = Number(countRes[0]?.value ?? 0);

      return {
        success: true,
        isExisting: true,
        slotNumber: existing.slotNumber,
        totalClaimed,
        maxSlots: MAX_SLOTS,
        remaining: Math.max(0, MAX_SLOTS - totalClaimed),
        token: existing.token,
      };
    }

    // Anti-bot check: allow multiple users/devices on the same Wi-Fi (up to 5 per IP)
    if (ipHash) {
      const ipClaims = await db
        .select({ value: count() })
        .from(earlyAccessSlots)
        .where(eq(earlyAccessSlots.ipHash, ipHash));
      const ipCount = Number(ipClaims[0]?.value ?? 0);
      if (ipCount >= 5) {
        return {
          success: false,
          isExisting: false,
          isFull: false,
          slotNumber: null,
          totalClaimed: 0,
          maxSlots: MAX_SLOTS,
          remaining: 0,
          token: null,
          message: 'Pilot slot limit reached for this network (max 5 per network).',
        };
      }
    }


    // 2. Check if slots are full
    const countRes = await db.select({ value: count() }).from(earlyAccessSlots);
    const totalClaimed = Number(countRes[0]?.value ?? 0);

    if (totalClaimed >= MAX_SLOTS) {
      return {
        success: false,
        isExisting: false,
        isFull: true,
        slotNumber: null,
        totalClaimed,
        maxSlots: MAX_SLOTS,
        remaining: 0,
        token: null,
        message: 'Pilot early access quota is currently full (100/100).',
      };
    }

    // 3. Assign next real slot number
    const highestSlot = await db
      .select({ slotNumber: earlyAccessSlots.slotNumber })
      .from(earlyAccessSlots)
      .orderBy(desc(earlyAccessSlots.slotNumber))
      .limit(1);
    const assignedSlot = (highestSlot[0]?.slotNumber ?? 0) + 1;

    if (assignedSlot > MAX_SLOTS) {
      return {
        success: false,
        isExisting: false,
        isFull: true,
        slotNumber: null,
        totalClaimed: MAX_SLOTS,
        maxSlots: MAX_SLOTS,
        remaining: 0,
        token: null,
        message: 'Pilot early access quota is currently full (100/100).',
      };
    }

    const newToken = token && token.length >= 10 ? token : `pangly_pilot_${crypto.randomUUID()}`;

    await db.insert(earlyAccessSlots).values({
      slotNumber: assignedSlot,
      token: newToken,
      ipHash: ipHash || 'unknown-ip',
      downloadsCount: 1,
      userAgent: userAgent ? userAgent.substring(0, 255) : undefined,
    });

    const newCountRes = await db.select({ value: count() }).from(earlyAccessSlots);
    const newTotalClaimed = Number(newCountRes[0]?.value ?? assignedSlot);

    return {
      success: true,
      isExisting: false,
      slotNumber: assignedSlot,
      totalClaimed: newTotalClaimed,
      maxSlots: MAX_SLOTS,
      remaining: Math.max(0, MAX_SLOTS - newTotalClaimed),
      token: newToken,
    };
  } catch (err) {
    console.error('Error claiming slot in Neon DB:', err);
    return {
      success: false,
      isExisting: false,
      isFull: false,
      slotNumber: null,
      totalClaimed: 0,
      maxSlots: MAX_SLOTS,
      remaining: MAX_SLOTS,
      token: null,
      message: 'Failed to claim slot due to database error.',
    };
  }
}
