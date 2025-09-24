CREATE TABLE "ab_test_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_id" integer NOT NULL,
	"user_id" integer,
	"variant" text NOT NULL,
	"interaction" text NOT NULL,
	"session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ab_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"article_id" integer NOT NULL,
	"variant_a" jsonb NOT NULL,
	"variant_b" jsonb NOT NULL,
	"traffic_split" real DEFAULT 0.5 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"results" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "active_consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"astrologer_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"consultation_id" integer NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"session_id" text,
	"socket_id" text,
	"status" text DEFAULT 'active' NOT NULL,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"response_type" varchar NOT NULL,
	"reference_id" integer NOT NULL,
	"response_text" text NOT NULL,
	"pdf_attachment" varchar,
	"responded_by" varchar NOT NULL,
	"email_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"category" text DEFAULT 'general' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"booking_date" date NOT NULL,
	"booking_time" time NOT NULL,
	"session_type" varchar NOT NULL,
	"astrologer" varchar,
	"duration" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"status" varchar DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "article_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"user_id" integer,
	"ip_address" text NOT NULL,
	"user_agent" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"featured_image" text,
	"author_id" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"category" text NOT NULL,
	"tags" text[] NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text[],
	"read_time" integer DEFAULT 5 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"focus_keyword" text,
	"parent_article_id" integer,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "astrologer_workload" (
	"id" serial PRIMARY KEY NOT NULL,
	"astrologer_id" integer NOT NULL,
	"current_consultations" integer DEFAULT 0 NOT NULL,
	"max_concurrent" integer DEFAULT 3 NOT NULL,
	"average_response_time" integer DEFAULT 30 NOT NULL,
	"performance_score" numeric(3, 2) DEFAULT '1.0' NOT NULL,
	"workload_percentage" numeric(5, 2) DEFAULT '0.0' NOT NULL,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"is_accepting_new" boolean DEFAULT true NOT NULL,
	"break_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "astrologers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"image" text NOT NULL,
	"experience" integer NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"review_count" integer NOT NULL,
	"rate_per_minute" integer NOT NULL,
	"specializations" text[] NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"languages" text[] NOT NULL,
	"description" text NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"total_consultations" integer DEFAULT 0 NOT NULL,
	"total_earnings" integer DEFAULT 0 NOT NULL,
	"available_from" text,
	"available_to" text,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"max_concurrent_users" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "astrologers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "birth_charts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"birth_date" timestamp NOT NULL,
	"birth_time" text NOT NULL,
	"birth_location" text NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"chart_data" jsonb NOT NULL,
	"interpretations" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"color" text DEFAULT '#8B5CF6' NOT NULL,
	"icon" text DEFAULT '📖' NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"parent_category_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"sender_type" text NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_by" integer,
	"deleted_at" timestamp,
	"reply_to_message_id" integer,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"pinned_by" integer,
	"pinned_at" timestamp,
	"reactions" jsonb DEFAULT '{}'::jsonb,
	"message_type" text DEFAULT 'text' NOT NULL,
	"attachment_url" text,
	"attachment_type" text,
	"status" text DEFAULT 'sent' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_routing" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_astrologer_id" integer NOT NULL,
	"assigned_astrologer_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"reason" text,
	"admin_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compatibility_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"chart1_id" integer NOT NULL,
	"chart2_id" integer NOT NULL,
	"compatibility_score" real NOT NULL,
	"analysis" jsonb NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultation_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_id" integer NOT NULL,
	"original_astrologer_id" integer NOT NULL,
	"assigned_astrologer_id" integer NOT NULL,
	"routing_rule_id" integer,
	"match_score" numeric(5, 2),
	"wait_time_seconds" integer,
	"response_time_avg" integer,
	"user_satisfaction" numeric(3, 2),
	"routing_effectiveness" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultation_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"astrologer_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"consultation_id" integer,
	"position" integer NOT NULL,
	"join_time" timestamp DEFAULT now() NOT NULL,
	"estimated_wait_minutes" integer,
	"payment_id" text,
	"payment_status" text DEFAULT 'pending',
	"status" text DEFAULT 'waiting' NOT NULL,
	"session_id" text,
	"notification_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"astrologer_id" integer NOT NULL,
	"topic" text NOT NULL,
	"duration" integer NOT NULL,
	"cost" integer NOT NULL,
	"rating" integer,
	"review" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"payment_id" text,
	"payment_status" text DEFAULT 'pending',
	"user_details" jsonb,
	"timer_started" boolean DEFAULT false NOT NULL,
	"timer_start_time" timestamp,
	"astrologer_extensions" integer DEFAULT 0 NOT NULL,
	"queue_position" integer,
	"estimated_wait_time" integer,
	"is_rerouted" boolean DEFAULT false NOT NULL,
	"rerouted_to" integer,
	"queue_entered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "content_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"template" text NOT NULL,
	"variables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"value" integer NOT NULL,
	"min_order_amount" integer DEFAULT 0 NOT NULL,
	"max_discount_amount" integer,
	"usage_limit" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"applicable_to_users" text[],
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "daily_horoscopes" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"zodiac_sign" text NOT NULL,
	"content" text NOT NULL,
	"mood" text,
	"lucky_number" integer,
	"lucky_color" text,
	"compatibility" text,
	"language" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "digital_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"price" integer NOT NULL,
	"astrologer_id" integer,
	"content" text,
	"download_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"template_id" integer,
	"status" text DEFAULT 'draft' NOT NULL,
	"recipient_filter" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"open_rate" real DEFAULT 0,
	"click_rate" real DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" text NOT NULL,
	"subscription_type" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "email_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"new_email" text NOT NULL,
	"verification_code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faq_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"gender" varchar NOT NULL,
	"birth_date" date NOT NULL,
	"birth_time" varchar NOT NULL,
	"birth_place" varchar NOT NULL,
	"latitude" real,
	"longitude" real,
	"free_question" text NOT NULL,
	"additional_question_1" text,
	"additional_question_2" text,
	"has_paid_questions" boolean DEFAULT false,
	"payment_id" varchar,
	"payment_txn_id" varchar,
	"payment_status" varchar DEFAULT 'pending',
	"payment_amount" integer DEFAULT 0,
	"answer" text,
	"answered_by" varchar,
	"assigned_astrologer_id" integer,
	"status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"answered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"astrologer_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "horoscopes" (
	"id" serial PRIMARY KEY NOT NULL,
	"sign" text NOT NULL,
	"period" text NOT NULL,
	"date" text NOT NULL,
	"prediction" text NOT NULL,
	"lucky_numbers" integer[] NOT NULL,
	"lucky_colors" text[] NOT NULL,
	"favorable_time" text NOT NULL,
	"avoid_time" text NOT NULL,
	"general_advice" text NOT NULL,
	"love_life" text NOT NULL,
	"career" text NOT NULL,
	"health" text NOT NULL,
	"finances" text NOT NULL,
	"spirituality" text NOT NULL,
	"transit_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indexnow_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"api_key" text NOT NULL,
	"key_location" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "indexnow_config_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "indexnow_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"urls" text[] NOT NULL,
	"content_type" text NOT NULL,
	"related_id" integer,
	"status" text DEFAULT 'pending' NOT NULL,
	"response_code" integer,
	"response_message" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"next_retry_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"action_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_id" text,
	"download_count" integer DEFAULT 0 NOT NULL,
	"purchased_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"question_text" text NOT NULL,
	"category" varchar NOT NULL,
	"answer" text,
	"is_priority" boolean DEFAULT false,
	"is_paid" boolean DEFAULT false,
	"answered_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"answered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reading_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"article_id" integer NOT NULL,
	"time_spent" integer,
	"completion_percentage" numeric DEFAULT '0',
	"read_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"astrologer_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"is_verified" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routed_consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_id" integer NOT NULL,
	"original_astrologer_id" integer NOT NULL,
	"assigned_astrologer_id" integer NOT NULL,
	"routing_rule_id" integer NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"user_visible_name" text NOT NULL,
	"actual_provider_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"gender" varchar NOT NULL,
	"birth_date" date NOT NULL,
	"birth_time" varchar NOT NULL,
	"birth_place" varchar NOT NULL,
	"latitude" real,
	"longitude" real,
	"booking_date" date NOT NULL,
	"booking_time" varchar NOT NULL,
	"session_type" varchar DEFAULT 'consultation' NOT NULL,
	"payment_id" varchar,
	"payment_status" varchar DEFAULT 'pending',
	"payment_amount" integer DEFAULT 15000,
	"status" varchar DEFAULT 'pending',
	"admin_notes" text,
	"user_pin" varchar,
	"is_slot_blocked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"confirmed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "smart_routing_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_name" text NOT NULL,
	"conditions" jsonb NOT NULL,
	"routing_logic" jsonb NOT NULL,
	"weight" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"success_rate" numeric(5, 2) DEFAULT '0.0' NOT NULL,
	"total_applications" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transit_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"transit_type" text NOT NULL,
	"planet" text NOT NULL,
	"aspect" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"description" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"notification_sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"event" text NOT NULL,
	"properties" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"session_id" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"birth_date" timestamp,
	"birth_time" text,
	"birth_location" text,
	"birth_latitude" numeric,
	"birth_longitude" numeric,
	"zodiac_sign" text,
	"moon_sign" text,
	"rising_sign" text,
	"birth_chart_data" jsonb,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"article_id" integer NOT NULL,
	"score" numeric NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"pin_hash" text,
	"pin_reset_at" timestamp,
	"phone" text,
	"role" text DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"wallet_balance" integer DEFAULT 0 NOT NULL,
	"date_of_birth" timestamp,
	"time_of_birth" text,
	"place_of_birth" text,
	"profile_image" text,
	"bio" text,
	"total_consultations" integer DEFAULT 0 NOT NULL,
	"total_spent" integer DEFAULT 0 NOT NULL,
	"preferred_languages" text[] DEFAULT '{}' NOT NULL,
	"google_id" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"full_name" text,
	"login_otp" text,
	"login_otp_expiry" timestamp,
	"reset_otp" text,
	"reset_otp_expiry" timestamp,
	"latitude" real,
	"longitude" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE TABLE "webinar_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"webinar_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"attendance_status" text DEFAULT 'registered' NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webinars" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"host_id" integer NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"max_participants" integer,
	"price" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"meeting_url" text,
	"recording_url" text,
	"language" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ab_test_interactions" ADD CONSTRAINT "ab_test_interactions_test_id_ab_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."ab_tests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ab_test_interactions" ADD CONSTRAINT "ab_test_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_consultations" ADD CONSTRAINT "active_consultations_astrologer_id_astrologers_id_fk" FOREIGN KEY ("astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_consultations" ADD CONSTRAINT "active_consultations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_consultations" ADD CONSTRAINT "active_consultations_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_views" ADD CONSTRAINT "article_views_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_views" ADD CONSTRAINT "article_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "astrologer_workload" ADD CONSTRAINT "astrologer_workload_astrologer_id_astrologers_id_fk" FOREIGN KEY ("astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "birth_charts" ADD CONSTRAINT "birth_charts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_pinned_by_users_id_fk" FOREIGN KEY ("pinned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_routing" ADD CONSTRAINT "chat_routing_original_astrologer_id_astrologers_id_fk" FOREIGN KEY ("original_astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_routing" ADD CONSTRAINT "chat_routing_assigned_astrologer_id_astrologers_id_fk" FOREIGN KEY ("assigned_astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_routing" ADD CONSTRAINT "chat_routing_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_reports" ADD CONSTRAINT "compatibility_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_reports" ADD CONSTRAINT "compatibility_reports_chart1_id_birth_charts_id_fk" FOREIGN KEY ("chart1_id") REFERENCES "public"."birth_charts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_reports" ADD CONSTRAINT "compatibility_reports_chart2_id_birth_charts_id_fk" FOREIGN KEY ("chart2_id") REFERENCES "public"."birth_charts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_analytics" ADD CONSTRAINT "consultation_analytics_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_analytics" ADD CONSTRAINT "consultation_analytics_original_astrologer_id_astrologers_id_fk" FOREIGN KEY ("original_astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_analytics" ADD CONSTRAINT "consultation_analytics_assigned_astrologer_id_astrologers_id_fk" FOREIGN KEY ("assigned_astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_analytics" ADD CONSTRAINT "consultation_analytics_routing_rule_id_smart_routing_rules_id_fk" FOREIGN KEY ("routing_rule_id") REFERENCES "public"."smart_routing_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_queue" ADD CONSTRAINT "consultation_queue_astrologer_id_astrologers_id_fk" FOREIGN KEY ("astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_queue" ADD CONSTRAINT "consultation_queue_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_queue" ADD CONSTRAINT "consultation_queue_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_astrologer_id_astrologers_id_fk" FOREIGN KEY ("astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_rerouted_to_astrologers_id_fk" FOREIGN KEY ("rerouted_to") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_products" ADD CONSTRAINT "digital_products_astrologer_id_astrologers_id_fk" FOREIGN KEY ("astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_template_id_content_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."content_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_subscriptions" ADD CONSTRAINT "email_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faq_questions" ADD CONSTRAINT "faq_questions_assigned_astrologer_id_astrologers_id_fk" FOREIGN KEY ("assigned_astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_astrologer_id_astrologers_id_fk" FOREIGN KEY ("astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_purchases" ADD CONSTRAINT "product_purchases_product_id_digital_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."digital_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_purchases" ADD CONSTRAINT "product_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_astrologer_id_astrologers_id_fk" FOREIGN KEY ("astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routed_consultations" ADD CONSTRAINT "routed_consultations_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routed_consultations" ADD CONSTRAINT "routed_consultations_original_astrologer_id_astrologers_id_fk" FOREIGN KEY ("original_astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routed_consultations" ADD CONSTRAINT "routed_consultations_assigned_astrologer_id_astrologers_id_fk" FOREIGN KEY ("assigned_astrologer_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routed_consultations" ADD CONSTRAINT "routed_consultations_routing_rule_id_chat_routing_id_fk" FOREIGN KEY ("routing_rule_id") REFERENCES "public"."chat_routing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_content" ADD CONSTRAINT "scheduled_content_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transit_notifications" ADD CONSTRAINT "transit_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_analytics" ADD CONSTRAINT "user_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recommendations" ADD CONSTRAINT "user_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recommendations" ADD CONSTRAINT "user_recommendations_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webinar_registrations" ADD CONSTRAINT "webinar_registrations_webinar_id_webinars_id_fk" FOREIGN KEY ("webinar_id") REFERENCES "public"."webinars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webinar_registrations" ADD CONSTRAINT "webinar_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webinars" ADD CONSTRAINT "webinars_host_id_astrologers_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."astrologers"("id") ON DELETE no action ON UPDATE no action;