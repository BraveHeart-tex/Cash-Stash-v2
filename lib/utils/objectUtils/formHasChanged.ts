/**
 * Compares two objects to check if they are different. Does not compare nested objects. If you need to compare nested objects, use areObjectsDeepEqual.
 * @param initialValues
 * @param values
 * @returns true if the objects are different, otherwise false.
 */
export const formHasChanged = (initialValues: any, values: any): boolean => {
  const matchingKeys = Object.keys(initialValues).filter(
    (key) => key in values
  );

  return !matchingKeys.some((key) => values[key] !== initialValues[key]);
};
