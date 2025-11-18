import { db } from "../server/db";
import { pgTable, serial, text, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

async function createOnboardingTables() {
  console.log("Creating onboarding and gamification tables...");

  try {
    // Create onboarding_steps table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS onboarding_steps (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        content JSONB NOT NULL,
        "order" INTEGER NOT NULL,
        estimated_duration INTEGER NOT NULL,
        points INTEGER,
        prerequisite_step_ids JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("Created onboarding_steps table");

    // Create user_progress table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        step_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        started_at TIMESTAMPTZ NOT NULL,
        completed_at TIMESTAMPTZ,
        user_data JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, step_id)
      )
    `);
    console.log("Created user_progress table");

    // Create badges table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT,
        required_points INTEGER,
        required_steps JSONB,
        is_secret BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("Created badges table");

    // Create user_badges table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        badge_id INTEGER NOT NULL,
        earned_at TIMESTAMPTZ NOT NULL,
        is_displayed BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, badge_id)
      )
    `);
    console.log("Created user_badges table");

    // Create user_game_stats table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_game_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        level INTEGER NOT NULL DEFAULT 1,
        total_points INTEGER NOT NULL DEFAULT 0,
        completed_steps INTEGER NOT NULL DEFAULT 0,
        earned_badges INTEGER NOT NULL DEFAULT 0,
        streak_days INTEGER NOT NULL DEFAULT 0,
        last_active TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("Created user_game_stats table");

    // Seed initial data if needed
    await seedInitialData();

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

async function seedInitialData() {
  // Add some initial onboarding steps
  await db.execute(sql`
    INSERT INTO onboarding_steps (title, description, type, content, "order", estimated_duration, points)
    VALUES 
      ('Welcome to MetaWorks', 'Introduction to the cybersecurity compliance platform', 'introduction', '{"content": "Welcome to MetaWorks, your comprehensive cybersecurity compliance platform. This platform is designed to help you manage and improve your organization''s security posture."}', 1, 5, 10),
      ('Complete Your Profile', 'Set up your company information and profile', 'profile', '{"content": "Fill in your company details and upload your company logo to personalize your dashboard."}', 2, 10, 20),
      ('Security Assessment Introduction', 'Learn how to conduct your first security assessment', 'tutorial', '{"content": "This tutorial will guide you through the process of conducting your first security assessment using the platform."}', 3, 15, 30),
      ('ECC Framework Overview', 'Overview of the NCA Essential Cybersecurity Controls', 'knowledge', '{"content": "The ECC framework consists of 29 essential controls divided into 5 main domains. This overview will help you understand the framework structure."}', 4, 20, 40)
    ON CONFLICT (id) DO NOTHING
  `);
  
  // Add some initial badges
  await db.execute(sql`
    INSERT INTO badges (name, description, category, image_url, required_points)
    VALUES 
      ('Newcomer', 'Completed your first onboarding step', 'onboarding', '/badges/newcomer.svg', 10),
      ('Profile Master', 'Completed your company profile setup', 'profile', '/badges/profile-master.svg', 30),
      ('Assessment Novice', 'Completed your first security assessment', 'assessment', '/badges/assessment-novice.svg', 50),
      ('Security Champion', 'Reached level 5 in security knowledge', 'achievement', '/badges/security-champion.svg', 200)
    ON CONFLICT (id) DO NOTHING
  `);
  
  console.log("Seeded initial data");
}

createOnboardingTables()
  .then(() => {
    console.log("Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration script failed:", error);
    process.exit(1);
  });