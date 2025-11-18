import { Router } from "express";
import { storage } from "../storage";
import { 
  predictComplianceRisks, 
  generateRemediationPlan, 
  analyzeControlGaps 
} from "../utils/openai";

const router = Router();

/**
 * Generate a risk prediction for a specific assessment
 */
router.get("/api/risk-prediction/assessment/:assessmentId", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { assessmentId } = req.params;
    const assessmentIdNum = parseInt(assessmentId);
    
    // Get the assessment
    const assessment = await storage.getAssessmentById(assessmentIdNum);
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    // Get assessment results
    const assessmentResults = await storage.getAssessmentResultsByAssessmentId(assessmentIdNum);
    
    // Get company info for additional context
    const companyInfo = await storage.getCompanyInfo();
    
    // Generate risk prediction
    const riskAnalysis = await predictComplianceRisks(
      { assessment, results: assessmentResults },
      companyInfo
    );
    
    // Return the risk analysis
    res.json(riskAnalysis);
  } catch (error) {
    next(error);
  }
});

/**
 * Generate a remediation plan for identified risks in an assessment
 */
router.get("/api/risk-prediction/remediation/:assessmentId", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { assessmentId } = req.params;
    const assessmentIdNum = parseInt(assessmentId);
    
    // Get the assessment
    const assessment = await storage.getAssessmentById(assessmentIdNum);
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    // Get assessment results
    const assessmentResults = await storage.getAssessmentResultsByAssessmentId(assessmentIdNum);
    
    // Get relevant controls for the assessment
    const frameworkControls = [];
    if (assessment.frameworkId) {
      const framework = await storage.getFrameworkById(assessment.frameworkId);
      if (framework) {
        const domains = await storage.getDomainsByFrameworkId(framework.id);
        for (const domain of domains) {
          const subdomains = await storage.getSubdomainsByDomainId(domain.id);
          for (const subdomain of subdomains) {
            const controls = await storage.getControlsBySubdomainId(subdomain.id);
            frameworkControls.push(...controls.map(control => ({
              ...control,
              domain: domain.name,
              subdomain: subdomain.name
            })));
          }
        }
      }
    }
    
    // Get company info for additional context
    const companyInfo = await storage.getCompanyInfo();
    
    // First, get a risk analysis
    const riskAnalysis = await predictComplianceRisks(
      { assessment, results: assessmentResults, controls: frameworkControls },
      companyInfo
    );
    
    // Then generate a remediation plan based on the identified risks
    const remediationPlan = await generateRemediationPlan(
      riskAnalysis.domain_risks || [],
      { company: companyInfo, assessment }
    );
    
    // Return the remediation plan
    res.json(remediationPlan);
  } catch (error) {
    next(error);
  }
});

/**
 * Analyze implementation gaps for a specific control
 */
router.get("/api/risk-prediction/control-gaps/:controlId", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { controlId } = req.params;
    const controlIdNum = parseInt(controlId);
    
    // Get the control
    const control = await storage.getControlById(controlIdNum);
    if (!control) {
      return res.status(404).json({ error: "Control not found" });
    }
    
    // Get the subdomain
    const subdomain = await storage.getSubdomainById(control.subdomainId);
    
    // Get the domain
    const domain = subdomain ? await storage.getDomainById(subdomain.domainId) : null;
    
    // Get all assessment results for this control
    const allAssessments = await storage.getAssessmentsByCompanyId(1); // Using company ID 1 as a placeholder
    
    let implementationDetails: {
      currentStatus: string;
      implementationHistory: Array<{
        date: string;
        status: string;
        comments: string | null;
        evidence: string | null;
      }>;
      evidenceSubmitted: string[];
    } = {
      currentStatus: "Unknown",
      implementationHistory: [],
      evidenceSubmitted: [],
    };
    
    for (const assessment of allAssessments) {
      const results = await storage.getAssessmentResultsByAssessmentId(assessment.id);
      const controlResult = results.find(result => result.controlId === controlIdNum);
      
      if (controlResult) {
        implementationDetails.implementationHistory.push({
          date: assessment.startDate,
          status: controlResult.status,
          comments: controlResult.comments,
          evidence: controlResult.evidence
        });
        
        if (controlResult.evidence) {
          implementationDetails.evidenceSubmitted.push(controlResult.evidence);
        }
        
        // Use the most recent status
        implementationDetails.currentStatus = controlResult.status;
      }
    }
    
    // Get remediation tasks for this control
    const allTasksForAssessments = [];
    for (const assessment of allAssessments) {
      const tasks = await storage.getRemediationTasksByAssessmentId(assessment.id);
      const controlTasks = tasks.filter(task => task.controlId === controlIdNum);
      allTasksForAssessments.push(...controlTasks);
    }
    
    // Analyze gaps
    const gapAnalysis = await analyzeControlGaps(
      { 
        control, 
        domain: domain?.name,
        subdomain: subdomain?.name 
      },
      { 
        implementationDetails,
        remediationTasks: allTasksForAssessments 
      }
    );
    
    // Return the gap analysis
    res.json(gapAnalysis);
  } catch (error) {
    next(error);
  }
});

