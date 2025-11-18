import { Router } from "express";
import { storage } from "../storage";
import { insertControlSchema } from "@shared/schema";

const router = Router();

// Get controls with query parameters (domainId or subdomainId)
router.get("/api/controls", async (req, res) => {
  try {
    const subdomainId = req.query.subdomainId ? parseInt(req.query.subdomainId as string) : undefined;
    const domainId = req.query.domainId ? parseInt(req.query.domainId as string) : undefined;
    
    if (subdomainId) {
      const subdomain = await storage.getSubdomainById(subdomainId);
      
      if (!subdomain) {
        return res.status(404).json({ error: "Subdomain not found" });
      }
      
      const controls = await storage.getControlsBySubdomainId(subdomainId);
      
      // Get domain info for additional context
      const domain = await storage.getDomainById(subdomain.domainId);
      
      // Enhance controls with their codes
      const controlsWithCodes = controls.map((control, index) => {
        return {
          ...control,
          code: `C${index + 1}`,
          domainName: domain?.name || '',
          subdomainName: subdomain.name,
        };
      });
      
      return res.json(controlsWithCodes);
    }
    
    if (domainId) {
      const domain = await storage.getDomainById(domainId);
      
      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      }
      
      const controls = await storage.getControlsByDomainId(domainId);
      
      // Enhance controls with their codes
      const controlsWithCodes = controls.map((control, index) => {
        return {
          ...control,
          code: `C${index + 1}`,
          domainName: domain.name,
        };
      });
      
      return res.json(controlsWithCodes);
    }
    
    // If no query parameters are provided, return an error
    return res.status(400).json({ error: "Either subdomainId or domainId is required" });
  } catch (error) {
    console.error("Error fetching controls:", error);
    res.status(500).json({ error: "Failed to fetch controls" });
  }
});

// Get all subdomains for a domain
router.get("/api/domains/:domainId/subdomains", async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId);
    const domain = await storage.getDomainById(domainId);
    
    if (!domain) {
      return res.status(404).json({ error: "Domain not found" });
    }
    
    const subdomains = await storage.getSubdomainsByDomainId(domainId);
    
    res.json(subdomains);
  } catch (error) {
    console.error("Error fetching subdomains:", error);
    res.status(500).json({ error: "Failed to fetch subdomains" });
  }
});

// Get all controls for a subdomain
router.get("/api/subdomains/:subdomainId/controls", async (req, res) => {
  try {
    const subdomainId = parseInt(req.params.subdomainId);
    const subdomain = await storage.getSubdomainById(subdomainId);
    
    if (!subdomain) {
      return res.status(404).json({ error: "Subdomain not found" });
    }
    
    const domain = await storage.getDomainById(subdomain.domainId);
    const controls = await storage.getControlsBySubdomainId(subdomainId);
    
    // Enhance controls with their codes
    const controlsWithCodes = controls.map((control, index) => {
      return {
        ...control,
        code: `C${index + 1}`,
        domainName: domain?.name || '',
        subdomainName: subdomain.name,
      };
    });
    
    res.json(controlsWithCodes);
  } catch (error) {
    console.error("Error fetching controls:", error);
    res.status(500).json({ error: "Failed to fetch controls" });
  }
});

// Get all controls for a domain (including all subdomains)
router.get("/api/domains/:domainId/controls", async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId);
    const domain = await storage.getDomainById(domainId);
    
    if (!domain) {
      return res.status(404).json({ error: "Domain not found" });
    }
    
    const controls = await storage.getControlsByDomainId(domainId);
    
    // Enhance controls with their codes
    const controlsWithCodes = controls.map((control, index) => {
      return {
        ...control,
        code: `C${index + 1}`,
        domainName: domain.name,
      };
    });
    
    res.json(controlsWithCodes);
  } catch (error) {
    console.error("Error fetching controls:", error);
    res.status(500).json({ error: "Failed to fetch controls" });
  }
});

// Get a specific control
router.get("/api/controls/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const control = await storage.getControlById(id);
    
    if (!control) {
      return res.status(404).json({ error: "Control not found" });
    }
    
    // Get the subdomain and domain info
    const subdomain = await storage.getSubdomainById(control.subdomainId);
    let domainName = '';
    
    if (subdomain) {
      const domain = await storage.getDomainById(subdomain.domainId);
      if (domain) {
        domainName = domain.name;
      }
    }
    
    res.json({
      ...control,
      domainName,
      subdomainName: subdomain?.name || '',
    });
  } catch (error) {
    console.error("Error fetching control:", error);
    res.status(500).json({ error: "Failed to fetch control" });
  }
});

// Create a new control (Admin only)
router.post("/api/controls", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const parsedData = insertControlSchema.parse(req.body);
    const control = await storage.saveControl(parsedData);
    res.status(201).json(control);
  } catch (error) {
    console.error("Error creating control:", error);
    res.status(400).json({ error: "Failed to create control" });
  }
});

export default router;