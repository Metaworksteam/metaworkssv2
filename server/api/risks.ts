import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { insertRiskSchema } from '@shared/schema';
import { z } from 'zod';

const router = express.Router();

// Get all risks
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
    const risks = await storage.getRisks(companyId);
    
    res.json(risks);
  } catch (error: any) {
    console.error('Error getting risks:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get risk by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    const risk = await storage.getRiskById(id);
    
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    
    res.json(risk);
  } catch (error: any) {
    console.error('Error getting risk by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create or update risk
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Validate request body
    const validatedData = insertRiskSchema.parse(req.body);
    
    // Save the risk
    const risk = await storage.saveRisk(validatedData);
    
    res.status(201).json(risk);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Error creating/updating risk:', error);
      res.status(500).json({ message: error.message });
    }
  }
});

// Delete risk
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteRisk(id);
    
    res.sendStatus(204);
  } catch (error: any) {
    console.error('Error deleting risk:', error);
    res.status(500).json({ message: error.message });
  }
});

// Bulk import risks
router.post('/import', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const risks = req.body.risks;
    
    if (!Array.isArray(risks)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of risks.' });
    }
    
    const results = [];
    const companyId = req.body.companyId;
    
    for (const risk of risks) {
      // Basic validation for required fields
      if (!risk.title || !risk.description || !risk.category || !risk.likelihood || !risk.impact || !risk.inherentRiskLevel) {
        results.push({
          success: false,
          risk: risk,
          error: 'Missing required fields'
        });
        continue;
      }
      
      try {
        const savedRisk = await storage.saveRisk({
          ...risk,
          companyId
        });
        
        results.push({
          success: true,
          risk: savedRisk
        });
      } catch (error: any) {
        results.push({
          success: false,
          risk: risk,
          error: error.message
        });
      }
    }
    
    res.status(201).json({
      totalProcessed: risks.length,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
      results
    });
  } catch (error: any) {
    console.error('Error importing risks:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;