/**
 * Get overall compliance risk dashboard
 */
router.get("/api/risk-prediction/dashboard", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Get company info
    const companyInfo = await storage.getCompanyInfo();
    
    // Get all completed assessments
    const allAssessments = await storage.getAssessmentsByCompanyId(companyInfo?.id || 1);
    const completedAssessments = allAssessments.filter(assessment => assessment.status === 'completed');
    
    if (completedAssessments.length === 0) {
      return res.json({
        risk_score: 0,
        compliance_level: "Unknown",
        message: "No completed assessments found. Complete an assessment to generate risk prediction."
      });
    }
    
    // Get the most recent assessment
    const sortedAssessments = completedAssessments.sort(
      (a, b) => new Date(b.completionDate || "").getTime() - new Date(a.completionDate || "").getTime()
    );
    const latestAssessment = sortedAssessments[0];
    
    // Get assessment results
    const assessmentResults = await storage.getAssessmentResultsByAssessmentId(latestAssessment.id);
    
    // Generate risk prediction for the latest assessment
    const riskAnalysis = await predictComplianceRisks(
      { assessment: latestAssessment, results: assessmentResults },
      companyInfo
    );
    
    // Calculate aggregate risk metrics
    const riskScore = riskAnalysis.overall_risk_score || 0;
    let complianceLevel = "Unknown";
    
    if (riskScore >= 0 && riskScore <= 3) {
      complianceLevel = "High";
    } else if (riskScore > 3 && riskScore <= 6) {
      complianceLevel = "Medium";
    } else {
      complianceLevel = "Low";
    }
    
    // Build dashboard data
    const dashboardData = {
      risk_score: riskScore,
      compliance_level: complianceLevel,
      last_assessment_date: latestAssessment.completionDate,
      assessment_name: latestAssessment.name,
      framework: latestAssessment.frameworkId,
      high_risk_domains: riskAnalysis.domain_risks
        ? riskAnalysis.domain_risks
            .filter((domain: any) => domain.risk_level === "High")
            .map((domain: any) => domain.domain)
        : [],
      critical_recommendations: riskAnalysis.recommendations
        ? riskAnalysis.recommendations.slice(0, 3)
        : [],
      risk_summary: riskAnalysis.risk_summary,
      domain_risk_distribution: calculateDomainRiskDistribution(riskAnalysis.domain_risks),
      historical_data: calculateHistoricalRiskTrend(sortedAssessments)
    };
    
    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
});

/**
 * Calculates the distribution of risk levels across domains
 */
function calculateDomainRiskDistribution(domainRisks: any[] = []) {
  const distribution = {
    high: 0,
    medium: 0,
    low: 0
  };
  
  if (!domainRisks || !domainRisks.length) {
    return distribution;
  }
  
  domainRisks.forEach((domain: any) => {
    if (domain.risk_level === "High") {
      distribution.high += 1;
    } else if (domain.risk_level === "Medium") {
      distribution.medium += 1;
    } else {
      distribution.low += 1; 
    }
  });
  
  return distribution;
}

/**
 * Calculates historical risk trend based on completed assessments
 */
function calculateHistoricalRiskTrend(assessments: any[] = []) {
  return assessments.map(assessment => ({
    date: assessment.completionDate,
    score: assessment.score || 0,
    status: assessment.status
  }));
}

export default router;