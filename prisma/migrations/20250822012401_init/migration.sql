-- CreateEnum
CREATE TYPE "public"."LicenseType" AS ENUM ('COMMERCIAL', 'FEDERAL', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "public"."OrganizationSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'AUDIT_MANAGER', 'AUDITOR', 'REVIEWER', 'VIEWER', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "public"."ModuleCategory" AS ENUM ('COMPLIANCE', 'RISK_ASSESSMENT', 'CONTROL_TESTING', 'VULNERABILITY', 'FINANCIAL', 'OPERATIONAL', 'IT_SECURITY', 'DATA_PRIVACY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."AuditFramework" AS ENUM ('FISMA', 'SOC1', 'SOC2_TYPE1', 'SOC2_TYPE2', 'ISO_27001', 'ISO_27017', 'ISO_27018', 'HIPAA', 'PCI_DSS', 'NIST_CSF', 'NIST_800_53', 'NIST_800_171', 'GDPR', 'CCPA', 'FEDRAMP', 'CMMC', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ProjectRole" AS ENUM ('PROJECT_LEAD', 'SENIOR_AUDITOR', 'TEAM_MEMBER', 'REVIEWER', 'OBSERVER');

-- CreateEnum
CREATE TYPE "public"."RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."EnvironmentStatus" AS ENUM ('PROVISIONING', 'RUNNING', 'STOPPED', 'ERROR', 'TERMINATED');

-- CreateEnum
CREATE TYPE "public"."WorkpaperType" AS ENUM ('PLANNING', 'RISK_ASSESSMENT', 'CONTROL_MATRIX', 'TESTING_PROCEDURE', 'EVIDENCE', 'OBSERVATION', 'CONCLUSION', 'MANAGEMENT_REP');

-- CreateEnum
CREATE TYPE "public"."WorkpaperStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'FINAL', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ConfidentialityLevel" AS ENUM ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'NEEDS_REVISION');

