import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
  real,
  varchar,
  time,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(), // Made optional and nullable
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  pinHash: text("pin_hash"), // PIN authentication
  pinResetAt: timestamp("pin_reset_at"), // Track when PIN was last reset for token invalidation
  phone: text("phone"),
  role: text("role").notNull().default("user"), // user, admin
  isActive: boolean("is_active").default(true).notNull(),
  balance: integer("balance").default(0).notNull(), // Balance in paise (1 rupee = 100 paise)
  walletBalance: integer("wallet_balance").default(0).notNull(), // Wallet balance in paise
  dateOfBirth: timestamp("date_of_birth"),
  timeOfBirth: text("time_of_birth"),
  placeOfBirth: text("place_of_birth"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  totalConsultations: integer("total_consultations").default(0).notNull(),
  totalSpent: integer("total_spent").default(0).notNull(), // in paise
  preferredLanguages: text("preferred_languages").array().default([]).notNull(),
  googleId: text("google_id").unique(),
  isVerified: boolean("is_verified").default(false).notNull(),
  fullName: text("full_name"),
  // Additional OTP fields for login and password reset
  loginOtp: text("login_otp"),
  loginOtpExpiry: timestamp("login_otp_expiry"),
  resetOtp: text("reset_otp"),
  resetOtpExpiry: timestamp("reset_otp_expiry"),
  // Location fields
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  category: varchar("category").notNull(),
  answer: text("answer"),
  isPriority: boolean("is_priority").default(false),
  isPaid: boolean("is_paid").default(false),
  answeredBy: varchar("answered_by"),
  createdAt: timestamp("created_at").defaultNow(),
  answeredAt: timestamp("answered_at"),
});

// FAQ Questions schema for FAQ functionality
export const faqQuestions = pgTable("faq_questions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  gender: varchar("gender").notNull(),
  birthDate: date("birth_date").notNull(),
  birthTime: varchar("birth_time").notNull(),
  birthPlace: varchar("birth_place").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  freeQuestion: text("free_question").notNull(),
  additionalQuestion1: text("additional_question_1"),
  additionalQuestion2: text("additional_question_2"),
  hasPaidQuestions: boolean("has_paid_questions").default(false),
  paymentId: varchar("payment_id"),
  paymentTxnId: varchar("payment_txn_id"), // Store FAQ transaction ID for payment reconstruction
  paymentStatus: varchar("payment_status").default("pending"), // pending, success, failed
  paymentAmount: integer("payment_amount").default(0), // in paise
  answer: text("answer"),
  answeredBy: varchar("answered_by"),
  assignedAstrologerId: integer("assigned_astrologer_id").references(() => astrologers.id),
  status: varchar("status").default("pending"), // pending, answered
  createdAt: timestamp("created_at").defaultNow(),
  answeredAt: timestamp("answered_at"),
});

