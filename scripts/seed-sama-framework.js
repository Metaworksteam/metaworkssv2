#!/usr/bin/env node
import dotenv from 'dotenv';
import { db } from '../server/db.ts';
import { frameworks, domains, controls } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';

dotenv.config();

async function seedSAMAFramework() {
  try {
    console.log('Seeding SAMA framework domains and controls...');
    
    // First, find the SAMA framework ID
    const samaFrameworks = await db.select().from(frameworks).where(eq(frameworks.name, 'SAMA Cyber Security Framework'));
    
    if (samaFrameworks.length === 0) {
      console.log('SAMA framework not found. Make sure to run seed-frameworks.js first.');
      return;
    }
    
    const samaFramework = samaFrameworks[0];
    console.log(`Found SAMA framework with ID: ${samaFramework.id}`);
    
    // Check if SAMA domains already exist
    const existingSAMADomains = await db.select().from(domains).where(eq(domains.frameworkId, samaFramework.id));
    
    if (existingSAMADomains.length > 0) {
      console.log('SAMA domains already exist. Skipping seed.');
      return;
    }
    
    // SAMA Domains
    const samaDomains = [
      {
        frameworkId: samaFramework.id,
        name: 'Leadership and Governance',
        displayName: 'Leadership and Governance',
        description: 'Controls related to leadership commitment and governance structures',
        order: 1
      },
      {
        frameworkId: samaFramework.id,
        name: 'Risk Management',
        displayName: 'Risk Management',
        description: 'Controls related to cybersecurity risk management processes',
        order: 2
      },
      {
        frameworkId: samaFramework.id,
        name: 'Information Security',
        displayName: 'Information Security',
        description: 'Controls related to information security policies and procedures',
        order: 3
      },
      {
        frameworkId: samaFramework.id,
        name: 'Identity and Access Management',
        displayName: 'Identity and Access Management',
        description: 'Controls related to identity verification and access controls',
        order: 4
      },
      {
        frameworkId: samaFramework.id,
        name: 'Third-Party Security',
        displayName: 'Third-Party Security',
        description: 'Controls related to managing third-party security risks',
        order: 5
      },
      {
        frameworkId: samaFramework.id,
        name: 'Secure Development',
        displayName: 'Secure Development',
        description: 'Controls related to secure software development practices',
        order: 6
      },
      {
        frameworkId: samaFramework.id,
        name: 'Security Operations',
        displayName: 'Security Operations',
        description: 'Controls related to security monitoring and operations',
        order: 7
      }
    ];
    
    // Insert domains
    for (const domainData of samaDomains) {
      const [domain] = await db.insert(domains).values(domainData).returning();
      console.log(`Created domain: ${domain.displayName}`);
      
      // Generate controls for this domain
      const domainControls = generateSAMAControlsForDomain(domain);
      
      // Insert controls
      for (const controlData of domainControls) {
        await db.insert(controls).values(controlData);
      }
      
      console.log(`Added ${domainControls.length} controls to domain ${domain.displayName}`);
    }
    
    console.log('SAMA framework seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding SAMA framework:', error);
  } finally {
    process.exit(0);
  }
}

