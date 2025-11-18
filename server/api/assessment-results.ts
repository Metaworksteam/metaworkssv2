import { Router } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { json } from "drizzle-orm/pg-core";

const router = Router();

// Get all assessment results for a specific assessment
router.get("/api/assessment-results/:assessmentId", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const assessmentId = parseInt(req.params.assessmentId);
    
    // Get results with control information
    const results = await db.execute(sql`
      SELECT 
        ar.*,
        c.name as "controlName",
        c.description as "controlDescription",
        d.name as "domainName",
        d.code as "domainCode",
        c.code as "controlCode"
      FROM 
        assessment_results ar
      JOIN 
        controls c ON ar.control_id = c.id
      JOIN 
        domains d ON c.domain_id = d.id
      JOIN 
        assessments a ON ar.assessment_id = a.id
      WHERE 
        ar.assessment_id = ${assessmentId}
      AND
        a.company_id = ${req.user.companyId || 1}
      ORDER BY
        d.order, c.order
    `);
    
    res.json(results.rows);
  } catch (error) {
    console.error("Error fetching assessment results:", error);
    res.status(500).json({ error: "Failed to fetch assessment results" });
  }
});

// Get a specific assessment result
router.get("/api/assessment-results/detail/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const id = parseInt(req.params.id);
    const result = await storage.getAssessmentResultById(id);
    
    if (!result) {
      return res.status(404).json({ error: "Assessment result not found" });
    }
    
    // Get assessment to verify user has access
    const assessment = await storage.getAssessmentById(result.assessmentId);
    
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    // Get control information
    const control = await storage.getControlById(result.controlId);
    const domain = control ? await storage.getDomainById(control.domainId) : null;
    
    const resultWithDetails = {
      ...result,
      controlName: control?.name,
      controlDescription: control?.description,
      domainName: domain?.name,
      domainCode: domain?.code,
      controlCode: control?.code,
    };
    
    res.json(resultWithDetails);
  } catch (error) {
    console.error("Error fetching assessment result:", error);
    res.status(500).json({ error: "Failed to fetch assessment result" });
  }
});

// Update an assessment result
router.patch("/api/assessment-results/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const id = parseInt(req.params.id);
    const result = await storage.getAssessmentResultById(id);
    
    if (!result) {
      return res.status(404).json({ error: "Assessment result not found" });
    }
    
    // Update the result data
    const updatedData = {
      ...result,
      status: req.body.status || result.status,
      evidence: req.body.evidence !== undefined ? req.body.evidence : result.evidence,
      recommendation: req.body.recommendation !== undefined ? req.body.recommendation : result.recommendation,
      managementResponse: req.body.managementResponse !== undefined ? req.body.managementResponse : result.managementResponse,
      targetDate: req.body.targetDate !== undefined ? req.body.targetDate : result.targetDate,
      updatedBy: req.user.id,
    };
    
    // Save the updated result
    const updatedResult = await storage.saveAssessmentResult(updatedData);
    
    // Get control information for response
    const control = await storage.getControlById(result.controlId);
    const domain = control ? await storage.getDomainById(control.domainId) : null;
    
    const resultWithDetails = {
      ...updatedResult,
      controlName: control?.name,
      controlDescription: control?.description,
      domainName: domain?.name,
      domainCode: domain?.code,
      controlCode: control?.code,
    };
    
    res.json(resultWithDetails);
  } catch (error) {
    console.error("Error updating assessment result:", error);
    res.status(400).json({ error: "Failed to update assessment result" });
  }
});

export default router;