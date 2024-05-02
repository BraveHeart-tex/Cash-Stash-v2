export const generateOptionsFromEnums = (
  enumValues: string[],
  translations: Record<string, string> = {},
  separator = "_"
) => {
  return enumValues.map((value) => {
    return {
      value,
      label:
        translations[value] ||
        value
          .split(separator)
          .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
          .join(" "),
    };
  });
};
