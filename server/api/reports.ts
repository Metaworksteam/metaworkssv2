import { Request, Response, Express } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { randomBytes, createHash } from "crypto";
import { insertComplianceReportSchema, insertReportShareLinkSchema } from "@shared/schema";

export function registerReportsRoutes(app: Express) {
  // Generate a compliance report
  app.post("/api/reports", async (req: Request, res: Response) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      // Validate request body
      const schema = insertComplianceReportSchema.extend({
        assessmentId: z.number(),
        title: z.string().min(1, "Title is required"),
        summary: z.string().optional(),
        isPublic: z.boolean().default(false),
        format: z.enum(["pdf", "html", "json"]).default("pdf"),
      });

      const validatedData = schema.parse(req.body);

      // Get assessment data
      const assessment = await storage.getAssessmentById(validatedData.assessmentId);
      if (!assessment) {
        return res.status(404).send("Assessment not found");
      }

      // Get assessment results
      const results = await storage.getAssessmentResultsByAssessmentId(validatedData.assessmentId);
      
      // Get framework and domain information
      const framework = await storage.getFrameworkById(assessment.frameworkId);
      const domains = await storage.getDomainsByFrameworkId(assessment.frameworkId);
      
      // Aggregate report data
      const domainsWithControls = await Promise.all(
        domains.map(async (domain) => {
          const controls = await storage.getControlsByDomainId(domain.id);
          return {
            ...domain,
            controls,
          };
        })
      );

      // Calculate statistics for the report
      const implementedControls = results.filter(r => r.status === "implemented").length;
      const partiallyImplementedControls = results.filter(r => r.status === "partially_implemented").length;
      const notImplementedControls = results.filter(r => r.status === "not_implemented").length;
      const notApplicableControls = results.filter(r => r.status === "not_applicable").length;
      const totalControls = results.length;
      
      // Calculate overall compliance score
      const complianceScore = 
        totalControls > 0 
          ? ((implementedControls + (partiallyImplementedControls * 0.5)) / 
            (totalControls - notApplicableControls)) * 100
          : 0;
      
      // Determine risk level based on compliance score
      let riskLevel = "High";
      if (complianceScore >= 80) {
        riskLevel = "Low";
      } else if (complianceScore >= 50) {
        riskLevel = "Medium";
      }

      // Generate domain risk levels
      const domainRiskLevels = await Promise.all(
        domains.map(async (domain) => {
          const controls = await storage.getControlsByDomainId(domain.id);
          const domainResults = results.filter(r => 
            controls.some(c => c.id === r.controlId)
          );
          
          const domainImplementedControls = domainResults.filter(r => r.status === "implemented").length;
          const domainPartiallyImplementedControls = domainResults.filter(r => r.status === "partially_implemented").length;
          const domainNotImplementedControls = domainResults.filter(r => r.status === "not_implemented").length;
          const domainNotApplicableControls = domainResults.filter(r => r.status === "not_applicable").length;
          const domainTotalControls = domainResults.length;
          
          // Calculate domain compliance score
          const domainComplianceScore = 
            domainTotalControls > 0 
              ? ((domainImplementedControls + (domainPartiallyImplementedControls * 0.5)) / 
                (domainTotalControls - domainNotApplicableControls)) * 100
              : 0;
          
          // Determine domain risk level
          let domainRiskLevel = "high";
          if (domainComplianceScore >= 80) {
            domainRiskLevel = "low";
          } else if (domainComplianceScore >= 50) {
            domainRiskLevel = "medium";
          }
          
          return {
            domainId: domain.id,
            domainName: domain.name,
            displayName: domain.displayName,
            complianceScore: domainComplianceScore,
            implementedControls: domainImplementedControls,
            partiallyImplementedControls: domainPartiallyImplementedControls,
            notImplementedControls: domainNotImplementedControls,
            notApplicableControls: domainNotApplicableControls,
            totalControls: domainTotalControls,
            riskLevel: domainRiskLevel,
          };
        })
      );

      // Generate detailed results with additional context
      const detailedResults = await Promise.all(
        results.map(async (result) => {
          const control = await storage.getControlById(result.controlId);
          const domain = control ? await storage.getDomainById(control.domainId) : null;
          
          return {
            resultId: result.id,
            controlId: result.controlId,
            controlIdentifier: control?.controlId || "",
            controlName: control?.name || "",
            domainId: domain?.id || 0,
            domainName: domain?.name || "",
            status: result.status,
            evidence: result.evidence,
            comments: result.comments,
          };
        })
      );

      // Generate recommendations for controls that are not fully implemented
      const recommendations = await Promise.all(
        results
          .filter(r => r.status === "not_implemented" || r.status === "partially_implemented")
          .map(async (result) => {
            const control = await storage.getControlById(result.controlId);
            const domain = control ? await storage.getDomainById(control.domainId) : null;
            
            // Determine priority based on control maturity level
            let priority = "medium";
            if (control?.maturityLevel && control.maturityLevel >= 3) {
              priority = "high";
            } else if (control?.maturityLevel && control.maturityLevel === 1) {
              priority = "low";
            }
            
            return {
              controlId: result.controlId,
              controlIdentifier: control?.controlId || "",
              controlName: control?.name || "",
              domainId: domain?.id || 0,
              domainName: domain?.name || "",
              status: result.status,
              priority,
              recommendation: result.status === "not_implemented"
                ? `Implement ${control?.name} to address ${control?.description}`
                : `Complete the implementation of ${control?.name} to fully address ${control?.description}`,
            };
          })
      );

      // Create the report data structure
      const reportData = {
        framework: {
          id: framework?.id,
          name: framework?.name,
          displayName: framework?.displayName,
          version: framework?.version,
        },
        summary: {
          complianceScore,
          riskLevel,
          implementedControls,
          partiallyImplementedControls,
          notImplementedControls,
          notApplicableControls,
          totalControls,
        },
        domainRiskLevels,
        detailedResults,
        recommendations,
      };

      // Create report in database
      const report = await storage.createComplianceReport({
        assessmentId: validatedData.assessmentId,
        companyId: assessment.companyId,
        createdBy: (req.user as any).id,
        title: validatedData.title,
        summary: validatedData.summary || "",
        format: validatedData.format,
        isPublic: validatedData.isPublic,
        status: "completed",
        reportData: reportData as any,
      });

      // Update assessment status if needed
      if (assessment.status !== "completed") {
        await storage.updateAssessmentStatus(assessment.id, "completed", complianceScore);
      }

      res.status(201).json(report);
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).send(`Error generating report: ${(error as Error).message}`);
    }
  });

  // Get a specific report by ID
  app.get("/api/reports/:id", async (req: Request, res: Response) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const reportId = parseInt(req.params.id);
      if (isNaN(reportId)) {
        return res.status(400).send("Invalid report ID");
      }

      const report = await storage.getComplianceReportById(reportId);
      if (!report) {
        return res.status(404).send("Report not found");
      }

      // Check if user has access to this report
      const user = req.user as any;
      if (report.companyId !== user.companyId && !user.isAdmin) {
        return res.status(403).send("Access denied");
      }

      res.json(report);
    } catch (error) {
      console.error("Error retrieving report:", error);
      res.status(500).send(`Error retrieving report: ${(error as Error).message}`);
    }
  });

  // Get all reports for a company
  app.get("/api/reports/company/:companyId", async (req: Request, res: Response) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const companyId = parseInt(req.params.companyId);
      if (isNaN(companyId)) {
        return res.status(400).send("Invalid company ID");
      }

      // Check if user has access to this company's reports
      const user = req.user as any;
      if (companyId !== user.companyId && !user.isAdmin) {
        return res.status(403).send("Access denied");
      }

      const reports = await storage.getComplianceReportsByCompanyId(companyId);
      res.json(reports);
    } catch (error) {
      console.error("Error retrieving reports:", error);
      res.status(500).send(`Error retrieving reports: ${(error as Error).message}`);
    }
  });

  // Get all reports for an assessment
  app.get("/api/reports/assessment/:assessmentId", async (req: Request, res: Response) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const assessmentId = parseInt(req.params.assessmentId);
      if (isNaN(assessmentId)) {
        return res.status(400).send("Invalid assessment ID");
      }

      // Check if user has access to this assessment's reports
      const assessment = await storage.getAssessmentById(assessmentId);
      if (!assessment) {
        return res.status(404).send("Assessment not found");
      }

      const user = req.user as any;
      if (assessment.companyId !== user.companyId && !user.isAdmin) {
        return res.status(403).send("Access denied");
      }

      const reports = await storage.getComplianceReportsByAssessmentId(assessmentId);
      res.json(reports);
    } catch (error) {
      console.error("Error retrieving reports:", error);
      res.status(500).send(`Error retrieving reports: ${(error as Error).message}`);
    }
  });

  // Create a share link for a report
  app.post("/api/reports/:id/share", async (req: Request, res: Response) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const reportId = parseInt(req.params.id);
      if (isNaN(reportId)) {
        return res.status(400).send("Invalid report ID");
      }

      // Check if the report exists
      const report = await storage.getComplianceReportById(reportId);
      if (!report) {
        return res.status(404).send("Report not found");
      }

      // Check if user has access to this report
      const user = req.user as any;
      if (report.companyId !== user.companyId && !user.isAdmin) {
        return res.status(403).send("Access denied");
      }

      // Generate a unique share token
      const shareToken = randomBytes(16).toString('hex');
      
      // Process password if provided
      let password = req.body.password;
      if (password) {
        // Hash the password before storing
        password = createHash('sha256').update(password).digest('hex');
      }

      // Create share link in database
      const shareLink = await storage.createReportShareLink({
        reportId: reportId,
        createdBy: (req.user as any).id,
        password: password || null,
        expiresAt: req.body.expiresAt || null,
        maxViews: req.body.maxViews || null,
        isActive: true,
      });

      res.status(201).json(shareLink);
    } catch (error) {
      console.error("Error creating share link:", error);
      res.status(500).send(`Error creating share link: ${(error as Error).message}`);
    }
  });

  // Access a shared report using a token
  app.get("/api/reports/share/:token", async (req: Request, res: Response) => {
    try {
      const token = req.params.token;
      
      // Check if the share link exists
      const shareLink = await storage.getReportShareLinkByToken(token);
      if (!shareLink) {
        return res.status(404).send("Shared report link not found or expired");
      }

      // Check if the share link is active
      if (!shareLink.isActive) {
        return res.status(403).send("This share link has been deactivated");
      }

      // Check if the share link has expired
      if (shareLink.expiresAt && new Date(shareLink.expiresAt) < new Date()) {
        return res.status(403).send("This share link has expired");
      }

      // Check if the share link has reached maximum views
      if (shareLink.maxViews && shareLink.viewCount >= shareLink.maxViews) {
        return res.status(403).send("This share link has reached its maximum view count");
      }

      // Check if password is required
      if (shareLink.password) {
        const providedPassword = req.query.password as string;
        
        if (!providedPassword) {
          return res.status(401).send("password_required");
        }
        
        // Hash the provided password and compare with stored hash
        const hashedPassword = createHash('sha256').update(providedPassword).digest('hex');
        if (hashedPassword !== shareLink.password) {
          return res.status(401).send("Invalid password");
        }
      }

      // Get the report
      const report = await storage.getComplianceReportById(shareLink.reportId);
      if (!report) {
        return res.status(404).send("Report not found");
      }

      // Increment view count
      await storage.incrementShareLinkViewCount(shareLink.id);

      res.json(report);
    } catch (error) {
      console.error("Error accessing shared report:", error);
      res.status(500).send(`Error accessing shared report: ${(error as Error).message}`);
    }
  });

  // Deactivate a share link
  app.post("/api/reports/share/:id/deactivate", async (req: Request, res: Response) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const linkId = parseInt(req.params.id);
      if (isNaN(linkId)) {
        return res.status(400).send("Invalid share link ID");
      }

      // Deactivate the share link
      const shareLink = await storage.deactivateShareLink(linkId);
      res.json(shareLink);
    } catch (error) {
      console.error("Error deactivating share link:", error);
      res.status(500).send(`Error deactivating share link: ${(error as Error).message}`);
    }
  });

  // Get all share links for a report
  app.get("/api/reports/:id/share", async (req: Request, res: Response) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const reportId = parseInt(req.params.id);
      if (isNaN(reportId)) {
        return res.status(400).send("Invalid report ID");
      }

      // Check if the report exists
      const report = await storage.getComplianceReportById(reportId);
      if (!report) {
        return res.status(404).send("Report not found");
      }

      // Check if user has access to this report
      const user = req.user as any;
      if (report.companyId !== user.companyId && !user.isAdmin) {
        return res.status(403).send("Access denied");
      }

      // Get the share links
      const shareLinks = await storage.getReportShareLinksByReportId(reportId);
      res.json(shareLinks);
    } catch (error) {
      console.error("Error retrieving share links:", error);
      res.status(500).send(`Error retrieving share links: ${(error as Error).message}`);
    }
  });
}