// Session Bookings Table
export const sessionBookings = pgTable("session_bookings", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  gender: varchar("gender").notNull(),
  birthDate: date("birth_date").notNull(),
  birthTime: varchar("birth_time").notNull(),
  birthPlace: varchar("birth_place").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  bookingDate: date("booking_date").notNull(),
  bookingTime: varchar("booking_time").notNull(),
  sessionType: varchar("session_type").default("consultation").notNull(),
  paymentId: varchar("payment_id"),
  paymentStatus: varchar("payment_status").default("pending"), // pending, success, failed
  paymentAmount: integer("payment_amount").default(15000), // ₹150 in paise
  status: varchar("status").default("pending"), // pending, confirmed, completed, cancelled
  adminNotes: text("admin_notes"),
  userPin: varchar("user_pin"), // 6-digit PIN if user email doesn't exist
  isSlotBlocked: boolean("is_slot_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

// Admin Responses Table for both FAQ and Session bookings
export const adminResponses = pgTable("admin_responses", {
  id: serial("id").primaryKey(),
  responseType: varchar("response_type").notNull(), // "faq" or "session"
  referenceId: integer("reference_id").notNull(), // faqQuestions.id or sessionBookings.id
  responseText: text("response_text").notNull(),
  pdfAttachment: varchar("pdf_attachment"), // File path or URL to PDF
  respondedBy: varchar("responded_by").notNull(), // Admin email/ID
  emailSent: boolean("email_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookingDate: date("booking_date").notNull(),
  bookingTime: time("booking_time").notNull(),
  sessionType: varchar("session_type").notNull(),
  astrologer: varchar("astrologer"),
  duration: integer("duration").notNull(), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  questions: many(questions),
  appointments: many(appointments),
  reports: many(reports),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  user: one(users, {
    fields: [questions.userId],
    references: [users.id],
  }),
  reports: many(reports),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [reports.questionId],
    references: [questions.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
  answeredAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertFAQQuestionSchema = createInsertSchema(faqQuestions).omit({
  id: true,
  createdAt: true,
  answeredAt: true,
});

// FAQ Form validation schemas
export const faqUserInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const faqQuestionSchema = z.object({
  freeQuestion: z.string().min(10, "Question must be at least 10 characters"),
  additionalQuestion1: z.string().optional(),
  additionalQuestion2: z.string().optional(),
  hasPaidQuestions: z.boolean().default(false),
});

// Session Booking Schemas
export const insertSessionBookingSchema = createInsertSchema(sessionBookings).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export const sessionBookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
});

// Admin Response Schema
export const insertAdminResponseSchema = createInsertSchema(adminResponses).omit({
  id: true,
  createdAt: true,
});

export const adminResponseFormSchema = z.object({
  responseType: z.enum(["faq", "session"]),
  referenceId: z.number(),
  responseText: z.string().min(10, "Response must be at least 10 characters"),
  pdfAttachment: z.string().optional(),
  respondedBy: z.string().min(1, "Responder name is required"),
});

export type UpsertUser = typeof users.$inferInsert;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertFAQQuestion = z.infer<typeof insertFAQQuestionSchema>;
export type SelectFAQQuestion = typeof faqQuestions.$inferSelect;
export type FAQUserInfo = z.infer<typeof faqUserInfoSchema>;
export type FAQQuestionForm = z.infer<typeof faqQuestionSchema>;
export type InsertSessionBooking = z.infer<typeof insertSessionBookingSchema>;
export type SelectSessionBooking = typeof sessionBookings.$inferSelect;
export type SessionBookingForm = z.infer<typeof sessionBookingFormSchema>;
export type InsertAdminResponse = z.infer<typeof insertAdminResponseSchema>;
export type SelectAdminResponse = typeof adminResponses.$inferSelect;
export type AdminResponseForm = z.infer<typeof adminResponseFormSchema>;

export const astrologers = pgTable("astrologers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  image: text("image").notNull(),
  experience: integer("experience").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull(),
  ratePerMinute: integer("rate_per_minute").notNull(),
  specializations: text("specializations").array().notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  languages: text("languages").array().notNull(),
  description: text("description").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  totalConsultations: integer("total_consultations").default(0).notNull(),
  totalEarnings: integer("total_earnings").default(0).notNull(), // in paise
  availableFrom: text("available_from"), // e.g., "09:00"
  availableTo: text("available_to"), // e.g., "18:00"
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  maxConcurrentUsers: integer("max_concurrent_users").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  sign: text("sign").notNull(),
  period: text("period").notNull(), // daily, weekly, monthly
  date: text("date").notNull(),
  prediction: text("prediction").notNull(),
  luckyNumbers: integer("lucky_numbers").array().notNull(),
  luckyColors: text("lucky_colors").array().notNull(),
  favorableTime: text("favorable_time").notNull(),
  avoidTime: text("avoid_time").notNull(),
  generalAdvice: text("general_advice").notNull(),
  loveLife: text("love_life").notNull(),
  career: text("career").notNull(),
  health: text("health").notNull(),
  finances: text("finances").notNull(),
  spirituality: text("spirituality").notNull(),
  transitData: jsonb("transit_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  astrologerId: integer("astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  topic: text("topic").notNull(),
  duration: integer("duration").notNull(), // in minutes
  cost: integer("cost").notNull(), // in paise
  rating: integer("rating"), // 1-5 stars
  review: text("review"),
  status: text("status").notNull().default("queued"), // queued, active, completed, cancelled, paid
  paymentId: text("payment_id"), // PayU transaction ID
  paymentStatus: text("payment_status").default("pending"), // pending, success, failed
  userDetails: jsonb("user_details"), // birth details and question
  timerStarted: boolean("timer_started").default(false).notNull(),
  timerStartTime: timestamp("timer_start_time"),
  astrologerExtensions: integer("astrologer_extensions").default(0).notNull(), // track free extensions used
  queuePosition: integer("queue_position"), // Position in queue for the astrologer
  estimatedWaitTime: integer("estimated_wait_time"), // in minutes
  // Chat Rerouting Fields
  isRerouted: boolean("is_rerouted").default(false).notNull(),
  reroutedTo: integer("rerouted_to").references(() => astrologers.id), // actual astrologer handling the consultation
  queueEnteredAt: timestamp("queue_entered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

// Queue Management System
export const consultationQueue = pgTable("consultation_queue", {
  id: serial("id").primaryKey(),
  astrologerId: integer("astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  consultationId: integer("consultation_id").references(() => consultations.id),
  position: integer("position").notNull(),
  joinTime: timestamp("join_time").defaultNow().notNull(),
  estimatedWaitMinutes: integer("estimated_wait_minutes"),
  paymentId: text("payment_id"), // PayU transaction ID for queue payment
  paymentStatus: text("payment_status").default("pending"), // pending, success, failed
  status: text("status").notNull().default("waiting"), // waiting, ready, expired, cancelled
  sessionId: text("session_id"), // Socket session for real-time updates
  notificationSent: boolean("notification_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Active Consultation Tracking
export const activeConsultations = pgTable("active_consultations", {
  id: serial("id").primaryKey(),
  astrologerId: integer("astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  consultationId: integer("consultation_id")
    .references(() => consultations.id)
    .notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  sessionId: text("session_id"), // Socket session ID
  socketId: text("socket_id"), // Socket connection ID
  status: text("status").notNull().default("active"), // active, paused, ending
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id")
    .references(() => consultations.id)
    .notNull(),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  senderType: text("sender_type").notNull(), // user, astrologer
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  // Advanced messaging features
  isEdited: boolean("is_edited").default(false).notNull(),
  editedAt: timestamp("edited_at"),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedBy: integer("deleted_by").references(() => users.id),
  deletedAt: timestamp("deleted_at"),
  replyToMessageId: integer("reply_to_message_id"),
  isPinned: boolean("is_pinned").default(false).notNull(),
  pinnedBy: integer("pinned_by").references(() => users.id),
  pinnedAt: timestamp("pinned_at"),
  reactions: jsonb("reactions").default({}),
  messageType: text("message_type").notNull().default("text"), // text, image, voice, file
  attachmentUrl: text("attachment_url"),
  attachmentType: text("attachment_type"), // image, voice, file
  status: text("status").notNull().default("sent"), // sending, sent, delivered, read, failed
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id")
    .references(() => consultations.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  astrologerId: integer("astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  isVerified: boolean("is_verified").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'consultation', 'payment', 'system'
  isRead: boolean("is_read").default(false).notNull(),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  astrologerId: integer("astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailVerifications = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  newEmail: text("new_email").notNull(),
  verificationCode: text("verification_code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CMS Tables
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  authorId: integer("author_id")
    .references(() => users.id)
    .notNull(),
  status: text("status").notNull().default("draft"), // draft, published, archived
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords").array(),
  readTime: integer("read_time").default(5).notNull(), // in minutes
  viewCount: integer("view_count").default(0).notNull(),
  language: text("language").notNull().default("en"), // en, hi, es, fr, etc.
  focusKeyword: text("focus_keyword"),
  parentArticleId: integer("parent_article_id"), // for translations
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  color: text("color").default("#8B5CF6").notNull(),
  icon: text("icon").default("📖").notNull(),
  language: text("language").notNull().default("en"),
  parentCategoryId: integer("parent_category_id"), // for translations
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articleViews = pgTable("article_views", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id")
    .references(() => articles.id)
    .notNull(),
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

// User Profiles & Preferences
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  birthDate: timestamp("birth_date"),
  birthTime: text("birth_time"),
  birthLocation: text("birth_location"),
  birthLatitude: decimal("birth_latitude"),
  birthLongitude: decimal("birth_longitude"),
  zodiacSign: text("zodiac_sign"),
  moonSign: text("moon_sign"),
  risingSign: text("rising_sign"),
  birthChartData: jsonb("birth_chart_data"),
  preferences: jsonb("preferences").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content Templates
export const contentTemplates = pgTable("content_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // horoscope, guide, consultation
  template: text("template").notNull(),
  variables: jsonb("variables").default([]).notNull(),
  language: text("language").notNull().default("en"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Personalized Recommendations
export const userRecommendations = pgTable("user_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  articleId: integer("article_id")
    .references(() => articles.id)
    .notNull(),
  score: decimal("score").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Reading History
export const readingHistory = pgTable("reading_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  articleId: integer("article_id")
    .references(() => articles.id)
    .notNull(),
  timeSpent: integer("time_spent"), // in seconds
  completionPercentage: decimal("completion_percentage").default("0"),
  readAt: timestamp("read_at").defaultNow().notNull(),
});

// Chat Rerouting System
export const chatRouting = pgTable("chat_routing", {
  id: serial("id").primaryKey(),
  originalAstrologerId: integer("original_astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  assignedAstrologerId: integer("assigned_astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  priority: integer("priority").default(1).notNull(), // Higher priority = processed first
  reason: text("reason"), // Admin reason for rerouting
  adminId: integer("admin_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const routedConsultations = pgTable("routed_consultations", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id")
    .references(() => consultations.id)
    .notNull(),
  originalAstrologerId: integer("original_astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  assignedAstrologerId: integer("assigned_astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  routingRuleId: integer("routing_rule_id")
    .references(() => chatRouting.id)
    .notNull(),
  status: text("status").notNull().default("active"), // active, completed, failed
  userVisibleName: text("user_visible_name").notNull(), // Name shown to user (original astrologer)
  actualProviderName: text("actual_provider_name").notNull(), // Name of actual provider
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Phase 3: Advanced routing tables for intelligent load balancing
export const astrologerWorkload = pgTable("astrologer_workload", {
  id: serial("id").primaryKey(),
  astrologerId: integer("astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  currentConsultations: integer("current_consultations").default(0).notNull(),
  maxConcurrent: integer("max_concurrent").default(3).notNull(),
  averageResponseTime: integer("average_response_time").default(30).notNull(), // seconds
  performanceScore: decimal("performance_score", { precision: 3, scale: 2 })
    .default("1.0")
    .notNull(),
  workloadPercentage: decimal("workload_percentage", { precision: 5, scale: 2 })
    .default("0.0")
    .notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  isAcceptingNew: boolean("is_accepting_new").default(true).notNull(),
  breakUntil: timestamp("break_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const smartRoutingRules = pgTable("smart_routing_rules", {
  id: serial("id").primaryKey(),
  ruleName: text("rule_name").notNull(),
  conditions: jsonb("conditions").notNull(), // e.g., {"user_language": "hindi", "specialization": "vedic"}
  routingLogic: jsonb("routing_logic").notNull(), // e.g., {"method": "load_balance", "priority": "performance"}
  weight: integer("weight").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  successRate: decimal("success_rate", { precision: 5, scale: 2 })
    .default("0.0")
    .notNull(),
  totalApplications: integer("total_applications").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const consultationAnalytics = pgTable("consultation_analytics", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id")
    .references(() => consultations.id)
    .notNull(),
  originalAstrologerId: integer("original_astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  assignedAstrologerId: integer("assigned_astrologer_id")
    .references(() => astrologers.id)
    .notNull(),
  routingRuleId: integer("routing_rule_id").references(
    () => smartRoutingRules.id,
  ),
  matchScore: decimal("match_score", { precision: 5, scale: 2 }), // 0.0 to 100.0
  waitTimeSeconds: integer("wait_time_seconds"),
  responseTimeAvg: integer("response_time_avg"),
  userSatisfaction: decimal("user_satisfaction", { precision: 3, scale: 2 }), // 1.0 to 5.0
  routingEffectiveness: decimal("routing_effectiveness", {
    precision: 5,
    scale: 2,
  }), // 0.0 to 100.0
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Queue Schema Types
export const insertConsultationQueueSchema =
  createInsertSchema(consultationQueue);
export type InsertConsultationQueue = z.infer<
  typeof insertConsultationQueueSchema
>;
export type ConsultationQueue = typeof consultationQueue.$inferSelect;

export const insertActiveConsultationSchema =
  createInsertSchema(activeConsultations);
export type InsertActiveConsultation = z.infer<
  typeof insertActiveConsultationSchema
>;
export type ActiveConsultation = typeof activeConsultations.$inferSelect;

// Horoscope Schema Types
export const insertHoroscopeSchema = createInsertSchema(horoscopes);
export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscopes.$inferSelect;

// Birth Charts
export const birthCharts = pgTable("birth_charts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Made optional for anonymous reports
  name: text("name").notNull(),
  birthDate: timestamp("birth_date").notNull(),
  birthTime: text("birth_time").notNull(),
  birthLocation: text("birth_location").notNull(),
  latitude: decimal("latitude").notNull(),
  longitude: decimal("longitude").notNull(),
  chartData: jsonb("chart_data").notNull(),
  interpretations: jsonb("interpretations").default({}).notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  isAnonymous: boolean("is_anonymous").default(false).notNull(), // Track anonymous reports
  sessionId: text("session_id"), // Optional session tracking for anonymous users
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Compatibility Reports
export const compatibilityReports = pgTable("compatibility_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Made optional for anonymous reports
  chart1Id: integer("chart1_id")
    .references(() => birthCharts.id)
    .notNull(),
  chart2Id: integer("chart2_id")
    .references(() => birthCharts.id)
    .notNull(),
  compatibilityScore: real("compatibility_score").notNull(),
  analysis: jsonb("analysis").notNull(),
  isAnonymous: boolean("is_anonymous").default(false).notNull(), // Track anonymous reports
  sessionId: text("session_id"), // Optional session tracking for anonymous users
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// IndexNow Integration Tables
export const indexNowSubmissions = pgTable("indexnow_submissions", {
  id: serial("id").primaryKey(),
  urls: text("urls").array().notNull(),
  contentType: text("content_type").notNull(), // horoscope, article, page, custom
  relatedId: integer("related_id"), // article_id, horoscope_id, etc.
  status: text("status").notNull().default("pending"), // pending, success, failed
  responseCode: integer("response_code"),
  responseMessage: text("response_message"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  retryCount: integer("retry_count").default(0).notNull(),
  nextRetryAt: timestamp("next_retry_at"),
});

export const indexNowConfig = pgTable("indexnow_config", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull().unique(),
  apiKey: text("api_key").notNull(),
  keyLocation: text("key_location").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transit Notifications
export const transitNotifications = pgTable("transit_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  transitType: text("transit_type").notNull(),
  planet: text("planet").notNull(),
  aspect: text("aspect"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  notificationSent: boolean("notification_sent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Daily Horoscopes
export const dailyHoroscopes = pgTable("daily_horoscopes", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  zodiacSign: text("zodiac_sign").notNull(),
  content: text("content").notNull(),
  mood: text("mood"),
  luckyNumber: integer("lucky_number"),
  luckyColor: text("lucky_color"),
  compatibility: text("compatibility"),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content Scheduling
export const scheduledContent = pgTable("scheduled_content", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id")
    .references(() => articles.id)
    .notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, published, failed
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Coupons
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  type: text("type").notNull(), // percentage, fixed
  value: integer("value").notNull(), // percentage (1-100) or amount in paise
  minOrderAmount: integer("min_order_amount").default(0).notNull(), // in paise
  maxDiscountAmount: integer("max_discount_amount"), // in paise, for percentage coupons
  usageLimit: integer("usage_limit"), // null = unlimited
  usedCount: integer("used_count").default(0).notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  applicableToUsers: text("applicable_to_users").array(), // specific user IDs, null = all users
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// A/B Testing
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  articleId: integer("article_id")
    .references(() => articles.id)
    .notNull(),
  variantA: jsonb("variant_a").notNull(),
  variantB: jsonb("variant_b").notNull(),
  trafficSplit: real("traffic_split").default(0.5).notNull(),
  status: text("status").notNull().default("active"), // active, paused, completed
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  results: jsonb("results"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// A/B Test Interactions
export const abTestInteractions = pgTable("ab_test_interactions", {
  id: serial("id").primaryKey(),
  testId: integer("test_id")
    .references(() => abTests.id)
    .notNull(),
  userId: integer("user_id").references(() => users.id),
  variant: text("variant").notNull(), // A or B
  interaction: text("interaction").notNull(), // view, click, conversion
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Analytics
export const userAnalytics = pgTable("user_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  event: text("event").notNull(),
  properties: jsonb("properties").default({}).notNull(),
  sessionId: text("session_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email Campaigns
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  templateId: integer("template_id").references(() => contentTemplates.id),
  status: text("status").notNull().default("draft"), // draft, sending, sent, paused
  recipientFilter: jsonb("recipient_filter").default({}).notNull(),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  openRate: real("open_rate").default(0),
  clickRate: real("click_rate").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email Subscriptions
export const emailSubscriptions = pgTable("email_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull(),
  subscriptionType: text("subscription_type").notNull(), // newsletter, horoscope, consultation_updates
  isActive: boolean("is_active").default(true).notNull(),
  preferences: jsonb("preferences").default({}).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// Webinars
export const webinars = pgTable("webinars", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  hostId: integer("host_id")
    .references(() => astrologers.id)
    .notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  maxParticipants: integer("max_participants"),
  price: integer("price").default(0).notNull(), // in paise
  status: text("status").notNull().default("scheduled"), // scheduled, live, completed, cancelled
  meetingUrl: text("meeting_url"),
  recordingUrl: text("recording_url"),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Webinar Registrations
export const webinarRegistrations = pgTable("webinar_registrations", {
  id: serial("id").primaryKey(),
  webinarId: integer("webinar_id")
    .references(() => webinars.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  paymentStatus: text("payment_status").default("pending").notNull(),
  attendanceStatus: text("attendance_status").default("registered").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

// Digital Products
export const digitalProducts = pgTable("digital_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // report, chart_reading, premium_article
  price: integer("price").notNull(), // in paise
  astrologerId: integer("astrologer_id").references(() => astrologers.id),
  content: text("content"),
  downloadUrl: text("download_url"),
  isActive: boolean("is_active").default(true).notNull(),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Product Purchases
export const productPurchases = pgTable("product_purchases", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => digitalProducts.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  amount: integer("amount").notNull(), // in paise
  paymentStatus: text("payment_status").notNull().default("pending"),
  paymentId: text("payment_id"),
  downloadCount: integer("download_count").default(0).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
});

// IndexNow Schema Types
export const insertIndexNowSubmissionSchema = createInsertSchema(
  indexNowSubmissions,
).omit({
  id: true,
  submittedAt: true,
});
export type InsertIndexNowSubmission = z.infer<
  typeof insertIndexNowSubmissionSchema
>;
export type IndexNowSubmission = typeof indexNowSubmissions.$inferSelect;

export const insertIndexNowConfigSchema = createInsertSchema(
  indexNowConfig,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertIndexNowConfig = z.infer<typeof insertIndexNowConfigSchema>;
export type IndexNowConfig = typeof indexNowConfig.$inferSelect;

export const insertAstrologerSchema = createInsertSchema(astrologers).omit({
  id: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  endedAt: true,
  timerStarted: true,
  timerStartTime: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export const insertEmailVerificationSchema = createInsertSchema(
  emailVerifications,
).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertArticleViewSchema = createInsertSchema(articleViews).omit({
  id: true,
  viewedAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentTemplateSchema = createInsertSchema(
  contentTemplates,
).omit({
  id: true,
  createdAt: true,
});

export const insertUserRecommendationSchema = createInsertSchema(
  userRecommendations,
).omit({
  id: true,
  createdAt: true,
});

export const insertReadingHistorySchema = createInsertSchema(
  readingHistory,
).omit({
  id: true,
  readAt: true,
});

export const insertBirthChartSchema = createInsertSchema(birthCharts).omit({
  id: true,
  createdAt: true,
});

export const insertCompatibilityReportSchema = createInsertSchema(
  compatibilityReports,
).omit({
  id: true,
  createdAt: true,
});

export const insertTransitNotificationSchema = createInsertSchema(
  transitNotifications,
).omit({
  id: true,
  createdAt: true,
});

export const insertDailyHoroscopeSchema = createInsertSchema(
  dailyHoroscopes,
).omit({
  id: true,
  createdAt: true,
});

export const insertScheduledContentSchema = createInsertSchema(
  scheduledContent,
).omit({
  id: true,
  createdAt: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  usedCount: true,
  createdAt: true,
});

export const insertAbTestSchema = createInsertSchema(abTests).omit({
  id: true,
  createdAt: true,
});

export const insertAbTestInteractionSchema = createInsertSchema(
  abTestInteractions,
).omit({
  id: true,
  createdAt: true,
});

export const insertUserAnalyticsSchema = createInsertSchema(userAnalytics).omit(
  {
    id: true,
    createdAt: true,
  },
);

export const insertEmailCampaignSchema = createInsertSchema(
  emailCampaigns,
).omit({
  id: true,
  createdAt: true,
});

export const insertEmailSubscriptionSchema = createInsertSchema(
  emailSubscriptions,
).omit({
  id: true,
  subscribedAt: true,
});

export const insertWebinarSchema = createInsertSchema(webinars).omit({
  id: true,
  createdAt: true,
});

export const insertWebinarRegistrationSchema = createInsertSchema(
  webinarRegistrations,
).omit({
  id: true,
  registeredAt: true,
});

export const insertDigitalProductSchema = createInsertSchema(
  digitalProducts,
).omit({
  id: true,
  createdAt: true,
});

export const insertProductPurchaseSchema = createInsertSchema(
  productPurchases,
).omit({
  id: true,
  purchasedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Astrologer = typeof astrologers.$inferSelect;
export type InsertAstrologer = z.infer<typeof insertAstrologerSchema>;

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = z.infer<
  typeof insertEmailVerificationSchema
>;

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;

// Extended types for API responses
export type ConsultationWithAstrologer = Consultation & {
  astrologer: Astrologer;
  user?: User;
};

export type ChatMessageWithSender = ChatMessage & {
  senderName: string;
};

export type ReviewWithUser = Review & {
  user: { username: string | null; profileImage: string | null };
};

export type AstrologerWithReviews = Astrologer & {
  reviews: ReviewWithUser[];
};

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type ArticleView = typeof articleViews.$inferSelect;
export type InsertArticleView = z.infer<typeof insertArticleViewSchema>;

export type ArticleWithAuthor = Article & {
  author: { username: string | null; profileImage: string | null };
};

// Admin Settings
export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  category: text("category").default("general").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;

// Chat Rerouting Schema Types
export const insertChatRoutingSchema = createInsertSchema(chatRouting).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertChatRouting = z.infer<typeof insertChatRoutingSchema>;
export type ChatRouting = typeof chatRouting.$inferSelect;

export const insertRoutedConsultationSchema = createInsertSchema(
  routedConsultations,
).omit({
  id: true,
  createdAt: true,
});
export type InsertRoutedConsultation = z.infer<
  typeof insertRoutedConsultationSchema
>;
export type RoutedConsultation = typeof routedConsultations.$inferSelect;

// Phase 3: Advanced routing schema types
export const insertAstrologerWorkloadSchema = createInsertSchema(
  astrologerWorkload,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAstrologerWorkload = z.infer<
  typeof insertAstrologerWorkloadSchema
>;
export type AstrologerWorkload = typeof astrologerWorkload.$inferSelect;

export const insertSmartRoutingRuleSchema = createInsertSchema(
  smartRoutingRules,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSmartRoutingRule = z.infer<
  typeof insertSmartRoutingRuleSchema
>;
export type SmartRoutingRule = typeof smartRoutingRules.$inferSelect;

export const insertConsultationAnalyticsSchema = createInsertSchema(
  consultationAnalytics,
).omit({
  id: true,
  createdAt: true,
});
export type InsertConsultationAnalytics = z.infer<
  typeof insertConsultationAnalyticsSchema
>;
export type ConsultationAnalytics = typeof consultationAnalytics.$inferSelect;
