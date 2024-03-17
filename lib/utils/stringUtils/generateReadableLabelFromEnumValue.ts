export const generateReadableLabelFromEnumValue = ({
  key,
  separator = "_",
}: {
  key: string;
  separator?: string;
}) => {
  let label = key.replace(separator, " ");

  if (label.split(" ").length > 1) {
    const words = label.split(" ");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    label = capitalizedWords.join(" ");
  } else {
    label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }

  return label;
};
