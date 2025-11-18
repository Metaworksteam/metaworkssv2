import { storage } from "../storage";
import { Router, Request, Response } from "express";
import { z } from "zod";
import { insertPolicyCategorySchema, insertPolicyTemplateSchema, insertGeneratedPolicySchema } from "@shared/schema";
import { logoUpload, saveFileToDatabase, getFileById, deleteFile } from "../file-service";
import { db } from "../db";
import { log } from "../vite";
import path from "path";
import fs from "fs";
import multer from "multer";

const router = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

// Policy Categories endpoints
router.get("/categories", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const categories = await storage.getPolicyCategories();
    res.json(categories);
  } catch (error) {
    log(`Error getting policy categories: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to get policy categories" });
  }
});

router.post("/categories", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const categoryData = insertPolicyCategorySchema.parse(req.body);
    const category = await storage.savePolicyCategory(categoryData);
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    log(`Error creating policy category: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to create policy category" });
  }
});

router.get("/categories/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    
    const category = await storage.getPolicyCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.json(category);
  } catch (error) {
    log(`Error getting policy category: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to get policy category" });
  }
});

// Policy Templates endpoints
router.get("/templates", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templates = await storage.getPolicyTemplates();
    res.json(templates);
  } catch (error) {
    log(`Error getting policy templates: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to get policy templates" });
  }
});

router.get("/templates/by-category/:categoryId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    
    const templates = await storage.getPolicyTemplatesByCategory(categoryId);
    res.json(templates);
  } catch (error) {
    log(`Error getting policy templates by category: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to get policy templates by category" });
  }
});

// Upload policy template
const templateUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads", "templates");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `template-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    // Allow only Word and PDF files
    if (file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only .doc, .docx and .pdf files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB size limit
  }
});

router.post("/templates/upload", isAuthenticated, templateUpload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    
    const templateData = JSON.parse(req.body.data || "{}");
    
    // Store file info in database
    const savedFile = await saveFileToDatabase(req.file, "template", req.user?.id || 0);
    
    // Extract placeholders - in a real implementation this would parse the document
    // For demo purposes, use some default placeholders
    const placeholders = [
      "[COMPANY_NAME]",
      "[COMPANY_LOGO]",
      "[CEO_NAME]",
      "[CIO_NAME]",
      "[EFFECTIVE_DATE]"
    ];
    
    // Create the template record
    const template = await storage.savePolicyTemplate({
      templateName: templateData.templateName || req.file.originalname,
      templateType: req.file.mimetype.includes('pdf') ? 'pdf' : 'word',
      fileId: savedFile,
      categoryId: parseInt(templateData.categoryId),
      uploadedBy: req.user?.id || 0,
      version: templateData.version || "1.0",
      placeholders,
      isActive: true
    });
    
    res.status(201).json(template);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Delete the file if there was an error
    }
    
    log(`Error uploading policy template: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to upload policy template" });
  }
});

router.get("/templates/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid template ID" });
    }
    
    const template = await storage.getPolicyTemplateById(id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    // Get the file info
    const file = await getFileById(template.fileId);
    if (!file) {
      return res.status(404).json({ error: "Template file not found" });
    }
    
    res.json({ template, file });
  } catch (error) {
    log(`Error getting policy template: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to get policy template" });
  }
});

router.patch("/templates/:id/status", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid template ID" });
    }
    
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: "isActive must be a boolean" });
    }
    
    const updatedTemplate = await storage.updatePolicyTemplateStatus(id, isActive);
    res.json(updatedTemplate);
  } catch (error) {
    log(`Error updating policy template status: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to update policy template status" });
  }
});

// Generated Policies endpoints
router.get("/generated/:companyId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }
    
    const policies = await storage.getGeneratedPolicies(companyId);
    res.json(policies);
  } catch (error) {
    log(`Error getting generated policies: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to get generated policies" });
  }
});

router.post("/generated", isAuthenticated, async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would handle the actual document processing
    // For demo purposes, we'll just save the policy data
    const policyData = insertGeneratedPolicySchema.parse(req.body);
    
    // For demo purposes, assume we've generated a file and saved it
    // In a real implementation, this would process the template, replace placeholders, and generate a new document
    const fileData = {
      filename: `generated-policy-${Date.now()}.docx`,
      originalName: `Generated Policy ${policyData.templateId}`,
      path: path.join(process.cwd(), "uploads", "generated", `generated-policy-${Date.now()}.docx`),
      size: 1024,
      mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      uploadedBy: req.user?.id || 0
    };
    
    // Ensure directory exists
    const dir = path.join(process.cwd(), "uploads", "generated");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create an empty file for demo purposes
    fs.writeFileSync(fileData.path, "");
    
    // Create a multer-like file object for the saveFileToDatabase function
    const mockFile = {
      filename: fileData.filename,
      originalname: `Generated Policy ${policyData.templateId}.docx`,
      path: fileData.path,
      size: fileData.size,
      mimetype: fileData.mimetype
    } as Express.Multer.File;
    
    const savedFile = await saveFileToDatabase(mockFile, "generated-policy", req.user?.id || 0);
    
    // Create the generated policy with the file ID
    const generatedPolicy = await storage.saveGeneratedPolicy({
      ...policyData,
      generatedFileId: savedFile
    });
    
    res.status(201).json(generatedPolicy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    log(`Error generating policy: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to generate policy" });
  }
});

router.get("/generated/policy/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid policy ID" });
    }
    
    const policy = await storage.getGeneratedPolicyById(id);
    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }
    
    // Get the generated file
    const file = await getFileById(policy.generatedFileId);
    if (!file) {
      return res.status(404).json({ error: "Policy file not found" });
    }
    
    // Get the template
    const template = await storage.getPolicyTemplateById(policy.templateId);
    
    res.json({ policy, file, template });
  } catch (error) {
    log(`Error getting generated policy: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to get generated policy" });
  }
});

router.patch("/generated/:id/approval", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid policy ID" });
    }
    
    const { status } = req.body;
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const updatedPolicy = await storage.updateGeneratedPolicyApprovalStatus(
      id, 
      status, 
      status === 'approved' ? req.user?.id : undefined
    );
    
    res.json(updatedPolicy);
  } catch (error) {
    log(`Error updating policy approval status: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to update policy approval status" });
  }
});

// Download policy file
router.get("/download/:fileId", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId);
    if (isNaN(fileId)) {
      return res.status(400).json({ error: "Invalid file ID" });
    }
    
    const file = await getFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: "File not found on disk" });
    }
    
    res.download(file.path, file.originalName);
  } catch (error) {
    log(`Error downloading file: ${error}`, "policy-api");
    res.status(500).json({ error: "Failed to download file" });
  }
});

export default router;