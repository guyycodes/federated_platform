// Audit Service Pillars
export const serviceItems = [
  {
    title: 'Internal Audit Domain',
    subtitle: 'Comprehensive internal control testing',
    description: 'Autonomous testing of internal controls, risk assessments, and compliance frameworks across Federal, Commercial, and International standards.',
    color: '#3B82F6', // Blue color for Internal Audit
    icon: 'assessment',
    modules: [
      {
        id: 'commercial-internal',
        title: 'Commercial Module',
        description: 'SOX §404, HIPAA, PCI DSS v4.0, ISO 27001:2022, and GDPR compliance',
        icon: 'business',
        color: '#8B5CF6', // Purple
        features: [
          'Automated Audit Work Program (AWP) Generator',
          'Automated PBC List Generation + Evidence Collection',
          'Autonomous Inquiry Walkthrough & Test of Design (TOD)',
          'Autonomous Population Sampling & Test of Effectiveness (TOE)',
          'Intelligent Automated Workpaper Generation',
          'AI-Powered Audit Report Generator'
        ],
        addOnFeatures: [
          'Automated SOP and Policy Development Wizards',
          'Automated Network Diagram Generator',
          'Automated Corrective Action Plan (CAP) with Jira/ServiceNow Sync',
          'Control Enhancement Suggestions & Gap Analysis'
        ],
        frameworks: ['SOX §404', 'HIPAA', 'PCI DSS v4.0', 'ISO 27001:2022', 'GDPR']
      },
      {
        id: 'federal-internal',
        title: 'Federal Module',
        description: 'FISMA, FISCAM, FFMIA, OMB A-123, FedRAMP, and NIST 800-53 compliance',
        icon: 'shield',
        color: '#3B82F6', // Blue
        features: [
          'Automated AWP Generator mapped to FISCAM/FEDRAMP/FISMA/NIST/OMB A123',
          'Automated PBC List Generation + Evidence Collection',
          'Autonomous Inquiry Walkthrough & TOD/TOE Processing',
          'Automated NFR Generator for Early Risk Exposure',
          'AI-Supported Evidence Collection and Workpapers'
        ],
        addOnFeatures: [
          'Automated SSP, SAR, and ATO Package Generators',
          'Automated POA&M Builder + Continuous Monitoring',
          'OSCAL-compliant Export Packages',
          'Control Enhancement Suggestions & Gap Analysis'
        ],
        frameworks: ['FISMA', 'FISCAM', 'FFMIA', 'OMB A-123', 'FedRAMP', 'NIST 800-53']
      },
      {
        id: 'international-internal',
        title: 'International Module',
        description: 'Coming Soon - ISO 27001, GDPR, and ISO 22301 compliance',
        icon: 'language',
        color: '#10B981', // Emerald
        features: [
          'ISO 27001 Compliance (Coming Soon)',
          'GDPR Data Protection (Coming Soon)',
          'ISO 22301 Business Continuity (Coming Soon)',
          'Regional Compliance Standards (Coming Soon)',
          'Multi-jurisdiction Reporting (Coming Soon)'
        ],
        frameworks: ['ISO 27001', 'GDPR', 'ISO 22301'],
        comingSoon: true
      }
    ]
  },
  {
    title: 'External Audit Domain',
    subtitle: 'AI-first preparation with auditor-as-reviewer workflow',
    description: 'AI-first preparation with auditor-as-reviewer workflow. Performs scoping, testing, and writing - auditors simply review with 60-80% time reduction.',
    color: '#8B5CF6', // Purple color for External Audit
    icon: 'verified',
    modules: [
      {
        id: 'commercial-external',
        title: 'Commercial Module',
        description: 'SOX §404, HIPAA, PCI DSS v4.0, ISO 27001:2022, and GDPR audits',
        icon: 'business',
        color: '#8B5CF6', // Purple
        features: [
          'AI-Generated Audit Work Program (pre-mapped to standards)',
          'Automated PBC Fulfillment Review with flagged items',
          'Automated Walkthrough and Test of Design (TOD) Evaluation',
          'Autonomous Test of Effectiveness (TOE) Execution and Sampling',
          'AI-Assembled Workpapers with testing artifacts',
          'Audit Report Drafting with exceptions & remediation'
        ],
        addOnFeatures: [
          'Q&A Audit Log with timestamped interactions',
          'One-Click Export: PDF & XLSX Workpapers'
        ],
        frameworks: ['SOX §404', 'HIPAA', 'PCI DSS v4.0', 'ISO 27001:2022', 'GDPR']
      },
      {
        id: 'federal-external',
        title: 'Federal Module',
        description: 'FedRAMP, NIST 800-53, FISMA, FFMIA, OMB A-123, and FISCAM compliance',
        icon: 'shield',
        color: '#3B82F6', // Blue
        features: [
          'Automated AWP Generation with Federal Standard Auto-Mapping',
          'SSP, SAR, and POA&M Auto-Review',
          'Automated Evidence Request, Collection, and Review',
          'OSCAL-Compliant Workpaper/Audit Deliverable Exports',
          'Pre-Labeled Findings + Risk Severity Classification'
        ],
        addOnFeatures: [
          'Air-Gapped Review Access (Optional)',
          'View AI-generated findings & request clarification',
          'Automated final report export & digital signing'
        ],
        frameworks: ['FedRAMP', 'NIST 800-53', 'FISMA', 'FFMIA', 'OMB A-123', 'FISCAM']
      },
      {
        id: 'international-external',
        title: 'International Module',
        description: 'Coming Soon - IFRS Financial Audits and Regional Compliance',
        icon: 'language',
        color: '#64748B', // Slate
        features: [
          'IFRS Financial Audits (Coming Soon)',
          'Regional Compliance (EU, APAC) (Coming Soon)',
          'Cross-Border Regulations (Coming Soon)',
          'Multi-jurisdiction Reporting (Coming Soon)',
          'International Standards Integration (Coming Soon)'
        ],
        frameworks: ['IFRS', 'EU Compliance', 'APAC Standards'],
        comingSoon: true
      }
    ]
  }
]; 