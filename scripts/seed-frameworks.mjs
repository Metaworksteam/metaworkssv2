import dotenv from 'dotenv';
import { db } from '../server/db.js';
import { frameworks, domains, controls } from '../shared/schema.js';

dotenv.config();

async function seedFrameworks() {
  try {
    console.log('Seeding frameworks, domains, and controls...');
    
    // Check if frameworks already exist
    const existingFrameworks = await db.select().from(frameworks);
    
    if (existingFrameworks.length > 0) {
      console.log('Frameworks already exist. Skipping seed.');
      return;
    }
    
    // NCA ECC Framework
    const [eccFramework] = await db.insert(frameworks).values({
      name: 'NCA Essential Cybersecurity Controls',
      description: 'Saudi National Cybersecurity Authority Essential Cybersecurity Controls',
      version: '1.0',
      referenceUrl: 'https://nca.gov.sa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    console.log('Created framework:', eccFramework.name);
    
    // ECC Domains
    const eccDomains = [
      {
        frameworkId: eccFramework.id,
        name: 'Cybersecurity Governance',
        code: 'ECC-1',
        description: 'Controls related to cybersecurity governance and leadership',
      },
      {
        frameworkId: eccFramework.id,
        name: 'Cybersecurity Risk Management',
        code: 'ECC-2',
        description: 'Controls related to risk management processes and procedures',
      },
      {
        frameworkId: eccFramework.id,
        name: 'Cybersecurity Operations',
        code: 'ECC-3',
        description: 'Controls related to security operations and incident management',
      },
      {
        frameworkId: eccFramework.id,
        name: 'Technology Security',
        code: 'ECC-4',
        description: 'Controls related to technical security measures and configurations',
      },
      {
        frameworkId: eccFramework.id,
        name: 'Third-Party Cybersecurity',
        code: 'ECC-5',
        description: 'Controls related to managing third-party and vendor security',
      },
    ];
    
    // Insert domains
    for (const domainData of eccDomains) {
      const [domain] = await db.insert(domains).values(domainData).returning();
      console.log(`Created domain: ${domain.code} - ${domain.name}`);
      
      // Sample controls for each domain
      const domainControls = generateControlsForDomain(domain);
      
      // Insert controls
      for (const controlData of domainControls) {
        await db.insert(controls).values(controlData);
      }
      
      console.log(`Added ${domainControls.length} controls to domain ${domain.code}`);
    }
    
    // SAMA Framework
    const [samaFramework] = await db.insert(frameworks).values({
      name: 'SAMA Cyber Security Framework',
      description: 'Saudi Central Bank (SAMA) Cyber Security Framework',
      version: '1.0',
      referenceUrl: 'https://sama.gov.sa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    console.log('Created framework:', samaFramework.name);
    
    // ISO 27001 Framework
    const [isoFramework] = await db.insert(frameworks).values({
      name: 'ISO/IEC 27001',
      description: 'International Standard for Information Security Management Systems',
      version: '2022',
      referenceUrl: 'https://www.iso.org/standard/27001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    console.log('Created framework:', isoFramework.name);
    
    // PDPL Framework
    const [pdplFramework] = await db.insert(frameworks).values({
      name: 'Saudi Arabia PDPL',
      description: 'Saudi Arabia Personal Data Protection Law',
      version: '2021',
      referenceUrl: 'https://ndmo.gov.sa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    console.log('Created framework:', pdplFramework.name);
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding frameworks:', error);
  } finally {
    process.exit(0);
  }
}

// Helper function to generate sample controls for a domain
function generateControlsForDomain(domain) {
  const controls = [];
  
  // Different number of controls per domain for more realistic data
  const numControls = 5 + Math.floor(Math.random() * 5); // 5-9 controls per domain
  
  for (let i = 1; i <= numControls; i++) {
    let controlName, controlDescription;
    
    switch (domain.code) {
      case 'ECC-1':
        controlName = `Cybersecurity Policy ${i}`;
        controlDescription = `Establish and maintain a comprehensive cybersecurity policy addressing organizational requirements.`;
        break;
      case 'ECC-2':
        controlName = `Risk Assessment ${i}`;
        controlDescription = `Conduct regular cybersecurity risk assessments to identify and manage risks.`;
        break;
      case 'ECC-3':
        controlName = `Security Monitoring ${i}`;
        controlDescription = `Implement continuous monitoring of security events and incidents.`;
        break;
      case 'ECC-4':
        controlName = `Access Control ${i}`;
        controlDescription = `Implement strong access control mechanisms for all systems and data.`;
        break;
      case 'ECC-5':
        controlName = `Vendor Management ${i}`;
        controlDescription = `Establish processes for assessing and managing third-party cybersecurity risks.`;
        break;
      default:
        controlName = `Control ${i}`;
        controlDescription = `Generic control description`;
    }
    
    controls.push({
      domainId: domain.id,
      name: controlName,
      code: `${domain.code}.${i}`,
      description: controlDescription,
      implementationGuidance: 'Follow industry best practices and organizational policies.',
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    });
  }
  
  return controls;
}

seedFrameworks();