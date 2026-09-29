export declare const PROJECT_INTAKE_TEMPLATE_SCHEMA_VERSION = 1;
export declare const PROJECT_INTAKE_REPORT_SCHEMA_VERSION = 1;
export declare const MAX_PROJECT_INTAKE_ITEMS = 2000;
export declare const MAX_PROJECT_INTAKE_RULES = 64;
export declare const MAX_PROJECT_INTAKE_FINDINGS = 12200;
export declare const FRAME_RATE_CANONICAL_SNAP_TOLERANCE_FPS = 0.005;
export declare const FRAME_RATE_MATCH_TOLERANCE_FPS = 0.05;
export type IntakeCertainty = "observed" | "unavailable" | "not_checked";
export type IntakeSeverity = "error" | "warning" | "info";
export type IntakeStatus = "ready" | "needs_attention" | "incomplete";
export interface RequiredBinRule {
    name: string;
    parentPath?: string;
}
export interface ApprovedPathPrefix {
    id: string;
    prefix: string;
}
export interface OrganizationMatchRule {
    filenamePrefixes?: string[];
    extensions?: string[];
}
export interface OrganizationRule {
    id: string;
    destinationBinName: string;
    match: OrganizationMatchRule;
    colorIndex?: number;
}
export interface FacilityIntakeTemplate {
    schemaVersion: typeof PROJECT_INTAKE_TEMPLATE_SCHEMA_VERSION;
    id: string;
    version: string;
    requiredBins: RequiredBinRule[];
    allowedExtensions: string[];
    allowedFrameRates: number[];
    proxyPolicy: "ignore" | "report_missing" | "require";
    approvedPathPrefixes: ApprovedPathPrefix[];
    requiredEvidence: Array<"extension" | "frame_rate" | "offline" | "proxy" | "path">;
    organizationRules: OrganizationRule[];
}
export interface ProjectIntakeItem {
    id: string;
    name: string;
    type: "clip" | "bin" | "sequence" | "other";
    parentId?: string;
    treePath?: string;
    mediaPath?: string;
    offline?: boolean;
    hasProxy?: boolean;
    frameRate?: number;
    /** Derived during snapshot validation; never accepted as caller authority. */
    frameRateUnsupported?: true;
}
export interface ProjectIntakeSnapshot {
    project: {
        id: string;
        name?: string;
    };
    items: ProjectIntakeItem[];
    truncated: boolean;
    unavailableEvidence: string[];
}
export interface ProjectIntakeFinding {
    code: string;
    severity: IntakeSeverity;
    certainty: IntakeCertainty;
    itemId?: string;
    expected?: Record<string, unknown>;
    observed?: Record<string, unknown>;
}
export interface ProjectIntakeOrganizationPlan {
    applied: false;
    planDigest: string;
    proposedBins: Array<{
        name: string;
        exists: boolean;
        createIfApproved: boolean;
    }>;
    proposedMoves: Array<{
        projectItemId: string;
        expectedParentId?: string;
        destinationBinName: string;
        ruleId: string;
        colorIndex?: number;
    }>;
}
export interface ProjectIntakeReport {
    schemaVersion: typeof PROJECT_INTAKE_REPORT_SCHEMA_VERSION;
    applied: false;
    status: IntakeStatus;
    project: {
        id: string;
        name?: string;
        revision: string;
    };
    template: {
        id: string;
        version: string;
        digest: string;
    };
    capture: {
        itemCount: number;
        truncated: boolean;
        pathDisclosure: "redacted" | "requested";
    };
    findings: ProjectIntakeFinding[];
    organizationPlan: ProjectIntakeOrganizationPlan;
    limitations: string[];
}
export interface BuildProjectIntakeOptions {
    includePaths?: boolean;
}
export declare function validateFacilityIntakeTemplate(value: unknown): FacilityIntakeTemplate;
export declare function validateProjectIntakeSnapshot(value: unknown): ProjectIntakeSnapshot;
export declare function buildProjectIntakeReport(snapshotValue: unknown, templateValue: unknown, options?: BuildProjectIntakeOptions): ProjectIntakeReport;
