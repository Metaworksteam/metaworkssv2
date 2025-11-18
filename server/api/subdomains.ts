import { Router } from "express";
import { storage } from "../storage";
import { subdomains } from "@shared/schema";
import { createInsertSchema } from "drizzle-zod";

// Create schema for validation
const insertSubdomainSchema = createInsertSchema(subdomains).omit({ id: true });

const router = Router();

// Get all subdomains
router.get("/api/subdomains", async (req, res) => {
  try {
    // Get domainId from query params if provided
    const domainId = req.query.domainId ? parseInt(req.query.domainId as string) : undefined;
    
    if (domainId) {
      const domain = await storage.getDomainById(domainId);
      
      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      }
      
      const subdomains = await storage.getSubdomainsByDomainId(domainId);
      return res.json(subdomains);
    }
    
    // If no domainId is provided, get all subdomains (less common use case)
    // This would need to be implemented in storage.ts with a getAllSubdomains method
    // For now, we'll return an error
    return res.status(400).json({ error: "Domain ID is required" });
  } catch (error) {
    console.error("Error fetching subdomains:", error);
    res.status(500).json({ error: "Failed to fetch subdomains" });
  }
});

// Get a specific subdomain
router.get("/api/subdomains/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const subdomain = await storage.getSubdomainById(id);
    
    if (!subdomain) {
      return res.status(404).json({ error: "Subdomain not found" });
    }
    
    // Get the domain info
    const domain = await storage.getDomainById(subdomain.domainId);
    
    res.json({
      ...subdomain,
      domainName: domain?.name || '',
    });
  } catch (error) {
    console.error("Error fetching subdomain:", error);
    res.status(500).json({ error: "Failed to fetch subdomain" });
  }
});

// Create a new subdomain (Admin only)
router.post("/api/subdomains", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  // Check if user is admin (if you have roles implemented)
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ error: "Forbidden" });
  // }
  
  try {
    const parsedData = insertSubdomainSchema.parse(req.body);
    
    // Verify the domain exists
    const domain = await storage.getDomainById(parsedData.domainId);
    if (!domain) {
      return res.status(404).json({ error: "Domain not found" });
    }
    
    const subdomain = await storage.saveSubdomain(parsedData);
    res.status(201).json(subdomain);
  } catch (error) {
    console.error("Error creating subdomain:", error);
    res.status(400).json({ error: "Failed to create subdomain" });
  }
});

// Update a subdomain (Admin only)
router.put("/api/subdomains/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  // Check if user is admin (if you have roles implemented)
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ error: "Forbidden" });
  // }
  
  try {
    const id = parseInt(req.params.id);
    const subdomain = await storage.getSubdomainById(id);
    
    if (!subdomain) {
      return res.status(404).json({ error: "Subdomain not found" });
    }
    
    const parsedData = insertSubdomainSchema.parse({
      ...req.body,
      id // Add the ID to ensure we're updating the right subdomain
    });
    
    // Make sure the domain exists
    const domain = await storage.getDomainById(parsedData.domainId);
    if (!domain) {
      return res.status(404).json({ error: "Domain not found" });
    }
    
    const updatedSubdomain = await storage.saveSubdomain(parsedData);
    res.json(updatedSubdomain);
  } catch (error) {
    console.error("Error updating subdomain:", error);
    res.status(400).json({ error: "Failed to update subdomain" });
  }
});

export default router;