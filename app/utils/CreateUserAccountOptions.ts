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

export default CreateUserAccountOptions;
