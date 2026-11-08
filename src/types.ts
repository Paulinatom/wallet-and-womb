export type CountyStatus = 'on-track' | 'lagging' | 'data-incomplete' | 'data_incomplete' | 'partial';

export type MapLayerType = 
  | 'budget-status'
  | 'facility-delivery'
  | 'skilled-provider'
  | 'anc4-plus';

export interface CountyStoryLead {
  type: string;
  headline: string;
  detail: string;
  angle: string;
  question?: string;
}

export interface CountyYearData {
  status: CountyStatus;
  promised: number | null;
  delivered: number | null;
  absorption: number | null;
  pending: number | null;
  reportedActualNote?: string;
  editorHeadline: string;
  leads: CountyStoryLead[];
  investigativeAngle?: string;
}

export interface YearSummaryLead {
  county: string;
  type: string;
  headline: string;
  detail: string;
  angle: string;
  question?: string;
}

export interface YearSummaryItem {
  reliability: string;
  note: string;
  counts: {
    'on-track': number;
    lagging: number;
    'data-incomplete': number;
    partial: number;
  };
  totalPromisedAllCounties: number;
  promisedReportingCounties?: number;
  deliveredReportingCounties?: number;
  absorption?: number;
  pending?: number;
  countiesIncluded?: number;
  topLeads: YearSummaryLead[];
  combinedLeadCount?: number;
}

export interface CountySurveyData {
  source: string;
  period: string;
  anc4Plus: number;
  facilityDelivery: number;
  skilledBirthAttendance: number;
  sampleBirths: number;
  smallSample: boolean;
  nationalAnc4Plus: number;
  nationalFacilityDelivery: number;
  nationalSkilledBirthAttendance: number;
  belowNational: string[];
}

export interface CountiesFinalMetadata {
  units: string;
  scope: string;
  source: string;
  statusRule: string;
  defaultYear: string;
  years: string[];
  disclaimer: string;
  surveyNote: string;
  nationalMMR: {
    value: number;
    per: string;
    ci: [number, number];
    source: string;
  };
  nationalSurvey: {
    anc4Plus: number;
    facilityDelivery: number;
    skilledBirthAttendance: number;
  };
}

export interface CountiesFinalData {
  meta: CountiesFinalMetadata;
  yearSummary: Record<string, YearSummaryItem>;
  counties: CountyHealthData[];
}

export type KenyaRegion = 
  | 'North Eastern'
  | 'Coast'
  | 'Western'
  | 'Nyanza'
  | 'Rift Valley'
  | 'Central'
  | 'Eastern'
  | 'Nairobi'
  | string;

export interface HealthYearRecord {
  q4_revised_estimate?: number;
  q4_actual?: number;
  absorption?: number | null;
  recurrent_est?: number;
  recurrent_actual?: number;
  development_est?: number;
  development_actual?: number;
  status?: string;
  q1_approved?: number;
  note?: string;
}

export interface OSRYearRecord {
  target?: number;
  actual?: number;
}

export interface FIFYearRecord {
  target?: number;
  actual?: number;
}

export interface SHIFRecord {
  private_total_jul25_apr26?: number;
  gok_total_jul25_apr26?: number;
  [key: string]: number | undefined;
}

export interface PHCRecord {
  level2?: number;
  level3?: number;
  level4?: number;
  total_jul25_mar26?: number;
  [key: string]: number | undefined;
}

export interface CountyDataFlag {
  severity: 'High' | 'Medium' | 'Low' | string;
  flag: string;
  metric: string;
  fy: string;
  detail: string;
}

export interface CountyHealthData {
  id: string;
  code: number;
  name: string;
  region: KenyaRegion;
  status: CountyStatus;
  statusReason?: string | null;
  capital?: string | null;
  population?: string | null;
  
  // County Health Budget accountability (in Millions KES)
  promisedBudgetKES: number | null; // Approved budget allocation
  deliveredBudgetKES: number | null; // Actual expenditure
  absorptionRate: number | null; // Delivered / Promised %
  pendingDisbursementKES: number | null;
  reportedActualNote?: string | null;
  unaccountedFundsKES?: number | null;
  cobReportQuarter?: string | null;
  dataNote?: string | null;
  defaultYear?: string;
  years: Record<string, CountyYearData>;
  leads?: CountyStoryLead[];
  
  // Survey baseline layer (Mini DHS 2025-26)
  survey: CountySurveyData;
  
  // Multi-Year Controller of Budget Health Datasets
  health?: Record<string, HealthYearRecord> | null;
  osr?: Record<string, OSRYearRecord> | null;
  fif?: Record<string, FIFYearRecord> | null;
  shif?: SHIFRecord | null;
  phc?: PHCRecord | null;
  dataFlags?: CountyDataFlag[] | null;
  
  // Editorial angles and notes from dataset
  investigativeAngle?: string | null;
  editorHeadline?: string | null;
  
  // Normalized SVG coordinate for Kenya map rendering
  mapCoord?: {
    x: number;
    y: number;
    svgPathD: string;
  } | null;
}

export interface SecureTipSubmission {
  id: string;
  countyId: string;
  countyName: string;
  facility: string;
  category: 'Medicine Stockout' | 'Equipment Tampering' | 'Fund Diversion' | 'Unofficial Fees' | 'Unreported Spending';
  incidentDate: string;
  description: string;
  evidenceFilesCount: number;
  urgency: 'Standard' | 'Urgent' | 'Breaking Lead';
  verificationHash: string;
  submittedAt: string;
  status: 'Verified' | 'Pending Review' | 'Under Investigation';
}
