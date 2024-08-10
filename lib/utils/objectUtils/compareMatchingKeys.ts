export const compareMatchingKeys = (
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): boolean => {
  const matchingKeys = Object.keys(obj1).filter((key) => key in obj2);
  return matchingKeys.every((key: string) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (typeof value1 === "object" && typeof value2 === "object") {
      return compareMatchingKeys(
        value1 as Record<string, unknown>,
        value2 as Record<string, unknown>,
      );
    }
    return value1 === value2;
  });
};
