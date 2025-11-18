import { Router } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { insertAssessmentSchema, assessmentResults, frameworks } from "@shared/schema";
import { json } from "drizzle-orm/pg-core";

const router = Router();

// Get all assessments for the current user
router.get("/api/assessments", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    // Get assessments with framework names
    const assessmentsWithFrameworks = await db.execute(sql`
      SELECT 
        a.*,
        f.name as "frameworkName"
      FROM 
        assessments a
      JOIN 
        frameworks f ON a.framework_id = f.id
      WHERE 
        a.company_id = ${req.user.companyId || 1}
      ORDER BY 
        a.updated_at DESC
    `);
    
    res.json(assessmentsWithFrameworks.rows);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

// Get a specific assessment
router.get("/api/assessments/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const id = parseInt(req.params.id);
    
    // Get assessment with framework name
    const [assessmentWithFramework] = await db.execute(sql`
      SELECT 
        a.*,
        f.name as "frameworkName"
      FROM 
        assessments a
      JOIN 
        frameworks f ON a.framework_id = f.id
      WHERE 
        a.id = ${id}
      AND
        a.company_id = ${req.user.companyId || 1}
    `);
    
    if (!assessmentWithFramework) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    res.json(assessmentWithFramework);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    res.status(500).json({ error: "Failed to fetch assessment" });
  }
});

// Create a new assessment
router.post("/api/assessments", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const parsedData = insertAssessmentSchema.parse({
      ...req.body,
      companyId: req.user.companyId || 1,
      createdBy: req.user.id,
    });
    
    const assessment = await storage.createAssessment(parsedData);
    
    // Get all controls for the framework
    const framework = await storage.getFrameworkById(parsedData.frameworkId);
    const domains = await storage.getDomainsByFrameworkId(parsedData.frameworkId);
    
    // For each domain, get controls and create assessment results
    for (const domain of domains) {
      const controls = await storage.getControlsByDomainId(domain.id);
      
      for (const control of controls) {
        // Create an assessment result for each control with default "not_implemented" status
        await storage.saveAssessmentResult({
          assessmentId: assessment.id,
          controlId: control.id,
          status: "not_implemented",
          evidence: null,
          recommendation: "",
          managementResponse: "",
          targetDate: null,
          updatedBy: req.user.id,
        });
      }
    }
    
    res.status(201).json({
      ...assessment,
      frameworkName: framework?.name || "Unknown Framework",
    });
  } catch (error) {
    console.error("Error creating assessment:", error);
    res.status(400).json({ error: "Failed to create assessment" });
  }
});

// Update an assessment status
router.patch("/api/assessments/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const id = parseInt(req.params.id);
    const { status, score } = req.body;
    
    const assessment = await storage.updateAssessmentStatus(id, status, score);
    
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    res.json(assessment);
  } catch (error) {
    console.error("Error updating assessment:", error);
    res.status(400).json({ error: "Failed to update assessment" });
  }
});

// Complete an assessment (set status to completed and calculate score)
router.post("/api/assessments/:id/complete", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const id = parseInt(req.params.id);
    const assessment = await storage.getAssessmentById(id);
    
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    // Get all results for this assessment
    const results = await storage.getAssessmentResultsByAssessmentId(id);
    
    // Calculate score based on implementation status
    const totalControls = results.length;
    const implementedControls = results.filter(r => r.status === "implemented").length;
    const partiallyImplementedControls = results.filter(r => r.status === "partially_implemented").length;
    
    // Calculate score: implemented = 100%, partially = 50%, not implemented = 0%
    const score = ((implementedControls * 1.0) + (partiallyImplementedControls * 0.5)) / totalControls * 100;
    
    // Update assessment status and score
    const updatedAssessment = await storage.updateAssessmentStatus(
      id, 
      "completed",
      Math.round(score * 10) / 10 // Round to 1 decimal place
    );
    
    res.json(updatedAssessment);
  } catch (error) {
    console.error("Error completing assessment:", error);
    res.status(500).json({ error: "Failed to complete assessment" });
  }
});

export default router;