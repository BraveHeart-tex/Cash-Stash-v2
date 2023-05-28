const CreateUserAccountOptions = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  CREDIT_CARD: 'Credit Card',
  INVESTMENT: 'Investment Account',
  LOAN: 'Loan Account',
  OTHER: 'Other Account',
};

export function getOptionLabel(
  options: Record<string, string>,
  selectedOption: string
): string {
  return options[selectedOption] || '';
}

export function getKeyByValue<T>(
  object: Record<string, T>,
  value: T
): string | null {
  const keys = Object.keys(object);
  for (const key of keys) {
    if (object[key] === value) {
      return key;
    }
  }
  return null;
}

export default CreateUserAccountOptions;
