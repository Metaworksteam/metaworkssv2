import { Router } from 'express';
import { storage } from '../storage';
import { userProgress } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get complete timeline with onboarding steps and user progress
router.get('/api/progress/timeline', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user!.id;
    
    // Get all onboarding steps
    const onboardingSteps = await storage.getOnboardingSteps();
    
    // Get user progress for these steps
    const userProgressEntries = await storage.getUserProgressByUser(userId);
    
    // Combine steps with progress
    const timelineData = onboardingSteps.map(step => {
      const progressEntry = userProgressEntries.find((p: any) => p.stepId === step.id);
      
      let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
      if (progressEntry) {
        status = progressEntry.completed ? 'completed' : 'in_progress';
      }
      
      return {
        ...step,
        status,
        startedAt: progressEntry?.startedAt || null,
        completedAt: progressEntry?.completedAt || null,
      };
    });
    
    // Sort by step order
    timelineData.sort((a, b) => a.order - b.order);
    
    res.json(timelineData);
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    res.status(500).json({ error: 'Failed to fetch timeline data' });
  }
});

// Record user progress for a specific step
router.post('/api/progress/:stepId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user!.id;
    const stepId = parseInt(req.params.stepId);
    const { completed, score, answers } = req.body;
    
    // Check if the step exists
    const step = await storage.getOnboardingStepById(stepId);
    if (!step) {
      return res.status(404).json({ error: 'Step not found' });
    }
    
    // Check if progress entry already exists
    const existingProgress = await storage.getUserStepProgress(userId, stepId);
    
    let progress;
    
    if (existingProgress) {
      // Update existing progress
      progress = await storage.updateUserProgress(existingProgress.id, {
        userId,
        stepId,
        completed: completed !== undefined ? completed : existingProgress.completed,
        score: score !== undefined ? score : existingProgress.score,
        answers: answers !== undefined ? answers : existingProgress.answers,
        completedAt: completed ? new Date().toISOString() : existingProgress.completedAt,
        attempts: existingProgress.attempts + 1,
      });
    } else {
      // Create new progress entry
      progress = await storage.saveUserProgress({
        userId,
        stepId,
        completed: !!completed,
        score,
        answers,
        startedAt: new Date().toISOString(),
        completedAt: completed ? new Date().toISOString() : null,
        attempts: 1,
      });
    }
    
    // If step was completed, could check for badge unlocks here
    // We'll implement badge awarding in a future update
    
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;