export const validateEnumValue = (value: any, enumObj: Record<string, any>) => {
  return Object.values(enumObj).includes(value);
};
