import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { insertAssessmentRiskSchema } from '@shared/schema';
import { z } from 'zod';

const router = express.Router();

// Get assessment risks by assessment ID
router.get('/assessment/:assessmentId', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const assessmentId = parseInt(req.params.assessmentId);
    const assessmentRisks = await storage.getAssessmentRisksByAssessmentId(assessmentId);
    
    res.json(assessmentRisks);
  } catch (error: any) {
    console.error('Error getting assessment risks:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get assessment risk by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    const assessmentRisk = await storage.getAssessmentRiskById(id);
    
    if (!assessmentRisk) {
      return res.status(404).json({ message: 'Assessment risk not found' });
    }
    
    res.json(assessmentRisk);
  } catch (error: any) {
    console.error('Error getting assessment risk by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create or update assessment risk
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Validate request body
    const validatedData = insertAssessmentRiskSchema.parse(req.body);
    
    // Save the assessment risk
    const assessmentRisk = await storage.saveAssessmentRisk(validatedData);
    
    res.status(201).json(assessmentRisk);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Error creating/updating assessment risk:', error);
      res.status(500).json({ message: error.message });
    }
  }
});

// Delete assessment risk
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteAssessmentRisk(id);
    
    res.sendStatus(204);
  } catch (error: any) {
    console.error('Error deleting assessment risk:', error);
    res.status(500).json({ message: error.message });
  }
});

// Assign risks to an assessment
router.post('/assign', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { assessmentId, riskIds } = req.body;
    
    if (!assessmentId || !Array.isArray(riskIds)) {
      return res.status(400).json({ message: 'Invalid request. assessmentId and riskIds array required.' });
    }
    
    const results = [];
    
    for (const riskId of riskIds) {
      try {
        // Check if the assignment already exists
        const existingAssessmentRisks = await storage.getAssessmentRisksByAssessmentId(assessmentId);
        const alreadyAssigned = existingAssessmentRisks.some(ar => ar.riskId === riskId);
        
        if (!alreadyAssigned) {
          const assessmentRisk = await storage.saveAssessmentRisk({
            assessmentId,
            riskId,
            status: 'to_assess'
          });
          
          results.push({
            success: true,
            assessmentRisk
          });
        } else {
          results.push({
            success: false,
            riskId,
            error: 'Risk already assigned to this assessment'
          });
        }
      } catch (error: any) {
        results.push({
          success: false,
          riskId,
          error: error.message
        });
      }
    }
    
    res.status(201).json({
      totalProcessed: riskIds.length,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
      results
    });
  } catch (error: any) {
    console.error('Error assigning risks to assessment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update status of an assessment risk
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    const { status, notes, evidence } = req.body;
    
    if (!status || !['to_assess', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: to_assess, in_progress, completed' });
    }
    
    const assessmentRisk = await storage.getAssessmentRiskById(id);
    
    if (!assessmentRisk) {
      return res.status(404).json({ message: 'Assessment risk not found' });
    }
    
    const updatedAssessmentRisk = await storage.saveAssessmentRisk({
      ...assessmentRisk,
      status,
      notes: notes || assessmentRisk.notes,
      evidence: evidence || assessmentRisk.evidence,
      reviewedBy: status === 'completed' ? req.user?.id : assessmentRisk.reviewedBy,
      reviewedAt: status === 'completed' ? new Date().toISOString() : assessmentRisk.reviewedAt
    });
    
    res.json(updatedAssessmentRisk);
  } catch (error: any) {
    console.error('Error updating assessment risk status:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;