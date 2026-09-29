import { pgTable, serial, integer, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const earlyAccessSlots = pgTable('early_access_slots', {
  id: serial('id').primaryKey(),
  slotNumber: integer('slot_number').notNull().unique(),
  token: varchar('token', { length: 64 }).notNull().unique(),
  ipHash: varchar('ip_hash', { length: 64 }).notNull(),
  downloadsCount: integer('downloads_count').default(1).notNull(),
  userAgent: varchar('user_agent', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const customerFeedbacks = pgTable('customer_feedbacks', {
  id: serial('id').primaryKey(),
  category: varchar('category', { length: 32 }).notNull().default('feature_request'), // 'feature_request' | 'bug_report' | 'review' | 'general'
  rating: integer('rating'), // 1 - 5 stars
  message: text('message').notNull(),
  name: varchar('name', { length: 100 }).notNull(), // Required name or nickname
  contact: varchar('contact', { length: 150 }), // Email or FB handle (optional)
  slotNumber: integer('slot_number'), // Slot number if verified pilot downloader
  userAgent: varchar('user_agent', { length: 255 }),
  ipHash: varchar('ip_hash', { length: 64 }),
  authorToken: varchar('author_token', { length: 64 }), // Token to allow author to edit or delete their own feedback
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export type SlotRecord = typeof earlyAccessSlots.$inferSelect;
export type NewSlotRecord = typeof earlyAccessSlots.$inferInsert;
export type FeedbackRecord = typeof customerFeedbacks.$inferSelect;
export type NewFeedbackRecord = typeof customerFeedbacks.$inferInsert;
