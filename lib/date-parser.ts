/**
 * Parse a date string in various formats and return a Date object
 * Supported formats:
 * - DD/Mon/YYYY (e.g., 13/May/2026)
 * - MM/DD/YYYY (e.g., 05/13/2026)
 * - YYYY-MM-DD
 * - ISO 8601 (YYYY-MM-DDTHH:mm:ss)
 * Returns null if the string is empty or invalid
 */
export function parseFlexibleDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;

  // Month name to number mapping
  const monthMap: { [key: string]: number } = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  };

  // Try DD/Mon/YYYY format (e.g., 13/May/2026)
  const ddmonyyyyyMatch = dateString.match(/^(\d{1,2})\/([A-Za-z]+)\/(\d{4})$/);
  if (ddmonyyyyyMatch) {
    const [, day, monthName, year] = ddmonyyyyyMatch;
    const monthNum = monthMap[monthName.toLowerCase()];
    if (monthNum !== undefined) {
      const date = new Date(parseInt(year), monthNum, parseInt(day));
      if (!isNaN(date.getTime())) return date;
    }
  }

  // Try MM/DD/YYYY format (e.g., 05/13/2026) - form input format
  const mmddyyyyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyyMatch) {
    const [, month, day, year] = mmddyyyyMatch;
    const monthNum = parseInt(month) - 1;
    if (monthNum >= 0 && monthNum <= 11) {
      const date = new Date(parseInt(year), monthNum, parseInt(day));
      if (!isNaN(date.getTime())) return date;
    }
  }

  // Try ISO format (YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) return date;
  }

  // Fallback: try native Date parser
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;

  return null;
}
