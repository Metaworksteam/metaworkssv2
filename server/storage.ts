import {
  users,
  companyInfo,
  cybersecurityStaff,
  policies,
  frameworks,
  domains,
  subdomains,
  controls,
  assessments,
  assessmentResults,
  remediationTasks,
  files,
  complianceReports,
  reportShareLinks,
  risks,
  assessmentRisks,
  policyCategories,
  policyTemplates,
  generatedPolicies,
  onboardingSteps,
  userProgress,
  badges,
  userBadges,
  userGameStats,
  type User,
  type InsertUser,
  type CompanyInfo,
  type CybersecurityStaff,
  type Policy,
  type Framework,
  type Domain,
  type Subdomain,
  type Control,
  type Assessment,
  type AssessmentResult,
  type RemediationTask,
  type InsertFramework,
  type InsertDomain,
  type InsertSubdomain,
  type InsertControl,
  type InsertAssessment,
  type InsertAssessmentResult,
  type InsertRemediationTask,
  type File,
  type InsertFile,
  type ComplianceReport,
  type InsertComplianceReport,
  type ReportShareLink,
  type InsertReportShareLink,
  type PolicyCategory,
  type InsertPolicyCategory,
  type PolicyTemplate,
  type InsertPolicyTemplate,
  type GeneratedPolicy,
  type InsertGeneratedPolicy,
  type OnboardingStep,
  type InsertOnboardingStep,
  type UserProgress,
  type InsertUserProgress,
  type Badge,
  type InsertBadge,
  type UserBadge,
  type InsertUserBadge,
  type UserGameStats,
  type InsertUserGameStats,
  type Risk,
  type InsertRisk,
  type AssessmentRisk,
  type InsertAssessmentRisk
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc, asc, sql, or, isNull, inArray } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Company info management
  saveCompanyInfo(info: Partial<CompanyInfo>): Promise<CompanyInfo>;
  getCompanyInfo(): Promise<CompanyInfo | undefined>;
  
  // Staff management
  saveCybersecurityStaff(companyId: number, staffNames: string[]): Promise<CybersecurityStaff[]>;
  getCybersecurityStaff(companyId: number): Promise<CybersecurityStaff[]>;
  
  // Policy management
  savePolicy(policy: Partial<Policy>): Promise<Policy>;
  getPolicies(): Promise<Policy[]>;
  getPolicyById(id: number): Promise<Policy | undefined>;
  deletePolicy(id: number): Promise<void>;
  
  // Framework management
  saveFramework(framework: InsertFramework): Promise<Framework>;
  getFrameworks(): Promise<Framework[]>;
  getFrameworkByName(name: string): Promise<Framework | undefined>;
  getFrameworkById(id: number): Promise<Framework | undefined>;
  
  // Domain management
  saveDomain(domain: InsertDomain): Promise<Domain>;
  getDomainsByFrameworkId(frameworkId: number): Promise<Domain[]>;
  getDomainById(id: number): Promise<Domain | undefined>;
  
  // Subdomain management
  saveSubdomain(subdomain: InsertSubdomain): Promise<Subdomain>;
  getSubdomainsByDomainId(domainId: number): Promise<Subdomain[]>;
  getSubdomainById(id: number): Promise<Subdomain | undefined>;
  
  // Control management
  saveControl(control: InsertControl): Promise<Control>;
  getControlsBySubdomainId(subdomainId: number): Promise<Control[]>;
  getControlById(id: number): Promise<Control | undefined>;
  
  // Assessment management
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessmentsByCompanyId(companyId: number): Promise<Assessment[]>;
  getAssessmentById(id: number): Promise<Assessment | undefined>;
  updateAssessmentStatus(id: number, status: string, score?: number): Promise<Assessment>;
  
  // Assessment Results management
  saveAssessmentResult(result: InsertAssessmentResult): Promise<AssessmentResult>;
  getAssessmentResultsByAssessmentId(assessmentId: number): Promise<AssessmentResult[]>;
  getAssessmentResultById(id: number): Promise<AssessmentResult | undefined>;
  
  // Remediation Tasks management
  saveRemediationTask(task: InsertRemediationTask): Promise<RemediationTask>;
  getRemediationTasksByAssessmentId(assessmentId: number): Promise<RemediationTask[]>;
  getRemediationTaskById(id: number): Promise<RemediationTask | undefined>;
  updateRemediationTaskStatus(id: number, status: string): Promise<RemediationTask>;
  
  // Compliance Reports management
  createComplianceReport(report: InsertComplianceReport): Promise<ComplianceReport>;
  getComplianceReportById(id: number): Promise<ComplianceReport | undefined>;
  getComplianceReportsByCompanyId(companyId: number): Promise<ComplianceReport[]>;
  getComplianceReportsByAssessmentId(assessmentId: number): Promise<ComplianceReport[]>;
  updateComplianceReportStatus(id: number, status: string): Promise<ComplianceReport>;
  
  // Report Share Links management
  createReportShareLink(shareLink: InsertReportShareLink): Promise<ReportShareLink>;
  getReportShareLinkByToken(token: string): Promise<ReportShareLink | undefined>;
  getReportShareLinksByReportId(reportId: number): Promise<ReportShareLink[]>;
  incrementShareLinkViewCount(id: number): Promise<ReportShareLink>;
  deactivateShareLink(id: number): Promise<ReportShareLink>;
  
  // Policy Management System
  // Policy Categories
  savePolicyCategory(category: InsertPolicyCategory): Promise<PolicyCategory>;
  getPolicyCategories(): Promise<PolicyCategory[]>;
  getPolicyCategoryById(id: number): Promise<PolicyCategory | undefined>;
  
  // Policy Templates
  savePolicyTemplate(template: InsertPolicyTemplate): Promise<PolicyTemplate>;
  getPolicyTemplates(): Promise<PolicyTemplate[]>;
  getPolicyTemplateById(id: number): Promise<PolicyTemplate | undefined>;
  getPolicyTemplatesByCategory(categoryId: number): Promise<PolicyTemplate[]>;
  updatePolicyTemplateStatus(id: number, isActive: boolean): Promise<PolicyTemplate>;
  
  // Generated Policies 
  saveGeneratedPolicy(policy: InsertGeneratedPolicy): Promise<GeneratedPolicy>;
  getGeneratedPolicies(companyId: number): Promise<GeneratedPolicy[]>;
  getGeneratedPolicyById(id: number): Promise<GeneratedPolicy | undefined>;
  updateGeneratedPolicyApprovalStatus(id: number, status: string, approvedBy?: number): Promise<GeneratedPolicy>;
  
  // Onboarding and Gamification
  // Onboarding Steps
  saveOnboardingStep(step: InsertOnboardingStep): Promise<OnboardingStep>;
  getOnboardingSteps(): Promise<OnboardingStep[]>;
  getOnboardingStepById(id: number): Promise<OnboardingStep | undefined>;
  getOnboardingStepsByType(type: string): Promise<OnboardingStep[]>;
  
  // User Progress
  saveUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserProgressByUser(userId: number): Promise<UserProgress[]>;
  getUserProgressByStep(stepId: number): Promise<UserProgress[]>;
  getUserStepProgress(userId: number, stepId: number): Promise<UserProgress | undefined>;
  updateUserProgress(id: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  
  // Badges
  saveBadge(badge: InsertBadge): Promise<Badge>;
  getBadges(): Promise<Badge[]>;
  getBadgeById(id: number): Promise<Badge | undefined>;
  getBadgesByCategory(category: string): Promise<Badge[]>;
  
  // User Badges
  saveUserBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  getUserBadgesByUser(userId: number): Promise<UserBadge[]>;
  getUserBadgeById(id: number): Promise<UserBadge | undefined>;
  toggleBadgeDisplay(id: number, displayed: boolean): Promise<UserBadge>;
  
  // User Game Stats
  saveUserGameStats(stats: InsertUserGameStats): Promise<UserGameStats>;
  getUserGameStats(userId: number): Promise<UserGameStats | undefined>;
  updateUserGameStats(userId: number, stats: Partial<InsertUserGameStats>): Promise<UserGameStats>;
  getUsersTopGameStats(limit: number): Promise<UserGameStats[]>;
  
  // Risk Management
  saveRisk(risk: Partial<Risk>): Promise<Risk>;
  getRisks(companyId?: number): Promise<Risk[]>;
  getRiskById(id: number): Promise<Risk | undefined>;
  deleteRisk(id: number): Promise<void>;
  
  // Assessment Risk Management
  saveAssessmentRisk(assessmentRisk: Partial<AssessmentRisk>): Promise<AssessmentRisk>;
  getAssessmentRisksByAssessmentId(assessmentId: number): Promise<AssessmentRisk[]>;
  getAssessmentRiskById(id: number): Promise<AssessmentRisk | undefined>;
  deleteAssessmentRisk(id: number): Promise<void>;
  
  // Session storage
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create a session store with PostgreSQL
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: Partial<User>): Promise<User> {
    const [user] = await db.insert(users).values({
      username: insertUser.username || '',
      password: insertUser.password || '',
      role: insertUser.role || 'user',
      accessLevel: insertUser.accessLevel || 'trial',
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true
    }).returning();
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // Company info methods
  async saveCompanyInfo(info: Partial<CompanyInfo>): Promise<CompanyInfo> {
    // First check if there's an existing company record
    const existingCompany = await this.getCompanyInfo();
    
    if (existingCompany) {
      // Update existing company
      const [updated] = await db.update(companyInfo)
        .set({
          companyName: info.companyName || existingCompany.companyName,
          sector: info.sector !== undefined ? info.sector : existingCompany.sector,
          size: info.size !== undefined ? info.size : existingCompany.size,
          website: info.website !== undefined ? info.website : existingCompany.website,
          address: info.address !== undefined ? info.address : existingCompany.address,
          city: info.city !== undefined ? info.city : existingCompany.city,
          country: info.country !== undefined ? info.country : existingCompany.country,
          postalCode: info.postalCode !== undefined ? info.postalCode : existingCompany.postalCode,
          contactEmail: info.contactEmail !== undefined ? info.contactEmail : existingCompany.contactEmail,
          contactPhone: info.contactPhone !== undefined ? info.contactPhone : existingCompany.contactPhone,
          ceoName: info.ceoName !== undefined ? info.ceoName : existingCompany.ceoName,
          cioName: info.cioName !== undefined ? info.cioName : existingCompany.cioName,
          ctoName: info.ctoName !== undefined ? info.ctoName : existingCompany.ctoName,
          cisoName: info.cisoName !== undefined ? info.cisoName : existingCompany.cisoName,
          logoId: info.logoId !== undefined ? info.logoId : existingCompany.logoId
        })
        .where(eq(companyInfo.id, existingCompany.id))
        .returning();
      return updated;
    } else {
      // Create new company
      const [company] = await db.insert(companyInfo).values({
        companyName: info.companyName || '',
        sector: info.sector,
        size: info.size,
        website: info.website,
        address: info.address,
        city: info.city,
        country: info.country,
        postalCode: info.postalCode,
        contactEmail: info.contactEmail,
        contactPhone: info.contactPhone,
        ceoName: info.ceoName,
        cioName: info.cioName,
        ctoName: info.ctoName,
        cisoName: info.cisoName,
        logoId: info.logoId
      }).returning();
      return company;
    }
  }
  
  async getCompanyInfo(): Promise<CompanyInfo | undefined> {
    const [company] = await db.select().from(companyInfo).limit(1);
    return company;
  }
  
  // Staff methods
  async saveCybersecurityStaff(companyId: number, staffNames: string[]): Promise<CybersecurityStaff[]> {
    // First delete existing staff for this company
    await db.delete(cybersecurityStaff).where(eq(cybersecurityStaff.companyId, companyId));
    
    // Then insert new staff
    if (staffNames.length === 0) {
      return [];
    }
    
    const staffValues = staffNames.map(name => ({
      companyId,
      staffName: name
    }));
    
    return await db.insert(cybersecurityStaff).values(staffValues).returning();
  }
  
  async getCybersecurityStaff(companyId: number): Promise<CybersecurityStaff[]> {
    return await db.select().from(cybersecurityStaff).where(eq(cybersecurityStaff.companyId, companyId));
  }
  
  // Policy methods
  async savePolicy(policy: Partial<Policy>): Promise<Policy> {
    const now = new Date().toISOString();
    
    if (policy.id) {
      // Update existing policy
      const [existingPolicy] = await db.select().from(policies).where(eq(policies.id, policy.id));
      
      if (existingPolicy) {
        const [updated] = await db.update(policies)
          .set({
            title: policy.title || existingPolicy.title,
            type: policy.type || existingPolicy.type,
            content: policy.content !== undefined ? policy.content : existingPolicy.content,
            fileId: policy.fileId !== undefined ? policy.fileId : existingPolicy.fileId,
            updatedAt: now
          })
          .where(eq(policies.id, policy.id))
          .returning();
        return updated;
      }
    }
    
    // Create new policy
    const [newPolicy] = await db.insert(policies).values({
      title: policy.title || 'Untitled Policy',
      type: policy.type || 'general',
      content: policy.content,
      fileId: policy.fileId,
      createdAt: policy.createdAt || now,
      updatedAt: now
    }).returning();
    return newPolicy;
  }
  
  async getPolicies(): Promise<Policy[]> {
    return await db.select().from(policies);
  }
  
  async getPolicyById(id: number): Promise<Policy | undefined> {
    const [policy] = await db.select().from(policies).where(eq(policies.id, id));
    return policy;
  }
  
  async deletePolicy(id: number): Promise<void> {
    await db.delete(policies).where(eq(policies.id, id));
  }

  // Framework methods
  async saveFramework(framework: InsertFramework): Promise<Framework> {
    // Check if the framework already exists by name
    const existingFramework = await this.getFrameworkByName(framework.name);
    
    if (existingFramework) {
      // Update existing framework
      const [updated] = await db.update(frameworks)
        .set({
          displayName: framework.displayName,
          description: framework.description,
          version: framework.version,
          updatedAt: new Date().toISOString()
        })
        .where(eq(frameworks.id, existingFramework.id))
        .returning();
      return updated;
    } else {
      // Create new framework
      const [newFramework] = await db.insert(frameworks).values({
        name: framework.name,
        displayName: framework.displayName,
        description: framework.description,
        version: framework.version
      }).returning();
      return newFramework;
    }
  }
  
  async getFrameworks(): Promise<Framework[]> {
    return await db.select().from(frameworks);
  }
  
  async getFrameworkByName(name: string): Promise<Framework | undefined> {
    const [framework] = await db.select().from(frameworks).where(eq(frameworks.name, name));
    return framework;
  }
  
  async getFrameworkById(id: number): Promise<Framework | undefined> {
    const [framework] = await db.select().from(frameworks).where(eq(frameworks.id, id));
    return framework;
  }
  
  // Domain methods
  async saveDomain(domain: InsertDomain): Promise<Domain> {
    // Check if domain exists
    const [existingDomain] = await db.select()
      .from(domains)
      .where(
        and(
          eq(domains.frameworkId, domain.frameworkId),
          eq(domains.name, domain.name)
        )
      );
    
    if (existingDomain) {
      // Update existing domain
      const [updated] = await db.update(domains)
        .set({
          displayName: domain.displayName,
          description: domain.description,
          order: domain.order
        })
        .where(eq(domains.id, existingDomain.id))
        .returning();
      return updated;
    } else {
      // Create new domain
      const [newDomain] = await db.insert(domains).values(domain).returning();
      return newDomain;
    }
  }
  
  async getDomainsByFrameworkId(frameworkId: number): Promise<Domain[]> {
    return await db.select()
      .from(domains)
      .where(eq(domains.frameworkId, frameworkId))
      .orderBy(asc(domains.order));
  }
  
  async getDomainById(id: number): Promise<Domain | undefined> {
    const [domain] = await db.select().from(domains).where(eq(domains.id, id));
    return domain;
  }
  
  // Subdomain methods
  async saveSubdomain(subdomain: any): Promise<Subdomain> {
    // Check if subdomain exists
    const [existingSubdomain] = await db!.select()
      .from(subdomains)
      .where(
        and(
          eq(subdomains.domainId, subdomain.domainId),
          eq(subdomains.name, subdomain.name)
        )
      );
    
    if (existingSubdomain) {
      // Update existing subdomain
      const [updated] = await db!.update(subdomains)
        .set({
          displayName: subdomain.displayName,
          description: subdomain.description,
          order: subdomain.order
        })
        .where(eq(subdomains.id, existingSubdomain.id))
        .returning();
      return updated;
    } else {
      // Create new subdomain
      const [newSubdomain] = await db!.insert(subdomains).values(subdomain).returning();
      return newSubdomain;
    }
  }
  
  async getSubdomainsByDomainId(domainId: number): Promise<Subdomain[]> {
    return await db!.select()
      .from(subdomains)
      .where(eq(subdomains.domainId, domainId))
      .orderBy(asc(subdomains.order));
  }
  
  async getSubdomainById(id: number): Promise<Subdomain | undefined> {
    const [subdomain] = await db!.select().from(subdomains).where(eq(subdomains.id, id));
    return subdomain;
  }
  
  // Control methods
  async saveControl(control: InsertControl): Promise<Control> {
    // Check if control exists
    const [existingControl] = await db.select()
      .from(controls)
      .where(
        and(
          eq(controls.subdomainId, control.subdomainId),
          eq(controls.controlId, control.controlId)
        )
      );
    
    if (existingControl) {
      // Update existing control
      const [updated] = await db.update(controls)
        .set({
          name: control.name,
          description: control.description,
          guidance: control.guidance,
          maturityLevel: control.maturityLevel,
          referenceLinks: control.referenceLinks,
          implementationGuide: control.implementationGuide
        })
        .where(eq(controls.id, existingControl.id))
        .returning();
      return updated;
    } else {
      // Create new control
      const [newControl] = await db.insert(controls).values(control).returning();
      return newControl;
    }
  }
  
  async getControlsBySubdomainId(subdomainId: number): Promise<Control[]> {
    return await db!.select()
      .from(controls)
      .where(eq(controls.subdomainId, subdomainId))
      .orderBy(asc(controls.controlId));
  }
  
  // Backward compatibility method
  async getControlsByDomainId(domainId: number): Promise<Control[]> {
    // First get all subdomains for this domain
    const subdoms = await this.getSubdomainsByDomainId(domainId);
    
    if (subdoms.length === 0) {
      return [];
    }
    
    // Then get all controls for each subdomain
    const controls = [];
    for (const subdomain of subdoms) {
      const subdomainControls = await this.getControlsBySubdomainId(subdomain.id);
      controls.push(...subdomainControls);
    }
    
    return controls.sort((a, b) => a.controlId.localeCompare(b.controlId));
  }
  
  async getControlById(id: number): Promise<Control | undefined> {
    const [control] = await db.select().from(controls).where(eq(controls.id, id));
    return control;
  }
  
  // Assessment methods
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }
  
  async getAssessmentsByCompanyId(companyId: number): Promise<Assessment[]> {
    return await db.select()
      .from(assessments)
      .where(eq(assessments.companyId, companyId))
      .orderBy(desc(assessments.startDate));
  }
  
  async getAssessmentById(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }
  
  async updateAssessmentStatus(id: number, status: string, score?: number): Promise<Assessment> {
    const updateData: Partial<Assessment> = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (status === 'completed') {
      updateData.completionDate = new Date().toISOString();
    }
    
    if (score !== undefined) {
      updateData.score = score;
    }
    
    const [updated] = await db.update(assessments)
      .set(updateData)
      .where(eq(assessments.id, id))
      .returning();
    
    return updated;
  }
  
  // Assessment Results methods
  async saveAssessmentResult(result: InsertAssessmentResult): Promise<AssessmentResult> {
    // Check if result exists
    const [existingResult] = await db.select()
      .from(assessmentResults)
      .where(
        and(
          eq(assessmentResults.assessmentId, result.assessmentId),
          eq(assessmentResults.controlId, result.controlId)
        )
      );
    
    if (existingResult) {
      // Update existing result
      const [updated] = await db.update(assessmentResults)
        .set({
          status: result.status,
          evidence: result.evidence,
          comments: result.comments,
          attachments: result.attachments,
          updatedAt: new Date().toISOString(),
          updatedBy: result.updatedBy
        })
        .where(eq(assessmentResults.id, existingResult.id))
        .returning();
      return updated;
    } else {
      // Create new result
      const [newResult] = await db.insert(assessmentResults).values({
        ...result,
        updatedAt: new Date().toISOString()
      }).returning();
      return newResult;
    }
  }
  
  async getAssessmentResultsByAssessmentId(assessmentId: number): Promise<AssessmentResult[]> {
    return await db.select()
      .from(assessmentResults)
      .where(eq(assessmentResults.assessmentId, assessmentId))
      .orderBy(asc(assessmentResults.id));
  }
  
  async getAssessmentResultById(id: number): Promise<AssessmentResult | undefined> {
    const [result] = await db.select().from(assessmentResults).where(eq(assessmentResults.id, id));
    return result;
  }
  
  // Remediation Tasks methods
  async saveRemediationTask(task: InsertRemediationTask): Promise<RemediationTask> {
    // Check if a task with the same assessmentId and controlId exists
    const [existingTask] = await db.select()
      .from(remediationTasks)
      .where(
        and(
          eq(remediationTasks.assessmentId, task.assessmentId),
          eq(remediationTasks.controlId, task.controlId),
          eq(remediationTasks.title, task.title)
        )
      );
    
    if (existingTask) {
      // Update existing task
      const [updated] = await db.update(remediationTasks)
        .set({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
          updatedAt: new Date().toISOString(),
          externalId: task.externalId
        })
        .where(eq(remediationTasks.id, existingTask.id))
        .returning();
      return updated;
    } else {
      // Create new task
      const [newTask] = await db.insert(remediationTasks).values({
        ...task,
        updatedAt: new Date().toISOString()
      }).returning();
      return newTask;
    }
  }
  
  async getRemediationTasksByAssessmentId(assessmentId: number): Promise<RemediationTask[]> {
    return await db.select()
      .from(remediationTasks)
      .where(eq(remediationTasks.assessmentId, assessmentId))
      .orderBy(asc(remediationTasks.createdAt));
  }
  
  async getRemediationTaskById(id: number): Promise<RemediationTask | undefined> {
    const [task] = await db.select().from(remediationTasks).where(eq(remediationTasks.id, id));
    return task;
  }
  
  async updateRemediationTaskStatus(id: number, status: string): Promise<RemediationTask> {
    const [updated] = await db.update(remediationTasks)
      .set({
        status,
        updatedAt: new Date().toISOString()
      })
      .where(eq(remediationTasks.id, id))
      .returning();
    
    return updated;
  }
  
  // Compliance Reports methods
  async createComplianceReport(report: InsertComplianceReport): Promise<ComplianceReport> {
    const [newReport] = await db.insert(complianceReports).values(report).returning();
    return newReport;
  }
  
  async getComplianceReportById(id: number): Promise<ComplianceReport | undefined> {
    const [report] = await db.select().from(complianceReports).where(eq(complianceReports.id, id));
    return report;
  }
  
  async getComplianceReportsByCompanyId(companyId: number): Promise<ComplianceReport[]> {
    return await db.select()
      .from(complianceReports)
      .where(eq(complianceReports.companyId, companyId))
      .orderBy(desc(complianceReports.createdAt));
  }
  
  async getComplianceReportsByAssessmentId(assessmentId: number): Promise<ComplianceReport[]> {
    return await db.select()
      .from(complianceReports)
      .where(eq(complianceReports.assessmentId, assessmentId))
      .orderBy(desc(complianceReports.createdAt));
  }
  
  async updateComplianceReportStatus(id: number, status: string): Promise<ComplianceReport> {
    const [updated] = await db.update(complianceReports)
      .set({
        status
      })
      .where(eq(complianceReports.id, id))
      .returning();
    
    return updated;
  }
  
  // Report Share Links methods
  async createReportShareLink(shareLink: InsertReportShareLink): Promise<ReportShareLink> {
    const [newShareLink] = await db.insert(reportShareLinks).values(shareLink).returning();
    return newShareLink;
  }
  
  async getReportShareLinkByToken(token: string): Promise<ReportShareLink | undefined> {
    const [shareLink] = await db.select().from(reportShareLinks).where(eq(reportShareLinks.shareToken, token));
    return shareLink;
  }
  
  async getReportShareLinksByReportId(reportId: number): Promise<ReportShareLink[]> {
    return await db.select().from(reportShareLinks)
      .where(eq(reportShareLinks.reportId, reportId))
      .orderBy(desc(reportShareLinks.createdAt));
  }
  
  async incrementShareLinkViewCount(id: number): Promise<ReportShareLink> {
    const [shareLink] = await db.select().from(reportShareLinks).where(eq(reportShareLinks.id, id));
    
    if (!shareLink) {
      throw new Error(`Share link with id ${id} not found`);
    }
    
    const [updated] = await db.update(reportShareLinks)
      .set({
        viewCount: shareLink.viewCount + 1
      })
      .where(eq(reportShareLinks.id, id))
      .returning();
    
    return updated;
  }
  
  async deactivateShareLink(id: number): Promise<ReportShareLink> {
    const [updated] = await db.update(reportShareLinks)
      .set({
        isActive: false
      })
      .where(eq(reportShareLinks.id, id))
      .returning();
    
    return updated;
  }

  // Policy Management System Implementation
  // Policy Categories methods
  async savePolicyCategory(category: InsertPolicyCategory): Promise<PolicyCategory> {
    if ('id' in category && category.id) {
      // Update existing category
      const [existingCategory] = await db.select().from(policyCategories).where(eq(policyCategories.id, category.id));
      
      if (existingCategory) {
        const [updated] = await db.update(policyCategories)
          .set({
            categoryName: category.categoryName,
            description: category.description,
            updatedAt: new Date().toISOString()
          })
          .where(eq(policyCategories.id, category.id))
          .returning();
        return updated;
      }
    }
    
    // Create new category
    const [newCategory] = await db.insert(policyCategories).values({
      categoryName: category.categoryName,
      description: category.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).returning();
    return newCategory;
  }
  
  async getPolicyCategories(): Promise<PolicyCategory[]> {
    return await db.select().from(policyCategories).orderBy(asc(policyCategories.categoryName));
  }
  
  async getPolicyCategoryById(id: number): Promise<PolicyCategory | undefined> {
    const [category] = await db.select().from(policyCategories).where(eq(policyCategories.id, id));
    return category;
  }
  
  // Policy Templates methods
  async savePolicyTemplate(template: InsertPolicyTemplate): Promise<PolicyTemplate> {
    if ('id' in template && template.id) {
      // Update existing template
      const [existingTemplate] = await db.select().from(policyTemplates).where(eq(policyTemplates.id, template.id));
      
      if (existingTemplate) {
        const [updated] = await db.update(policyTemplates)
          .set({
            templateName: template.templateName,
            templateType: template.templateType,
            fileId: template.fileId,
            categoryId: template.categoryId,
            uploadedBy: template.uploadedBy,
            version: template.version,
            placeholders: template.placeholders,
            isActive: template.isActive !== undefined ? template.isActive : existingTemplate.isActive
          })
          .where(eq(policyTemplates.id, template.id))
          .returning();
        return updated;
      }
    }
    
    // Create new template
    const [newTemplate] = await db.insert(policyTemplates).values({
      templateName: template.templateName,
      templateType: template.templateType,
      fileId: template.fileId,
      categoryId: template.categoryId,
      uploadedBy: template.uploadedBy,
      dateUploaded: new Date().toISOString(),
      version: template.version || '1.0',
      placeholders: template.placeholders,
      isActive: template.isActive !== undefined ? template.isActive : true
    }).returning();
    return newTemplate;
  }
  
  async getPolicyTemplates(): Promise<PolicyTemplate[]> {
    return await db.select().from(policyTemplates).orderBy(asc(policyTemplates.templateName));
  }
  
  async getPolicyTemplateById(id: number): Promise<PolicyTemplate | undefined> {
    const [template] = await db.select().from(policyTemplates).where(eq(policyTemplates.id, id));
    return template;
  }
  
  async getPolicyTemplatesByCategory(categoryId: number): Promise<PolicyTemplate[]> {
    return await db.select()
      .from(policyTemplates)
      .where(eq(policyTemplates.categoryId, categoryId))
      .orderBy(asc(policyTemplates.templateName));
  }
  
  async updatePolicyTemplateStatus(id: number, isActive: boolean): Promise<PolicyTemplate> {
    const [updated] = await db.update(policyTemplates)
      .set({ isActive })
      .where(eq(policyTemplates.id, id))
      .returning();
    return updated;
  }
  
  // Generated Policies methods
  async saveGeneratedPolicy(policy: InsertGeneratedPolicy): Promise<GeneratedPolicy> {
    if ('id' in policy && policy.id) {
      // Update existing policy
      const [existingPolicy] = await db.select().from(generatedPolicies).where(eq(generatedPolicies.id, policy.id));
      
      if (existingPolicy) {
        const [updated] = await db.update(generatedPolicies)
          .set({
            templateId: policy.templateId,
            companyId: policy.companyId,
            generatedFileId: policy.generatedFileId,
            version: policy.version,
            approvalStatus: policy.approvalStatus,
            replacementData: policy.replacementData,
            notes: policy.notes
          })
          .where(eq(generatedPolicies.id, policy.id))
          .returning();
        return updated;
      }
    }
    
    // Create new generated policy
    const [newPolicy] = await db.insert(generatedPolicies).values({
      templateId: policy.templateId,
      companyId: policy.companyId,
      generatedFileId: policy.generatedFileId,
      version: policy.version || '1.0',
      generationDate: new Date().toISOString(),
      approvalStatus: policy.approvalStatus || 'pending',
      replacementData: policy.replacementData,
      notes: policy.notes
    }).returning();
    return newPolicy;
  }
  
  async getGeneratedPolicies(companyId: number): Promise<GeneratedPolicy[]> {
    return await db.select()
      .from(generatedPolicies)
      .where(eq(generatedPolicies.companyId, companyId))
      .orderBy(desc(generatedPolicies.generationDate));
  }
  
  async getGeneratedPolicyById(id: number): Promise<GeneratedPolicy | undefined> {
    const [policy] = await db.select().from(generatedPolicies).where(eq(generatedPolicies.id, id));
    return policy;
  }
  
  async updateGeneratedPolicyApprovalStatus(id: number, status: string, approvedBy?: number): Promise<GeneratedPolicy> {
    const updateData: Partial<GeneratedPolicy> = {
      approvalStatus: status
    };
    
    if (status === 'approved' && approvedBy) {
      updateData.approvedBy = approvedBy;
      updateData.approvedDate = new Date().toISOString();
    }
    
    const [updated] = await db.update(generatedPolicies)
      .set(updateData)
      .where(eq(generatedPolicies.id, id))
      .returning();
    
    return updated;
  }
  
  // Onboarding and Gamification Methods
  
  // Onboarding Steps
  async saveOnboardingStep(step: InsertOnboardingStep): Promise<OnboardingStep> {
    if (step.id) {
      // Update existing step
      const [updatedStep] = await db.update(onboardingSteps)
        .set({
          title: step.title,
          description: step.description,
          order: step.order,
          type: step.type,
          content: step.content,
          points: step.points,
          estimatedDuration: step.estimatedDuration,
          prerequisiteStepIds: step.prerequisiteStepIds,
          updatedAt: new Date().toISOString()
        })
        .where(eq(onboardingSteps.id, step.id))
        .returning();
      return updatedStep;
    } else {
      // Create new step
      const [newStep] = await db.insert(onboardingSteps).values({
        ...step,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).returning();
      return newStep;
    }
  }
  
  async getOnboardingSteps(): Promise<OnboardingStep[]> {
    return await db.select().from(onboardingSteps).orderBy(asc(onboardingSteps.order));
  }
  
  async getOnboardingStepById(id: number): Promise<OnboardingStep | undefined> {
    const [step] = await db.select().from(onboardingSteps).where(eq(onboardingSteps.id, id));
    return step;
  }
  
  async getOnboardingStepsByType(type: string): Promise<OnboardingStep[]> {
    return await db.select().from(onboardingSteps)
      .where(eq(onboardingSteps.type, type))
      .orderBy(asc(onboardingSteps.order));
  }
  
  // User Progress
  async saveUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    // Check if progress exists
    const existingProgress = await this.getUserStepProgress(progress.userId, progress.stepId);
    
    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db.update(userProgress)
        .set({
          ...progress,
          updatedAt: new Date().toISOString()
        })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      return updatedProgress;
    } else {
      // Create new progress
      const [newProgress] = await db.insert(userProgress).values({
        ...progress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).returning();
      return newProgress;
    }
  }
  
  async getUserProgressByUser(userId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }
  
  async getUserProgressByStep(stepId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.stepId, stepId));
  }
  
  async getUserStepProgress(userId: number, stepId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.stepId, stepId)
        )
      );
    return progress;
  }
  
  async updateUserProgress(id: number, progress: Partial<InsertUserProgress>): Promise<UserProgress> {
    const [updatedProgress] = await db.update(userProgress)
      .set({
        ...progress,
        updatedAt: new Date().toISOString()
      })
      .where(eq(userProgress.id, id))
      .returning();
    return updatedProgress;
  }
  
  // Badges
  async saveBadge(badge: InsertBadge): Promise<Badge> {
    if (badge.id) {
      // Update existing badge
      const [updatedBadge] = await db.update(badges)
        .set(badge)
        .where(eq(badges.id, badge.id))
        .returning();
      return updatedBadge;
    } else {
      // Create new badge
      const [newBadge] = await db.insert(badges).values({
        ...badge,
        createdAt: new Date().toISOString()
      }).returning();
      return newBadge;
    }
  }
  
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }
  
  async getBadgeById(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }
  
  async getBadgesByCategory(category: string): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.category, category));
  }
  
  // User Badges
  async saveUserBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    // Check if already awarded
    const [existingBadge] = await db.select().from(userBadges)
      .where(
        and(
          eq(userBadges.userId, userBadge.userId),
          eq(userBadges.badgeId, userBadge.badgeId)
        )
      );
    
    if (existingBadge) {
      return existingBadge; // Badge already awarded, return it
    }
    
    // Create new user badge
    const [newUserBadge] = await db.insert(userBadges).values({
      ...userBadge,
      earnedAt: new Date().toISOString()
    }).returning();
    
    // Update user game stats to reflect new badge
    await this.updateUserGameStats(userBadge.userId, {});
    
    return newUserBadge;
  }
  
  async getUserBadgesByUser(userId: number): Promise<UserBadge[]> {
    return await db.select().from(userBadges).where(eq(userBadges.userId, userId));
  }
  
  async getUserBadgeById(id: number): Promise<UserBadge | undefined> {
    const [userBadge] = await db.select().from(userBadges).where(eq(userBadges.id, id));
    return userBadge;
  }
  
  async toggleBadgeDisplay(id: number, displayed: boolean): Promise<UserBadge> {
    const [updatedUserBadge] = await db.update(userBadges)
      .set({ displayed })
      .where(eq(userBadges.id, id))
      .returning();
    return updatedUserBadge;
  }
  
  // User Game Stats
  async saveUserGameStats(stats: InsertUserGameStats): Promise<UserGameStats> {
    const existingStats = await this.getUserGameStats(stats.userId);
    
    if (existingStats) {
      // Update existing stats
      const [updatedStats] = await db.update(userGameStats)
        .set({
          ...stats,
          updatedAt: new Date().toISOString()
        })
        .where(eq(userGameStats.userId, stats.userId))
        .returning();
      return updatedStats;
    } else {
      // Create new stats
      const [newStats] = await db.insert(userGameStats).values({
        ...stats,
        updatedAt: new Date().toISOString()
      }).returning();
      return newStats;
    }
  }
  
  async getUserGameStats(userId: number): Promise<UserGameStats | undefined> {
    const [stats] = await db.select().from(userGameStats).where(eq(userGameStats.userId, userId));
    return stats;
  }
  
  async updateUserGameStats(userId: number, stats: Partial<InsertUserGameStats>): Promise<UserGameStats> {
    const existingStats = await this.getUserGameStats(userId);
    
    if (existingStats) {
      // Get completed steps count
      const completedSteps = await db.select({ count: count() }).from(userProgress)
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.completed, true)
          )
        );
      
      // Get total points from completed steps and quizzes
      const userSteps = await this.getUserProgressByUser(userId);
      let totalPoints = 0;
      let quizScores: number[] = [];
      
      for (const step of userSteps) {
        if (step.completed) {
          // Get step info to add points
          const stepInfo = await this.getOnboardingStepById(step.stepId);
          if (stepInfo) {
            totalPoints += stepInfo.points;
          }
          
          // If it's a quiz and has a score, add to quiz scores array
          if (step.score !== null && step.score !== undefined) {
            quizScores.push(step.score);
          }
        }
      }
      
      // Calculate streak days
      const lastActivityDate = new Date(existingStats.lastActivity);
      const now = new Date();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const daysSinceLastActivity = Math.floor((now.getTime() - lastActivityDate.getTime()) / oneDayMs);
      
      let streakDays = existingStats.streakDays;
      if (daysSinceLastActivity === 1) {
        // User was active yesterday, increment streak
        streakDays += 1;
      } else if (daysSinceLastActivity > 1) {
        // User missed a day, reset streak
        streakDays = 1;
      }
      
      // Calculate level (1 level for every 100 points)
      const level = Math.max(1, Math.floor(totalPoints / 100) + 1);
      
      // Calculate quiz average
      const quizAverage = quizScores.length > 0 
        ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length 
        : 0;
      
      // Update stats
      const [updatedStats] = await db.update(userGameStats)
        .set({
          ...stats,
          totalPoints,
          level,
          streakDays,
          lastActivity: now.toISOString(),
          completedSteps: completedSteps[0]?.count || 0,
          quizAverage,
          updatedAt: now.toISOString()
        })
        .where(eq(userGameStats.userId, userId))
        .returning();
      
      return updatedStats;
    } else {
      // Create initial stats
      return await this.saveUserGameStats({
        userId,
        totalPoints: 0,
        level: 1,
        streakDays: 1,
        lastActivity: new Date().toISOString(),
        completedSteps: 0,
      });
    }
  }
  
  async getUsersTopGameStats(limit: number): Promise<UserGameStats[]> {
    return await db.select().from(userGameStats)
      .orderBy(desc(userGameStats.totalPoints))
      .limit(limit);
  }

  // Risk Management methods
  async saveRisk(risk: Partial<Risk>): Promise<Risk> {
    if (risk.id) {
      // Update existing risk
      const [updated] = await db.update(risks)
        .set({
          title: risk.title,
          description: risk.description,
          cause: risk.cause,
          category: risk.category,
          owner: risk.owner,
          likelihood: risk.likelihood,
          impact: risk.impact,
          inherentRiskLevel: risk.inherentRiskLevel,
          existingControls: risk.existingControls,
          controlEffectiveness: risk.controlEffectiveness,
          residualRiskLevel: risk.residualRiskLevel,
          mitigationActions: risk.mitigationActions,
          targetDate: risk.targetDate,
          isAccepted: risk.isAccepted,
          companyId: risk.companyId,
          updatedAt: new Date().toISOString()
        })
        .where(eq(risks.id, risk.id))
        .returning();
      return updated;
    } else {
      // Create new risk
      const [newRisk] = await db.insert(risks).values({
        ...risk,
        title: risk.title!,
        description: risk.description!,
        category: risk.category!,
        likelihood: risk.likelihood!,
        impact: risk.impact!,
        inherentRiskLevel: risk.inherentRiskLevel!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as InsertRisk).returning();
      return newRisk;
    }
  }

  async getRisks(companyId?: number): Promise<Risk[]> {
    if (companyId) {
      return await db.select().from(risks).where(eq(risks.companyId!, companyId));
    }
    return await db.select().from(risks);
  }

  async getRiskById(id: number): Promise<Risk | undefined> {
    const [risk] = await db.select().from(risks).where(eq(risks.id, id));
    return risk;
  }

  async deleteRisk(id: number): Promise<void> {
    await db.delete(risks).where(eq(risks.id, id));
  }

  async saveAssessmentRisk(assessmentRisk: Partial<AssessmentRisk>): Promise<AssessmentRisk> {
    if (assessmentRisk.id) {
      // Update existing assessment risk
      const [updated] = await db.update(assessmentRisks)
        .set({
          assessmentId: assessmentRisk.assessmentId,
          riskId: assessmentRisk.riskId,
          status: assessmentRisk.status,
          notes: assessmentRisk.notes,
          evidence: assessmentRisk.evidence,
          reviewedBy: assessmentRisk.reviewedBy,
          reviewedAt: assessmentRisk.reviewedAt,
          updatedAt: new Date().toISOString()
        })
        .where(eq(assessmentRisks.id, assessmentRisk.id))
        .returning();
      return updated;
    } else {
      // Create new assessment risk
      const [newAssessmentRisk] = await db.insert(assessmentRisks).values({
        assessmentId: assessmentRisk.assessmentId!,
        riskId: assessmentRisk.riskId!,
        status: assessmentRisk.status || 'to_assess',
        notes: assessmentRisk.notes,
        evidence: assessmentRisk.evidence,
        reviewedBy: assessmentRisk.reviewedBy,
        reviewedAt: assessmentRisk.reviewedAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as InsertAssessmentRisk).returning();
      return newAssessmentRisk;
    }
  }

  async getAssessmentRisksByAssessmentId(assessmentId: number): Promise<AssessmentRisk[]> {
    return await db.select()
      .from(assessmentRisks)
      .where(eq(assessmentRisks.assessmentId, assessmentId));
  }

  async getAssessmentRiskById(id: number): Promise<AssessmentRisk | undefined> {
    const [assessmentRisk] = await db.select().from(assessmentRisks).where(eq(assessmentRisks.id, id));
    return assessmentRisk;
  }

  async deleteAssessmentRisk(id: number): Promise<void> {
    await db.delete(assessmentRisks).where(eq(assessmentRisks.id, id));
  }
}

export const storage = new DatabaseStorage();
