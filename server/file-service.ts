import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { storage as dbStorage } from "./storage";
import { files, insertFileSchema, type InsertFile } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

// Setup storage locations
const UPLOADS_DIR = path.resolve("uploads");
const LOGOS_DIR = path.join(UPLOADS_DIR, "logos");
const DOCUMENTS_DIR = path.join(UPLOADS_DIR, "documents");

// Ensure directories exist
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureDirSync(LOGOS_DIR);
fs.ensureDirSync(DOCUMENTS_DIR);

// Configure multer storage
const logoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, LOGOS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `logo-${uniqueSuffix}${ext}`);
  },
});

const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, DOCUMENTS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `document-${uniqueSuffix}${ext}`);
  },
});

// Create multer upload instances
export const logoUpload = multer({
  storage: logoStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and SVG are allowed."));
    }
  },
});

export const documentUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and DOCX files are allowed."));
    }
  },
});

// Initialize PostgreSQL client
let db = null;
if (process.env.DATABASE_URL) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql);
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

// File service functions
export const saveFileToDatabase = async (
  file: Express.Multer.File,
  fileType: string,
  userId?: number
): Promise<number> => {
  if (db) {
    // Using PostgreSQL
    try {
      const fileData: InsertFile = {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        uploadedBy: userId,
        fileType: fileType,
      };
      
      const result = await db.insert(files).values(fileData).returning({ id: files.id });
      return result[0].id;
    } catch (error) {
      console.error("Error saving file to database:", error);
      throw error;
    }
  } else {
    // Using in-memory storage
    const fileData = {
      id: Math.floor(Math.random() * 10000),
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedAt: new Date(),
      uploadedBy: userId,
      fileType: fileType,
    };
    
    // Store file metadata in memory
    // Note: In a real implementation, we would store this in dbStorage
    return fileData.id;
  }
};

export const getFileById = async (fileId: number) => {
  if (db) {
    // Using PostgreSQL
    try {
      const fileData = await db.select().from(files).where(eq(files.id, fileId));
      return fileData[0];
    } catch (error) {
      console.error("Error getting file from database:", error);
      throw error;
    }
  } else {
    // Using in-memory storage
    // Note: In a real implementation, we would retrieve this from dbStorage
    return null;
  }
};

export const deleteFile = async (fileId: number) => {
  const file = await getFileById(fileId);
  if (file) {
    // Delete physical file
    await fs.remove(file.path);
    
    if (db) {
      // Delete from database
      await db.delete(files).where(eq(files.id, fileId));
    }
  }
};