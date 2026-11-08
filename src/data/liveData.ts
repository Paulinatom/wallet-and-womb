/**
 * LIVE DATA SERVICE - ewene.go.ke / Rapid Response Initiative (RRI)
 * 
 * NOTE FOR USER:
 * To connect to your real feed (Google Sheet published as CSV/JSON or direct API):
 * Replace the body of getLiveData() with your fetch request.
 * Ensure the returned array contains objects matching this exact shape:
 * { "county": string, "date": "YYYY-MM-DD", "maternal_deaths": number, "newborn_deaths": number }
 */

export interface LiveDailyRecord {
  county: string;
  date: string;
  maternal_deaths: number;
  newborn_deaths: number;
}

// The 26 High-Burden Priority Counties
export const LIVE_PRIORITY_COUNTIES = [
  'Migori',
  'Garissa',
  'Mombasa',
  'Kisumu',
  'Kisii',
  'Kitui',
  'Nairobi',
  'Machakos',
  'Nakuru',
  'Trans Nzoia',
  'Bungoma',
  'Homa Bay',
  'Kwale',
  'Siaya',
  'Kilifi',
  'Kakamega',
  'Kajiado',
  'Uasin Gishu',
  'Meru',
  'Samburu',
  'Elgeyo-Marakwet',
  'West Pokot',
  'Tana River',
  'Mandera',
  'Turkana',
  'Wajir'
];

/**
 * Deterministic pseudo-random generator so mock counts are stable per day/county
 */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate 30 days of mock surveillance records for the 26 priority counties
 * ending on 2026-11-05
 */
function generateMockLiveData(): LiveDailyRecord[] {
  const records: LiveDailyRecord[] = [];
  const baseDate = new Date('2026-11-05T00:00:00Z');

  LIVE_PRIORITY_COUNTIES.forEach((county, countyIdx) => {
    // Some counties have higher clinical throughput / burden
    const burdenFactor = [
      'Nairobi', 'Nakuru', 'Mombasa', 'Kisumu', 'Kakamega', 'Kilifi', 'Bungoma', 'Homa Bay'
    ].includes(county) ? 1.6 : 1.0;

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const d = new Date(baseDate);
      d.setUTCDate(baseDate.getUTCDate() - dayOffset);
      const dateStr = d.toISOString().split('T')[0];

      const seed = countyIdx * 100 + dayOffset * 7;
      const rMaternal = pseudoRandom(seed);
      const rNewborn = pseudoRandom(seed + 13);

      // Maternal deaths: 0 (85% of days), 1 (12%), 2 (3% in high burden)
      let maternalDeaths = 0;
      if (rMaternal > 0.96 && burdenFactor > 1.2) {
        maternalDeaths = 2;
      } else if (rMaternal > (0.87 / burdenFactor)) {
        maternalDeaths = 1;
      }

      // Newborn deaths: 0 (45%), 1 (35%), 2 (15%), 3 (5%)
      let newbornDeaths = 0;
      if (rNewborn > (0.92 / burdenFactor)) {
        newbornDeaths = 3;
      } else if (rNewborn > (0.75 / burdenFactor)) {
        newbornDeaths = 2;
      } else if (rNewborn > (0.45 / burdenFactor)) {
        newbornDeaths = 1;
      }

      records.push({
        county,
        date: dateStr,
        maternal_deaths: maternalDeaths,
        newborn_deaths: newbornDeaths,
      });
    }
  });

  return records;
}

// In-memory cache of mock data
const MOCK_LIVE_DATA: LiveDailyRecord[] = generateMockLiveData();

/**
 * getLiveData()
 * 
 * Returns daily maternal and newborn deaths from ewene.go.ke/rri.
 * Currently returns mock data for the 26 priority counties for the last 30 days.
 * 
 * To connect to real Google Sheets / API:
 * Replace with:
 *   const res = await fetch('YOUR_PUBLISHED_SHEET_CSV_OR_JSON_URL');
 *   return parseYourSheetData(await res.text());
 */
export async function getLiveData(): Promise<LiveDailyRecord[]> {
  // Simulate minimal async tick for realistic promise resolution
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_LIVE_DATA]);
    }, 60);
  });
}