// Helper function to generate SAMA controls for a domain
function generateSAMAControlsForDomain(domain) {
  const controls = [];
  
  // Different controls based on domain
  switch (domain.name) {
    case 'Leadership and Governance':
      controls.push(
        createSAMAControl(domain.id, 'SAMA-LG-1', 'Cybersecurity Strategy', 'Develop and maintain a cybersecurity strategy aligned with business objectives', 'baseline'),
        createSAMAControl(domain.id, 'SAMA-LG-2', 'Security Organization', 'Establish a dedicated cybersecurity organization with clear roles and responsibilities', 'evolving'),
        createSAMAControl(domain.id, 'SAMA-LG-3', 'Policy Framework', 'Implement a comprehensive cybersecurity policy framework', 'established'),
        createSAMAControl(domain.id, 'SAMA-LG-4', 'Compliance Management', 'Establish processes to monitor and ensure compliance with regulatory requirements', 'predictable'),
        createSAMAControl(domain.id, 'SAMA-LG-5', 'Security Culture', 'Foster a security-aware culture through regular awareness and training programs', 'leading')
      );
      break;
      
    case 'Risk Management':
      controls.push(
        createSAMAControl(domain.id, 'SAMA-RM-1', 'Risk Assessment', 'Conduct regular risk assessments to identify and prioritize cybersecurity risks', 'baseline'),
        createSAMAControl(domain.id, 'SAMA-RM-2', 'Risk Treatment', 'Implement risk treatment plans to address identified risks', 'evolving'),
        createSAMAControl(domain.id, 'SAMA-RM-3', 'Risk Monitoring', 'Continuously monitor and report on cybersecurity risks', 'established'),
        createSAMAControl(domain.id, 'SAMA-RM-4', 'Asset Management', 'Maintain an inventory of information assets and their associated risks', 'predictable'),
        createSAMAControl(domain.id, 'SAMA-RM-5', 'Risk Integration', 'Integrate cybersecurity risk management with enterprise risk management', 'leading')
      );
      break;
      
    case 'Information Security':
      controls.push(
        createSAMAControl(domain.id, 'SAMA-IS-1', 'Information Classification', 'Classify information based on sensitivity and criticality', 'baseline'),
        createSAMAControl(domain.id, 'SAMA-IS-2', 'Data Protection', 'Implement controls to protect data in transit and at rest', 'evolving'),
        createSAMAControl(domain.id, 'SAMA-IS-3', 'Cryptography', 'Use appropriate cryptographic controls to protect sensitive information', 'established'),
        createSAMAControl(domain.id, 'SAMA-IS-4', 'Media Handling', 'Establish procedures for handling, storing, and disposing of media', 'predictable'),
        createSAMAControl(domain.id, 'SAMA-IS-5', 'Data Leakage Prevention', 'Implement DLP solutions to prevent unauthorized data disclosure', 'leading')
      );
      break;
      
    case 'Identity and Access Management':
      controls.push(
        createSAMAControl(domain.id, 'SAMA-IAM-1', 'User Access Management', 'Implement processes for user registration, provisioning, and de-provisioning', 'baseline'),
        createSAMAControl(domain.id, 'SAMA-IAM-2', 'Authentication', 'Enforce strong authentication mechanisms', 'evolving'),
        createSAMAControl(domain.id, 'SAMA-IAM-3', 'Privileged Access', 'Implement enhanced controls for privileged access management', 'established'),
        createSAMAControl(domain.id, 'SAMA-IAM-4', 'Access Reviews', 'Conduct regular access reviews to ensure appropriate access rights', 'predictable'),
        createSAMAControl(domain.id, 'SAMA-IAM-5', 'Identity Governance', 'Implement identity governance to automate and integrate IAM processes', 'leading')
      );
      break;
      
    case 'Third-Party Security':
      controls.push(
        createSAMAControl(domain.id, 'SAMA-TPS-1', 'Vendor Risk Assessment', 'Assess security risks associated with third-party service providers', 'baseline'),
        createSAMAControl(domain.id, 'SAMA-TPS-2', 'Contractual Requirements', 'Include security requirements in contracts with third parties', 'evolving'),
        createSAMAControl(domain.id, 'SAMA-TPS-3', 'Ongoing Monitoring', 'Regularly monitor third-party compliance with security requirements', 'established'),
        createSAMAControl(domain.id, 'SAMA-TPS-4', 'Service Level Agreements', 'Define security-related SLAs with third parties', 'predictable'),
        createSAMAControl(domain.id, 'SAMA-TPS-5', 'Integrated Risk Management', 'Integrate third-party risk management with enterprise risk processes', 'leading')
      );
      break;
      
    case 'Secure Development':
      controls.push(
        createSAMAControl(domain.id, 'SAMA-SD-1', 'Secure SDLC', 'Implement a secure software development lifecycle', 'baseline'),
        createSAMAControl(domain.id, 'SAMA-SD-2', 'Secure Coding', 'Establish secure coding standards and guidelines', 'evolving'),
        createSAMAControl(domain.id, 'SAMA-SD-3', 'Security Testing', 'Conduct regular security testing of applications', 'established'),
        createSAMAControl(domain.id, 'SAMA-SD-4', 'Vulnerability Management', 'Implement a vulnerability management program', 'predictable'),
        createSAMAControl(domain.id, 'SAMA-SD-5', 'DevSecOps', 'Integrate security into DevOps practices (DevSecOps)', 'leading')
      );
      break;
      
    case 'Security Operations':
      controls.push(
        createSAMAControl(domain.id, 'SAMA-SO-1', 'Security Monitoring', 'Implement security monitoring capabilities', 'baseline'),
        createSAMAControl(domain.id, 'SAMA-SO-2', 'Incident Response', 'Establish incident response procedures', 'evolving'),
        createSAMAControl(domain.id, 'SAMA-SO-3', 'Security Testing', 'Conduct regular security assessments and penetration testing', 'established'),
        createSAMAControl(domain.id, 'SAMA-SO-4', 'Threat Intelligence', 'Utilize threat intelligence to enhance security operations', 'predictable'),
        createSAMAControl(domain.id, 'SAMA-SO-5', 'Security Automation', 'Implement automation in security operations for efficiency and consistency', 'leading')
      );
      break;
  }
  
  return controls;
}

