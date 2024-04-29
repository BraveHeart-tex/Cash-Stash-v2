/**
 * Returns a new object with only the specified keys from the input object.
 *
 * @param {T} obj - The input object.
 * @param {K[]} keys - An array of keys to pick from the object.
 * @return {Pick<T, K>} - A new object with only the specified keys.
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {} as Pick<T, K>
  );
}
