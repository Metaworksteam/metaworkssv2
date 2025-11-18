import { Router, Request, Response } from "express";
import { db } from "../db";
import { demoRequests, insertDemoRequestSchema } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.post('/api/book-demo', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not initialized' });
    }
    const validatedData = insertDemoRequestSchema.parse(req.body);
    
    const [newRequest] = await db.insert(demoRequests).values(validatedData).returning();
    
    console.log('=== Demo Request Submission ===');
    console.log('Name:', validatedData.name);
    console.log('Email:', validatedData.email);
    console.log('Company:', validatedData.company || 'Not provided');
    console.log('Message:', validatedData.message || 'Not provided');
    console.log('Saved to database with ID:', newRequest.id);
    console.log('================================');
    
    res.status(200).json({ 
      success: true, 
      message: 'Demo request submitted successfully',
      id: newRequest.id
    });
  } catch (error) {
    console.error('Error processing demo request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process demo request'
    });
  }
});

router.get('/api/book-demo', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not initialized' });
    }
    const requests = await db.select().from(demoRequests).orderBy(desc(demoRequests.createdAt));
    res.json(requests);
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch demo requests'
    });
  }
});

router.patch('/api/book-demo/:id/status', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not initialized' });
    }
    const { id } = req.params;
    const { status } = req.body;
    
    const [updated] = await db
      .update(demoRequests)
      .set({ status })
      .where(eq(demoRequests.id, parseInt(id)))
      .returning();
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating demo request status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update status'
    });
  }
});

export default router;
