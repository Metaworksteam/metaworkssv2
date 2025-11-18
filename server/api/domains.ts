import { Router } from "express";
import { storage } from "../storage";
import { insertDomainSchema } from "@shared/schema";

const router = Router();

// Get all domains for a framework
router.get("/api/frameworks/:frameworkId/domains", async (req, res) => {
  try {
    const frameworkId = parseInt(req.params.frameworkId);
    const domains = await storage.getDomainsByFrameworkId(frameworkId);
    
    // Enhance domains with their codes
    const domainsWithCodes = domains.map((domain, index) => {
      return {
        ...domain,
        code: `D${index + 1}`
      };
    });
    
    res.json(domainsWithCodes);
  } catch (error) {
    console.error("Error fetching domains:", error);
    res.status(500).json({ error: "Failed to fetch domains" });
  }
});

// Get a specific domain
router.get("/api/domains/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const domain = await storage.getDomainById(id);
    
    if (!domain) {
      return res.status(404).json({ error: "Domain not found" });
    }
    
    res.json(domain);
  } catch (error) {
    console.error("Error fetching domain:", error);
    res.status(500).json({ error: "Failed to fetch domain" });
  }
});

// Create a new domain (Admin only)
router.post("/api/domains", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const parsedData = insertDomainSchema.parse(req.body);
    const domain = await storage.saveDomain(parsedData);
    res.status(201).json(domain);
  } catch (error) {
    console.error("Error creating domain:", error);
    res.status(400).json({ error: "Failed to create domain" });
  }
});

export default router;