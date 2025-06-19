import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Subjects
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notes


export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  note: text("note"),
});



/*
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  isShared: boolean('is_shared').default(false),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
*/