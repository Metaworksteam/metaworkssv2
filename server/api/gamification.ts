import express from "express";
import { storage } from "../storage";
import { insertBadgeSchema, insertUserBadgeSchema, insertUserGameStatsSchema } from "@shared/schema";
import { z } from "zod";

export const gamificationRouter = express.Router();

// Badges routes
// Get all badges
gamificationRouter.get("/badges", async (req, res) => {
  try {
    const badges = await storage.getBadges();
    res.json(badges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ error: "Failed to fetch badges" });
  }
});

// Get badges by category
gamificationRouter.get("/badges/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const badges = await storage.getBadgesByCategory(category);
    res.json(badges);
  } catch (error) {
    console.error("Error fetching badges by category:", error);
    res.status(500).json({ error: "Failed to fetch badges by category" });
  }
});

// Get a specific badge
gamificationRouter.get("/badges/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const badge = await storage.getBadgeById(id);
    if (!badge) {
      return res.status(404).json({ error: "Badge not found" });
    }
    
    res.json(badge);
  } catch (error) {
    console.error("Error fetching badge:", error);
    res.status(500).json({ error: "Failed to fetch badge" });
  }
});

// Create or update a badge (admin only)
gamificationRouter.post("/badges", async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }
    
    const validatedData = insertBadgeSchema.parse(req.body);
    const badge = await storage.saveBadge(validatedData);
    res.status(201).json(badge);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating badge:", error);
    res.status(500).json({ error: "Failed to create badge" });
  }
});

// User Badge routes
// Get user badges
gamificationRouter.get("/user-badges/:userId", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    // Check if user is requesting their own badges or is an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Cannot access other user's badges" });
    }
    
    const userBadges = await storage.getUserBadgesByUser(userId);
    res.json(userBadges);
  } catch (error) {
    console.error("Error fetching user badges:", error);
    res.status(500).json({ error: "Failed to fetch user badges" });
  }
});

// Award a badge to a user
gamificationRouter.post("/user-badges", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const validatedData = insertUserBadgeSchema.parse(req.body);
    
    // Check if user is awarding themselves a badge or is an admin
    if (req.user.id !== validatedData.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Cannot award badges to other users" });
    }
    
    const userBadge = await storage.saveUserBadge(validatedData);
    res.status(201).json(userBadge);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error awarding badge:", error);
    res.status(500).json({ error: "Failed to award badge" });
  }
});

// Toggle badge display status
gamificationRouter.patch("/user-badges/:id/display", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    
    const { displayed } = req.body;
    if (displayed === undefined || typeof displayed !== 'boolean') {
      return res.status(400).json({ error: "Missing or invalid 'displayed' parameter" });
    }
    
    // Get the user badge to check ownership
    const userBadge = await storage.getUserBadgeById(id);
    if (!userBadge) {
      return res.status(404).json({ error: "User badge not found" });
    }
    
    // Check if user owns this badge or is an admin
    if (req.user.id !== userBadge.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Cannot modify other user's badges" });
    }
    
    const updatedUserBadge = await storage.toggleBadgeDisplay(id, displayed);
    res.json(updatedUserBadge);
  } catch (error) {
    console.error("Error toggling badge display:", error);
    res.status(500).json({ error: "Failed to toggle badge display" });
  }
});

// Game Stats routes
// Get a user's game stats
gamificationRouter.get("/game-stats/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    // Only require authentication for private stats
    if (req.isAuthenticated()) {
      // Allow a user to view their own stats or admins to view any user's stats
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Unauthorized: Cannot access other user's detailed stats" });
      }
      
      const stats = await storage.getUserGameStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "Game stats not found for user" });
      }
      
      res.json(stats);
    } else {
      // For unauthenticated requests, return limited public stats
      const stats = await storage.getUserGameStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "Game stats not found for user" });
      }
      
      // Return only public fields
      const publicStats = {
        userId: stats.userId,
        level: stats.level,
        totalPoints: stats.totalPoints,
        completedSteps: stats.completedSteps
      };
      
      res.json(publicStats);
    }
  } catch (error) {
    console.error("Error fetching game stats:", error);
    res.status(500).json({ error: "Failed to fetch game stats" });
  }
});

// Update game stats
gamificationRouter.patch("/game-stats/:userId", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    // Check if user is updating their own stats or is an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Cannot update other user's stats" });
    }
    
    const validatedData = insertUserGameStatsSchema.partial().parse(req.body);
    const stats = await storage.updateUserGameStats(userId, validatedData);
    res.json(stats);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating game stats:", error);
    res.status(500).json({ error: "Failed to update game stats" });
  }
});

// Get leaderboard (top users by points)
gamificationRouter.get("/leaderboard", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ error: "Invalid limit parameter. Must be between 1 and 100." });
    }
    
    const topUsers = await storage.getUsersTopGameStats(limit);
    res.json(topUsers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});