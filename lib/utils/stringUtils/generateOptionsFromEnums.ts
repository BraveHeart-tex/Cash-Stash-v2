export const generateOptionsFromEnums = (
  enumValues: string[],
  separator = "_"
) => {
  return enumValues.map((value) => {
    return {
      value,
      label: value
        .split(separator)
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" "),
    };
  });
};
