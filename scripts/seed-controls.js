import { db } from '../server/db.js';
import { controls } from '../shared/schema.js';

async function seedControls() {
  try {
    // Check if db is available
    if (!db) {
      console.error('Database not available');
      return;
    }

    // First check if controls already exist
    const existingControls = await db.select().from(controls);
    
    if (existingControls.length > 0) {
      console.log(`${existingControls.length} controls already exist. Skipping seeding.`);
      return;
    }

    // Insert controls for domain 1 (Cybersecurity Governance)
    const controlsToInsert = [
      {
        domainId: 1,
        name: 'Cybersecurity Strategy',
        controlId: 'ECC-1-1-1',
        description: 'The organization shall establish a cybersecurity strategy aligned with its business objectives and the national cybersecurity strategy.',
        guidance: 'Develop and document a cybersecurity strategy that includes specific goals, objectives, and priorities.',
        maturityLevel: 2,
        implementationGuide: 'Strategy should be approved by senior management and reviewed annually.'
      },
      {
        domainId: 1,
        name: 'Cybersecurity Policies',
        controlId: 'ECC-1-1-2',
        description: 'The organization shall establish and document cybersecurity policies, standards, and procedures.',
        guidance: 'Develop and maintain a comprehensive set of cybersecurity policies covering all relevant areas.',
        maturityLevel: 1,
        implementationGuide: 'Policies should be approved by management and reviewed at least annually.'
      },
      {
        domainId: 1,
        name: 'Cybersecurity Roles and Responsibilities',
        controlId: 'ECC-1-2-1',
        description: 'The organization shall define and document cybersecurity roles and responsibilities.',
        guidance: 'Clearly define the roles and responsibilities for cybersecurity throughout the organization.',
        maturityLevel: 1,
        implementationGuide: 'Roles should include a CISO or equivalent position with appropriate authority.'
      },
      {
        domainId: 1,
        name: 'Risk Management',
        controlId: 'ECC-1-3-1',
        description: 'The organization shall establish and implement a cybersecurity risk management program.',
        guidance: 'Develop and implement a risk management framework that identifies, assesses, and mitigates cybersecurity risks.',
        maturityLevel: 2,
        implementationGuide: 'Risk assessments should be conducted at least annually and when significant changes occur.'
      },
      {
        domainId: 1,
        name: 'Compliance Management',
        controlId: 'ECC-1-4-1',
        description: 'The organization shall establish and implement a cybersecurity compliance management program.',
        guidance: 'Identify and comply with applicable cybersecurity laws, regulations, and standards.',
        maturityLevel: 2,
        implementationGuide: 'Conduct regular compliance assessments and address any gaps.'
      }
    ];

    console.log('Inserting controls...');
    for (const control of controlsToInsert) {
      console.log(`Inserting control: ${control.name}`);
      
      // Insert the control
      await db.insert(controls).values({
        domainId: control.domainId,
        name: control.name,
        description: control.description,
        controlId: control.controlId,
        guidance: control.guidance,
        maturityLevel: control.maturityLevel,
        implementationGuide: control.implementationGuide,
        referenceLinks: null,
        order: 0  // Default order
      });
    }

    console.log('Seeding controls completed successfully!');
  } catch (error) {
    console.error('Error seeding controls:', error);
  } finally {
    process.exit(0);
  }
}

seedControls();