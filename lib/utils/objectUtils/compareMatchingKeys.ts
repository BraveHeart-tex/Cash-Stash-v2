/**
 * Compares matching keys and their values recursively in two objects.
 * @param {Record<string, any>} obj1 - The first object to compare.
 * @param {Record<string, any>} obj2 - The second object to compare.
 * @returns {boolean} Returns true if all matching keys and their values are equal, otherwise false.
 */
export const compareMatchingKeys = (
  obj1: Record<string, any>,
  obj2: Record<string, any>
): boolean => {
  const matchingKeys = Object.keys(obj1).filter((key) => key in obj2);
  return matchingKeys.every((key: string) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (typeof value1 === "object" && typeof value2 === "object") {
      return compareMatchingKeys(value1, value2);
    }
    return value1 === value2;
  });
};
