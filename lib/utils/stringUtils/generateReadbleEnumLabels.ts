import { generateReadableLabelFromEnumValue } from "./generateReadableLabelFromEnumValue";

export const generateReadbleEnumLabels = ({
  enumObj,
  separator = "_",
}: {
  enumObj: Record<string, string>;
  separator?: string;
}) => {
  const keys = Object.keys(enumObj);

  return keys.map((key) => {
    const label = generateReadableLabelFromEnumValue({ key, separator });
    return {
      label,
      value: key,
    };
  });
};
