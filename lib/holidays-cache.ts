import { fetchNationalHolidays, HolidayItem } from "./api/holidays";

export type HolidayMap = Record<string, HolidayItem>;

export async function buildHolidaySeedYear(
  year: number,
  serviceKey: string,
): Promise<HolidayMap> {
  const holidayMap: HolidayMap = {};

  for (let month = 1; month <= 12; month += 1) {
    const monthItems = await fetchNationalHolidays(year, month, serviceKey);

    for (const item of monthItems) {
      holidayMap[item.date] = item;
    }
  }

  return holidayMap;
}

export async function buildHolidaySeedByYears(
  years: number[],
  serviceKey: string,
): Promise<Record<number, HolidayMap>> {
  const result: Record<number, HolidayMap> = {};

  for (const year of years) {
    result[year] = await buildHolidaySeedYear(year, serviceKey);
  }

  return result;
}
