import { CountyHealthData, CountiesFinalData, CountyStatus } from '../types';
import { KENYA_ALL_GEO_PATHS } from './kenyaSvgPaths';
import rawData from './walletwomb_counties_FINAL.json';

export const COUNTIES_FINAL_DATA = rawData as unknown as CountiesFinalData;

// For any components importing COUNTIES_V2_DATA
export const COUNTIES_V2_DATA = COUNTIES_FINAL_DATA;

export const DEFAULT_YEAR = COUNTIES_FINAL_DATA.meta?.defaultYear || 'FY2023/24';
export const AVAILABLE_YEARS = COUNTIES_FINAL_DATA.meta?.years || [
  'FY2022/23',
  'FY2023/24',
  'FY2024/25',
  'FY2025/26',
];

// Function to hydrate 26 counties for a specific financial year
export function getCountiesForYear(selectedYear: string): CountyHealthData[] {
  return COUNTIES_FINAL_DATA.counties.map((raw) => {
    const geo = KENYA_ALL_GEO_PATHS[raw.name];
    const yearData = raw.years?.[selectedYear];

    let normalizedStatus: CountyStatus = yearData?.status || 'on-track';
    if (normalizedStatus === ('on_track' as any)) normalizedStatus = 'on-track';
    if (normalizedStatus === ('data_incomplete' as any)) normalizedStatus = 'data-incomplete';

    return {
      ...raw,
      status: normalizedStatus,
      promisedBudgetKES: yearData?.promised ?? null,
      deliveredBudgetKES: yearData?.delivered ?? null,
      absorptionRate: yearData?.absorption ?? null,
      pendingDisbursementKES: yearData?.pending ?? null,
      reportedActualNote: yearData?.reportedActualNote ?? null,
      editorHeadline: yearData?.editorHeadline || raw.editorHeadline || `${raw.name}: FY ${selectedYear}`,
      leads: yearData?.leads || [],
      investigativeAngle: yearData?.investigativeAngle || raw.investigativeAngle || null,
      survey: raw.survey,
      mapCoord: geo
        ? {
            x: geo.cx,
            y: geo.cy,
            svgPathD: geo.d,
          }
        : raw.mapCoord || {
            x: 150,
            y: 200,
            svgPathD: '',
          },
    };
  });
}

export const KENYA_26_COUNTIES: CountyHealthData[] = getCountiesForYear(DEFAULT_YEAR);
