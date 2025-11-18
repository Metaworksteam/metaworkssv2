import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  accessLevel: text("access_level").default("trial").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const companyInfo = pgTable("company_info", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  sector: text("sector"),
  size: text("size"),
  website: text("website"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  postalCode: text("postal_code"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  ceoName: text("ceo_name"),
  cioName: text("cio_name"),
  ctoName: text("cto_name"),
  cisoName: text("ciso_name"),
  businessDescription: text("business_description"),
  foundedYear: integer("founded_year"),
  employeeCount: integer("employee_count"),
  annualRevenue: text("annual_revenue"),
  logoId: integer("logo_id").references(() => files.id),
  documentsFileIds: jsonb("documents_file_ids").default([]),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
  updatedBy: integer("updated_by"),
});

export const cybersecurityStaff = pgTable("cybersecurity_staff", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  staffName: text("staff_name").notNull(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  content: text("content"),
  fileId: integer("file_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// File storage tables
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  uploadedBy: integer("uploaded_by"),
  fileType: text("file_type").notNull(), // 'logo', 'policy', etc.
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCompanyInfoSchema = createInsertSchema(companyInfo);
export const insertCybersecurityStaffSchema = createInsertSchema(cybersecurityStaff);
export const insertPolicySchema = createInsertSchema(policies);
export const insertFileSchema = createInsertSchema(files).omit({ id: true });

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CompanyInfo = typeof companyInfo.$inferSelect;
export type CybersecurityStaff = typeof cybersecurityStaff.$inferSelect;
export type Policy = typeof policies.$inferSelect;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

// Framework assessment tables
export const frameworks = pgTable("frameworks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description").notNull(),
  version: text("version").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  frameworkId: integer("framework_id").notNull(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

export const subdomains = pgTable("subdomains", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").notNull(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

export const controls = pgTable("controls", {
  id: serial("id").primaryKey(),
  subdomainId: integer("subdomain_id").notNull(),
  controlId: text("control_id").notNull(), // e.g., "ECC-1.2.3" or "SAMA-2.4"
  name: text("name").notNull(),
  description: text("description").notNull(),
  guidance: text("guidance"),
  maturityLevel: integer("maturity_level").default(1),
  referenceLinks: text("reference_links"),
  implementationGuide: text("implementation_guide"),
  frameworkSpecific: jsonb("framework_specific"), // Stores framework-specific properties
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  frameworkId: integer("framework_id").notNull(),
  name: text("name").notNull(),
  status: text("status").default("in_progress").notNull(), // in_progress, completed
  score: real("score"),
  startDate: date("start_date", { mode: 'string' }).defaultNow().notNull(),
  completionDate: date("completion_date", { mode: 'string' }),
  createdBy: integer("created_by").notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
  findings: jsonb("findings"),
  recommendations: jsonb("recommendations"),
});

export const assessmentResults = pgTable("assessment_results", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  controlId: integer("control_id").notNull(),
  status: text("status").notNull(), // implemented, partially_implemented, not_implemented, not_applicable
  evidence: text("evidence"),
  comments: text("comments"),
  attachments: jsonb("attachments"),
  maturityLevel: text("maturity_level"), // SAMA: baseline, evolving, established, predictable, leading
  maturityScore: integer("maturity_score"), // Numeric representation of maturity (1-5)
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
  updatedBy: integer("updated_by").notNull(),
  frameworkSpecificData: jsonb("framework_specific_data"), // Stores framework-specific assessment data
});

export const remediationTasks = pgTable("remediation_tasks", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  controlId: integer("control_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(), // open, in_progress, completed
  priority: text("priority").default("medium").notNull(), // low, medium, high, critical
  assignedTo: integer("assigned_to"),
  dueDate: date("due_date", { mode: 'string' }),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
  externalId: text("external_id"), // For integration with external systems like ClickUp
});

// Create insert schemas for assessment tables
export const insertFrameworkSchema = createInsertSchema(frameworks).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDomainSchema = createInsertSchema(domains).omit({ id: true });
export const insertSubdomainSchema = createInsertSchema(subdomains).omit({ id: true });
export const insertControlSchema = createInsertSchema(controls).omit({ id: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, updatedAt: true });
export const insertAssessmentResultSchema = createInsertSchema(assessmentResults).omit({ id: true, updatedAt: true });
export const insertRemediationTaskSchema = createInsertSchema(remediationTasks).omit({ id: true, createdAt: true, updatedAt: true });

// Define assessment-related types
export type Framework = typeof frameworks.$inferSelect;
export type Domain = typeof domains.$inferSelect;
export type Subdomain = typeof subdomains.$inferSelect;
export type Control = typeof controls.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type RemediationTask = typeof remediationTasks.$inferSelect;

export type InsertFramework = z.infer<typeof insertFrameworkSchema>;
export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type InsertSubdomain = z.infer<typeof insertSubdomainSchema>;
export type InsertControl = z.infer<typeof insertControlSchema>;
// Compliance reports and shareable links
export const complianceReports = pgTable("compliance_reports", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  companyId: integer("company_id").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  reportData: jsonb("report_data").notNull(),
  format: text("format").default("pdf").notNull(), // pdf, html, json, etc.
  status: text("status").default("generated").notNull(), // generating, generated, error
  isPublic: boolean("is_public").default(false).notNull(),
});

export const reportShareLinks = pgTable("report_share_links", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").notNull(),
  shareToken: uuid("share_token").defaultRandom().notNull().unique(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { mode: 'string' }),
  password: text("password"),
  viewCount: integer("view_count").default(0).notNull(),
  maxViews: integer("max_views"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertComplianceReportSchema = createInsertSchema(complianceReports).omit({ 
  id: true, 
  createdAt: true 
});

export const insertReportShareLinkSchema = createInsertSchema(reportShareLinks).omit({ 
  id: true, 
  createdAt: true, 
  shareToken: true,
  viewCount: true
});

export type ComplianceReport = typeof complianceReports.$inferSelect;
export type ReportShareLink = typeof reportShareLinks.$inferSelect;
export type InsertComplianceReport = z.infer<typeof insertComplianceReportSchema>;
export type InsertReportShareLink = z.infer<typeof insertReportShareLinkSchema>;

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
export type InsertRemediationTask = z.infer<typeof insertRemediationTaskSchema>;

// Policy Management System
export const policyCategories = pgTable("policy_categories", {
  id: serial("id").primaryKey(),
  categoryName: text("category_name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const policyTemplates = pgTable("policy_templates", {
  id: serial("id").primaryKey(),
  templateName: text("template_name").notNull(),
  templateType: text("template_type").notNull(), // Word/PDF
  fileId: integer("file_id").notNull(),
  categoryId: integer("category_id").notNull(),
  dateUploaded: timestamp("date_uploaded", { mode: 'string' }).defaultNow().notNull(),
  uploadedBy: integer("uploaded_by").notNull(),
  version: text("version").default("1.0").notNull(),
  placeholders: jsonb("placeholders"), // Extracted placeholders
  isActive: boolean("is_active").default(true).notNull(),
});

export const generatedPolicies = pgTable("generated_policies", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  companyId: integer("company_id").notNull(),
  generatedFileId: integer("generated_file_id").notNull(),
  version: text("version").default("1.0").notNull(),
  generationDate: timestamp("generation_date", { mode: 'string' }).defaultNow().notNull(),
  approvalStatus: text("approval_status").default("pending").notNull(), // pending, approved, rejected
  approvedBy: integer("approved_by"),
  approvedDate: timestamp("approved_date", { mode: 'string' }),
  replacementData: jsonb("replacement_data").notNull(), // Stored values used for placeholders
  notes: text("notes"),
});

// Create insert schemas for policy management
export const insertPolicyCategorySchema = createInsertSchema(policyCategories).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});

export const insertPolicyTemplateSchema = createInsertSchema(policyTemplates).omit({ 
  id: true, 
  dateUploaded: true
});

export const insertGeneratedPolicySchema = createInsertSchema(generatedPolicies).omit({ 
  id: true, 
  generationDate: true, 
  approvedBy: true,
  approvedDate: true
});

// Define policy management types
export type PolicyCategory = typeof policyCategories.$inferSelect;
export type PolicyTemplate = typeof policyTemplates.$inferSelect;
export type GeneratedPolicy = typeof generatedPolicies.$inferSelect;

export type InsertPolicyCategory = z.infer<typeof insertPolicyCategorySchema>;
export type InsertPolicyTemplate = z.infer<typeof insertPolicyTemplateSchema>;
export type InsertGeneratedPolicy = z.infer<typeof insertGeneratedPolicySchema>;

// Onboarding and Gamification Schema
export const onboardingSteps = pgTable('onboarding_steps', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  type: text('type').notNull(), // 'learning', 'quiz', 'task', 'assessment'
  content: jsonb('content').notNull(), // Contains questions, answers, and educational content
  points: integer('points').notNull().default(10),
  estimatedDuration: integer('estimated_duration').notNull(), // in minutes
  prerequisiteStepIds: jsonb('prerequisite_step_ids').default([]),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
});

export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  stepId: integer('step_id').notNull().references(() => onboardingSteps.id),
  completed: boolean('completed').notNull().default(false),
  score: integer('score'),
  answers: jsonb('answers'), // User's answers to quizzes
  startedAt: timestamp('started_at', { mode: 'string' }),
  completedAt: timestamp('completed_at', { mode: 'string' }),
  attempts: integer('attempts').notNull().default(0),
  feedback: text('feedback'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
});

export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  category: text('category').notNull(), // 'achievement', 'learning', 'participation'
  requiredPoints: integer('required_points'),
  requiredSteps: jsonb('required_steps'),
  isSecret: boolean('is_secret').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow()
});

