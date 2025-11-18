import { Router, Request, Response } from "express";
import { db } from "../db";
import { contactMessages, insertContactMessageSchema } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.post('/api/contact', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not initialized' });
    }
    const validatedData = insertContactMessageSchema.parse(req.body);
    
    const [newMessage] = await db.insert(contactMessages).values(validatedData).returning();
    
    console.log('=== Contact Form Submission ===');
    console.log('Name:', validatedData.name);
    console.log('Email:', validatedData.email);
    console.log('Message:', validatedData.message);
    console.log('Saved to database with ID:', newMessage.id);
    console.log('================================');
    
    res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      id: newMessage.id
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process contact form'
    });
  }
});

router.get('/api/contact', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not initialized' });
    }
    const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch contact messages'
    });
  }
});

router.patch('/api/contact/:id/status', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not initialized' });
    }
    const { id } = req.params;
    const { status } = req.body;
    
    const [updated] = await db
      .update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, parseInt(id)))
      .returning();
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating contact message status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update status'
    });
  }
});

export default router;
