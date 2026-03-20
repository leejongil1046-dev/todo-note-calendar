import { holidaySeedByYear } from "@/data/holiday-seed";
import type { HolidayMap } from "@/lib/holidays-cache";

export const buildHolidayMapFromSeedYears = (years: number[]): HolidayMap => {
  return years.reduce<HolidayMap>((acc, year) => {
    return {
      ...acc,
      ...(holidaySeedByYear[year] ?? {}),
    };
  }, {});
};
