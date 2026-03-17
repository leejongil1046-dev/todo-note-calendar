import { holidaySeedByYear } from "@/data/holiday-seed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchNationalHolidays, HolidayItem } from "./api/holidays";

export type HolidayMap = Record<string, HolidayItem>;

const getCacheKey = (year: number) => `holidays:${year}`;

const SEED_VERSION = "v1"; // seed 바꿀 때마다 v2, v3 처럼만 변경
const getSeedVersionKey = (year: number) => `holidays-seed-version:${year}`;

export async function ensureHolidaySeed(years: number[]) {
  for (const year of years) {
    const key = getCacheKey(year);
    const versionKey = getSeedVersionKey(year);
    const [cached, storedVersion] = await Promise.all([
      AsyncStorage.getItem(key),
      AsyncStorage.getItem(versionKey),
    ]);
    if (!cached || storedVersion !== SEED_VERSION) {
      const seed = holidaySeedByYear[year];
      if (seed) {
        await AsyncStorage.setItem(key, JSON.stringify(seed));
        await AsyncStorage.setItem(versionKey, SEED_VERSION);
      }
    }
  }
}

export async function getHolidayMapForYears(
  years: number[],
): Promise<HolidayMap> {
  const merged: HolidayMap = {};

  for (const year of years) {
    const key = getCacheKey(year);
    const cached = await AsyncStorage.getItem(key);
    if (!cached) continue;

    const parsed = JSON.parse(cached) as HolidayMap;
    Object.assign(merged, parsed);
  }

  return merged;
}

export async function buildHolidaySeedYear(
  year: number,
  serviceKey: string,
): Promise<HolidayMap> {
  const allMonths: HolidayItem[] = [];

  for (let m = 1; m <= 12; m++) {
    const monthItems = await fetchNationalHolidays(year, m, serviceKey);
    allMonths.push(...monthItems);
  }

  const map: HolidayMap = {};
  for (const item of allMonths) {
    map[item.date] = item;
  }

  return map;
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
