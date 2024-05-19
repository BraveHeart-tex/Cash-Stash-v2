/**
 * Converts an ISO datetime string to a MySQL datetime string.
 * @param isoDatetimeString - The ISO datetime string to convert.
 * @returns The MySQL datetime string.
 */
export function convertISOToMysqlDatetime(isoDatetimeString: string): string {
  const isoDatetime = new Date(isoDatetimeString);

  const year = isoDatetime.getFullYear();
  const month = ("0" + (isoDatetime.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ("0" + isoDatetime.getDate()).slice(-2);
  const hours = ("0" + isoDatetime.getHours()).slice(-2);
  const minutes = ("0" + isoDatetime.getMinutes()).slice(-2);
  const seconds = ("0" + isoDatetime.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
