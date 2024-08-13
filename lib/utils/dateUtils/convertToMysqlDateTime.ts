export function convertToMysqlDateTime(ISOString: string): string {
  const ISODateTime = new Date(ISOString);

  const year = ISODateTime.getFullYear();
  const month = `0${ISODateTime.getMonth() + 1}`.slice(-2); // Months are zero-based
  const day = `0${ISODateTime.getDate()}`.slice(-2);
  const hours = `0${ISODateTime.getHours()}`.slice(-2);
  const minutes = `0${ISODateTime.getMinutes()}`.slice(-2);
  const seconds = `0${ISODateTime.getSeconds()}`.slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
