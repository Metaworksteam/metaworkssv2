import express, { Request, Response } from "express";
import { storage } from "../storage";
// Use Express's built-in authentication check
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};
import { log } from "../vite";
import multer from "multer";
import { insertCompanyInfoSchema } from "@shared/schema";
import { saveFileToDatabase, getFileById, deleteFile } from "../file-service";
import fs from "fs";
import path from "path";
import { z } from "zod";

const router = express.Router();

// Configure multer for logo uploads
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "logos");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `company-logo-${uniqueSuffix}${ext}`);
  }
});

const logoUpload = multer({
  storage: logoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed") as any);
    }
  }
});

// Configure multer for document uploads
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "company-docs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `company-doc-${uniqueSuffix}${ext}`);
  }
});

const documentUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

// Get company information
router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const companyInfo = await storage.getCompanyInfo();
    
    if (!companyInfo) {
      return res.status(404).json({ message: "Company information not found" });
    }
    
    // Fetch logo file info if it exists
    let logoFile = null;
    if (companyInfo.logoId) {
      logoFile = await getFileById(companyInfo.logoId);
    }
    
    // Prepare response with logo URL if available
    const response = {
      ...companyInfo,
      logoUrl: logoFile ? `/api/files/${logoFile.id}` : null,
      logoFile
    };
    
    res.status(200).json(response);
  } catch (error) {
    log(`Error fetching company information: ${error}`, "company-api");
    res.status(500).json({ error: "Failed to fetch company information" });
  }
});

// Create or update company information
router.post("/", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const companyData = req.body;
    
    // Validate the data
    const validatedData = insertCompanyInfoSchema.parse(companyData);
    
    // Save to database
    const savedCompanyInfo = await storage.saveCompanyInfo({
      ...validatedData,
      updatedBy: req.user?.id || 0
    });
    
    res.status(201).json(savedCompanyInfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    log(`Error saving company information: ${error}`, "company-api");
    res.status(500).json({ error: "Failed to save company information" });
  }
});

// Upload company logo
router.post("/logo", isAuthenticated, logoUpload.single("logo"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No logo file uploaded" });
    }
    
    // Save file to database
    const savedFile = await saveFileToDatabase(req.file, "company-logo", req.user?.id || 0);
    
    // Get existing company info
    let companyInfo = await storage.getCompanyInfo();
    
    // Delete old logo file if it exists
    if (companyInfo && companyInfo.logoId) {
      await deleteFile(companyInfo.logoId);
    }
    
    // Update company info with new logo file ID
    companyInfo = await storage.saveCompanyInfo({
      ...(companyInfo || { companyName: "Default Company" }),
      logoId: savedFile,
      updatedBy: req.user?.id || 0
    });
    
    res.status(201).json({
      logoId: savedFile,
      logoUrl: `/api/files/${savedFile}`,
      companyInfo
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Delete the file if there was an error
    }
    
    log(`Error uploading company logo: ${error}`, "company-api");
    res.status(500).json({ error: "Failed to upload company logo" });
  }
});

// Upload company document
router.post("/documents", isAuthenticated, documentUpload.single("document"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No document file uploaded" });
    }
    
    // Save file to database
    const savedFile = await saveFileToDatabase(req.file, "company-document", req.user?.id || 0);
    
    // Get existing company info
    let companyInfo = await storage.getCompanyInfo();
    
    if (!companyInfo) {
      return res.status(404).json({ error: "Company information not found" });
    }
    
    // Add document ID to array
    const documentsFileIds = companyInfo.documentsFileIds ? [...companyInfo.documentsFileIds as number[]] : [];
    documentsFileIds.push(savedFile);
    
    // Update company info with new documents array
    companyInfo = await storage.saveCompanyInfo({
      ...companyInfo,
      documentsFileIds,
      updatedBy: req.user?.id || 0
    });
    
    res.status(201).json({
      documentId: savedFile,
      documentUrl: `/api/files/${savedFile}`,
      companyInfo
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Delete the file if there was an error
    }
    
    log(`Error uploading company document: ${error}`, "company-api");
    res.status(500).json({ error: "Failed to upload company document" });
  }
});

// Get company documents
router.get("/documents", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const companyInfo = await storage.getCompanyInfo();
    
    if (!companyInfo) {
      return res.status(404).json({ error: "Company information not found" });
    }
    
    // Get document files
    const documentsFileIds = companyInfo.documentsFileIds as number[] || [];
    const documents = [];
    
    for (const fileId of documentsFileIds) {
      const file = await getFileById(fileId);
      if (file) {
        documents.push({
          ...file,
          downloadUrl: `/api/company/documents/${fileId}/download`
        });
      }
    }
    
    res.status(200).json({ documents });
  } catch (error) {
    log(`Error fetching company documents: ${error}`, "company-api");
    res.status(500).json({ error: "Failed to fetch company documents" });
  }
});

// Download a specific company document
router.get("/documents/:id/download", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id);
    if (isNaN(fileId)) {
      return res.status(400).json({ error: "Invalid file ID" });
    }
    
    const file = await getFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    // Verify the file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: "Document file not found on disk" });
    }
    
    // Send the file for download
    res.download(file.path, file.originalName);
  } catch (error) {
    log(`Error downloading company document: ${error}`, "company-api");
    res.status(500).json({ error: "Failed to download company document" });
  }
});

// Delete a company document
router.delete("/documents/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id);
    if (isNaN(fileId)) {
      return res.status(400).json({ error: "Invalid file ID" });
    }
    
    // Get existing company info
    let companyInfo = await storage.getCompanyInfo();
    
    if (!companyInfo) {
      return res.status(404).json({ error: "Company information not found" });
    }
    
    // Remove document ID from array
    const documentsFileIds = companyInfo.documentsFileIds as number[] || [];
    const updatedDocumentsFileIds = documentsFileIds.filter(id => id !== fileId);
    
    // Update company info with new documents array
    companyInfo = await storage.saveCompanyInfo({
      ...companyInfo,
      documentsFileIds: updatedDocumentsFileIds,
      updatedBy: req.user?.id || 0
    });
    
    // Delete the file
    await deleteFile(fileId);
    
    res.status(200).json({ message: "Document deleted successfully", companyInfo });
  } catch (error) {
    log(`Error deleting company document: ${error}`, "company-api");
    res.status(500).json({ error: "Failed to delete company document" });
  }
});

export default router;