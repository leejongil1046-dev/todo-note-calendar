const BASE_URL =
  "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService";

export type HolidayItem = {
  date: string; // "2019-03-01"
  name: string; // "삼일절"
  isHoliday: boolean; // Y/N
};

type RawItem = {
  locdate: number; // 20190301
  dateName: string;
  isHoliday: "Y" | "N";
  dateKind: string; // "01" 등
};

function formatLocdate(locdate: number): string {
  const s = String(locdate);
  const year = s.slice(0, 4);
  const month = s.slice(4, 6);
  const day = s.slice(6, 8);
  return `${year}-${month}-${day}`;
}

export async function fetchNationalHolidays(
  year: number,
  month: number,
  serviceKey: string,
): Promise<HolidayItem[]> {
  const params = new URLSearchParams({
    solYear: String(year),
    solMonth: month.toString().padStart(2, "0"),
    ServiceKey: serviceKey,
    _type: "json",
    numOfRows: "50",
  });

  const url = `${BASE_URL}/getHoliDeInfo?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  const items: RawItem[] = json.response?.body?.items?.item
    ? Array.isArray(json.response.body.items.item)
      ? json.response.body.items.item
      : [json.response.body.items.item]
    : [];

  return items.map((item) => ({
    date: formatLocdate(item.locdate),
    name: item.dateName,
    isHoliday: item.isHoliday === "Y",
  }));
}
