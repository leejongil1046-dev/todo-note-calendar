import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchNationalHolidays, HolidayItem } from "./api/holidays";

export type HolidayMap = Record<string, HolidayItem>;

export async function getHolidayMapForYear(
  year: number,
  serviceKey: string,
): Promise<HolidayMap> {
  const cacheKey = `holidays:${year}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached) as HolidayMap;
  }

  const allMonths: HolidayItem[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthItems = await fetchNationalHolidays(year, m, serviceKey);
    allMonths.push(...monthItems);
  }

  const map: HolidayMap = {};
  for (const h of allMonths) {
    map[h.date] = h;
  }

  await AsyncStorage.setItem(cacheKey, JSON.stringify(map));
  return map;
}
