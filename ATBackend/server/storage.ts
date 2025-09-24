import {
  users,
  astrologers,
  consultations,
  chatMessages,
  reviews,
  notifications,
  favorites,
  emailVerifications,
  articles,
  categories,
  articleViews,
  adminSettings,
  coupons,
  birthCharts,
  compatibilityReports,
  consultationQueue,
  activeConsultations,
  chatRouting,
  routedConsultations,
  astrologerWorkload,
  smartRoutingRules,
  consultationAnalytics,
  indexNowSubmissions,
  indexNowConfig,
  type User,
  type InsertUser,
  type Astrologer,
  type InsertAstrologer,
  type Consultation,
  type InsertConsultation,
  type ChatMessage,
  type InsertChatMessage,
  type Review,
  type InsertReview,
  type Notification,
  type InsertNotification,
  type Favorite,
  type InsertFavorite,
  type EmailVerification,
  type InsertEmailVerification,
  type ConsultationWithAstrologer,
  type ChatMessageWithSender,
  type ReviewWithUser,
  type Article,
  type InsertArticle,
  type ArticleWithAuthor,
  type Category,
  type InsertCategory,
  type ArticleView,
  type InsertArticleView,
  type AdminSetting,
  type InsertAdminSetting,
  type Coupon,
  type InsertCoupon,
  type ConsultationQueue,
  type InsertConsultationQueue,
  type ActiveConsultation,
  type InsertActiveConsultation,
  type ChatRouting,
  type InsertChatRouting,
  type RoutedConsultation,
  type InsertRoutedConsultation,
  type AstrologerWorkload,
  type InsertAstrologerWorkload,
  type SmartRoutingRule,
  type InsertSmartRoutingRule,
  type ConsultationAnalytics,
  type InsertConsultationAnalytics,
  type IndexNowSubmission,
  type InsertIndexNowSubmission,
  type IndexNowConfig,
  type InsertIndexNowConfig,
} from "../shared/schema";
import { db } from "./db";
import { eq, and, or, desc, avg, sum, inArray, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserStatus(id: number, isActive: boolean): Promise<void>;
  updateUserProfile(id: number, updates: Partial<User>): Promise<void>;
  updateUserPassword(id: number, hashedPassword: string): Promise<void>;
  updateUserGoogleId(userId: number, googleId: string): Promise<void>;
  authenticateUser(email: string, password: string): Promise<User | null>;
  getUserById(id: number): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<User>): Promise<void>;
  getUserStats(userId: number): Promise<any>;
  addWalletBalance(id: number, amount: number): Promise<void>;
  addUserBalance(userId: number, amount: number): Promise<User>;
  updateUserBalance(userId: number, newBalance: number): Promise<void>;

  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Question operations
  createQuestion(question: InsertQuestion): Promise<Question>;
  getUserQuestions(userId: string): Promise<Question[]>;
  getPendingQuestions(): Promise<Question[]>;
  updateQuestion(id: number, data: Partial<Question>): Promise<Question>;
  getQuestionById(id: number): Promise<Question | undefined>;

  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getUserAppointments(userId: string): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  updateAppointment(
    id: number,
    data: Partial<Appointment>,
  ): Promise<Appointment>;

  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getUserReports(userId: string): Promise<Report[]>;

  // Admin operations
  getTodayAppointments(): Promise<Appointment[]>;
  getQuestionStats(): Promise<{
    pending: number;
    answered: number;
    total: number;
  }>;

  // Coupons
  validateCoupon(
    code: string,
    orderAmount: number,
  ): Promise<{
    isValid: boolean;
    type?: string;
    value?: number;
    discount?: number;
    message: string;
  }>;
  useCoupon(couponId: number): Promise<void>;
  getAllCoupons(): Promise<Coupon[]>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, updates: Partial<Coupon>): Promise<Coupon>;
  deleteCoupon(id: number): Promise<void>;

  // Queue management
  getNextQueuePosition(astrologerId: number): Promise<number>;

  // Consultation Queue Management
  addToQueue(queueData: InsertConsultationQueue): Promise<ConsultationQueue>;
  removeFromQueue(queueId: number): Promise<void>;
  getAstrologerQueue(astrologerId: number): Promise<ConsultationQueue[]>;
  getUserQueuePosition(
    userId: number,
    astrologerId: number,
  ): Promise<ConsultationQueue | undefined>;
  updateQueuePosition(queueId: number, position: number): Promise<void>;
  updateQueuePaymentStatus(
    queueId: number,
    paymentId: string,
    paymentStatus: string,
  ): Promise<void>;
  getNextInQueue(astrologerId: number): Promise<ConsultationQueue | undefined>;
  updateQueueStatus(queueId: number, status: string): Promise<void>;
  reorderQueue(astrologerId: number): Promise<void>;
  getQueueEstimatedTime(
    astrologerId: number,
    position: number,
  ): Promise<number>;

  // Active Consultation Management
  createActiveConsultation(
    consultation: InsertActiveConsultation,
  ): Promise<ActiveConsultation>;
  getActiveConsultation(
    astrologerId: number,
  ): Promise<ActiveConsultation | undefined>;
  getActiveConsultationByUser(
    userId: number,
  ): Promise<ActiveConsultation | undefined>;
  endActiveConsultation(consultationId: number): Promise<void>;
  updateActiveConsultationActivity(consultationId: number): Promise<void>;

  // Queue Status and Availability
  isAstrologerBusy(astrologerId: number): Promise<boolean>;
  getAverageConsultationDuration(astrologerId: number): Promise<number>;
  getQueueStatus(astrologerId: number): Promise<{
    isOnline: boolean;
    isBusy: boolean;
    currentConsultation?: ActiveConsultation;
    queueLength: number;
    estimatedWaitTime: number;
  }>;

  // Astrologers
  getAllAstrologers(): Promise<Astrologer[]>;
  getAllAstrologersForAdmin(): Promise<Astrologer[]>;
  getAstrologer(id: number): Promise<Astrologer | undefined>;
  getOnlineAstrologers(): Promise<Astrologer[]>;
  updateAstrologerStatus(id: number, isOnline: boolean): Promise<void>;
  createAstrologer(astrologer: InsertAstrologer): Promise<Astrologer>;
  updateAstrologer(id: number, updates: Partial<Astrologer>): Promise<void>;
  deleteAstrologer(id: number): Promise<void>;
  approveAstrologer(id: number): Promise<void>;
  rejectAstrologer(id: number): Promise<void>;
  getPendingAstrologers(): Promise<Astrologer[]>;
  getAstrologerStats(astrologerId: number): Promise<any>;
  getAstrologerByEmail(email: string): Promise<Astrologer | undefined>;
  getAstrologerActiveConsultations(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer[]>;
  getAstrologerConsultationHistory(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer[]>;

  // Consultations
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultation(id: number): Promise<Consultation | undefined>;
  getUserConsultations(userId: number): Promise<ConsultationWithAstrologer[]>;
  getActiveConsultation(
    userId: number,
  ): Promise<ConsultationWithAstrologer | undefined>;
  endConsultation(id: number, rating?: number, review?: string): Promise<void>;
  updateConsultationPayment(
    id: number,
    paymentId: string,
    paymentStatus: string,
  ): Promise<void>;
  startConsultationTimer(id: number): Promise<void>;
  updateConsultationUserDetails(id: number, userDetails: any): Promise<void>;
  extendConsultation(id: number, additionalMinutes: number): Promise<void>;
  extendConsultationWithAstrologerLimit(
    id: number,
    additionalMinutes: number,
  ): Promise<void>;
  getActiveConsultationsForAstrologer(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer[]>;
  getAllActiveConsultations(): Promise<any[]>;
  updateConsultation(id: number, updates: Partial<Consultation>): Promise<void>;
  confirmQueuePayment(queueId: number, paymentId: string): Promise<void>;

  // Chat Messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getConsultationMessages(
    consultationId: number,
    limit?: number,
    offset?: number,
  ): Promise<ChatMessageWithSender[]>;
  getAllChats(): Promise<any[]>;
  updateChatMessage(
    messageId: number,
    updates: Partial<ChatMessage>,
  ): Promise<void>;
  deleteChatMessage(
    messageId: number,
    userId: number,
    deleteForAll?: boolean,
  ): Promise<void>;
  getChatMessage(messageId: number): Promise<ChatMessage | undefined>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getAstrologerReviews(astrologerId: number): Promise<ReviewWithUser[]>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationRead(id: number): Promise<void>;

  // Favorites
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, astrologerId: number): Promise<void>;
  getUserFavorites(userId: number): Promise<any[]>;

  // Astrologer-specific methods
  getAstrologerActiveConsultations(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer[]>;
  getAstrologerActiveConsultation(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer | undefined>;
  getAstrologerConsultationHistory(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer[]>;

  // Email verification methods
  createEmailVerification(
    verification: InsertEmailVerification,
  ): Promise<EmailVerification>;
  verifyEmailCode(userId: number, code: string): Promise<boolean>;
  updateUserEmail(userId: number, newEmail: string): Promise<void>;

  // CMS Article methods
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, updates: Partial<Article>): Promise<void>;
  deleteArticle(id: number): Promise<void>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<ArticleWithAuthor | undefined>;
  getAllArticles(status?: string): Promise<ArticleWithAuthor[]>;
  getPublishedArticles(limit?: number): Promise<ArticleWithAuthor[]>;
  getArticlesByCategory(category: string): Promise<ArticleWithAuthor[]>;
  incrementArticleViews(id: number): Promise<void>;
  recordArticleView(view: InsertArticleView): Promise<void>;

  // CMS Category methods
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<void>;
  deleteCategory(id: number): Promise<void>;
  getAllCategories(): Promise<Category[]>;
  getActiveCategories(): Promise<Category[]>;

  // Admin Settings
  getAdminSetting(key: string): Promise<AdminSetting | undefined>;
  getAllAdminSettings(): Promise<AdminSetting[]>;

  // Wallet and Coupon methods
  markCouponUsed(code: string, userId: number): Promise<void>;
  getAstrologerById(id: number): Promise<Astrologer | undefined>;
  updateAdminSetting(key: string, value: string): Promise<void>;
  createAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting>;

  // Date-range query methods for reports dashboard
  getBirthChartsForDateRange(startDate: Date, endDate: Date): Promise<any[]>;
  getCompatibilityReportsForDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<any[]>;
  getConsultationsForDateRange(startDate: Date, endDate: Date): Promise<any[]>;
  getBirthChartById(id: number): Promise<any>;
  getCompatibilityReportById(id: number): Promise<any>;

  // Birth chart methods
  createBirthChart(chart: any): Promise<any>;
  getLatestBirthChartByUserId(userId: number): Promise<any>;

  // Anonymous report methods
  createAnonymousBirthChart(chart: any): Promise<any>;
  createAnonymousCompatibilityReport(report: any): Promise<any>;

  // Chat Rerouting Management
  createChatRouting(routing: InsertChatRouting): Promise<ChatRouting>;
  updateChatRouting(id: number, updates: Partial<ChatRouting>): Promise<void>;
  deleteChatRouting(id: number): Promise<void>;
  getAllChatRoutings(): Promise<ChatRouting[]>;
  getActiveChatRoutings(): Promise<ChatRouting[]>;
  getChatRoutingByAstrologer(
    originalAstrologerId: number,
  ): Promise<ChatRouting | undefined>;
  createRoutedConsultation(
    routedConsultation: InsertRoutedConsultation,
  ): Promise<RoutedConsultation>;
  getRoutedConsultation(
    consultationId: number,
  ): Promise<RoutedConsultation | undefined>;
  getOnlineAstrologersForRouting(): Promise<Astrologer[]>;

  // Phase 1: Enhanced consultation routing
  getConsultationWithRouting(consultationId: number): Promise<any>;
  getActiveRouting(originalAstrologerId: number): Promise<any>;

  // Phase 3: Advanced routing operations for intelligent load balancing
  createAstrologerWorkload(
    workload: InsertAstrologerWorkload,
  ): Promise<AstrologerWorkload>;
  updateAstrologerWorkload(
    astrologerId: number,
    updates: Partial<AstrologerWorkload>,
  ): Promise<AstrologerWorkload>;
  getAstrologerWorkload(
    astrologerId: number,
  ): Promise<AstrologerWorkload | undefined>;
  getAllAstrologerWorkloads(): Promise<AstrologerWorkload[]>;

  createSmartRoutingRule(
    rule: InsertSmartRoutingRule,
  ): Promise<SmartRoutingRule>;
  updateSmartRoutingRule(
    id: number,
    updates: Partial<SmartRoutingRule>,
  ): Promise<SmartRoutingRule>;
  deleteSmartRoutingRule(id: number): Promise<void>;
  getActiveSmartRoutingRules(): Promise<SmartRoutingRule[]>;

  createConsultationAnalytics(
    analytics: InsertConsultationAnalytics,
  ): Promise<ConsultationAnalytics>;
  getConsultationAnalytics(
    consultationId: number,
  ): Promise<ConsultationAnalytics[]>;

  // Phase 3: Intelligent matching and load balancing
  findBestAvailableAstrologer(userPreferences: {
    languages?: string[];
    specializations?: string[];
    maxWaitTime?: number;
    priorityLevel?: "normal" | "high" | "urgent";
  }): Promise<{
    astrologer: Astrologer;
    workload: AstrologerWorkload;
    matchScore: number;
    estimatedWaitTime: number;
  } | null>;

  calculateAstrologerMatchScore(
    astrologer: Astrologer,
    workload: AstrologerWorkload,
    userPreferences: any,
  ): Promise<number>;
  updatePerformanceMetrics(
    astrologerId: number,
    responseTime: number,
    userSatisfaction: number,
  ): Promise<void>;
  rebalanceWorkload(): Promise<void>;

  // IndexNow Integration Methods
  createIndexNowConfig(config: InsertIndexNowConfig): Promise<IndexNowConfig>;
  updateIndexNowConfig(
    domain: string,
    updates: Partial<IndexNowConfig>,
  ): Promise<void>;
  getIndexNowConfig(domain: string): Promise<IndexNowConfig | undefined>;
  createIndexNowSubmission(
    submission: InsertIndexNowSubmission,
  ): Promise<IndexNowSubmission>;
  updateIndexNowSubmission(
    id: number,
    updates: Partial<IndexNowSubmission>,
  ): Promise<void>;
  getIndexNowSubmission(id: number): Promise<IndexNowSubmission | undefined>;
  getFailedIndexNowSubmissions(
    maxRetries: number,
  ): Promise<IndexNowSubmission[]>;
  getIndexNowStats(): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
    recentSubmissions: IndexNowSubmission[];
  }>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if we already have data
      const existingAstrologers = await db.select().from(astrologers).limit(1);
      console.log('exisiting astrologers', existingAstrologers)
      if (existingAstrologers.length > 0) return;

      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      console.log('in the seeding')
      await db
        .insert(users)
        .values({
          username: "admin",
          email: "admin@astroconnect.com",
          password: hashedPassword,
          role: "admin",
          isActive: true,
          phone: null,
        })
        .onConflictDoNothing();

      // Create test users
      const testUsers = [
        {
          username: "rahul_sharma",
          email: "rahul@example.com",
          password: await bcrypt.hash("password123", 10),
          role: "user",
          isActive: true,
          phone: "+91 9876543210",
          dateOfBirth: new Date("1990-05-15"),
          timeOfBirth: "14:30",
          placeOfBirth: "Mumbai, Maharashtra",
          bio: "Software engineer seeking guidance on career and relationships",
        },
        {
          username: "priya_singh",
          email: "priya@example.com",
          password: await bcrypt.hash("password123", 10),
          role: "user",
          isActive: true,
          phone: "+91 9876543211",
          dateOfBirth: new Date("1985-08-22"),
          timeOfBirth: "09:45",
          placeOfBirth: "Delhi, India",
          bio: "Marketing professional interested in spiritual growth and meditation",
        },
        {
          username: "amit_patel",
          email: "amit@example.com",
          password: await bcrypt.hash("password123", 10),
          role: "user",
          isActive: true,
          phone: "+91 9876543212",
          dateOfBirth: new Date("1992-12-10"),
          timeOfBirth: "11:20",
          placeOfBirth: "Ahmedabad, Gujarat",
          bio: "Business owner looking for astrological guidance on financial decisions",
        },
        {
          username: "neha_gupta",
          email: "neha@example.com",
          password: await bcrypt.hash("password123", 10),
          role: "user",
          isActive: true,
          phone: "+91 9876543213",
          dateOfBirth: new Date("1988-03-18"),
          timeOfBirth: "16:15",
          placeOfBirth: "Bangalore, Karnataka",
          bio: "Teacher seeking clarity on family matters and personal growth",
        },
        {
          username: "vikash_kumar",
          email: "vikash@example.com",
          password: await bcrypt.hash("password123", 10),
          role: "user",
          isActive: true,
          phone: "+91 9876543214",
          dateOfBirth: new Date("1993-07-05"),
          timeOfBirth: "08:30",
          placeOfBirth: "Chennai, Tamil Nadu",
          bio: "Healthcare professional interested in vedic astrology and life purpose",
        },
      ];

      await db.insert(users).values(testUsers).onConflictDoNothing();

      // Create astrologer user accounts
      const astrologerUsers = [
        {
          username: "priya_astrologer",
          email: "priya.astrologer@example.com",
          password: await bcrypt.hash("astro123", 10),
          role: "astrologer",
          isActive: true,
          phone: "+91 9876543220",
        },
        {
          username: "raj_astrologer",
          email: "raj.astrologer@example.com",
          password: await bcrypt.hash("astro123", 10),
          role: "astrologer",
          isActive: true,
          phone: "+91 9876543221",
        },
        {
          username: "meera_astrologer",
          email: "meera.astrologer@example.com",
          password: await bcrypt.hash("astro123", 10),
          role: "astrologer",
          isActive: true,
          phone: "+91 9876543222",
        },
        {
          username: "arjun_astrologer",
          email: "arjun.astrologer@example.com",
          password: await bcrypt.hash("astro123", 10),
          role: "astrologer",
          isActive: true,
          phone: "+91 9876543223",
        },
      ];

      await db.insert(users).values(astrologerUsers).onConflictDoNothing();

      // Seed astrologers
      const seedAstrologers = [
        {
          name: "Priya Sharma",
          image:
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
          experience: 8,
          rating: "4.9",
          reviewCount: 234,
          ratePerMinute: 45,
          specializations: [
            "Vedic Astrology",
            "Love & Relationships",
            "Career Guidance",
          ],
          isOnline: true,
          languages: ["English", "Hindi"],
          description:
            "Expert in Vedic astrology with focus on relationship and career guidance.",
          isApproved: true,
          isActive: true,
        },
        {
          name: "Raj Gupta",
          image:
            "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
          experience: 12,
          rating: "4.7",
          reviewCount: 189,
          ratePerMinute: 60,
          specializations: ["Tarot Reading", "Numerology", "Spiritual Healing"],
          isOnline: false,
          languages: ["English", "Hindi", "Bengali"],
          description:
            "Master tarot reader specializing in spiritual healing and numerology.",
          isApproved: true,
          isActive: true,
        },
        {
          name: "Meera Devi",
          image:
            "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face",
          experience: 15,
          rating: "5.0",
          reviewCount: 156,
          ratePerMinute: 75,
          specializations: ["Birth Chart", "Palmistry", "Meditation"],
          isOnline: true,
          languages: ["English", "Hindi", "Sanskrit"],
          description:
            "Renowned palmist and meditation guide with extensive birth chart expertise.",
          isApproved: true,
          isActive: true,
        },
        {
          name: "Arjun Singh",
          image:
            "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face",
          experience: 6,
          rating: "4.6",
          reviewCount: 98,
          ratePerMinute: 40,
          specializations: [
            "Vastu Shastra",
            "Gemstone Therapy",
            "Remedial Astrology",
          ],
          isOnline: true,
          languages: ["English", "Hindi", "Punjabi"],
          description:
            "Vastu and gemstone therapy expert providing comprehensive remedial solutions.",
          isApproved: true,
          isActive: true,
        },
      ];

      await db.insert(astrologers).values(seedAstrologers);

      // Get the actual user IDs after insertion
      const createdUsers = await db
        .select()
        .from(users)
        .where(eq(users.role, "user"));
      const createdAstrologers = await db.select().from(astrologers);

      if (createdUsers.length >= 5 && createdAstrologers.length >= 4) {
        // Create sample consultations for test users
        const sampleConsultations = [
          {
            userId: createdUsers[0].id, // rahul_sharma
            astrologerId: createdAstrologers[0].id, // Priya Sharma
            topic: "Career Guidance",
            status: "completed" as const,
            duration: 25,
            cost: 1125, // 25 * 45 paise
            rating: 5,
            review:
              "Excellent guidance on career decisions. Very insightful and accurate predictions.",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          },
          {
            userId: createdUsers[1].id, // priya_singh
            astrologerId: createdAstrologers[2].id, // Meera Devi
            topic: "Spiritual Growth",
            status: "completed" as const,
            duration: 30,
            cost: 2250, // 30 * 75 paise
            rating: 5,
            review:
              "Amazing palmistry reading! Helped me understand my spiritual path better.",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          },
          {
            userId: createdUsers[2].id, // amit_patel
            astrologerId: createdAstrologers[1].id, // Raj Gupta
            topic: "Business & Finance",
            status: "completed" as const,
            duration: 20,
            cost: 1200, // 20 * 60 paise
            rating: 4,
            review:
              "Good insights about business timing. Numerology analysis was helpful.",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          },
          {
            userId: createdUsers[3].id, // neha_gupta
            astrologerId: createdAstrologers[0].id, // Priya Sharma
            topic: "Family & Relationships",
            status: "completed" as const,
            duration: 35,
            cost: 1575, // 35 * 45 paise
            rating: 5,
            review:
              "Very compassionate and understanding. Great advice on family matters.",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          {
            userId: createdUsers[4].id, // vikash_kumar
            astrologerId: createdAstrologers[3].id, // Arjun Singh
            topic: "Health & Vastu",
            status: "completed" as const,
            duration: 15,
            cost: 600, // 15 * 40 paise
            rating: 4,
            review:
              "Helpful vastu suggestions for home. Clear explanations of remedies.",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          },
        ];

        await db.insert(consultations).values(sampleConsultations);

        // Create sample reviews with actual consultation IDs
        const createdConsultations = await db.select().from(consultations);
        const sampleReviews = [
          {
            userId: createdUsers[0].id,
            astrologerId: createdAstrologers[0].id,
            consultationId: createdConsultations[0]?.id || 1,
            rating: 5,
            comment:
              "Excellent guidance on career decisions. Very insightful and accurate predictions.",
            isVerified: true,
          },
          {
            userId: createdUsers[1].id,
            astrologerId: createdAstrologers[2].id,
            consultationId: createdConsultations[1]?.id || 2,
            rating: 5,
            comment:
              "Amazing palmistry reading! Helped me understand my spiritual path better.",
            isVerified: true,
          },
          {
            userId: createdUsers[2].id,
            astrologerId: createdAstrologers[1].id,
            consultationId: createdConsultations[2]?.id || 3,
            rating: 4,
            comment:
              "Good insights about business timing. Numerology analysis was helpful.",
            isVerified: true,
          },
        ];

        await db.insert(reviews).values(sampleReviews);

        // Create sample notifications for users
        const sampleNotifications = [
          {
            userId: createdUsers[0].id,
            title: "Consultation Completed",
            message:
              "Your consultation with Priya Sharma has been completed. Please rate your experience.",
            type: "consultation" as const,
            isRead: false,
          },
          {
            userId: createdUsers[1].id,
            title: "Welcome to AstroConnect",
            message:
              "Welcome! Explore our astrologers and start your spiritual journey.",
            type: "general" as const,
            isRead: true,
          },
          {
            userId: createdUsers[2].id,
            title: "Special Offer",
            message:
              "Get 20% off on your next consultation with premium astrologers.",
            type: "promotion" as const,
            isRead: false,
          },
        ];

        await db.insert(notifications).values(sampleNotifications);

        // Create sample coupons for testing
        const sampleCoupons = [
          {
            code: "WELCOME50",
            description: "Welcome discount for new users",
            type: "percentage" as const,
            value: 50,
            minOrderAmount: 0,
            maxDiscountAmount: 200,
            usageLimit: 100,
            usedCount: 0,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            isActive: true,
            createdBy: 1, // admin user
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            code: "FREECHAT",
            description: "Free 5-minute chat consultation",
            type: "fixed" as const,
            value: 500, // ₹500 discount (covers typical 5-min consultation)
            minOrderAmount: 0,
            maxDiscountAmount: null,
            usageLimit: 50,
            usedCount: 0,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            isActive: true,
            createdBy: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            code: "ASTRO25",
            description: "25% off on consultations over ₹200",
            type: "percentage" as const,
            value: 25,
            minOrderAmount: 200,
            maxDiscountAmount: 150,
            usageLimit: null, // unlimited
            usedCount: 0,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            isActive: true,
            createdBy: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            code: "FIRSTTIME",
            description: "100% off first consultation (up to ₹300)",
            type: "percentage" as const,
            value: 100,
            minOrderAmount: 0,
            maxDiscountAmount: 300,
            usageLimit: 200,
            usedCount: 5,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
            isActive: true,
            createdBy: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        await db.insert(coupons).values(sampleCoupons).onConflictDoNothing();
      }
    } catch (error) {
      
if (error) {
    console.error("WebSocket ErrorEvent:", {
      type: error.type,
      message: error.message,
      target: error.target,
      error: error.error,
    });
  } else if (error instanceof Error) {
    console.error("Error:", error.message, error.stack);
  } else {
    console.error("Unknown error:", error);
  }    }
  }


  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
        pinHash: insertUser.pinHash, // Preserve PIN hash for PIN-based authentication
        role: insertUser.role || "user",
        isActive: insertUser.isActive !== false,
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<void> {
    await db.update(users).set({ isActive }).where(eq(users.id, id));
  }

  async updateUserProfile(id: number, updates: Partial<User>): Promise<void> {
    await db.update(users).set(updates).where(eq(users.id, id));
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ pinHash: hashedPassword })
      .where(eq(users.id, id));
  }

  async updateUserGoogleId(userId: number, googleId: string): Promise<void> {
    await db.update(users).set({ googleId }).where(eq(users.id, userId));
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.isActive) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    await db.update(users).set(updates).where(eq(users.id, id));
  }

  async getConsultationById(consultationId: number): Promise<any> {
    const [consultation] = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, consultationId));
    return consultation;
  }

  async getUserStats(userId: number): Promise<any> {
    const [userConsultations] = await db
      .select({
        totalConsultations: sum(users.totalConsultations),
        totalSpent: sum(users.totalSpent),
      })
      .from(users)
      .where(eq(users.id, userId));

    const consultationData = await db
      .select({
        duration: consultations.duration,
        rating: consultations.rating,
        astrologerId: consultations.astrologerId,
      })
      .from(consultations)
      .where(eq(consultations.userId, userId));

    const totalMinutes = consultationData.reduce(
      (sum, c) => sum + c.duration,
      0,
    );
    const ratings = consultationData
      .filter((c) => c.rating !== null)
      .map((c) => c.rating!);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

    // Find top astrologer
    const astrologerCounts = consultationData.reduce(
      (acc, c) => {
        acc[c.astrologerId] = (acc[c.astrologerId] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    let topAstrologer = null;
    if (Object.keys(astrologerCounts).length > 0) {
      const topAstrologerId = Object.keys(astrologerCounts).reduce((a, b) =>
        astrologerCounts[parseInt(a)] > astrologerCounts[parseInt(b)] ? a : b,
      );
      const astrologer = await this.getAstrologer(parseInt(topAstrologerId));
      if (astrologer) {
        topAstrologer = {
          name: astrologer.name,
          consultations: astrologerCounts[parseInt(topAstrologerId)],
        };
      }
    }

    return {
      totalConsultations: userConsultations?.totalConsultations || 0,
      totalSpent: userConsultations?.totalSpent || 0,
      totalMinutes,
      averageRating,
      topAstrologer,
    };
  }

  async addWalletBalance(id: number, amount: number): Promise<void> {
    await db
      .update(users)
      .set({
        balance: sql`${users.balance} + ${amount}`,
      })
      .where(eq(users.id, id));
  }

  async addUserBalance(userId: number, amount: number): Promise<User> {
    // First check if user exists
    const existingUser = await this.getUser(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Update the user's balance
    await db
      .update(users)
      .set({
        balance: sql`${users.balance} + ${amount}`,
      })
      .where(eq(users.id, userId));

    // Return the updated user
    const updatedUser = await this.getUser(userId);
    if (!updatedUser) {
      throw new Error("Failed to retrieve updated user");
    }

    return updatedUser;
  }

  // Astrologers
  async getAllAstrologers(): Promise<Astrologer[]> {
    // Query from astrologers table directly - get all approved astrologers
    return await db
      .select()
      .from(astrologers)
      .where(eq(astrologers.isApproved, true));
  }

  async getAllAstrologersForAdmin(): Promise<Astrologer[]> {
    return await db
      .select()
      .from(astrologers)
      .orderBy(desc(astrologers.createdAt));
  }

  async getAstrologer(id: number): Promise<Astrologer | undefined> {
    const [astrologer] = await db
      .select()
      .from(astrologers)
      .where(eq(astrologers.id, id));
    return astrologer;
  }

  async getAstrologerByEmail(email: string): Promise<Astrologer | undefined> {
    const [astrologer] = await db
      .select()
      .from(astrologers)
      .where(eq(astrologers.email, email));
    return astrologer;
  }

  async getOnlineAstrologers(): Promise<Astrologer[]> {
    return await db
      .select()
      .from(astrologers)
      .where(
        and(eq(astrologers.isOnline, true), eq(astrologers.isApproved, true)),
      );
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Question operations
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }

  async getUserQuestions(userId: string): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.userId, userId))
      .orderBy(desc(questions.createdAt));
  }

  async getPendingQuestions(): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(isNull(questions.answer))
      .orderBy(questions.createdAt);
  }

  async updateQuestion(id: number, data: Partial<Question>): Promise<Question> {
    const [updatedQuestion] = await db
      .update(questions)
      .set(data)
      .where(eq(questions.id, id))
      .returning();
    return updatedQuestion;
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id));
    return question;
  }

  // Appointment operations
  async createAppointment(
    appointment: InsertAppointment,
  ): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.bookingDate));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.bookingDate, date))
      .orderBy(appointments.bookingTime);
  }

  async updateAppointment(
    id: number,
    data: Partial<Appointment>,
  ): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async getUserReports(userId: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.userId, userId))
      .orderBy(desc(reports.createdAt));
  }

  // Admin operations
  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split("T")[0];
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.bookingDate, today))
      .orderBy(appointments.bookingTime);
  }

  async getQuestionStats(): Promise<{
    pending: number;
    answered: number;
    total: number;
  }> {
    const allQuestions = await db.select().from(questions);
    const pending = allQuestions.filter((q) => !q.answer).length;
    const answered = allQuestions.filter((q) => q.answer).length;

    return {
      pending,
      answered,
      total: allQuestions.length,
    };
  }

  async updateAstrologerStatus(id: number, isOnline: boolean): Promise<void> {
    console.log(
      `🔄 Database: Updating astrologer ${id} status to ${isOnline ? "ONLINE" : "OFFLINE"}`,
    );
    await db
      .update(astrologers)
      .set({ isOnline })
      .where(eq(astrologers.id, id));

    // Verify the update
    const [updated] = await db
      .select()
      .from(astrologers)
      .where(eq(astrologers.id, id));
    if (updated) {
      console.log(
        `✅ Database: Astrologer ${updated.name} status confirmed as ${updated.isOnline ? "ONLINE" : "OFFLINE"}`,
      );
    }
  }

  async createAstrologer(astrologer: InsertAstrologer): Promise<Astrologer> {
    const [newAstrologer] = await db
      .insert(astrologers)
      .values(astrologer)
      .returning();
    return newAstrologer;
  }

  async updateAstrologer(
    id: number,
    updates: Partial<Astrologer>,
  ): Promise<void> {
    await db.update(astrologers).set(updates).where(eq(astrologers.id, id));
  }

  async deleteAstrologer(id: number): Promise<void> {
    await db.delete(astrologers).where(eq(astrologers.id, id));
  }

  async approveAstrologer(id: number): Promise<void> {
    await db
      .update(astrologers)
      .set({ isApproved: true })
      .where(eq(astrologers.id, id));
  }

  async rejectAstrologer(id: number): Promise<void> {
    await db
      .update(astrologers)
      .set({ isApproved: false, isActive: false })
      .where(eq(astrologers.id, id));
  }

  async getPendingAstrologers(): Promise<Astrologer[]> {
    return await db
      .select()
      .from(astrologers)
      .where(eq(astrologers.isApproved, false));
  }

  async getAstrologerStats(astrologerId: number): Promise<any> {
    const [astrologerData] = await db
      .select({
        totalConsultations: astrologers.totalConsultations,
        totalEarnings: astrologers.totalEarnings,
      })
      .from(astrologers)
      .where(eq(astrologers.id, astrologerId));

    const consultationData = await db
      .select({
        duration: consultations.duration,
        rating: consultations.rating,
        cost: consultations.cost,
      })
      .from(consultations)
      .where(eq(consultations.astrologerId, astrologerId));

    const totalMinutes = consultationData.reduce(
      (sum, c) => sum + c.duration,
      0,
    );
    const ratings = consultationData
      .filter((c) => c.rating !== null)
      .map((c) => c.rating!);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;
    const totalRevenue = consultationData.reduce((sum, c) => sum + c.cost, 0);

    return {
      totalConsultations: astrologerData?.totalConsultations || 0,
      totalEarnings: astrologerData?.totalEarnings || 0,
      totalMinutes,
      averageRating,
      totalRevenue,
      averageSessionDuration:
        consultationData.length > 0
          ? totalMinutes / consultationData.length
          : 0,
    };
  }

  // Consultations
  async createConsultation(
    insertConsultation: InsertConsultation,
  ): Promise<Consultation> {
    // Phase 1: Check for active chat routing rules
    let actualAstrologerId = insertConsultation.astrologerId;
    let isRerouted = false;
    let routingRule = null;

    const activeRouting = await db
      .select()
      .from(chatRouting)
      .where(
        and(
          eq(chatRouting.originalAstrologerId, insertConsultation.astrologerId),
          eq(chatRouting.isActive, true),
        ),
      )
      .orderBy(desc(chatRouting.priority))
      .limit(1);

    if (activeRouting.length > 0) {
      routingRule = activeRouting[0];
      // Check if assigned astrologer is online and available
      const assignedAstrologer = await db
        .select()
        .from(astrologers)
        .where(eq(astrologers.id, routingRule.assignedAstrologerId))
        .limit(1);

      if (assignedAstrologer.length > 0 && assignedAstrologer[0].isOnline) {
        actualAstrologerId = routingRule.assignedAstrologerId;
        isRerouted = true;
      }
    }

    // Check if the actual astrologer (original or rerouted) has active consultation
    const [activeConsultation] = await db
      .select()
      .from(consultations)
      .where(
        and(
          or(
            eq(consultations.astrologerId, actualAstrologerId),
            eq(consultations.reroutedTo, actualAstrologerId),
          ),
          eq(consultations.status, "active"),
        ),
      );

    // Calculate queue position and estimated wait time
    let queuePosition = null;
    let estimatedWaitTime = null;
    let status = "active";

    if (activeConsultation) {
      // Astrologer is busy, add to queue
      const queuedConsultations = await db
        .select()
        .from(consultations)
        .where(
          and(
            or(
              eq(consultations.astrologerId, actualAstrologerId),
              eq(consultations.reroutedTo, actualAstrologerId),
            ),
            eq(consultations.status, "queued"),
          ),
        )
        .orderBy(consultations.createdAt);

      queuePosition = queuedConsultations.length + 1;
      // Estimate 30 minutes per consultation + 5 minutes buffer
      estimatedWaitTime = queuePosition * 35;
      status = "queued";
    }

    // Start a transaction to ensure atomicity
    const [consultation] = await db
      .insert(consultations)
      .values({
        ...insertConsultation,
        paymentStatus: "pending",
        status,
        queuePosition,
        estimatedWaitTime,
        // Phase 1: Add rerouting fields
        isRerouted,
        queueEnteredAt: status === "queued" ? new Date() : null,
      })
      .returning();

    // Phase 1: Create routed consultation record if rerouted
    if (isRerouted && routingRule) {
      const originalAstrologer = await db
        .select()
        .from(astrologers)
        .where(eq(astrologers.id, insertConsultation.astrologerId))
        .limit(1);
      const assignedAstrologer = await db
        .select()
        .from(astrologers)
        .where(eq(astrologers.id, actualAstrologerId))
        .limit(1);

      await db.insert(routedConsultations).values({
        consultationId: consultation.id,
        originalAstrologerId: insertConsultation.astrologerId,
        assignedAstrologerId: actualAstrologerId,
        routingRuleId: routingRule.id,
        userVisibleName: originalAstrologer[0]?.name || "Astrologer",
        actualProviderName: assignedAstrologer[0]?.name || "Astrologer",
      });
    }

    // Deduct balance from user and update spent amount (only if cost > 0)
    if (insertConsultation.cost > 0) {
      await db
        .update(users)
        .set({
          balance: sql`${users.balance} - ${insertConsultation.cost}`,
          totalSpent: sql`${users.totalSpent} + ${insertConsultation.cost}`,
        })
        .where(eq(users.id, insertConsultation.userId));
    }

    return consultation;
  }

  async getConsultation(id: number): Promise<Consultation | undefined> {
    const [consultation] = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, id));
    return consultation;
  }

  async getUserConsultations(
    userId: number,
  ): Promise<ConsultationWithAstrologer[]> {
    const userConsultations = await db
      .select({
        consultation: consultations,
        astrologer: astrologers,
      })
      .from(consultations)
      .innerJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
      .where(eq(consultations.userId, userId))
      .orderBy(desc(consultations.createdAt));

    return userConsultations.map(({ consultation, astrologer }) => ({
      ...consultation,
      astrologer,
    }));
  }

  async getActiveConsultation(
    userId: number,
  ): Promise<ConsultationWithAstrologer | undefined> {
    // First, auto-expire consultations that have exceeded their duration + 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    await db
      .update(consultations)
      .set({ status: "completed", endedAt: new Date() })
      .where(
        and(
          eq(consultations.userId, userId),
          or(
            eq(consultations.status, "active"),
            eq(consultations.status, "pending"),
          ),
          sql`${consultations.createdAt} + INTERVAL '1 minute' * ${consultations.duration} + INTERVAL '2 minutes' < ${twoMinutesAgo}`,
        ),
      );

    const [activeConsultation] = await db
      .select({
        consultation: consultations,
        astrologer: astrologers,
      })
      .from(consultations)
      .innerJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
      .where(
        and(
          eq(consultations.userId, userId),
          or(
            eq(consultations.status, "active"),
            eq(consultations.status, "pending"),
          ),
        ),
      )
      .orderBy(desc(consultations.createdAt))
      .limit(1);

    if (!activeConsultation) return undefined;

    return {
      ...activeConsultation.consultation,
      astrologer: activeConsultation.astrologer,
    };
  }

  async endConsultation(
    id: number,
    rating?: number,
    review?: string,
  ): Promise<void> {
    const consultation = await this.getConsultation(id);
    if (!consultation) {
      throw new Error("Consultation not found");
    }

    await db
      .update(consultations)
      .set({
        status: "completed",
        endedAt: new Date(),
        ...(rating && { rating }),
        ...(review && { review }),
      })
      .where(eq(consultations.id, id));

    // Process next user in queue for this astrologer
    await this.processNextInQueue(consultation.astrologerId);
  }

  async processNextInQueue(astrologerId: number): Promise<void> {
    // Get the next queued consultation for this astrologer
    const [nextConsultation] = await db
      .select()
      .from(consultations)
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          eq(consultations.status, "queued"),
        ),
      )
      .orderBy(consultations.createdAt)
      .limit(1);

    if (nextConsultation) {
      // Activate the next consultation
      await db
        .update(consultations)
        .set({
          status: "active",
          queuePosition: null,
          estimatedWaitTime: null,
        })
        .where(eq(consultations.id, nextConsultation.id));

      // Update queue positions for remaining users
      const remainingQueue = await db
        .select()
        .from(consultations)
        .where(
          and(
            eq(consultations.astrologerId, astrologerId),
            eq(consultations.status, "queued"),
          ),
        )
        .orderBy(consultations.createdAt);

      for (let i = 0; i < remainingQueue.length; i++) {
        const newPosition = i + 1;
        const newWaitTime = newPosition * 35; // 35 minutes estimate per consultation

        await db
          .update(consultations)
          .set({
            queuePosition: newPosition,
            estimatedWaitTime: newWaitTime,
          })
          .where(eq(consultations.id, remainingQueue[i].id));
      }

      // Send notification to next user
      await this.createNotification({
        userId: nextConsultation.userId,
        title: "Your consultation is starting!",
        message: "Your astrologer is now available. Please join the chat.",
        type: "consultation",
        actionUrl: "/chat",
      });
    }
  }

  async getQueueStatusOld(astrologerId: number): Promise<any> {
    const activeConsultation = await db
      .select()
      .from(consultations)
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          eq(consultations.status, "active"),
        ),
      )
      .limit(1);

    const queuedConsultations = await db
      .select({
        id: consultations.id,
        userId: consultations.userId,
        userName: users.username,
        topic: consultations.topic,
        queuePosition: consultations.queuePosition,
        estimatedWaitTime: consultations.estimatedWaitTime,
        createdAt: consultations.createdAt,
      })
      .from(consultations)
      .leftJoin(users, eq(consultations.userId, users.id))
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          eq(consultations.status, "queued"),
        ),
      )
      .orderBy(consultations.queuePosition);

    return {
      isAstrologerBusy: activeConsultation.length > 0,
      activeConsultation: activeConsultation[0] || null,
      queueLength: queuedConsultations.length,
      queuedConsultations,
    };
  }

  async updateConsultationPayment(
    id: number,
    paymentId: string,
    paymentStatus: string,
  ): Promise<void> {
    await db
      .update(consultations)
      .set({ paymentId, paymentStatus })
      .where(eq(consultations.id, id));
  }

  async startConsultationTimer(id: number): Promise<void> {
    await db
      .update(consultations)
      .set({
        timerStarted: true,
        timerStartTime: new Date(),
      })
      .where(eq(consultations.id, id));
  }

  async updateConsultationUserDetails(
    id: number,
    userDetails: any,
  ): Promise<void> {
    await db
      .update(consultations)
      .set({ userDetails })
      .where(eq(consultations.id, id));
  }

  async extendConsultation(
    id: number,
    additionalMinutes: number,
  ): Promise<void> {
    const consultation = await this.getConsultation(id);
    if (!consultation) {
      throw new Error("Consultation not found");
    }

    const newDuration = consultation.duration + additionalMinutes;
    await db
      .update(consultations)
      .set({ duration: newDuration })
      .where(eq(consultations.id, id));
  }

  async extendConsultationWithAstrologerLimit(
    id: number,
    additionalMinutes: number,
  ): Promise<void> {
    const consultation = await this.getConsultation(id);
    if (!consultation) {
      throw new Error("Consultation not found");
    }

    // Check if astrologer has already used maximum extensions
    if (consultation.astrologerExtensions >= 2) {
      throw new Error(
        "Maximum astrologer extensions (2) already used for this consultation",
      );
    }

    const newDuration = consultation.duration + additionalMinutes;
    const newExtensionCount = consultation.astrologerExtensions + 1;

    await db
      .update(consultations)
      .set({
        duration: newDuration,
        astrologerExtensions: newExtensionCount,
      })
      .where(eq(consultations.id, id));
  }

  // Chat Messages
  async createChatMessage(
    insertMessage: InsertChatMessage,
  ): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async updateChatMessage(
    messageId: number,
    updates: Partial<ChatMessage>,
  ): Promise<void> {
    const updateData: any = { ...updates };
    if (updates.message) {
      updateData.isEdited = true;
      updateData.editedAt = new Date();
    }
    await db
      .update(chatMessages)
      .set(updateData)
      .where(eq(chatMessages.id, messageId));
  }

  async deleteChatMessage(
    messageId: number,
    userId: number,
    deleteForAll: boolean = false,
  ): Promise<void> {
    const updateData: any = {
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
      message: deleteForAll
        ? "[This message was deleted]"
        : "[You deleted this message]",
    };
    await db
      .update(chatMessages)
      .set(updateData)
      .where(eq(chatMessages.id, messageId));
  }

  async getChatMessage(messageId: number): Promise<ChatMessage | undefined> {
    const [message] = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.id, messageId));
    return message;
  }

  async getConsultationMessages(
    consultationId: number,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ChatMessageWithSender[]> {
    const messages = await db
      .select({
        message: chatMessages,
        user: users,
      })
      .from(chatMessages)
      .leftJoin(users, eq(chatMessages.senderId, users.id))
      .where(eq(chatMessages.consultationId, consultationId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit)
      .offset(offset);

    const consultation = await this.getConsultation(consultationId);
    const astrologer = consultation
      ? await this.getAstrologer(consultation.astrologerId)
      : null;

    return messages
      .map(({ message, user }) => ({
        ...message,
        senderName:
          user?.username || (astrologer ? astrologer.name : "Unknown"),
      }))
      .reverse(); // Reverse to show oldest first
  }

  async getAllChats(): Promise<any[]> {
    try {
      // Get all consultations with user and astrologer details
      const consultationsWithDetails = await db
        .select({
          consultation: consultations,
          user: { username: users.username, email: users.email },
          astrologer: { name: astrologers.name, email: astrologers.email },
        })
        .from(consultations)
        .leftJoin(users, eq(consultations.userId, users.id))
        .leftJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
        .orderBy(desc(consultations.createdAt));

      // Format the data for admin dashboard
      return consultationsWithDetails.map(
        ({ consultation, user, astrologer }) => ({
          id: consultation.id,
          userName: user?.username || "Anonymous",
          astrologerName: astrologer?.name || "Unknown",
          topic: consultation.topic || "General consultation",
          status: consultation.status || "unknown",
          duration: consultation.duration || 0,
          cost: consultation.cost || 0,
          createdAt: consultation.createdAt,
          updatedAt: consultation.createdAt,
        }),
      );
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    }
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getAstrologerReviews(astrologerId: number): Promise<ReviewWithUser[]> {
    const astrologerReviews = await db
      .select({
        review: reviews,
        user: { username: users.username, profileImage: users.profileImage },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.astrologerId, astrologerId))
      .orderBy(desc(reviews.createdAt));

    return astrologerReviews.map(({ review, user }) => ({
      ...review,
      user,
    }));
  }

  // Notifications
  async createNotification(
    notification: InsertNotification,
  ): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Favorites
  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db
      .insert(favorites)
      .values(favorite)
      .returning();
    return newFavorite;
  }

  async removeFavorite(userId: number, astrologerId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.astrologerId, astrologerId),
        ),
      );
  }

  async getUserFavorites(userId: number): Promise<any[]> {
    const userFavorites = await db
      .select({
        favorite: favorites,
        astrologer: astrologers,
      })
      .from(favorites)
      .innerJoin(astrologers, eq(favorites.astrologerId, astrologers.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return userFavorites.map(({ favorite, astrologer }) => ({
      ...favorite,
      astrologer,
    }));
  }

  async getAstrologerActiveConsultations(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer[]> {
    const result = await db
      .select({
        consultation: consultations,
        astrologer: astrologers,
        user: users,
      })
      .from(consultations)
      .innerJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
      .innerJoin(users, eq(consultations.userId, users.id))
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          or(
            eq(consultations.status, "active"),
            eq(consultations.status, "pending"),
          ),
        ),
      )
      .orderBy(desc(consultations.createdAt));

    return result.map((r) => ({
      ...r.consultation,
      astrologer: r.astrologer,
      user: r.user,
    }));
  }

  async getAstrologerActiveConsultation(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer | undefined> {
    // First, auto-expire consultations that have exceeded their duration + 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    await db
      .update(consultations)
      .set({ status: "completed", endedAt: new Date() })
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          or(
            eq(consultations.status, "active"),
            eq(consultations.status, "pending"),
          ),
          sql`${consultations.createdAt} + INTERVAL '1 minute' * ${consultations.duration} + INTERVAL '2 minutes' < ${twoMinutesAgo}`,
        ),
      );

    const [activeConsultation] = await db
      .select({
        consultation: consultations,
        astrologer: astrologers,
        user: users,
      })
      .from(consultations)
      .innerJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
      .innerJoin(users, eq(consultations.userId, users.id))
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          or(
            eq(consultations.status, "active"),
            eq(consultations.status, "pending"),
          ),
        ),
      )
      .orderBy(desc(consultations.createdAt))
      .limit(1);

    if (!activeConsultation) return undefined;

    return {
      ...activeConsultation.consultation,
      astrologer: activeConsultation.astrologer,
      user: activeConsultation.user,
    };
  }

  async getAstrologerConsultationHistory(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer[]> {
    const result = await db
      .select({
        consultation: consultations,
        astrologer: astrologers,
      })
      .from(consultations)
      .innerJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          inArray(consultations.status, ["completed", "ended"]),
        ),
      )
      .orderBy(desc(consultations.createdAt))
      .limit(50);

    return result.map((r) => ({
      ...r.consultation,
      astrologer: r.astrologer,
    }));
  }

  async createEmailVerification(
    verification: InsertEmailVerification,
  ): Promise<EmailVerification> {
    const [result] = await db
      .insert(emailVerifications)
      .values(verification)
      .returning();
    return result;
  }

  async verifyEmailCode(userId: number, code: string): Promise<boolean> {
    const verification = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.userId, userId),
          eq(emailVerifications.verificationCode, code),
          eq(emailVerifications.isUsed, false),
          sql`${emailVerifications.expiresAt} > NOW()`,
        ),
      )
      .limit(1);

    if (verification.length === 0) {
      return false;
    }

    // Mark as used
    await db
      .update(emailVerifications)
      .set({ isUsed: true })
      .where(eq(emailVerifications.id, verification[0].id));

    // Update user email
    await this.updateUserEmail(userId, verification[0].newEmail);

    return true;
  }

  async updateUserEmail(userId: number, newEmail: string): Promise<void> {
    await db.update(users).set({ email: newEmail }).where(eq(users.id, userId));
  }

  // CMS Article methods
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const articleData = insertArticle as any;
    const slug = articleData.slug || this.generateSlug(articleData.title);
    const readTime = this.calculateReadTime(articleData.content);

    const result = await db
      .insert(articles)
      .values({
        ...articleData,
        slug,
        readTime,
        tags: Array.isArray(articleData.tags) ? articleData.tags : [],
        metaKeywords: Array.isArray(articleData.metaKeywords)
          ? articleData.metaKeywords
          : [],
        publishedAt:
          articleData.status === "published"
            ? articleData.publishedAt || new Date()
            : null,
        language: articleData.language || "en",
      })
      .returning();

    return (result as any[])[0] as Article;
  }

  async updateArticle(id: number, updates: Partial<Article>): Promise<void> {
    const updateData: any = { ...updates, updatedAt: new Date() };

    if (updates.status === "published" && !(updates as any).publishedAt) {
      updateData.publishedAt = new Date();
    }

    if (updates.content) {
      updateData.readTime = this.calculateReadTime(updates.content);
    }

    await db.update(articles).set(updateData).where(eq(articles.id, id));
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id));
    return article;
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithAuthor | undefined> {
    const [result] = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        featuredImage: articles.featuredImage,
        authorId: articles.authorId,
        status: articles.status,
        category: articles.category,
        tags: articles.tags,
        metaTitle: articles.metaTitle,
        metaDescription: articles.metaDescription,
        metaKeywords: articles.metaKeywords,
        readTime: articles.readTime,
        viewCount: articles.viewCount,
        language: articles.language,
        focusKeyword: articles.focusKeyword,
        parentArticleId: articles.parentArticleId,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          username: users.username,
          profileImage: users.profileImage,
        },
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .where(and(eq(articles.slug, slug), eq(articles.status, "published")));

    return result;
  }

  async getAllArticles(status?: string): Promise<ArticleWithAuthor[]> {
    const baseQuery = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        featuredImage: articles.featuredImage,
        authorId: articles.authorId,
        status: articles.status,
        category: articles.category,
        tags: articles.tags,
        language: articles.language,
        metaTitle: articles.metaTitle,
        metaDescription: articles.metaDescription,
        metaKeywords: articles.metaKeywords,
        readTime: articles.readTime,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        focusKeyword: articles.focusKeyword,
        parentArticleId: articles.parentArticleId,
        author: {
          username: users.username,
          profileImage: users.profileImage,
        },
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.createdAt));

    if (status) {
      return await baseQuery.where(eq(articles.status, status));
    }

    return await baseQuery;
  }

  async getPublishedArticles(limit?: number): Promise<ArticleWithAuthor[]> {
    const baseQuery = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        featuredImage: articles.featuredImage,
        authorId: articles.authorId,
        status: articles.status,
        category: articles.category,
        tags: articles.tags,
        language: articles.language,
        metaTitle: articles.metaTitle,
        metaDescription: articles.metaDescription,
        metaKeywords: articles.metaKeywords,
        readTime: articles.readTime,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        focusKeyword: articles.focusKeyword,
        parentArticleId: articles.parentArticleId,
        author: {
          username: users.username,
          profileImage: users.profileImage,
        },
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt))
      .$dynamic();

    if (limit) {
      return await baseQuery.limit(limit);
    }

    return await baseQuery;
  }

  async getArticlesByCategory(category: string): Promise<ArticleWithAuthor[]> {
    return await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        featuredImage: articles.featuredImage,
        authorId: articles.authorId,
        status: articles.status,
        category: articles.category,
        tags: articles.tags,
        language: articles.language,
        metaTitle: articles.metaTitle,
        metaDescription: articles.metaDescription,
        metaKeywords: articles.metaKeywords,
        readTime: articles.readTime,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          username: users.username,
          profileImage: users.profileImage,
        },
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .where(
        and(eq(articles.category, category), eq(articles.status, "published")),
      )
      .orderBy(desc(articles.publishedAt));
  }

  async incrementArticleViews(id: number): Promise<void> {
    await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, id));
  }

  async recordArticleView(insertView: InsertArticleView): Promise<void> {
    await db.insert(articleViews).values(insertView);
  }

  // CMS Category methods
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const categoryData = insertCategory as any;
    const slug =
      categoryData.slug || this.generateSlug(categoryData.name || "");

    const result = await db
      .insert(categories)
      .values({
        ...categoryData,
        slug,
        language: categoryData.language || "en",
      })
      .returning();

    return (result as any[])[0] as Category;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<void> {
    await db.update(categories).set(updates).where(eq(categories.id, id));
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getAllCategories(): Promise<Category[]> {
    const result = await db.select().from(categories).orderBy(categories.name);
    return result as Category[];
  }

  async getActiveCategories(): Promise<Category[]> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.name);
    return result as Category[];
  }

  // Helper methods
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Admin Settings methods
  async getAdminSetting(key: string): Promise<AdminSetting | undefined> {
    const [setting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, key));
    return setting;
  }

  async getAllAdminSettings(): Promise<AdminSetting[]> {
    return await db
      .select()
      .from(adminSettings)
      .orderBy(adminSettings.category, adminSettings.key);
  }

  async updateAdminSetting(key: string, value: string): Promise<void> {
    await db
      .update(adminSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(adminSettings.key, key));
  }

  async createAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting> {
    const [result] = await db.insert(adminSettings).values(setting).returning();
    return result;
  }

  async getActiveConsultationsForAstrologer(
    astrologerId: number,
  ): Promise<ConsultationWithAstrologer[]> {
    // First, auto-expire consultations that have exceeded their duration + 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    await db
      .update(consultations)
      .set({ status: "completed", endedAt: new Date() })
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          or(
            eq(consultations.status, "active"),
            eq(consultations.status, "pending"),
          ),
          sql`${consultations.createdAt} + INTERVAL '1 minute' * ${consultations.duration} + INTERVAL '2 minutes' < ${twoMinutesAgo}`,
        ),
      );

    const results = await db
      .select({
        id: consultations.id,
        userId: consultations.userId,
        astrologerId: consultations.astrologerId,
        duration: consultations.duration,
        cost: consultations.cost,
        status: consultations.status,
        paymentId: consultations.paymentId,
        paymentStatus: consultations.paymentStatus,
        rating: consultations.rating,
        review: consultations.review,
        createdAt: consultations.createdAt,
        userDetails: consultations.userDetails,
        astrologerExtensions: consultations.astrologerExtensions,
        astrologer: {
          id: astrologers.id,
          name: astrologers.name,
          email: astrologers.email,
          specializations: astrologers.specializations,
          experience: astrologers.experience,
          rating: astrologers.rating,
          isActive: astrologers.isActive,
          maxConcurrentUsers: astrologers.maxConcurrentUsers,
        },
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          profileImage: users.profileImage,
        },
      })
      .from(consultations)
      .innerJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
      .innerJoin(users, eq(consultations.userId, users.id))
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          eq(consultations.status, "active"),
        ),
      )
      .orderBy(desc(consultations.createdAt));

    return results;
  }

  async getAllActiveConsultations(): Promise<any[]> {
    try {
      const results = await db
        .select({
          id: consultations.id,
          userId: consultations.userId,
          astrologerId: consultations.astrologerId,
          topic: consultations.topic,
          duration: consultations.duration,
          cost: consultations.cost,
          status: consultations.status,
          createdAt: consultations.createdAt,
          userName: users.username,
          astrologerName: astrologers.name,
        })
        .from(consultations)
        .leftJoin(users, eq(consultations.userId, users.id))
        .leftJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
        .where(
          or(
            eq(consultations.status, "active"),
            eq(consultations.status, "pending"),
          ),
        )
        .orderBy(desc(consultations.createdAt));

      return results;
    } catch (error) {
      console.error("Error fetching all active consultations:", error);
      return [];
    }
  }

  async updateConsultation(
    id: number,
    updates: Partial<Consultation>,
  ): Promise<void> {
    try {
      await db
        .update(consultations)
        .set(updates)
        .where(eq(consultations.id, id));
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw error;
    }
  }

  async getUserChatHistory(
    userId: number,
  ): Promise<ConsultationWithAstrologer[]> {
    try {
      const results = await db
        .select({
          id: consultations.id,
          userId: consultations.userId,
          astrologerId: consultations.astrologerId,
          duration: consultations.duration,
          cost: consultations.cost,
          status: consultations.status,
          paymentId: consultations.paymentId,
          paymentStatus: consultations.paymentStatus,
          rating: consultations.rating,
          review: consultations.review,
          createdAt: consultations.createdAt,
          endedAt: consultations.endedAt,
          topic: consultations.topic,
          astrologer: {
            id: astrologers.id,
            name: astrologers.name,
            email: astrologers.email,
            specializations: astrologers.specializations,
            experience: astrologers.experience,
            rating: astrologers.rating,
            image: astrologers.image,
            isOnline: astrologers.isOnline,
          },
        })
        .from(consultations)
        .innerJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
        .where(eq(consultations.userId, userId))
        .orderBy(desc(consultations.createdAt));

      return results;
    } catch (error) {
      console.error("Error getting user chat history:", error);
      throw new Error("Failed to get user chat history");
    }
  }

  async getUserActiveConsultations(
    userId: number,
  ): Promise<ConsultationWithAstrologer[]> {
    try {
      // First, auto-expire consultations that have exceeded their duration + 2 minutes
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      await db
        .update(consultations)
        .set({ status: "completed", endedAt: new Date() })
        .where(
          and(
            eq(consultations.userId, userId),
            or(
              eq(consultations.status, "active"),
              eq(consultations.status, "pending"),
            ),
            sql`${consultations.createdAt} + INTERVAL '1 minute' * ${consultations.duration} + INTERVAL '2 minutes' < ${twoMinutesAgo}`,
          ),
        );

      const results = await db
        .select({
          id: consultations.id,
          userId: consultations.userId,
          astrologerId: consultations.astrologerId,
          duration: consultations.duration,
          cost: consultations.cost,
          status: consultations.status,
          paymentId: consultations.paymentId,
          paymentStatus: consultations.paymentStatus,
          rating: consultations.rating,
          review: consultations.review,
          createdAt: consultations.createdAt,
          endedAt: consultations.endedAt,
          topic: consultations.topic,
          queuePosition: consultations.queuePosition,
          estimatedWaitTime: consultations.estimatedWaitTime,
          astrologer: {
            id: astrologers.id,
            name: astrologers.name,
            email: astrologers.email,
            specializations: astrologers.specializations,
            experience: astrologers.experience,
            rating: astrologers.rating,
            image: astrologers.image,
            isOnline: astrologers.isOnline,
          },
        })
        .from(consultations)
        .innerJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
        .where(
          and(
            eq(consultations.userId, userId),
            inArray(consultations.status, ["active", "queued"]),
          ),
        )
        .orderBy(desc(consultations.createdAt));

      return results;
    } catch (error) {
      console.error("Error getting user active consultations:", error);
      throw new Error("Failed to get user active consultations");
    }
  }

  async updateConsultationStatus(
    consultationId: number,
    status: string,
  ): Promise<void> {
    try {
      await db
        .update(consultations)
        .set({ status })
        .where(eq(consultations.id, consultationId));
    } catch (error) {
      console.error("Error updating consultation status:", error);
      throw new Error("Failed to update consultation status");
    }
  }

  async getAstrologerQueue(astrologerId: number): Promise<any[]> {
    try {
      const results = await db
        .select({
          id: consultations.id,
          userId: consultations.userId,
          status: consultations.status,
          topic: consultations.topic,
          duration: consultations.duration,
          cost: consultations.cost,
          queuePosition: consultations.queuePosition,
          estimatedWaitTime: consultations.estimatedWaitTime,
          createdAt: consultations.createdAt,
          timerStarted: consultations.timerStarted,
          timerStartTime: consultations.timerStartTime,
          user: {
            id: users.id,
            username: users.username,
            email: users.email,
            profileImage: users.profileImage,
          },
        })
        .from(consultations)
        .innerJoin(users, eq(consultations.userId, users.id))
        .where(
          and(
            eq(consultations.astrologerId, astrologerId),
            or(
              eq(consultations.status, "active"),
              eq(consultations.status, "queued"),
            ),
          ),
        )
        .orderBy(desc(consultations.createdAt));

      return results;
    } catch (error) {
      console.error("Error getting astrologer queue:", error);
      throw new Error("Failed to get astrologer queue");
    }
  }

  // Wallet and Coupon implementations
  async validateCoupon(
    code: string,
    orderAmount: number,
  ): Promise<{
    isValid: boolean;
    type?: string;
    value?: number;
    discount?: number;
    message: string;
  }> {
    try {
      // Check if coupon exists and is active
      const coupon = await db
        .select()
        .from(coupons)
        .where(and(eq(coupons.code, code), eq(coupons.isActive, true)))
        .limit(1);

      if (coupon.length === 0) {
        return {
          isValid: false,
          message: "Invalid promo code",
        };
      }

      const couponData = coupon[0];

      // Check validity dates
      const now = new Date();
      if (now < couponData.validFrom || now > couponData.validUntil) {
        return {
          isValid: false,
          message: "Promo code has expired",
        };
      }

      // Check usage limit
      if (
        couponData.usageLimit &&
        couponData.usedCount >= couponData.usageLimit
      ) {
        return {
          isValid: false,
          message: "Promo code usage limit exceeded",
        };
      }

      // Check minimum order amount
      if (orderAmount < couponData.minOrderAmount) {
        return {
          isValid: false,
          message: `Minimum order amount ₹${couponData.minOrderAmount} required`,
        };
      }

      // Calculate discount
      let discount = 0;
      if (couponData.type === "percentage") {
        console.log(
          `💰 Calculating percentage discount: orderAmount=${orderAmount}, couponValue=${couponData.value}, maxDiscount=${couponData.maxDiscountAmount}`,
        );
        discount = Math.floor((orderAmount * couponData.value) / 100);
        console.log(`💰 Calculated discount before cap: ${discount}`);
        if (
          couponData.maxDiscountAmount &&
          discount > couponData.maxDiscountAmount
        ) {
          discount = couponData.maxDiscountAmount;
          console.log(`💰 Discount capped to: ${discount}`);
        }
      } else if (couponData.type === "fixed") {
        discount = Math.min(couponData.value, orderAmount);
      }
      console.log(`💰 Final discount amount: ${discount}`);

      return {
        isValid: true,
        type: couponData.type,
        value: couponData.value,
        discount: discount,
        message: `Promo code applied! Discount: ₹${discount}`,
      };
    } catch (error) {
      console.error("Error validating coupon:", error);
      return {
        isValid: false,
        message: "Error validating promo code",
      };
    }
  }

  async markCouponUsed(code: string, userId: number): Promise<void> {
    try {
      // Demo implementation - in production this would mark coupon as used
      console.log(`Coupon ${code} marked as used for user ${userId}`);
    } catch (error) {
      console.error("Error marking coupon as used:", error);
    }
  }

  async getAstrologerById(id: number): Promise<Astrologer | undefined> {
    try {
      const [astrologer] = await db
        .select()
        .from(astrologers)
        .where(eq(astrologers.id, id));
      return astrologer;
    } catch (error) {
      console.error("Error getting astrologer by ID:", error);
      return undefined;
    }
  }

  // Wallet balance management
  async updateUserBalance(userId: number, newBalance: number): Promise<void> {
    await db
      .update(users)
      .set({ balance: newBalance })
      .where(eq(users.id, userId));
  }

  async useCoupon(couponId: number): Promise<void> {
    try {
      await db
        .update(coupons)
        .set({
          usedCount: sql`${coupons.usedCount} + 1`,
        })
        .where(eq(coupons.id, couponId));
    } catch (error) {
      console.error("Error using coupon:", error);
      throw error;
    }
  }

  async getAllCoupons(): Promise<Coupon[]> {
    try {
      return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    } catch (error) {
      console.error("Error getting all coupons:", error);
      throw error;
    }
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    try {
      const result = await db
        .insert(coupons)
        .values({
          ...coupon,
          usedCount: 0,
        })
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error creating coupon:", error);
      throw error;
    }
  }

  async updateCoupon(id: number, updates: Partial<Coupon>): Promise<Coupon> {
    try {
      const result = await db
        .update(coupons)
        .set({
          ...updates,
        })
        .where(eq(coupons.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error("Coupon not found");
      }

      return result[0];
    } catch (error) {
      console.error("Error updating coupon:", error);
      throw error;
    }
  }

  async deleteCoupon(id: number): Promise<void> {
    try {
      const result = await db
        .delete(coupons)
        .where(eq(coupons.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error("Coupon not found");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      throw error;
    }
  }

  // Queue management
  async getNextQueuePosition(astrologerId: number): Promise<number> {
    const activeConsultations = await db
      .select({ queuePosition: consultations.queuePosition })
      .from(consultations)
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          or(
            eq(consultations.status, "confirmed"),
            eq(consultations.status, "in_progress"),
            eq(consultations.status, "pending"),
          ),
        ),
      );

    if (activeConsultations.length === 0) {
      return 1;
    }

    const maxPosition = Math.max(
      ...activeConsultations.map((c) => c.queuePosition || 0),
    );
    return maxPosition + 1;
  }

  async updateQueuePositions(astrologerId: number): Promise<void> {
    // Get all consultations in queue order
    const queuedConsultations = await db
      .select({ id: consultations.id })
      .from(consultations)
      .where(
        and(
          eq(consultations.astrologerId, astrologerId),
          or(
            eq(consultations.status, "confirmed"),
            eq(consultations.status, "pending"),
          ),
        ),
      )
      .orderBy(consultations.queuePosition);

    // Update positions sequentially
    for (let i = 0; i < queuedConsultations.length; i++) {
      await db
        .update(consultations)
        .set({ queuePosition: i + 1 })
        .where(eq(consultations.id, queuedConsultations[i].id));
    }
  }

  // Date-range query methods for reports dashboard
  async getBirthChartsForDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    try {
      const results = await db
        .select({
          id: birthCharts.id,
          userId: birthCharts.userId,
          name: birthCharts.name,
          birthDate: birthCharts.birthDate,
          birthTime: birthCharts.birthTime,
          birthLocation: birthCharts.birthLocation,
          latitude: birthCharts.latitude,
          longitude: birthCharts.longitude,
          chartData: birthCharts.chartData,
          interpretations: birthCharts.interpretations,
          isPublic: birthCharts.isPublic,
          isAnonymous: birthCharts.isAnonymous,
          sessionId: birthCharts.sessionId,
          createdAt: birthCharts.createdAt,
        })
        .from(birthCharts)
        .where(
          and(
            sql`${birthCharts.createdAt} >= ${startDate}`,
            sql`${birthCharts.createdAt} < ${endDate}`,
          ),
        )
        .orderBy(desc(birthCharts.createdAt));
      console.log("Birth charts query returned:", results.length, "results");
      if (results.length > 0) {
        console.log("First result fields:", Object.keys(results[0]));
        console.log("First result isAnonymous:", results[0].isAnonymous);
      }
      return results;
    } catch (error) {
      console.error("Error getting birth charts for date range:", error);
      return [];
    }
  }

  async getCompatibilityReportsForDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    try {
      const results = await db
        .select({
          id: compatibilityReports.id,
          userId: compatibilityReports.userId,
          chart1Id: compatibilityReports.chart1Id,
          chart2Id: compatibilityReports.chart2Id,
          compatibilityScore: compatibilityReports.compatibilityScore,
          analysis: compatibilityReports.analysis,
          isAnonymous: compatibilityReports.isAnonymous,
          sessionId: compatibilityReports.sessionId,
          createdAt: compatibilityReports.createdAt,
        })
        .from(compatibilityReports)
        .where(
          and(
            sql`${compatibilityReports.createdAt} >= ${startDate}`,
            sql`${compatibilityReports.createdAt} < ${endDate}`,
          ),
        )
        .orderBy(desc(compatibilityReports.createdAt));
      return results;
    } catch (error) {
      console.error(
        "Error getting compatibility reports for date range:",
        error,
      );
      return [];
    }
  }

  async getBirthChartById(id: number): Promise<any> {
    try {
      const result = await db
        .select()
        .from(birthCharts)
        .where(eq(birthCharts.id, id))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error getting birth chart by ID:", error);
      return null;
    }
  }

  async getCompatibilityReportById(id: number): Promise<any> {
    try {
      const result = await db
        .select()
        .from(compatibilityReports)
        .where(eq(compatibilityReports.id, id))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error getting compatibility report by ID:", error);
      return null;
    }
  }

  async getConsultationsForDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    try {
      const results = await db
        .select()
        .from(consultations)
        .where(
          and(
            sql`${consultations.createdAt} >= ${startDate}`,
            sql`${consultations.createdAt} < ${endDate}`,
          ),
        )
        .orderBy(desc(consultations.createdAt));
      return results;
    } catch (error) {
      console.error("Error getting consultations for date range:", error);
      return [];
    }
  }

  async createBirthChart(chart: any): Promise<any> {
    try {
      const result = await db
        .insert(birthCharts)
        .values({
          userId: chart.user_id,
          name: chart.name,
          birthDate: chart.birth_date,
          birthTime: chart.birth_time,
          birthLocation: chart.birth_location,
          latitude: chart.latitude,
          longitude: chart.longitude,
          chartData: chart.chart_data,
          interpretations: chart.interpretations || {},
          isAnonymous: chart.is_anonymous || false,
          isPublic: chart.is_public || false,
          sessionId: chart.session_id || null,
        })
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error creating birth chart:", error);
      throw error;
    }
  }

  async getLatestBirthChartByUserId(userId: number): Promise<any> {
    try {
      const result = await db
        .select()
        .from(birthCharts)
        .where(eq(birthCharts.userId, userId))
        .orderBy(desc(birthCharts.createdAt))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error getting latest birth chart by user ID:", error);
      return null;
    }
  }

  async createAnonymousBirthChart(chart: any): Promise<any> {
    try {
      const sessionId = crypto.randomUUID();
      const result = await db
        .insert(birthCharts)
        .values({
          userId: null, // Anonymous report
          name: chart.name,
          birthDate: new Date(chart.birthDate),
          birthTime: chart.birthTime,
          birthLocation: chart.birthLocation,
          latitude: chart.latitude,
          longitude: chart.longitude,
          chartData: chart.chartData,
          interpretations: chart.interpretations || {},
          isAnonymous: true,
          sessionId: sessionId,
          isPublic: false,
        })
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error creating anonymous birth chart:", error);
      throw error;
    }
  }

  async createAnonymousCompatibilityReport(report: any): Promise<any> {
    try {
      const sessionId = crypto.randomUUID();
      const result = await db
        .insert(compatibilityReports)
        .values({
          userId: null, // Anonymous report
          chart1Id: report.chart1Id,
          chart2Id: report.chart2Id,
          compatibilityScore: report.compatibilityScore,
          analysis: report.analysis,
          isAnonymous: true,
          sessionId: sessionId,
        })
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error creating anonymous compatibility report:", error);
      throw error;
    }
  }

  // Consultation Queue Management Implementation
  async addToQueue(
    queueData: InsertConsultationQueue,
  ): Promise<ConsultationQueue> {
    try {
      const result = await db
        .insert(consultationQueue)
        .values(queueData)
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error adding to queue:", error);
      throw error;
    }
  }

  async removeFromQueue(queueId: number): Promise<void> {
    try {
      await db
        .delete(consultationQueue)
        .where(eq(consultationQueue.id, queueId));

      // Reorder remaining queue positions
      const queueEntry = await db
        .select()
        .from(consultationQueue)
        .where(eq(consultationQueue.id, queueId))
        .limit(1);

      if (queueEntry.length > 0) {
        await this.reorderQueue(queueEntry[0].astrologerId);
      }
    } catch (error) {
      console.error("Error removing from queue:", error);
      throw error;
    }
  }

  async getUserQueuePosition(
    userId: number,
    astrologerId: number,
  ): Promise<ConsultationQueue | undefined> {
    try {
      const result = await db
        .select()
        .from(consultationQueue)
        .where(
          and(
            eq(consultationQueue.userId, userId),
            eq(consultationQueue.astrologerId, astrologerId),
            eq(consultationQueue.status, "waiting"),
          ),
        )
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user queue position:", error);
      throw error;
    }
  }

  async updateQueuePosition(queueId: number, position: number): Promise<void> {
    try {
      await db
        .update(consultationQueue)
        .set({
          position,
          updatedAt: new Date(),
        })
        .where(eq(consultationQueue.id, queueId));
    } catch (error) {
      console.error("Error updating queue position:", error);
      throw error;
    }
  }

  async updateQueuePaymentStatus(
    queueId: number,
    paymentId: string,
    paymentStatus: string,
  ): Promise<void> {
    try {
      await db
        .update(consultationQueue)
        .set({
          paymentId,
          paymentStatus,
          updatedAt: new Date(),
        })
        .where(eq(consultationQueue.id, queueId));
    } catch (error) {
      console.error("Error updating queue payment status:", error);
      throw error;
    }
  }

  async getNextInQueue(
    astrologerId: number,
  ): Promise<ConsultationQueue | undefined> {
    try {
      const result = await db
        .select()
        .from(consultationQueue)
        .where(
          and(
            eq(consultationQueue.astrologerId, astrologerId),
            eq(consultationQueue.status, "waiting"),
            eq(consultationQueue.paymentStatus, "success"),
          ),
        )
        .orderBy(consultationQueue.position)
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting next in queue:", error);
      throw error;
    }
  }

  async updateQueueStatus(queueId: number, status: string): Promise<void> {
    try {
      await db
        .update(consultationQueue)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(consultationQueue.id, queueId));
    } catch (error) {
      console.error("Error updating queue status:", error);
      throw error;
    }
  }

  async reorderQueue(astrologerId: number): Promise<void> {
    try {
      const queueEntries = await db
        .select()
        .from(consultationQueue)
        .where(
          and(
            eq(consultationQueue.astrologerId, astrologerId),
            eq(consultationQueue.status, "waiting"),
          ),
        )
        .orderBy(consultationQueue.joinTime);

      // Update positions sequentially
      for (let i = 0; i < queueEntries.length; i++) {
        await db
          .update(consultationQueue)
          .set({
            position: i + 1,
            updatedAt: new Date(),
          })
          .where(eq(consultationQueue.id, queueEntries[i].id));
      }
    } catch (error) {
      console.error("Error reordering queue:", error);
      throw error;
    }
  }

  async getQueueEstimatedTime(
    astrologerId: number,
    position: number,
  ): Promise<number> {
    try {
      const averageDuration =
        await this.getAverageConsultationDuration(astrologerId);

      // Get current active consultation remaining time
      const activeConsultation =
        await this.getActiveConsultationForAstrologer(astrologerId);
      let currentConsultationRemaining = 0;

      if (activeConsultation) {
        const elapsedMinutes = Math.floor(
          (Date.now() - activeConsultation.startTime.getTime()) / (1000 * 60),
        );
        const consultation = await this.getConsultation(
          activeConsultation.consultationId,
        );
        if (consultation) {
          currentConsultationRemaining = Math.max(
            0,
            consultation.duration - elapsedMinutes,
          );
        }
      }

      // Calculate total wait time
      const queueWaitTime = (position - 1) * averageDuration;
      return currentConsultationRemaining + queueWaitTime;
    } catch (error) {
      console.error("Error calculating queue estimated time:", error);
      return position * 15; // Fallback: 15 minutes per position
    }
  }

  // Active Consultation Management Implementation
  async createActiveConsultation(
    consultation: InsertActiveConsultation,
  ): Promise<ActiveConsultation> {
    try {
      const result = await db
        .insert(activeConsultations)
        .values(consultation)
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error creating active consultation:", error);
      throw error;
    }
  }

  async getActiveConsultationForAstrologer(
    astrologerId: number,
  ): Promise<ActiveConsultation | undefined> {
    try {
      const result = await db
        .select()
        .from(activeConsultations)
        .where(eq(activeConsultations.astrologerId, astrologerId))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting active consultation:", error);
      throw error;
    }
  }

  async getActiveConsultationByUser(
    userId: number,
  ): Promise<ActiveConsultation | undefined> {
    try {
      const result = await db
        .select()
        .from(activeConsultations)
        .where(eq(activeConsultations.userId, userId))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting active consultation by user:", error);
      throw error;
    }
  }

  async endActiveConsultation(consultationId: number): Promise<void> {
    try {
      await db
        .delete(activeConsultations)
        .where(eq(activeConsultations.consultationId, consultationId));
    } catch (error) {
      console.error("Error ending active consultation:", error);
      throw error;
    }
  }

  async updateActiveConsultationActivity(
    consultationId: number,
  ): Promise<void> {
    try {
      await db
        .update(activeConsultations)
        .set({ lastActivity: new Date() })
        .where(eq(activeConsultations.consultationId, consultationId));
    } catch (error) {
      console.error("Error updating consultation activity:", error);
      throw error;
    }
  }

  // Queue Status and Availability Implementation
  async isAstrologerBusy(astrologerId: number): Promise<boolean> {
    try {
      const activeConsultation =
        await this.getActiveConsultationForAstrologer(astrologerId);
      return !!activeConsultation;
    } catch (error) {
      console.error("Error checking if astrologer is busy:", error);
      return false;
    }
  }

  async getAverageConsultationDuration(astrologerId: number): Promise<number> {
    try {
      const result = await db
        .select({ avgDuration: avg(consultations.duration) })
        .from(consultations)
        .where(
          and(
            eq(consultations.astrologerId, astrologerId),
            eq(consultations.status, "completed"),
          ),
        );

      const avgDuration = result[0]?.avgDuration;
      return avgDuration ? Math.round(Number(avgDuration)) : 20; // Default 20 minutes
    } catch (error) {
      console.error("Error getting average consultation duration:", error);
      return 20; // Fallback: 20 minutes
    }
  }

  async getQueueStatus(astrologerId: number): Promise<{
    isOnline: boolean;
    isBusy: boolean;
    currentConsultation?: ActiveConsultation;
    queueLength: number;
    estimatedWaitTime: number;
  }> {
    try {
      // Get astrologer status
      const astrologer = await this.getAstrologer(astrologerId);
      if (!astrologer) {
        throw new Error("Astrologer not found");
      }

      // Check if astrologer has active consultation
      const currentConsultation =
        await this.getActiveConsultationForAstrologer(astrologerId);
      const isBusy = !!currentConsultation;

      // Get queue length
      const queueEntries = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(consultationQueue)
        .where(
          and(
            eq(consultationQueue.astrologerId, astrologerId),
            eq(consultationQueue.status, "waiting"),
          ),
        );

      const queueLength = queueEntries[0]?.count || 0;

      // Calculate estimated wait time
      const estimatedWaitTime = await this.getQueueEstimatedTime(
        astrologerId,
        queueLength + 1,
      );

      return {
        isOnline: astrologer.isOnline,
        isBusy,
        currentConsultation,
        queueLength,
        estimatedWaitTime,
      };
    } catch (error) {
      console.error("Error getting queue status:", error);
      throw error;
    }
  }

  // Chat Rerouting Management Implementation
  async createChatRouting(routing: InsertChatRouting): Promise<ChatRouting> {
    try {
      const result = await db.insert(chatRouting).values(routing).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating chat routing:", error);
      throw error;
    }
  }

  async updateChatRouting(
    id: number,
    updates: Partial<ChatRouting>,
  ): Promise<void> {
    try {
      await db
        .update(chatRouting)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(chatRouting.id, id));
    } catch (error) {
      console.error("Error updating chat routing:", error);
      throw error;
    }
  }

  async deleteChatRouting(id: number): Promise<void> {
    try {
      await db.delete(chatRouting).where(eq(chatRouting.id, id));
    } catch (error) {
      console.error("Error deleting chat routing:", error);
      throw error;
    }
  }

  async getAllChatRoutings(): Promise<ChatRouting[]> {
    try {
      return await db
        .select()
        .from(chatRouting)
        .orderBy(desc(chatRouting.priority), desc(chatRouting.createdAt));
    } catch (error) {
      console.error("Error getting all chat routings:", error);
      throw error;
    }
  }

  async getActiveChatRoutings(): Promise<ChatRouting[]> {
    try {
      return await db
        .select()
        .from(chatRouting)
        .where(eq(chatRouting.isActive, true))
        .orderBy(desc(chatRouting.priority), desc(chatRouting.createdAt));
    } catch (error) {
      console.error("Error getting active chat routings:", error);
      throw error;
    }
  }

  async getChatRoutingByAstrologer(
    originalAstrologerId: number,
  ): Promise<ChatRouting | undefined> {
    try {
      const result = await db
        .select()
        .from(chatRouting)
        .where(
          and(
            eq(chatRouting.originalAstrologerId, originalAstrologerId),
            eq(chatRouting.isActive, true),
          ),
        )
        .orderBy(desc(chatRouting.priority))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting chat routing by astrologer:", error);
      throw error;
    }
  }

  async createRoutedConsultation(
    routedConsultation: InsertRoutedConsultation,
  ): Promise<RoutedConsultation> {
    try {
      const result = await db
        .insert(routedConsultations)
        .values(routedConsultation)
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error creating routed consultation:", error);
      throw error;
    }
  }

  async getRoutedConsultation(
    consultationId: number,
  ): Promise<RoutedConsultation | undefined> {
    try {
      const result = await db
        .select()
        .from(routedConsultations)
        .where(eq(routedConsultations.consultationId, consultationId))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting routed consultation:", error);
      throw error;
    }
  }

  async getOnlineAstrologersForRouting(): Promise<Astrologer[]> {
    try {
      return await db
        .select()
        .from(astrologers)
        .where(
          and(
            eq(astrologers.isOnline, true),
            eq(astrologers.isActive, true),
            eq(astrologers.isApproved, true),
          ),
        )
        .orderBy(astrologers.name);
    } catch (error) {
      console.error("Error getting online astrologers for routing:", error);
      throw error;
    }
  }

  // Phase 2: Enhanced consultation routing methods with real-time message routing support
  async getConsultationWithRouting(consultationId: number): Promise<any> {
    try {
      const consultation = await db
        .select({
          consultation: consultations,
          astrologer: astrologers,
          routedConsultation: routedConsultations,
        })
        .from(consultations)
        .leftJoin(astrologers, eq(consultations.astrologerId, astrologers.id))
        .leftJoin(
          routedConsultations,
          eq(consultations.id, routedConsultations.consultationId),
        )
        .where(eq(consultations.id, consultationId))
        .limit(1);

      if (consultation.length === 0) {
        return null;
      }

      const result = consultation[0];

      // Phase 2: Enhanced routing structure for real-time message delivery
      let routingData = null;
      if (result.routedConsultation) {
        // Get assigned astrologer details for Phase 2 routing
        const assignedAstrologer = await db
          .select()
          .from(astrologers)
          .where(
            eq(astrologers.id, result.routedConsultation.assignedAstrologerId),
          )
          .limit(1);

        routingData = {
          ...result.routedConsultation,
          originalAstrologerId: result.consultation.astrologerId,
          assignedAstrologerId: result.routedConsultation.assignedAstrologerId,
          displayAstrologerName:
            result.routedConsultation.userVisibleName ||
            result.astrologer?.name,
          assignedAstrologer: assignedAstrologer[0] || null,
        };
      }

      return {
        consultation: {
          ...result.consultation,
          is_rerouted: !!result.routedConsultation,
        },
        astrologer: result.astrologer,
        routing: routingData,
        // For transparency, always show original astrologer name to user
        displayAstrologerName:
          result.routedConsultation?.userVisibleName || result.astrologer?.name,
      };
    } catch (error) {
      console.error("Error getting consultation with routing:", error);
      throw error;
    }
  }

  async getActiveRouting(originalAstrologerId: number): Promise<any> {
    try {
      const routing = await db
        .select({
          routing: chatRouting,
          originalAstrologer: {
            id: astrologers.id,
            name: astrologers.name,
            email: astrologers.email,
            isOnline: astrologers.isOnline,
          },
        })
        .from(chatRouting)
        .leftJoin(
          astrologers,
          eq(chatRouting.originalAstrologerId, astrologers.id),
        )
        .where(
          and(
            eq(chatRouting.originalAstrologerId, originalAstrologerId),
            eq(chatRouting.isActive, true),
          ),
        )
        .orderBy(desc(chatRouting.priority))
        .limit(1);

      if (routing.length === 0) {
        return null;
      }

      const result = routing[0];
      const assignedAstrologer = await db
        .select()
        .from(astrologers)
        .where(eq(astrologers.id, result.routing.assignedAstrologerId))
        .limit(1);

      return {
        ...result.routing,
        originalAstrologer: result.originalAstrologer,
        assignedAstrologer: assignedAstrologer[0] || null,
      };
    } catch (error) {
      console.error("Error getting active routing:", error);
      throw error;
    }
  }

  // ========================= PHASE 3: INTELLIGENT ROUTING & LOAD BALANCING =========================

  async createAstrologerWorkload(
    workload: InsertAstrologerWorkload,
  ): Promise<AstrologerWorkload> {
    try {
      const [result] = await db
        .insert(astrologerWorkload)
        .values(workload)
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating astrologer workload:", error);
      throw error;
    }
  }

  async updateAstrologerWorkload(
    astrologerId: number,
    updates: Partial<AstrologerWorkload>,
  ): Promise<AstrologerWorkload> {
    try {
      const [result] = await db
        .update(astrologerWorkload)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(astrologerWorkload.astrologerId, astrologerId))
        .returning();
      return result;
    } catch (error) {
      console.error("Error updating astrologer workload:", error);
      throw error;
    }
  }

  async getAstrologerWorkload(
    astrologerId: number,
  ): Promise<AstrologerWorkload | undefined> {
    try {
      const [result] = await db
        .select()
        .from(astrologerWorkload)
        .where(eq(astrologerWorkload.astrologerId, astrologerId))
        .limit(1);
      return result;
    } catch (error) {
      console.error("Error getting astrologer workload:", error);
      throw error;
    }
  }

  async getAllAstrologerWorkloads(): Promise<AstrologerWorkload[]> {
    try {
      return await db
        .select()
        .from(astrologerWorkload)
        .orderBy(astrologerWorkload.workloadPercentage);
    } catch (error) {
      console.error("Error getting all astrologer workloads:", error);
      throw error;
    }
  }

  async createSmartRoutingRule(
    rule: InsertSmartRoutingRule,
  ): Promise<SmartRoutingRule> {
    try {
      const [result] = await db
        .insert(smartRoutingRules)
        .values(rule)
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating smart routing rule:", error);
      throw error;
    }
  }

  async updateSmartRoutingRule(
    id: number,
    updates: Partial<SmartRoutingRule>,
  ): Promise<SmartRoutingRule> {
    try {
      const [result] = await db
        .update(smartRoutingRules)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(smartRoutingRules.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error("Error updating smart routing rule:", error);
      throw error;
    }
  }

  async deleteSmartRoutingRule(id: number): Promise<void> {
    try {
      await db.delete(smartRoutingRules).where(eq(smartRoutingRules.id, id));
    } catch (error) {
      console.error("Error deleting smart routing rule:", error);
      throw error;
    }
  }

  async getActiveSmartRoutingRules(): Promise<SmartRoutingRule[]> {
    try {
      return await db
        .select()
        .from(smartRoutingRules)
        .where(eq(smartRoutingRules.isActive, true))
        .orderBy(smartRoutingRules.weight);
    } catch (error) {
      console.error("Error getting active smart routing rules:", error);
      throw error;
    }
  }

  async createConsultationAnalytics(
    analytics: InsertConsultationAnalytics,
  ): Promise<ConsultationAnalytics> {
    try {
      const [result] = await db
        .insert(consultationAnalytics)
        .values(analytics)
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating consultation analytics:", error);
      throw error;
    }
  }

  async getConsultationAnalytics(
    consultationId: number,
  ): Promise<ConsultationAnalytics[]> {
    try {
      return await db
        .select()
        .from(consultationAnalytics)
        .where(eq(consultationAnalytics.consultationId, consultationId))
        .orderBy(consultationAnalytics.createdAt);
    } catch (error) {
      console.error("Error getting consultation analytics:", error);
      throw error;
    }
  }

  async findBestAvailableAstrologer(userPreferences: {
    languages?: string[];
    specializations?: string[];
    maxWaitTime?: number;
    priorityLevel?: "normal" | "high" | "urgent";
  }): Promise<{
    astrologer: Astrologer;
    workload: AstrologerWorkload;
    matchScore: number;
    estimatedWaitTime: number;
  } | null> {
    try {
      // Get all online and available astrologers with their workload data
      const availableAstrologers = await db
        .select({
          astrologer: astrologers,
          workload: astrologerWorkload,
        })
        .from(astrologers)
        .leftJoin(
          astrologerWorkload,
          eq(astrologers.id, astrologerWorkload.astrologerId),
        )
        .where(
          and(
            eq(astrologers.isOnline, true),
            eq(astrologers.isActive, true),
            eq(astrologers.isApproved, true),
          ),
        );

      if (availableAstrologers.length === 0) return null;

      // Calculate match scores for each astrologer
      const scoredAstrologers = await Promise.all(
        availableAstrologers.map(async ({ astrologer, workload }) => {
          // Create default workload if none exists
          const astrologerWorkloadData = workload || {
            id: 0,
            astrologerId: astrologer.id,
            currentConsultations: 0,
            maxConcurrent: 3,
            averageResponseTime: 30,
            performanceScore: "1.0",
            workloadPercentage: "0.0",
            lastActivity: new Date(),
            isAcceptingNew: true,
            breakUntil: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const matchScore = await this.calculateAstrologerMatchScore(
            astrologer,
            astrologerWorkloadData,
            userPreferences,
          );
          const estimatedWaitTime = this.calculateEstimatedWaitTime(
            astrologerWorkloadData,
          );

          return {
            astrologer,
            workload: astrologerWorkloadData,
            matchScore,
            estimatedWaitTime,
          };
        }),
      );

      // Filter based on preferences and sort by match score
      const filteredAndSorted = scoredAstrologers
        .filter((item) => {
          // Filter by max wait time if specified
          if (
            userPreferences.maxWaitTime &&
            item.estimatedWaitTime > userPreferences.maxWaitTime
          ) {
            return false;
          }
          // Check if astrologer is accepting new consultations
          return (
            item.workload.isAcceptingNew &&
            (!item.workload.breakUntil || item.workload.breakUntil < new Date())
          );
        })
        .sort((a, b) => {
          // Priority level affects scoring
          const priorityMultiplier =
            userPreferences.priorityLevel === "urgent"
              ? 1.5
              : userPreferences.priorityLevel === "high"
                ? 1.2
                : 1.0;
          return (
            b.matchScore * priorityMultiplier -
            a.matchScore * priorityMultiplier
          );
        });

      return filteredAndSorted.length > 0 ? filteredAndSorted[0] : null;
    } catch (error) {
      console.error("Error finding best available astrologer:", error);
      throw error;
    }
  }

  async calculateAstrologerMatchScore(
    astrologer: Astrologer,
    workload: AstrologerWorkload,
    userPreferences: any,
  ): Promise<number> {
    try {
      let score = 0;
      let maxScore = 0;

      // Language match (30% weight)
      if (userPreferences.languages?.length > 0) {
        const languageMatch = userPreferences.languages.some((lang: string) =>
          astrologer.languages.includes(lang),
        );
        score += languageMatch ? 30 : 0;
      }
      maxScore += 30;

      // Specialization match (25% weight)
      if (userPreferences.specializations?.length > 0) {
        const specializationMatch = userPreferences.specializations.some(
          (spec: string) => astrologer.specializations.includes(spec),
        );
        score += specializationMatch ? 25 : 0;
      }
      maxScore += 25;

      // Performance score (20% weight)
      score += parseFloat(workload.performanceScore.toString()) * 20;
      maxScore += 20;

      // Workload consideration (15% weight) - prefer less busy astrologers
      const workloadScore = Math.max(
        0,
        15 - (parseFloat(workload.workloadPercentage.toString()) / 100) * 15,
      );
      score += workloadScore;
      maxScore += 15;

      // Rating (10% weight)
      const ratingScore = (parseFloat(astrologer.rating.toString()) / 5) * 10;
      score += ratingScore;
      maxScore += 10;

      // Normalize to 0-100 scale
      return maxScore > 0 ? (score / maxScore) * 100 : 0;
    } catch (error) {
      console.error("Error calculating astrologer match score:", error);
      return 0;
    }
  }

  private calculateEstimatedWaitTime(workload: AstrologerWorkload): number {
    const currentLoad = workload.currentConsultations;
    const maxConcurrent = workload.maxConcurrent;
    const avgResponseTime = workload.averageResponseTime;

    if (currentLoad < maxConcurrent) {
      return 0; // Available immediately
    }

    // Estimate based on current workload and average response time
    const queuePosition = currentLoad - maxConcurrent + 1;
    return queuePosition * avgResponseTime;
  }

  async updatePerformanceMetrics(
    astrologerId: number,
    responseTime: number,
    userSatisfaction: number,
  ): Promise<void> {
    try {
      const existingWorkload = await this.getAstrologerWorkload(astrologerId);

      if (existingWorkload) {
        // Update existing metrics with weighted average
        const newAvgResponseTime = Math.round(
          existingWorkload.averageResponseTime * 0.8 + responseTime * 0.2,
        );
        const newPerformanceScore =
          parseFloat(existingWorkload.performanceScore.toString()) * 0.9 +
          (userSatisfaction / 5) * 0.1;

        await this.updateAstrologerWorkload(astrologerId, {
          averageResponseTime: newAvgResponseTime,
          performanceScore: newPerformanceScore.toFixed(2),
          lastActivity: new Date(),
        });
      } else {
        // Create new workload entry
        await this.createAstrologerWorkload({
          astrologerId,
          currentConsultations: 0,
          maxConcurrent: 3,
          averageResponseTime: responseTime,
          performanceScore: (userSatisfaction / 5).toFixed(2),
          workloadPercentage: 0.0,
          lastActivity: new Date(),
          isAcceptingNew: true,
        });
      }
    } catch (error) {
      console.error("Error updating performance metrics:", error);
      throw error;
    }
  }

  async rebalanceWorkload(): Promise<void> {
    try {
      // Get all astrologer workloads
      const workloads = await this.getAllAstrologerWorkloads();

      for (const workload of workloads) {
        // Calculate current workload percentage
        const workloadPercentage =
          (workload.currentConsultations / workload.maxConcurrent) * 100;

        // Update workload data
        await this.updateAstrologerWorkload(workload.astrologerId, {
          workloadPercentage: workloadPercentage.toFixed(2),
          isAcceptingNew: workloadPercentage < 90, // Stop accepting new consultations at 90% capacity
        });
      }

      console.log("✅ Phase 3: Workload rebalancing completed successfully");
    } catch (error) {
      console.error("Error rebalancing workload:", error);
      throw error;
    }
  }

  // ========================= INDEXNOW INTEGRATION METHODS =========================

  async createIndexNowConfig(
    config: InsertIndexNowConfig,
  ): Promise<IndexNowConfig> {
    try {
      const [result] = await db
        .insert(indexNowConfig)
        .values(config)
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating IndexNow config:", error);
      throw error;
    }
  }

  async updateIndexNowConfig(
    domain: string,
    updates: Partial<IndexNowConfig>,
  ): Promise<void> {
    try {
      await db
        .update(indexNowConfig)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(indexNowConfig.domain, domain));
    } catch (error) {
      console.error("Error updating IndexNow config:", error);
      throw error;
    }
  }

  async getIndexNowConfig(domain: string): Promise<IndexNowConfig | undefined> {
    try {
      const [result] = await db
        .select()
        .from(indexNowConfig)
        .where(eq(indexNowConfig.domain, domain))
        .limit(1);
      return result;
    } catch (error) {
      console.error("Error getting IndexNow config:", error);
      throw error;
    }
  }

  async createIndexNowSubmission(
    submission: InsertIndexNowSubmission,
  ): Promise<IndexNowSubmission> {
    try {
      const [result] = await db
        .insert(indexNowSubmissions)
        .values(submission)
        .returning();
      return result;
    } catch (error) {
      console.error("Error creating IndexNow submission:", error);
      throw error;
    }
  }

  async updateIndexNowSubmission(
    id: number,
    updates: Partial<IndexNowSubmission>,
  ): Promise<void> {
    try {
      await db
        .update(indexNowSubmissions)
        .set(updates)
        .where(eq(indexNowSubmissions.id, id));
    } catch (error) {
      console.error("Error updating IndexNow submission:", error);
      throw error;
    }
  }

  async getIndexNowSubmission(
    id: number,
  ): Promise<IndexNowSubmission | undefined> {
    try {
      const [result] = await db
        .select()
        .from(indexNowSubmissions)
        .where(eq(indexNowSubmissions.id, id))
        .limit(1);
      return result;
    } catch (error) {
      console.error("Error getting IndexNow submission:", error);
      throw error;
    }
  }

  async getFailedIndexNowSubmissions(
    maxRetries: number,
  ): Promise<IndexNowSubmission[]> {
    try {
      return await db
        .select()
        .from(indexNowSubmissions)
        .where(
          and(
            eq(indexNowSubmissions.status, "failed"),
            sql`${indexNowSubmissions.retryCount} < ${maxRetries}`,
            or(
              sql`${indexNowSubmissions.nextRetryAt} IS NULL`,
              sql`${indexNowSubmissions.nextRetryAt} <= ${new Date()}`,
            ),
          ),
        )
        .orderBy(indexNowSubmissions.submittedAt)
        .limit(10);
    } catch (error) {
      console.error("Error getting failed IndexNow submissions:", error);
      throw error;
    }
  }

  async getIndexNowStats(): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
    recentSubmissions: IndexNowSubmission[];
  }> {
    try {
      const [totalResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(indexNowSubmissions);

      const [successResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(indexNowSubmissions)
        .where(eq(indexNowSubmissions.status, "success"));

      const [failedResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(indexNowSubmissions)
        .where(eq(indexNowSubmissions.status, "failed"));

      const [pendingResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(indexNowSubmissions)
        .where(eq(indexNowSubmissions.status, "pending"));

      const recentSubmissions = await db
        .select()
        .from(indexNowSubmissions)
        .orderBy(desc(indexNowSubmissions.submittedAt))
        .limit(10);

      return {
        total: totalResult.count,
        successful: successResult.count,
        failed: failedResult.count,
        pending: pendingResult.count,
        recentSubmissions,
      };
    } catch (error) {
      console.error("Error getting IndexNow stats:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
