const isObject = (value: any): boolean => {
  return value !== null && typeof value === "object";
};

/**
 * Compares two objects deeply for equality.
 * @param {any} obj1 - The first object to compare.
 * @param {any} obj2 - The second object to compare.
 * @returns {boolean} Returns true if the objects are deeply equal, otherwise false.
 */
export const compareDeepObjectEquality = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    const areObjects = isObject(value1) && isObject(value2);

    if (
      (areObjects && !compareDeepObjectEquality(value1, value2)) ||
      (!areObjects && value1 !== value2)
    ) {
      return false;
    }
  }

  return true;
};