-- CreateEnum
CREATE TYPE "public"."FindingSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."FindingStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'REMEDIATED', 'ACCEPTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."UsageMetric" AS ENUM ('COMPUTE_HOURS', 'STORAGE_GB', 'API_CALLS', 'USERS', 'PROJECTS', 'WORKPAPERS');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "primaryContactEmail" TEXT NOT NULL,
    "primaryContactName" TEXT NOT NULL,
    "primaryContactPhone" TEXT,
    "billingEmail" TEXT,
    "billingContactName" TEXT,
    "industry" TEXT,
    "size" "public"."OrganizationSize",
    "headquarters" TEXT,
    "regulatoryBodies" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT,
    "department" TEXT,
    "clerkUserId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "role" "public"."UserRole" NOT NULL DEFAULT 'AUDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "certifications" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "licenseType" "public"."LicenseType" NOT NULL,
    "customPlan" JSONB,
    "status" "public"."AccountStatus" NOT NULL DEFAULT 'TRIAL',
    "trialEndsAt" TIMESTAMP(3),
    "billingCycle" "public"."BillingCycle" NOT NULL DEFAULT 'ANNUAL',
    "nextBillingDate" TIMESTAMP(3),
    "contractEndDate" TIMESTAMP(3),
    "maxUsers" INTEGER,
    "maxProjects" INTEGER,
    "maxStorage" BIGINT,
    "features" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."modules" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."ModuleCategory" NOT NULL,
    "gitRepo" TEXT,
    "framework" "public"."AuditFramework" NOT NULL,
    "frameworkVersion" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBeta" BOOLEAN NOT NULL DEFAULT false,
    "containerImage" TEXT NOT NULL,
    "resourceRequirements" JSONB NOT NULL,
    "environmentVars" JSONB NOT NULL DEFAULT '{}',
    "apiEndpoint" TEXT,
    "webhookUrl" TEXT,
    "backendUrl" TEXT,
    "minLicenseType" "public"."LicenseType" NOT NULL,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "methodology" TEXT NOT NULL,
    "estimatedHours" INTEGER,
    "dependsOn" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "deprecatedAt" TIMESTAMP(3),

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account_module_access" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,

    CONSTRAINT "account_module_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."module_access" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "canExecute" BOOLEAN NOT NULL DEFAULT true,
    "canConfigure" BOOLEAN NOT NULL DEFAULT false,
    "canViewResults" BOOLEAN NOT NULL DEFAULT true,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,

    CONSTRAINT "module_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_projects" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "auditPeriod" JSONB NOT NULL,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "plannedStartDate" TIMESTAMP(3),
    "plannedEndDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "riskLevel" "public"."RiskLevel",
    "materialityThreshold" DOUBLE PRECISION,
    "environmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_project_members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."ProjectRole" NOT NULL DEFAULT 'TEAM_MEMBER',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "audit_project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."module_environments" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "status" "public"."EnvironmentStatus" NOT NULL DEFAULT 'PROVISIONING',
    "allocatedCpu" INTEGER NOT NULL,
    "allocatedMemory" INTEGER NOT NULL,
    "allocatedStorage" BIGINT NOT NULL,
    "internalUrl" TEXT,
    "publicUrl" TEXT,
    "isolationLevel" TEXT NOT NULL DEFAULT 'strict',
    "secretsRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "stoppedAt" TIMESTAMP(3),
    "destroyedAt" TIMESTAMP(3),
    "lastHealthCheck" TIMESTAMP(3),

    CONSTRAINT "module_environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workpapers" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "attachments" TEXT[],
    "type" "public"."WorkpaperType" NOT NULL,
    "confidentiality" "public"."ConfidentialityLevel" NOT NULL DEFAULT 'INTERNAL',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "generatedByModule" BOOLEAN NOT NULL DEFAULT false,
    "moduleVersion" TEXT,
    "generationMetadata" JSONB,
    "status" "public"."WorkpaperStatus" NOT NULL DEFAULT 'DRAFT',
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "workpapers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workpaper_reviews" (
    "id" TEXT NOT NULL,
    "workpaperId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "status" "public"."ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "workpaper_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."findings" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "workpaperId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "public"."FindingSeverity" NOT NULL,
    "category" TEXT NOT NULL,
    "likelihood" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "recommendation" TEXT NOT NULL,
    "managementResponse" TEXT,
    "status" "public"."FindingStatus" NOT NULL DEFAULT 'OPEN',
    "targetDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workpaper_templates" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "sampleData" JSONB,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workpaper_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usage_records" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "metric" "public"."UsageMetric" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "rate" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoices" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "lineItems" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_domain_key" ON "public"."organizations"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkUserId_key" ON "public"."users"("clerkUserId");

-- CreateIndex
CREATE INDEX "users_organizationId_idx" ON "public"."users"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_accountNumber_key" ON "public"."accounts"("accountNumber");

-- CreateIndex
CREATE INDEX "accounts_organizationId_idx" ON "public"."accounts"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "modules_code_key" ON "public"."modules"("code");

-- CreateIndex
CREATE INDEX "modules_framework_idx" ON "public"."modules"("framework");

-- CreateIndex
CREATE INDEX "modules_category_idx" ON "public"."modules"("category");

-- CreateIndex
CREATE UNIQUE INDEX "account_module_access_accountId_moduleId_key" ON "public"."account_module_access"("accountId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "module_access_userId_moduleId_key" ON "public"."module_access"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "audit_projects_environmentId_key" ON "public"."audit_projects"("environmentId");

-- CreateIndex
CREATE INDEX "audit_projects_organizationId_idx" ON "public"."audit_projects"("organizationId");

-- CreateIndex
CREATE INDEX "audit_projects_status_idx" ON "public"."audit_projects"("status");

-- CreateIndex
CREATE UNIQUE INDEX "audit_project_members_projectId_userId_key" ON "public"."audit_project_members"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "module_environments_environmentId_key" ON "public"."module_environments"("environmentId");

-- CreateIndex
CREATE INDEX "workpapers_projectId_idx" ON "public"."workpapers"("projectId");

-- CreateIndex
CREATE INDEX "workpapers_type_idx" ON "public"."workpapers"("type");

-- CreateIndex
CREATE UNIQUE INDEX "workpapers_projectId_referenceNumber_key" ON "public"."workpapers"("projectId", "referenceNumber");

-- CreateIndex
CREATE INDEX "findings_projectId_idx" ON "public"."findings"("projectId");

-- CreateIndex
CREATE INDEX "findings_severity_idx" ON "public"."findings"("severity");

-- CreateIndex
CREATE INDEX "usage_records_accountId_periodStart_idx" ON "public"."usage_records"("accountId", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "public"."invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "public"."activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_entityType_entityId_idx" ON "public"."activity_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "activity_logs_timestamp_idx" ON "public"."activity_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account_module_access" ADD CONSTRAINT "account_module_access_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account_module_access" ADD CONSTRAINT "account_module_access_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."module_access" ADD CONSTRAINT "module_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."module_access" ADD CONSTRAINT "module_access_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_projects" ADD CONSTRAINT "audit_projects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_projects" ADD CONSTRAINT "audit_projects_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_projects" ADD CONSTRAINT "audit_projects_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_projects" ADD CONSTRAINT "audit_projects_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "public"."module_environments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_project_members" ADD CONSTRAINT "audit_project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."audit_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_project_members" ADD CONSTRAINT "audit_project_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."module_environments" ADD CONSTRAINT "module_environments_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workpapers" ADD CONSTRAINT "workpapers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."audit_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workpapers" ADD CONSTRAINT "workpapers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workpapers" ADD CONSTRAINT "workpapers_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workpaper_reviews" ADD CONSTRAINT "workpaper_reviews_workpaperId_fkey" FOREIGN KEY ("workpaperId") REFERENCES "public"."workpapers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workpaper_reviews" ADD CONSTRAINT "workpaper_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."findings" ADD CONSTRAINT "findings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."audit_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."findings" ADD CONSTRAINT "findings_workpaperId_fkey" FOREIGN KEY ("workpaperId") REFERENCES "public"."workpapers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workpaper_templates" ADD CONSTRAINT "workpaper_templates_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usage_records" ADD CONSTRAINT "usage_records_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
