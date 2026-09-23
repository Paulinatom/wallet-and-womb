export type CountyStatus = 'on-track' | 'lagging';

export type LeakageRisk = 'Low' | 'Medium' | 'High' | 'Critical';

export type KenyaRegion = 
  | 'North Eastern'
  | 'Coast'
  | 'Western'
  | 'Nyanza'
  | 'Rift Valley'
  | 'Central'
  | 'Eastern'
  | 'Nairobi';

export interface MaternalProject {
  id: string;
  name: string;
  category: 'Infrastructure' | 'Equipment' | 'Subsidies' | 'Commodities' | 'Emergency Transport';
  allocatedKES: number; // in Millions KES
  spentKES: number; // in Millions KES
  status: 'Completed' | 'In Progress' | 'Stalled' | 'Audit Flagged';
  facility: string;
  contractor: string;
  flagNotes?: string;
}

export interface CountyHealthIndicators {
  mmr: number; // Maternal Mortality Ratio per 100,000 live births
  neonatalMortality: number; // per 1,000 live births
  skilledBirthAttendance: number; // percentage
  anc4Visits: number; // 4+ ANC visits percentage
  facilityDeliveryRate: number; // percentage
  emergencyObstetricReadiness: number; // percentage
  activeMidwivesPer10k: number;
}

export interface CountyHealthData {
  id: string;
  code: number;
  name: string;
  region: KenyaRegion;
  status: CountyStatus; // 'on-track' (green) or 'lagging' (red)
  statusReason: string;
  capital: string;
  population: string;
  
  // Budget accountability (in Millions KES)
  promisedBudgetKES: number; // Budget allocation
  deliveredBudgetKES: number; // Actual healthcare project spending disbursed
  absorptionRate: number; // Delivered / Promised %
  pendingDisbursementKES: number;
  unaccountedFundsKES: number;
  leakageRisk: LeakageRisk;
  auditorGeneralFlag: boolean;
  cobReportQuarter: string; // Controller of Budget reference
  
  // Health Outcomes
  indicators: CountyHealthIndicators;
  
  // Projects
  keyProjects: MaternalProject[];
  
  // Journalism & Editorial Toolkit
  investigativeAngle: string;
  editorHeadline: string;
  swahiliBrief: string;
  whistleblowerAlertsCount: number;
  keySources: {
    cecHealth: string;
    contactNote: string;
  };
  
  // Map coordinates (normalized SVG coordinate for Kenya map rendering)
  mapCoord: {
    x: number;
    y: number;
    svgPathD: string;
  };
}

export interface SecureTipSubmission {
  id: string;
  countyId: string;
  countyName: string;
  facility: string;
  category: 'Ghost Maternity Ward' | 'Medicine Stockout' | 'Equipment Tampering' | 'Fund Diversion' | 'Unofficial Fees';
  incidentDate: string;
  description: string;
  evidenceFilesCount: number;
  urgency: 'Standard' | 'Urgent' | 'Breaking Lead';
  verificationHash: string;
  submittedAt: string;
  status: 'Verified' | 'Pending Review' | 'Under Investigation';
}

export interface StoryPitch {
  id: string;
  county: string;
  tag: 'Budget Leakage' | 'Health Disparity' | 'Success Story' | 'Audit Red Flag';
  headline: string;
  hook: string;
  keyDataPoints: string[];
  suggestedDesk: 'Investigative' | 'Special Projects' | 'Health Beat' | 'Data Desk';
  urgency: 'Immediate' | 'Feature Pitch' | 'Weekend Read';
}
