import { Router } from "express";
import { storage } from "../storage";
import { eq } from "drizzle-orm";
import { insertFrameworkSchema } from "@shared/schema";

const router = Router();

// Get all frameworks
router.get("/api/frameworks", async (req, res) => {
  try {
    const frameworks = await storage.getFrameworks();
    res.json(frameworks);
  } catch (error) {
    console.error("Error fetching frameworks:", error);
    res.status(500).json({ error: "Failed to fetch frameworks" });
  }
});

// Get a specific framework by ID
router.get("/api/frameworks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const framework = await storage.getFrameworkById(id);
    
    if (!framework) {
      return res.status(404).json({ error: "Framework not found" });
    }
    
    res.json(framework);
  } catch (error) {
    console.error("Error fetching framework:", error);
    res.status(500).json({ error: "Failed to fetch framework" });
  }
});

// Create a new framework (Admin only)
router.post("/api/frameworks", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const parsedData = insertFrameworkSchema.parse(req.body);
    const framework = await storage.saveFramework(parsedData);
    res.status(201).json(framework);
  } catch (error) {
    console.error("Error creating framework:", error);
    res.status(400).json({ error: "Failed to create framework" });
  }
});

export default router;