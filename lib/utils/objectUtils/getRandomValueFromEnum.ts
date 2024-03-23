export const getRandomValueFromEnum = (enumObject: Record<string, any>) => {
  const enumValues = Object.values(enumObject);
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
};
