// src/lib/slotStorage.ts
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface SlotRecord {
  slot: number;
  token: string;
  ipHash: string;
  claimedAt: string;
  downloadsCount: number;
  userAgent?: string;
}

export interface SlotDatabase {
  maxSlots: number;
  claimed: SlotRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'slots.json');
const MAX_SLOTS = 100;

function ensureDb(): SlotDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialDb: SlotDatabase = {
      maxSlots: MAX_SLOTS,
      claimed: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading slots.json, recreating clean database:', err);
    const initialDb: SlotDatabase = {
      maxSlots: MAX_SLOTS,
      claimed: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
}

function saveDb(db: SlotDatabase) {
  try {
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    console.error('Error saving slots.json:', err);
  }
}

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip || 'unknown-ip').digest('hex').substring(0, 16);
}

export function getSlotStatus(token?: string | null, ip?: string | null) {
  const db = ensureDb();
  const totalClaimed = db.claimed.length;
  const ipHash = ip ? hashIp(ip) : '';

  // Check if this visitor already claimed a slot
  let existing: SlotRecord | undefined;
  if (token) {
    existing = db.claimed.find((c) => c.token === token);
  }
  if (!existing && ipHash) {
    existing = db.claimed.find((c) => c.ipHash === ipHash);
  }

  return {
    totalClaimed,
    maxSlots: db.maxSlots,
    remaining: Math.max(0, db.maxSlots - totalClaimed),
    isFull: totalClaimed >= db.maxSlots,
    mySlot: existing ? existing.slot : null,
    token: existing ? existing.token : null,
    isExisting: !!existing,
  };
}

export function claimSlot(token?: string | null, ip?: string | null, userAgent?: string) {
  const db = ensureDb();
  const ipHash = ip ? hashIp(ip) : '';

  // 1. Check if user already has a slot (token or IP match)
  let existing: SlotRecord | undefined;
  if (token) {
    existing = db.claimed.find((c) => c.token === token);
  }
  if (!existing && ipHash) {
    existing = db.claimed.find((c) => c.ipHash === ipHash);
  }

  if (existing) {
    // Duplicate detected! Increment download count for this slot holder without consuming quota
    existing.downloadsCount += 1;
    saveDb(db);

    return {
      success: true,
      isExisting: true,
      slotNumber: existing.slot,
      totalClaimed: db.claimed.length,
      maxSlots: db.maxSlots,
      remaining: Math.max(0, db.maxSlots - db.claimed.length),
      token: existing.token,
    };
  }

  // 2. Check if slots are full
  if (db.claimed.length >= db.maxSlots) {
    return {
      success: false,
      isExisting: false,
      isFull: true,
      slotNumber: null,
      totalClaimed: db.claimed.length,
      maxSlots: db.maxSlots,
      remaining: 0,
      token: null,
      message: 'Pilot early access quota is currently full (100/100).',
    };
  }

  // 3. Assign next real slot atomically
  const assignedSlot = db.claimed.length + 1;
  const newToken = token && token.length >= 10 ? token : `pangly_pilot_${crypto.randomUUID()}`;

  const newRecord: SlotRecord = {
    slot: assignedSlot,
    token: newToken,
    ipHash,
    claimedAt: new Date().toISOString(),
    downloadsCount: 1,
    userAgent: userAgent ? userAgent.substring(0, 150) : undefined,
  };

  db.claimed.push(newRecord);
  saveDb(db);

  return {
    success: true,
    isExisting: false,
    slotNumber: assignedSlot,
    totalClaimed: db.claimed.length,
    maxSlots: db.maxSlots,
    remaining: Math.max(0, db.maxSlots - db.claimed.length),
    token: newToken,
  };
}
