export type UpdateUserCurrencyPreferenceReturnType =
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: boolean;
      error?: undefined;
    };

export type ConvertTransactionsToNewCurrencyReturnType =
  | {
      success: string;
    }
  | {
      error: string;
    };
