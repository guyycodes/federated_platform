// Seed script for Federated Audit Platform
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create sample organizations
  const org1 = await prisma.organization.create({
    data: {
      name: 'TechCorp Industries',
      domain: 'techcorp.com',
      primaryContactEmail: 'admin@techcorp.com',
      primaryContactName: 'John Smith',
      primaryContactPhone: '+1-555-0100',
      industry: 'Technology',
      size: 'LARGE',
      headquarters: 'San Francisco, CA',
      regulatoryBodies: ['SOC2', 'ISO_27001', 'GDPR'],
      onboardingComplete: true,
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      name: 'Federal Agency X',
      domain: 'agencyx.gov',
      primaryContactEmail: 'security@agencyx.gov',
      primaryContactName: 'Sarah Johnson',
      primaryContactPhone: '+1-555-0200',
      industry: 'Government',
      size: 'ENTERPRISE',
      headquarters: 'Washington, DC',
      regulatoryBodies: ['FISMA', 'NIST_800_53', 'FEDRAMP'],
      onboardingComplete: true,
    },
  });

  // Create users
  const user1 = await prisma.user.create({
    data: {
      organizationId: org1.id,
      email: 'john.smith@techcorp.com',
      firstName: 'John',
      lastName: 'Smith',
      title: 'Chief Compliance Officer',
      department: 'Compliance',
      role: 'ADMIN',
      certifications: ['CISA', 'CISSP'],
    },
  });

  const user2 = await prisma.user.create({
    data: {
      organizationId: org1.id,
      email: 'jane.doe@techcorp.com',
      firstName: 'Jane',
      lastName: 'Doe',
      title: 'Senior Auditor',
      department: 'Internal Audit',
      role: 'AUDITOR',
      certifications: ['CPA', 'CISA'],
    },
  });

  const user3 = await prisma.user.create({
    data: {
      organizationId: org2.id,
      email: 'sarah.johnson@agencyx.gov',
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'Information Security Manager',
      department: 'IT Security',
      role: 'ADMIN',
      certifications: ['CISSP', 'CISM'],
    },
  });

  // Create accounts with different plan tiers
  const commercialAccount = await prisma.account.create({
    data: {
      organizationId: org1.id,
      accountName: 'Main Account',
      planTier: 'COMMERCIAL',
      status: 'ACTIVE',
      billingCycle: 'ANNUAL',
      maxUsers: 50,
      maxProjects: 20,
      features: {
        soc2: true,
        iso27001: true,
        customReporting: false,
        apiAccess: false,
      },
    },
  });

  const federalAccount = await prisma.account.create({
    data: {
      organizationId: org2.id,
      accountName: 'Federal Division',
      planTier: 'FEDERAL',
      status: 'ACTIVE',
      billingCycle: 'ANNUAL',
      features: {
        fisma: true,
        fedramp: true,
        nist80053: true,
        customReporting: true,
        apiAccess: true,
        dedicatedSupport: true,
      },
    },
  });

  // Create modules
  const fismaModule = await prisma.module.create({
    data: {
      code: 'FISMA_AUDIT',
      name: 'FISMA Compliance Audit',
      description: 'Comprehensive Federal Information Security Management Act (FISMA) compliance audit module with automated control testing and continuous monitoring capabilities.',
      category: 'COMPLIANCE',
      framework: 'FISMA',
      frameworkVersion: 'NIST 800-53 Rev 5',
      version: '2.1.0',
      containerImage: 'audit-platform/fisma-module:2.1.0',
      resourceRequirements: {
        cpu: 2000,
        memory: 4096,
        storage: 10737418240, // 10GB
      },
      minPlanTier: 'FEDERAL',
      requiresApproval: true,
      methodology: 'Automated control assessment using NIST 800-53A guidelines with continuous monitoring integration.',
      estimatedHours: 120,
      dependsOn: [],
    },
  });

  const soc2Module = await prisma.module.create({
    data: {
      code: 'SOC2_TYPE2',
      name: 'SOC 2 Type II Audit',
      description: 'Service Organization Control 2 Type II audit module for assessing security, availability, processing integrity, confidentiality, and privacy controls.',
      category: 'COMPLIANCE',
      framework: 'SOC2_TYPE2',
      version: '1.5.0',
      containerImage: 'audit-platform/soc2-module:1.5.0',
      resourceRequirements: {
        cpu: 1500,
        memory: 3072,
        storage: 5368709120, // 5GB
      },
      minPlanTier: 'COMMERCIAL',
      requiresApproval: false,
      methodology: 'Trust Services Criteria-based assessment with automated evidence collection and control testing.',
      estimatedHours: 80,
      dependsOn: [],
    },
  });

  const riskModule = await prisma.module.create({
    data: {
      code: 'RISK_ASSESSMENT',
      name: 'Enterprise Risk Assessment',
      description: 'AI-powered risk assessment module that identifies, analyzes, and prioritizes organizational risks across IT, operational, and compliance domains.',
      category: 'RISK_ASSESSMENT',
      framework: 'NIST_CSF',
      version: '3.0.0',
      containerImage: 'audit-platform/risk-assessment:3.0.0',
      resourceRequirements: {
        cpu: 2500,
        memory: 8192,
        storage: 21474836480, // 20GB
      },
      minPlanTier: 'COMMERCIAL',
      requiresApproval: false,
      methodology: 'AI-driven risk identification and scoring using NIST Cybersecurity Framework with machine learning models.',
      estimatedHours: 40,
      dependsOn: [],
    },
  });

  // Create module access
  await prisma.accountModuleAccess.createMany({
    data: [
      {
        accountId: commercialAccount.id,
        moduleId: soc2Module.id,
        configuration: {
          trustServicesCriteria: ['Security', 'Availability'],
          auditPeriod: 12,
        },
      },
      {
        accountId: commercialAccount.id,
        moduleId: riskModule.id,
        configuration: {
          riskCategories: ['IT', 'Operational', 'Compliance'],
          assessmentFrequency: 'Quarterly',
        },
      },
      {
        accountId: federalAccount.id,
        moduleId: fismaModule.id,
        configuration: {
          controlBaseline: 'High',
          continuousMonitoring: true,
          pocamIntegration: true,
        },
      },
      {
        accountId: federalAccount.id,
        moduleId: riskModule.id,
        configuration: {
          riskCategories: ['Cybersecurity', 'Supply Chain', 'Insider Threat'],
          assessmentFrequency: 'Monthly',
        },
      },
    ],
  });

  // Create user module access
  await prisma.moduleAccess.createMany({
    data: [
      {
        userId: user1.id,
        moduleId: soc2Module.id,
        canExecute: true,
        canConfigure: true,
        canViewResults: true,
      },
      {
        userId: user1.id,
        moduleId: riskModule.id,
        canExecute: true,
        canConfigure: true,
        canViewResults: true,
      },
      {
        userId: user2.id,
        moduleId: soc2Module.id,
        canExecute: true,
        canConfigure: false,
        canViewResults: true,
      },
      {
        userId: user3.id,
        moduleId: fismaModule.id,
        canExecute: true,
        canConfigure: true,
        canViewResults: true,
      },
    ],
  });

  // Create sample audit projects
  const soc2Project = await prisma.auditProject.create({
    data: {
      organizationId: org1.id,
      accountId: commercialAccount.id,
      moduleId: soc2Module.id,
      name: 'SOC 2 Type II Audit - FY2024',
      description: 'Annual SOC 2 Type II audit covering security and availability trust services criteria',
      auditPeriod: {
        start: '2024-01-01',
        end: '2024-12-31',
      },
      status: 'IN_PROGRESS',
      progress: 35,
      plannedStartDate: new Date('2024-01-15'),
      plannedEndDate: new Date('2024-03-15'),
      actualStartDate: new Date('2024-01-20'),
      riskLevel: 'MEDIUM',
      materialityThreshold: 1000000,
    },
  });

  const fismaProject = await prisma.auditProject.create({
    data: {
      organizationId: org2.id,
      accountId: federalAccount.id,
      moduleId: fismaModule.id,
      name: 'Annual FISMA Compliance Audit',
      description: 'FY2024 FISMA compliance audit with continuous monitoring assessment',
      auditPeriod: {
        start: '2023-10-01',
        end: '2024-09-30',
      },
      status: 'PLANNING',
      progress: 10,
      plannedStartDate: new Date('2024-02-01'),
      plannedEndDate: new Date('2024-04-30'),
      riskLevel: 'HIGH',
    },
  });

  // Add project members
  await prisma.auditProjectMember.createMany({
    data: [
      {
        projectId: soc2Project.id,
        userId: user1.id,
        role: 'PROJECT_LEAD',
      },
      {
        projectId: soc2Project.id,
        userId: user2.id,
        role: 'SENIOR_AUDITOR',
      },
      {
        projectId: fismaProject.id,
        userId: user3.id,
        role: 'PROJECT_LEAD',
      },
    ],
  });

  // Create workpaper templates
  await prisma.workpaperTemplate.createMany({
    data: [
      {
        moduleId: soc2Module.id,
        name: 'Control Test Workpaper',
        description: 'Standard template for documenting control testing procedures and results',
        category: 'Control Testing',
        version: '1.0.0',
        structure: {
          sections: [
            {
              id: 'control_description',
              title: 'Control Description',
              type: 'text',
              required: true,
            },
            {
              id: 'test_procedures',
              title: 'Test Procedures',
              type: 'list',
              required: true,
            },
            {
              id: 'sample_selection',
              title: 'Sample Selection',
              type: 'table',
              required: true,
            },
            {
              id: 'test_results',
              title: 'Test Results',
              type: 'rich_text',
              required: true,
            },
            {
              id: 'exceptions',
              title: 'Exceptions Noted',
              type: 'list',
              required: false,
            },
          ],
        },
      },
      {
        moduleId: fismaModule.id,
        name: 'Security Control Assessment',
        description: 'NIST 800-53A based security control assessment workpaper',
        category: 'Control Assessment',
        version: '2.0.0',
        structure: {
          sections: [
            {
              id: 'control_id',
              title: 'Control Identifier',
              type: 'text',
              required: true,
            },
            {
              id: 'control_baseline',
              title: 'Control Baseline',
              type: 'select',
              options: ['Low', 'Moderate', 'High'],
              required: true,
            },
            {
              id: 'implementation_status',
              title: 'Implementation Status',
              type: 'select',
              options: ['Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable'],
              required: true,
            },
            {
              id: 'assessment_methods',
              title: 'Assessment Methods',
              type: 'checklist',
              options: ['Examine', 'Interview', 'Test'],
              required: true,
            },
            {
              id: 'assessment_results',
              title: 'Assessment Results',
              type: 'rich_text',
              required: true,
            },
          ],
        },
      },
    ],
  });

  // Create sample workpapers
  const workpaper1 = await prisma.workpaper.create({
    data: {
      projectId: soc2Project.id,
      organizationId: org1.id,
      referenceNumber: 'A-1',
      title: 'Access Control Policy Review',
      description: 'Review of organizational access control policies and procedures',
      type: 'TESTING_PROCEDURE',
      createdBy: user2.id,
      content: {
        control_description: 'Access to systems is restricted to authorized individuals',
        test_procedures: [
          'Obtain and review access control policy',
          'Interview IT security manager',
          'Review access provisioning procedures',
        ],
        test_results: 'Access control policy is documented and includes appropriate procedures for user provisioning and deprovisioning.',
      },
      status: 'IN_REVIEW',
      generatedByModule: false,
    },
  });

  // Create sample findings
  await prisma.finding.create({
    data: {
      projectId: soc2Project.id,
      workpaperId: workpaper1.id,
      title: 'Incomplete Access Reviews',
      description: 'Quarterly access reviews were not completed for Q3 2023 for privileged accounts',
      severity: 'MEDIUM',
      category: 'Control Deficiency',
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      recommendation: 'Implement automated quarterly access review reminders and establish escalation procedures for incomplete reviews.',
      status: 'OPEN',
      targetDate: new Date('2024-04-30'),
    },
  });

  // Create module environment
  await prisma.moduleEnvironment.create({
    data: {
      moduleId: soc2Module.id,
      environmentId: 'env-soc2-' + soc2Project.id,
      status: 'RUNNING',
      allocatedCpu: 1500,
      allocatedMemory: 3072,
      allocatedStorage: BigInt(5368709120),
      internalUrl: 'http://soc2-module.internal:8080',
      isolationLevel: 'strict',
      startedAt: new Date(),
    },
  });

  // Create usage records
  await prisma.usageRecord.createMany({
    data: [
      {
        accountId: commercialAccount.id,
        metric: 'COMPUTE_HOURS',
        quantity: 156.5,
        unit: 'hours',
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-01-31'),
        rate: 0.50,
        totalCost: 78.25,
      },
      {
        accountId: commercialAccount.id,
        metric: 'STORAGE_GB',
        quantity: 45.2,
        unit: 'GB',
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-01-31'),
        rate: 0.10,
        totalCost: 4.52,
      },
      {
        accountId: federalAccount.id,
        metric: 'API_CALLS',
        quantity: 125000,
        unit: 'calls',
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-01-31'),
        rate: 0.0001,
        totalCost: 12.50,
      },
    ],
  });

  // Create activity logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: user1.id,
        action: 'CREATE_PROJECT',
        entityType: 'PROJECT',
        entityId: soc2Project.id,
        metadata: {
          projectName: 'SOC 2 Type II Audit - FY2024',
          module: 'SOC2_TYPE2',
        },
        ipAddress: '192.168.1.100',
      },
      {
        userId: user2.id,
        action: 'GENERATE_WORKPAPER',
        entityType: 'WORKPAPER',
        entityId: workpaper1.id,
        metadata: {
          workpaperRef: 'A-1',
          projectId: soc2Project.id,
        },
        ipAddress: '192.168.1.101',
      },
      {
        userId: user3.id,
        action: 'LOGIN',
        entityType: 'USER',
        entityId: user3.id,
        metadata: {
          loginMethod: 'SSO',
        },
        ipAddress: '10.0.0.50',
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log(`Created ${2} organizations`);
  console.log(`Created ${3} users`);
  console.log(`Created ${2} accounts`);
  console.log(`Created ${3} modules`);
  console.log(`Created ${2} audit projects`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });