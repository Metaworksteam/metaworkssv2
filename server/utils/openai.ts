import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// OpenAI client instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 * Predicts compliance risks based on assessment data
 * @param assessmentData The assessment data to analyze
 * @param companyInfo Optional company information for context
 * @returns Risk prediction analysis
 */
export async function predictComplianceRisks(
  assessmentData: any,
  companyInfo?: any
): Promise<any> {
  try {
    const prompt = generateRiskAnalysisPrompt(assessmentData, companyInfo);
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system", 
          content: "You are an expert in cybersecurity compliance risk analysis. Your task is to analyze compliance data and provide detailed risk predictions and recommendations based on identified gaps and patterns."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Error in risk prediction:", error);
    throw new Error(`Failed to predict compliance risks: ${error.message}`);
  }
}

/**
 * Generates an AI-powered remediation plan for identified risks
 * @param risks The identified risks to remediate
 * @param companyContext Information about the company for better recommendations
 * @returns Detailed remediation plan
 */
export async function generateRemediationPlan(
  risks: any[],
  companyContext?: any
): Promise<any> {
  try {
    const prompt = generateRemediationPrompt(risks, companyContext);
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system", 
          content: "You are an expert in cybersecurity remediation planning. Your task is to create detailed, actionable remediation plans for identified compliance risks."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Error generating remediation plan:", error);
    throw new Error(`Failed to generate remediation plan: ${error.message}`);
  }
}

/**
 * Analyzes a specific control with AI to determine implementation gaps
 * @param control The control to analyze
 * @param implementationData Current implementation details
 * @returns Gap analysis with recommendations
 */
export async function analyzeControlGaps(
  control: any,
  implementationData: any
): Promise<any> {
  try {
    const prompt = generateControlGapPrompt(control, implementationData);
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system", 
          content: "You are an expert in cybersecurity control implementation. Your task is to identify gaps in control implementations and provide actionable recommendations."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Error analyzing control gaps:", error);
    throw new Error(`Failed to analyze control gaps: ${error.message}`);
  }
}

// Helper functions to generate prompts

function generateRiskAnalysisPrompt(assessmentData: any, companyInfo?: any): string {
  let prompt = `Please analyze the following compliance assessment data and predict potential risks:\n\n`;
  
  // Add assessment data context
  prompt += `Assessment Data:\n${JSON.stringify(assessmentData, null, 2)}\n\n`;
  
  // Add company context if available
  if (companyInfo) {
    prompt += `Company Context:\n${JSON.stringify(companyInfo, null, 2)}\n\n`;
  }
  
  prompt += `For each domain or control with compliance gaps, predict the following in JSON format:
1. Risk likelihood (High/Medium/Low)
2. Potential impact (High/Medium/Low)
3. Overall risk rating
4. Potential consequences of non-compliance
5. Recommended priority level for remediation
6. Brief explanation of risk factors

Return the response in the following JSON structure:
{
  "overall_risk_score": number, // 1-10
  "risk_summary": "Summary text",
  "domain_risks": [
    {
      "domain": "Domain name",
      "risk_level": "High/Medium/Low",
      "impact": "High/Medium/Low",
      "priority": "Critical/High/Medium/Low",
      "explanation": "Explanation text",
      "potential_consequences": ["Consequence 1", "Consequence 2"],
      "control_risks": [
        {
          "control_id": "ID",
          "risk_level": "High/Medium/Low",
          "impact": "High/Medium/Low",
          "explanation": "Explanation text"
        }
      ]
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

  return prompt;
}

function generateRemediationPrompt(risks: any[], companyContext?: any): string {
  let prompt = `Please create a detailed remediation plan for the following compliance risks:\n\n`;
  
  // Add risks context
  prompt += `Identified Risks:\n${JSON.stringify(risks, null, 2)}\n\n`;
  
  // Add company context if available
  if (companyContext) {
    prompt += `Company Context:\n${JSON.stringify(companyContext, null, 2)}\n\n`;
  }
  
  prompt += `For each risk, provide the following in JSON format:
1. Step-by-step remediation actions
2. Estimated time for implementation
3. Required resources
4. Key stakeholders who should be involved
5. Potential challenges in implementation
6. Success metrics to verify remediation

Return the response in the following JSON structure:
{
  "remediation_summary": "Summary text",
  "risk_remediations": [
    {
      "risk_id": "ID or description",
      "priority": "Critical/High/Medium/Low",
      "steps": [
        {
          "step_number": 1,
          "description": "Step description",
          "estimated_time": "Time estimate",
          "required_resources": ["Resource 1", "Resource 2"],
          "stakeholders": ["Stakeholder 1", "Stakeholder 2"]
        }
      ],
      "challenges": ["Challenge 1", "Challenge 2"],
      "success_metrics": ["Metric 1", "Metric 2"]
    }
  ],
  "general_recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

  return prompt;
}

function generateControlGapPrompt(control: any, implementationData: any): string {
  let prompt = `Please analyze the following control implementation and identify gaps:\n\n`;
  
  // Add control context
  prompt += `Control Details:\n${JSON.stringify(control, null, 2)}\n\n`;
  
  // Add implementation data
  prompt += `Current Implementation:\n${JSON.stringify(implementationData, null, 2)}\n\n`;
  
  prompt += `Please identify gaps in the implementation compared to the control requirements and provide recommendations in JSON format:
1. Identified implementation gaps
2. Compliance impact of each gap
3. Recommended actions to close gaps
4. Implementation complexity
5. Estimated effort to remediate

Return the response in the following JSON structure:
{
  "control_id": "Control ID",
  "compliance_status": "Compliant/Partial/Non-compliant",
  "gap_analysis": {
    "identified_gaps": [
      {
        "gap_description": "Description",
        "compliance_impact": "High/Medium/Low",
        "remediation_action": "Action description",
        "complexity": "High/Medium/Low",
        "estimated_effort": "Effort estimate"
      }
    ]
  },
  "overall_recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

  return prompt;
}