// Helper function to create a SAMA control with maturity levels
function createSAMAControl(domainId, controlId, name, description, maturityLevel) {
  // Map maturity level to numeric value
  const maturityMap = {
    'baseline': 1,
    'evolving': 2,
    'established': 3,
    'predictable': 4,
    'leading': 5
  };
  
  const maturityScore = maturityMap[maturityLevel] || 1;
  
  // Implementation guidance based on maturity level
  let implementationGuide = '';
  switch (maturityLevel) {
    case 'baseline':
      implementationGuide = 'Implement basic controls to meet minimum requirements. Focus on essential protection mechanisms.';
      break;
    case 'evolving':
      implementationGuide = 'Build upon baseline controls with more structured approach. Begin formalizing processes and procedures.';
      break;
    case 'established':
      implementationGuide = 'Implement comprehensive controls with formal, documented processes. Ensure consistent implementation across the organization.';
      break;
    case 'predictable':
      implementationGuide = 'Establish metrics to measure control effectiveness. Use data to drive continuous improvement.';
      break;
    case 'leading':
      implementationGuide = 'Implement innovative approaches and industry-leading practices. Automate and integrate controls where possible.';
      break;
  }
  
  return {
    domainId,
    controlId,
    name,
    description,
    guidance: `This control requires a ${maturityLevel} maturity level of implementation.`,
    maturityLevel: maturityScore,
    referenceLinks: 'https://sama.gov.sa/cybersecurity',
    implementationGuide: implementationGuide,
    frameworkSpecific: {
      samaMaturityLevel: maturityLevel,
      samaMaturityDescription: getSAMAMaturityDescription(maturityLevel),
      assessmentCriteria: getSAMAAssessmentCriteria(maturityLevel)
    }
  };
}

// Helper function to get maturity level description
function getSAMAMaturityDescription(maturityLevel) {
  switch (maturityLevel) {
    case 'baseline':
      return 'Basic controls are in place but may be ad-hoc and reactive';
    case 'evolving':
      return 'Controls are documented and evolving but not fully consistent';
    case 'established':
      return 'Controls are well-defined, documented and consistently implemented';
    case 'predictable':
      return 'Controls are measured and predictable with quantitative management';
    case 'leading':
      return 'Controls are optimized with continuous improvement and innovation';
    default:
      return 'Unknown maturity level';
  }
}

// Helper function to get assessment criteria for each maturity level
function getSAMAAssessmentCriteria(maturityLevel) {
  switch (maturityLevel) {
    case 'baseline':
      return [
        'Basic documentation exists',
        'Manual processes are defined',
        'Essential controls are implemented'
      ];
    case 'evolving':
      return [
        'Processes are documented but may vary across the organization',
        'More comprehensive controls are implemented',
        'Some training is conducted',
        'Basic metrics are collected'
      ];
    case 'established':
      return [
        'Standardized processes are implemented consistently',
        'Regular testing of controls occurs',
        'Formalized training program exists',
        'Regular reporting to management'
      ];
    case 'predictable':
      return [
        'Quantitative measurement of control effectiveness',
        'Data-driven improvement of controls',
        'Integration with risk management processes',
        'Regular independent assessment'
      ];
    case 'leading':
      return [
        'Automation of control monitoring and implementation',
        'Integration across organization and with external stakeholders',
        'Proactive approach to emerging threats',
        'Contributing to industry standards and best practices'
      ];
    default:
      return ['No criteria defined'];
  }
}

seedSAMAFramework();