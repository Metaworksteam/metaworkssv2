import express from "express";
import { storage } from "../storage";
import { insertOnboardingStepSchema, insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export const onboardingRouter = express.Router();

// Get all onboarding steps
onboardingRouter.get("/steps", async (req, res) => {
  try {
    const steps = await storage.getOnboardingSteps();
    res.json(steps);
  } catch (error) {
    console.error("Error fetching onboarding steps:", error);
    res.status(500).json({ error: "Failed to fetch onboarding steps" });
  }
});

// Get onboarding steps by type
onboardingRouter.get("/steps/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const steps = await storage.getOnboardingStepsByType(type);
    res.json(steps);
  } catch (error) {
    console.error("Error fetching onboarding steps by type:", error);
    res.status(500).json({ error: "Failed to fetch onboarding steps by type" });
  }
});

// Get a specific onboarding step
onboardingRouter.get("/steps/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const step = await storage.getOnboardingStepById(id);
    if (!step) {
      return res.status(404).json({ error: "Onboarding step not found" });
    }
    
    res.json(step);
  } catch (error) {
    console.error("Error fetching onboarding step:", error);
    res.status(500).json({ error: "Failed to fetch onboarding step" });
  }
});

// Create or update an onboarding step
onboardingRouter.post("/steps", async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }
    
    const validatedData = insertOnboardingStepSchema.parse(req.body);
    const step = await storage.saveOnboardingStep(validatedData);
    res.status(201).json(step);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating onboarding step:", error);
    res.status(500).json({ error: "Failed to create onboarding step" });
  }
});

// Get user progress for a specific user
onboardingRouter.get("/progress/user/:userId", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    // Check if user is requesting their own progress or is an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Cannot access other user's progress" });
    }
    
    const progress = await storage.getUserProgressByUser(userId);
    res.json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
});

// Save or update user progress
onboardingRouter.post("/progress", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const validatedData = insertUserProgressSchema.parse(req.body);
    
    // Check if user is updating their own progress or is an admin
    if (req.user.id !== validatedData.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Cannot update other user's progress" });
    }
    
    const progress = await storage.saveUserProgress(validatedData);
    
    // Update game stats when progress is updated
    await storage.updateUserGameStats(validatedData.userId, {});
    
    res.status(201).json(progress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error saving user progress:", error);
    res.status(500).json({ error: "Failed to save user progress" });
  }
});

// Get specific progress entry
onboardingRouter.get("/progress/:userId/:stepId", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const userId = parseInt(req.params.userId);
    const stepId = parseInt(req.params.stepId);
    
    if (isNaN(userId) || isNaN(stepId)) {
      return res.status(400).json({ error: "Invalid IDs" });
    }
    
    // Check if user is requesting their own progress or is an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Cannot access other user's progress" });
    }
    
    const progress = await storage.getUserStepProgress(userId, stepId);
    if (!progress) {
      return res.status(404).json({ error: "Progress entry not found" });
    }
    
    res.json(progress);
  } catch (error) {
    console.error("Error fetching specific progress entry:", error);
    res.status(500).json({ error: "Failed to fetch progress entry" });
  }
});