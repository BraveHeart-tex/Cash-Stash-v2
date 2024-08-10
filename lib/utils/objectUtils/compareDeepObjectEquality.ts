const isObject = (value: unknown): boolean => {
  return value !== null && typeof value === "object";
};

export const compareDeepObjectEquality = (
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): boolean => {
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
      (areObjects &&
        !compareDeepObjectEquality(
          value1 as Record<string, unknown>,
          value2 as Record<string, unknown>,
        )) ||
      (!areObjects && value1 !== value2)
    ) {
      return false;
    }
  }

  return true;
};