export const userBadges = pgTable('user_badges', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  badgeId: integer('badge_id').notNull().references(() => badges.id),
  earnedAt: timestamp('earned_at', { mode: 'string' }).notNull().defaultNow(),
  displayed: boolean('displayed').notNull().default(true)
});

export const userGameStats = pgTable('user_game_stats', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id).unique(),
  totalPoints: integer('total_points').notNull().default(0),
  level: integer('level').notNull().default(1),
  streakDays: integer('streak_days').notNull().default(0),
  lastActivity: timestamp('last_activity', { mode: 'string' }).notNull().defaultNow(),
  completedSteps: integer('completed_steps').notNull().default(0),
  quizAverage: real('quiz_average'),
  fastestCompletionTime: integer('fastest_completion_time'), // in seconds
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow()
});

// Create insert schemas for onboarding and gamification
export const insertOnboardingStepSchema = createInsertSchema(onboardingSteps).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});

export const insertBadgeSchema = createInsertSchema(badges).omit({ 
  id: true, 
  createdAt: true
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ 
  id: true, 
  earnedAt: true
});

export const insertUserGameStatsSchema = createInsertSchema(userGameStats).omit({ 
  id: true,
  updatedAt: true
});

// Risk Management Schema
export const risks = pgTable('risks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  cause: text('cause'),
  category: text('category').notNull(), // 'Strategic', 'Operational', 'Compliance'
  owner: text('owner'),
  likelihood: text('likelihood').notNull(), // 'Very Likely', 'Likely', 'Possible', 'Unlikely', 'Very Unlikely'
  impact: text('impact').notNull(), // 'Catastrophic', 'Major', 'Serious', 'Medium', 'Minor'
  inherentRiskLevel: text('inherent_risk_level').notNull(), // 'High', 'Medium', 'Low'
  existingControls: text('existing_controls'),
  controlEffectiveness: text('control_effectiveness'), // 'Effective', 'Needs Improvement', 'None'
  residualRiskLevel: text('residual_risk_level'), // 'High', 'Medium', 'Low'
  mitigationActions: text('mitigation_actions'),
  targetDate: text('target_date'),
  isAccepted: boolean('is_accepted').default(false),
  companyId: integer('company_id').references(() => companyInfo.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Risk Assessment Link Table
export const assessmentRisks = pgTable('assessment_risks', {
  id: serial('id').primaryKey(),
  assessmentId: integer('assessment_id').notNull().references(() => assessments.id),
  riskId: integer('risk_id').notNull().references(() => risks.id),
  status: text('status').notNull().default('to_assess'), // 'to_assess', 'in_progress', 'completed'
  notes: text('notes'),
  evidence: text('evidence'),
  reviewedBy: integer('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Create insert schemas for risk management
export const insertRiskSchema = createInsertSchema(risks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAssessmentRiskSchema = createInsertSchema(assessmentRisks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Contact Messages and Demo Requests
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // 'new', 'read', 'replied', 'archived'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message"),
  status: text("status").notNull().default("new"), // 'new', 'contacted', 'scheduled', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas for contact and demo
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  createdAt: true
});

export const insertDemoRequestSchema = createInsertSchema(demoRequests).omit({
  id: true,
  status: true,
  createdAt: true
});

// Define onboarding and gamification types
export type OnboardingStep = typeof onboardingSteps.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type UserGameStats = typeof userGameStats.$inferSelect;

export type InsertOnboardingStep = z.infer<typeof insertOnboardingStepSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type InsertUserGameStats = z.infer<typeof insertUserGameStatsSchema>;

// Define risk management types
export type Risk = typeof risks.$inferSelect;
export type AssessmentRisk = typeof assessmentRisks.$inferSelect;

export type InsertRisk = z.infer<typeof insertRiskSchema>;
export type InsertAssessmentRisk = z.infer<typeof insertAssessmentRiskSchema>;

// Define contact and demo types
export type ContactMessage = typeof contactMessages.$inferSelect;
export type DemoRequest = typeof demoRequests.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
