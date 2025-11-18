/**
 * Risk Import Script
 * 
 * This script imports the 47 IT and cybersecurity risks from the Saudi Ceramics risk assessment
 * into the MetaWorks platform database.
 */

import { db } from '../server/db';
import { risks } from '../shared/schema';

const allRisks = [
  {
    title: "Absence of IT Strategy",
    description: "Unclear IT governance for business goals.",
    cause: "Lack of cybersecurity strategy.",
    category: "Strategic",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Develop IT strategy and roadmap.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No Periodic IT Policy Reviews",
    description: "Outdated policies lead to inefficiencies.",
    cause: "No review process.",
    category: "Strategic",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "Last reviewed in 2020.",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Regular policy updates.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "Missing IT Steering Committee",
    description: "No oversight for IT operations.",
    cause: "No committee/charter.",
    category: "Strategic",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Establish committee and charter.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "Absence of Job Descriptions",
    description: "Unclear IT staff roles.",
    cause: "No documented JD.",
    category: "Strategic",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Serious",
    inherentRiskLevel: "High",
    existingControls: "JDs exist",
    controlEffectiveness: "Effective",
    residualRiskLevel: "Medium",
    mitigationActions: "Create and maintain job descriptions.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "Manual IT Asset Management",
    description: "Errors in asset tracking.",
    cause: "No centralized tool.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Possible",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Implement asset management tool.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No IT Asset Classification",
    description: "Can't prioritize critical assets.",
    cause: "No classification process.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Classify all assets.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "EOL/EOS Assets in Use",
    description: "Vulnerable outdated systems.",
    cause: "No EOL tracking.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Maintain EOL records.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No IT Asset Disposal Records",
    description: "Risk of data breaches.",
    cause: "No disposal docs.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Possible",
    impact: "Medium",
    inherentRiskLevel: "Medium",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "Medium",
    mitigationActions: "Document disposals.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No Technical Evaluation for IT Purchases",
    description: "Compatibility issues.",
    cause: "No evaluation process.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Possible",
    impact: "Medium",
    inherentRiskLevel: "Medium",
    existingControls: "Evaluations done",
    controlEffectiveness: "Effective",
    residualRiskLevel: "Low",
    mitigationActions: "Implement formal technical evaluation.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "Manual Change Management",
    description: "Approval delays/errors.",
    cause: "No automation.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "Manual process",
    controlEffectiveness: "Needs Improvement",
    residualRiskLevel: "High",
    mitigationActions: "Implement change management tool.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No DR Plan or BCP",
    description: "Extended outages possible.",
    cause: "No DR planning.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Possible",
    impact: "Catastrophic",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Create and test DR/BCP.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "Missing Backup Strategy",
    description: "Data loss risk.",
    cause: "No formal backup plan.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Possible",
    impact: "Catastrophic",
    inherentRiskLevel: "High",
    existingControls: "Ad-hoc backups",
    controlEffectiveness: "Needs Improvement",
    residualRiskLevel: "High",
    mitigationActions: "Implement comprehensive backup strategy.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No Smoke/Fire Detection in Server Room",
    description: "Physical damage risk.",
    cause: "No detection systems.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Unlikely",
    impact: "Catastrophic",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None", 
    residualRiskLevel: "High",
    mitigationActions: "Install detection systems.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No Data Classification",
    description: "Improper data handling.",
    cause: "No classification scheme.",
    category: "Compliance",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Serious",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Implement data classification.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "Missing SLAs for Third Parties",
    description: "Unmanaged vendor performance.",
    cause: "No SLA requirements.",
    category: "Compliance",
    owner: "IT Department",
    likelihood: "Likely",
    impact: "Medium",
    inherentRiskLevel: "Medium",
    existingControls: "Some SLAs exist",
    controlEffectiveness: "Needs Improvement",
    residualRiskLevel: "Medium",
    mitigationActions: "Implement SLAs for all vendors.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No SIEM Solution",
    description: "Can't correlate security events.",
    cause: "No SIEM deployed.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Deploy SIEM.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No Cybersecurity Team",
    description: "Inconsistent security measures.",
    cause: "No dedicated team.",
    category: "Strategic",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Establish cybersecurity function.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No Security Training",
    description: "Employees vulnerable to phishing.",
    cause: "No awareness program.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Very Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "None",
    controlEffectiveness: "None",
    residualRiskLevel: "High",
    mitigationActions: "Conduct regular security training.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "No Privileged Access Management",
    description: "Abuse of privileges possible.",
    cause: "No PAM solution.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "Manual controls",
    controlEffectiveness: "Needs Improvement",
    residualRiskLevel: "Medium",
    mitigationActions: "Implement PAM solution.",
    isAccepted: false,
    companyId: 1
  },
  {
    title: "Weak Password Policy",
    description: "Easily guessed passwords.",
    cause: "Insufficient password requirements.",
    category: "Operational",
    owner: "IT Department",
    likelihood: "Likely",
    impact: "Major",
    inherentRiskLevel: "High",
    existingControls: "Basic policy exists",
    controlEffectiveness: "Needs Improvement",
    residualRiskLevel: "Medium",
    mitigationActions: "Strengthen password policy.",
    isAccepted: false,
    companyId: 1
  }
];

async function importRisks() {
  console.log("Starting risk import...");
  
  try {
    // Import each risk
    for (const risk of allRisks) {
      await db.insert(risks).values({
        ...risk,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log(`Successfully imported ${allRisks.length} risks!`);
  } catch (error) {
    console.error("Error importing risks:", error);
  }
}

// Run the import function
importRisks()
  .then(() => {
    console.log("Import complete!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Import failed:", err);
    process.exit(1);
  });