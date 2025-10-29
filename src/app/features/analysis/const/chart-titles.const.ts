export const CHART_TITLES: Record<number, string> = {
  1: 'Chart 1: Grades average over time for students with ID (for each student)',
  2: 'Chart 2: Students averages for students with chosen ID',
  3: 'Chart 3: Grades averages per subject'
};

export const ALL_CHART_NUMBERS = Object.keys(CHART_TITLES).map(Number);

export function getChartTitle(chartNumber: number): string {
  return CHART_TITLES[chartNumber] ?? '';
}