import { NavigationItem } from "@/server/types";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaCog, FaMoneyBill, FaPiggyBank } from "react-icons/fa";
import { MdDashboard, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import { TbReportAnalytics } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";
import { MdOutlineColorLens } from "react-icons/md";

export const PRIMARY_COLOR = "#c4002b" as const;
export const PRIMARY_FOREGROUND_COLOR = "#fefcfa" as const;
export const FOREGROUND_COLOR = "#001400" as const;
export const MUTED_FOREGROUND_COLOR = "#767b9c" as const;

export const PAGE_ROUTES = {
  HOME_PAGE: "/",
  LOGIN_ROUTE: "/auth/login",
  SIGN_UP_ROUTE: "/auth/signup",
  ACCOUNTS_ROUTE: "/accounts",
  BUDGETS_ROUTE: "/budgets",
  GOALS_ROUTE: "/goals",
  TRANSACTIONS_ROUTE: "/transactions",
  REPORTS_ROUTE: "/reports",
  CATEGORY_ROUTE: "/categories",
  EMAIL_VERIFICATION_ROUTE: "/auth/email-verification",
  SIGN_IN_HELP_ROUTE: "/auth/help",
  FORGOT_PASSWORD_ROUTE: "/auth/help?category=forgot-password",
  VERIFICATION_TOKEN_ROUTE: "/auth/help?category=verification-token",
  SETTINGS_ROUTE: "/settings",
  CURRENCY_CONVERTER_ROUTE: "/currency-converter",
} as const;

export const CATEGORY_TYPES = {
  TRANSACTION: 1,
  BUDGET: 2,
} as const;

export const MAX_VERIFICATION_CODE_ATTEMPTS = 3 as const;
export const SEND_VERIFICATION_CODE_RATE_LIMIT = 3 as const;
export const MAX_LOGIN_REQUESTS_PER_MINUTE = 5 as const;
export const MAX_SIGN_UP_REQUESTS_PER_MINUTE = 5 as const;
export const MAX_RESET_PASSWORD_LINK_REQUESTS_PER_MINUTE = 3 as const;
export const EMAIL_VERIFICATION_CODE_EXPIRY_SECONDS = 300 as const;
export const EMAIL_VERIFICATION_CODE_EXPIRY_MINUTES = 5 as const;
export const EMAIL_VERIFICATION_CODE_LENGTH = 8 as const;
export const FORGOT_PASSWORD_LINK_EXPIRATION_MINUTES = 60 as const;

export const ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS = 7 as const;
export const TWO_FACTOR_AUTH_INPUT_TIMEOUT_SECONDS = 180 as const;

export const MAX_TWO_FACTOR_AUTH_ATTEMPTS = 3 as const;

export const CAPTCHA_SITE_KEY =
  "6LecwqYpAAAAAEtHM7rnQ8gYCTtI4-fSF6_LK_rs" as const;

export const EMAIL_VERIFICATION_REDIRECTION_PATHS = {
  INVALID_EMAIL: PAGE_ROUTES.LOGIN_ROUTE + "?error=invalid-email",
  EXPIRED_CODE: PAGE_ROUTES.LOGIN_ROUTE + "?error=expired-code",
  INVALID_CODE: PAGE_ROUTES.LOGIN_ROUTE + "?error=invalid-code",
  TOO_MANY_REQUESTS: PAGE_ROUTES.LOGIN_ROUTE + "?error=too-many-requests",
  VERIFICATION_TIMEOUT: PAGE_ROUTES.LOGIN_ROUTE + "?error=verification-timeout",
} as const;

export const MONTHS_OF_THE_YEAR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: MdDashboard,
    link: PAGE_ROUTES.HOME_PAGE,
    isPrimary: true,
  },
  {
    label: "Accounts",
    icon: MdOutlineAccountBalanceWallet,
    link: PAGE_ROUTES.ACCOUNTS_ROUTE,
    isPrimary: true,
  },
  {
    label: "Budgets",
    icon: FaMoneyBill,
    link: PAGE_ROUTES.BUDGETS_ROUTE,
    isPrimary: true,
  },
  {
    label: "Goals",
    icon: FaPiggyBank,
    link: PAGE_ROUTES.GOALS_ROUTE,
  },
  {
    label: "Transactions",
    icon: AiOutlineTransaction,
    link: PAGE_ROUTES.TRANSACTIONS_ROUTE,
    isPrimary: true,
  },
  { label: "Categories", icon: BiCategory, link: PAGE_ROUTES.CATEGORY_ROUTE },
  {
    label: "Currency Converter",
    icon: SiConvertio,
    link: PAGE_ROUTES.CURRENCY_CONVERTER_ROUTE,
  },
  {
    label: "Reports",
    icon: TbReportAnalytics,
    link: PAGE_ROUTES.REPORTS_ROUTE,
  },
  {
    label: "Settings",
    icon: FaCog,
    link: PAGE_ROUTES.SETTINGS_ROUTE,
  },
];

export const CACHE_PREFIXES = {
  ACCOUNT: "account",
  PAGINATED_ACCOUNTS: "paginated_accounts",
  PAGINATED_BUDGETS: "paginated_budgets",
  PAGINATED_TRANSACTIONS: "paginated_transactions",
  PAGINATED_GOALS: "paginated_goals",
  LOGIN_RATE_LIMIT: "login_rate_limit",
  SIGN_UP_RATE_LIMIT: "sign_up_rate_limit",
  TRANSACTION: "transaction",
  BUDGET: "budget",
  GOAL: "goal",
  SEND_VERIFICATION_CODE_RATE_LIMIT: "send_verification_code_rate_limit",
  VERIFY_VERIFICATION_CODE_RATE_LIMIT: "verify_verification_code_rate_limit",
  ACCOUNT_TRANSACTIONS: "account_transactions",
  RESET_PASSWORD_LINK_REQUEST_RATE_LIMIT:
    "reset_password_link_request_rate_limit",
  TWO_FACTOR_AUTH_RATE_LIMIT: "two_factor_auth_rate_limit",
} as const;

export const getPageSizeAndSkipAmount = (pageNumber: number) => {
  const PAGE_SIZE = 12;
  const skipAmount = (pageNumber - 1) * PAGE_SIZE;
  return { pageSize: PAGE_SIZE, skipAmount };
};

export const getResetPasswordUrl = (email: string, token: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${email}?token=${token}`;
};

export const FLAGS_BY_CURRENCY_SYMBOL: {
  [key: string]: string;
} = {
  AED: "🇦🇪",
  AFN: "🇦🇫",
  ALL: "🇦🇱",
  AMD: "🇦🇲",
  ANG: "🇳🇱",
  AOA: "🇦🇴",
  ARS: "🇦🇷",
  AUD: "🇦🇺",
  AWG: "🇦🇼",
  AZN: "🇦🇿",
  BAM: "🇧🇦",
  BBD: "🇧🇧",
  BDT: "🇧🇩",
  BGN: "🇧🇬",
  BHD: "🇧🇭",
  BIF: "🇧🇮",
  BMD: "🇧🇲",
  BND: "🇧🇳",
  BOB: "🇧🇴",
  BRL: "🇧🇷",
  BSD: "🇧🇸",
  BTC: "₿",
  BTN: "🇧🇹",
  BWP: "🇧🇼",
  BYN: "🇧🇾",
  BYR: "🇧🇾",
  BZD: "🇧🇿",
  CAD: "🇨🇦",
  CDF: "🇨🇩",
  CHF: "🇨🇭",
  CLF: "🇨🇱",
  CLP: "🇨🇱",
  CNY: "🇨🇳",
  COP: "🇨🇴",
  CRC: "🇨🇷",
  CUC: "🇨🇺",
  CUP: "🇨🇺",
  CVE: "🇨🇻",
  CZK: "🇨🇿",
  DJF: "🇩🇯",
  DKK: "🇩🇰",
  DOP: "🇩🇴",
  DZD: "🇩🇿",
  EGP: "🇪🇬",
  ERN: "🇪🇷",
  ETB: "🇪🇹",
  EUR: "🇪🇺",
  FJD: "🇫🇯",
  FKP: "🇫🇰",
  GBP: "🇬🇧",
  GEL: "🇬🇪",
  GHS: "🇬🇭",
  GIP: "🇬🇮",
  GMD: "🇬🇲",
  GNF: "🇬🇳",
  GTQ: "🇬🇹",
  GYD: "🇬🇾",
  HKD: "🇭🇰",
  HNL: "🇭🇳",
  HRK: "🇭🇷",
  HTG: "🇭🇹",
  HUF: "🇭🇺",
  IDR: "🇮🇩",
  ILS: "🇮🇱",
  INR: "🇮🇳",
  IQD: "🇮🇶",
  IRR: "🇮🇷",
  ISK: "🇮🇸",
  JMD: "🇯🇲",
  JOD: "🇯🇴",
  JPY: "🇯🇵",
  KES: "🇰🇪",
  KGS: "🇰🇬",
  KHR: "🇰🇭",
  KMF: "🇰🇲",
  KPW: "🇰🇵",
  KRW: "🇰🇷",
  KWD: "🇰🇼",
  KYD: "🇰🇾",
  KZT: "🇰🇿",
  LAK: "🇱🇦",
  LBP: "🇱🇧",
  LKR: "🇱🇰",
  LRD: "🇱🇷",
  LSL: "🇱🇸",
  LTL: "🇱🇹",
  LVL: "🇱🇻",
  LYD: "🇱🇾",
  MAD: "🇲🇦",
  MDL: "🇲🇩",
  MGA: "🇲🇬",
  MKD: "🇲🇰",
  MMK: "🇲🇲",
  MNT: "🇲🇳",
  MOP: "🇲🇴",
  MRO: "🇲🇷",
  MUR: "🇲🇺",
  MVR: "🇲🇻",
  MWK: "🇲🇼",
  MXN: "🇲🇽",
  MYR: "🇲🇾",
  MZN: "🇲🇿",
  NAD: "🇳🇦",
  NGN: "🇳🇬",
  NIO: "🇳🇮",
  NOK: "🇳🇴",
  NPR: "🇳🇵",
  NZD: "🇳🇿",
  OMR: "🇴🇲",
  PAB: "🇵🇦",
  PEN: "🇵🇪",
  PGK: "🇵🇬",
  PHP: "🇵🇭",
  PKR: "🇵🇰",
  PLN: "🇵🇱",
  PYG: "🇵🇾",
  QAR: "🇶🇦",
  RON: "🇷🇴",
  RSD: "🇷🇸",
  RUB: "🇷🇺",
  RWF: "🇷🇼",
  SAR: "🇸🇦",
  SBD: "🇸🇧",
  SCR: "🇸🇨",
  SDG: "🇸🇩",
  SEK: "🇸🇪",
  SGD: "🇸🇬",
  SHP: "🇸🇭",
  SLE: "🇸🇱",
  SLL: "🇸🇱",
  SOS: "🇸🇴",
  SRD: "🇸🇷",
  STD: "🇸🇹",
  SYP: "🇸🇾",
  SZL: "🇸🇿",
  THB: "🇹🇭",
  TJS: "🇹🇯",
  TMT: "🇹🇲",
  TND: "🇹🇳",
  TOP: "🇹🇴",
  TRY: "🇹🇷",
  TTD: "🇹🇹",
  TWD: "🇹🇼",
  TZS: "🇹🇿",
  UAH: "🇺🇦",
  UGX: "🇺🇬",
  USD: "🇺🇸",
  UYU: "🇺🇾",
  UZS: "🇺🇿",
  VEF: "🇻🇪",
  VES: "🇻🇪",
  VND: "🇻🇳",
  VUV: "🇻🇺",
  WST: "🇼🇸",
  XAF: "🇨🇲",
  XCD: "🇦🇮",
  XOF: "🇧🇯",
  XPF: "🇵🇫",
  YER: "🇾🇪",
  ZAR: "🇿🇦",
  ZMW: "🇿🇲",
  ZWL: "🇿🇼",
} as const;

export const CURRENCIES = [
  {
    name: "Armenian Dram",
    symbol: "AMD",
  },
  {
    name: "Afghan Afghani",
    symbol: "AFN",
  },
  {
    name: "Netherlands Antillean Guilder",
    symbol: "ANG",
  },
  {
    name: "Albanian Lek",
    symbol: "ALL",
  },
  {
    name: "United Arab Emirates Dirham",
    symbol: "AED",
  },
  {
    name: "Australian Dollar",
    symbol: "AUD",
  },
  {
    name: "Angolan Kwanza",
    symbol: "AOA",
  },
  {
    name: "Azerbaijani Manat",
    symbol: "AZN",
  },
  {
    name: "Aruban Florin",
    symbol: "AWG",
  },
  {
    name: "Argentine Peso",
    symbol: "ARS",
  },
  {
    name: "Bosnia-Herzegovina Convertible Mark",
    symbol: "BAM",
  },
  {
    name: "Barbadian Dollar",
    symbol: "BBD",
  },
  {
    name: "Bangladeshi Taka",
    symbol: "BDT",
  },
  {
    name: "Bahraini Dinar",
    symbol: "BHD",
  },
  {
    name: "Brunei Dollar",
    symbol: "BND",
  },
  {
    name: "Bolivian Boliviano",
    symbol: "BOB",
  },
  {
    name: "Burundian Franc",
    symbol: "BIF",
  },
  {
    name: "Bulgarian Lev",
    symbol: "BGN",
  },
  {
    name: "Bermudan Dollar",
    symbol: "BMD",
  },
  {
    name: "Brazilian Real",
    symbol: "BRL",
  },
  {
    name: "Bahamian Dollar",
    symbol: "BSD",
  },
  {
    name: "Bhutanese Ngultrum",
    symbol: "BTN",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
  },
  {
    name: "Botswanan Pula",
    symbol: "BWP",
  },
  {
    name: "Belize Dollar",
    symbol: "BZD",
  },
  {
    name: "Belarusian Ruble",
    symbol: "BYN",
  },
  {
    name: "Congolese Franc",
    symbol: "CDF",
  },
  {
    name: "Canadian Dollar",
    symbol: "CAD",
  },
  {
    name: "Swiss Franc",
    symbol: "CHF",
  },
  {
    name: "Chilean Unit of Account (UF)",
    symbol: "CLF",
  },
  {
    name: "Chilean Peso",
    symbol: "CLP",
  },
  {
    name: "Cuban Convertible Peso",
    symbol: "CUC",
  },
  {
    name: "Chinese Yuan (Offshore)",
    symbol: "CNH",
  },
  {
    name: "Cuban Peso",
    symbol: "CUP",
  },
  {
    name: "Chinese Yuan",
    symbol: "CNY",
  },
  {
    name: "Costa Rican Col\u00f3n",
    symbol: "CRC",
  },
  {
    name: "Danish Krone",
    symbol: "DKK",
  },
  {
    name: "Czech Republic Koruna",
    symbol: "CZK",
  },
  {
    name: "Djiboutian Franc",
    symbol: "DJF",
  },
  {
    name: "Colombian Peso",
    symbol: "COP",
  },
  {
    name: "Cape Verdean Escudo",
    symbol: "CVE",
  },
  {
    name: "Algerian Dinar",
    symbol: "DZD",
  },
  {
    name: "Eritrean Nakfa",
    symbol: "ERN",
  },
  {
    name: "Falkland Islands Pound",
    symbol: "FKP",
  },
  {
    name: "Fijian Dollar",
    symbol: "FJD",
  },
  {
    name: "British Pound Sterling",
    symbol: "GBP",
  },
  {
    name: "Ethiopian Birr",
    symbol: "ETB",
  },
  {
    name: "Egyptian Pound",
    symbol: "EGP",
  },
  {
    name: "Dominican Peso",
    symbol: "DOP",
  },
  {
    name: "Georgian Lari",
    symbol: "GEL",
  },
  {
    name: "Euro",
    symbol: "EUR",
  },
  {
    name: "Ghanaian Cedi",
    symbol: "GHS",
  },
  {
    name: "Gibraltar Pound",
    symbol: "GIP",
  },
  {
    name: "Guernsey Pound",
    symbol: "GGP",
  },
  {
    name: "Guatemalan Quetzal",
    symbol: "GTQ",
  },
  {
    name: "Guinean Franc",
    symbol: "GNF",
  },
  {
    name: "Honduran Lempira",
    symbol: "HNL",
  },
  {
    name: "Hong Kong Dollar",
    symbol: "HKD",
  },
  {
    name: "Gambian Dalasi",
    symbol: "GMD",
  },
  {
    name: "Guyanaese Dollar",
    symbol: "GYD",
  },
  {
    name: "Croatian Kuna",
    symbol: "HRK",
  },
  {
    name: "Haitian Gourde",
    symbol: "HTG",
  },
  {
    name: "Hungarian Forint",
    symbol: "HUF",
  },
  {
    name: "Iraqi Dinar",
    symbol: "IQD",
  },
  {
    name: "Icelandic Kr\u00f3na",
    symbol: "ISK",
  },
  {
    name: "Indonesian Rupiah",
    symbol: "IDR",
  },
  {
    name: "Manx pound",
    symbol: "IMP",
  },
  {
    name: "Israeli New Sheqel",
    symbol: "ILS",
  },
  {
    name: "Indian Rupee",
    symbol: "INR",
  },
  {
    name: "Iranian Rial",
    symbol: "IRR",
  },
  {
    name: "Jersey Pound",
    symbol: "JEP",
  },
  {
    name: "Jamaican Dollar",
    symbol: "JMD",
  },
  {
    name: "Jordanian Dinar",
    symbol: "JOD",
  },
  {
    name: "Japanese Yen",
    symbol: "JPY",
  },
  {
    name: "Kenyan Shilling",
    symbol: "KES",
  },
  {
    name: "Kyrgystani Som",
    symbol: "KGS",
  },
  {
    name: "Comorian Franc",
    symbol: "KMF",
  },
  {
    name: "Cambodian Riel",
    symbol: "KHR",
  },
  {
    name: "North Korean Won",
    symbol: "KPW",
  },
  {
    name: "South Korean Won",
    symbol: "KRW",
  },
  {
    name: "Kuwaiti Dinar",
    symbol: "KWD",
  },
  {
    name: "Cayman Islands Dollar",
    symbol: "KYD",
  },
  {
    name: "Laotian Kip",
    symbol: "LAK",
  },
  {
    name: "Kazakhstani Tenge",
    symbol: "KZT",
  },
  {
    name: "Lebanese Pound",
    symbol: "LBP",
  },
  {
    name: "Sri Lankan Rupee",
    symbol: "LKR",
  },
  {
    name: "Liberian Dollar",
    symbol: "LRD",
  },
  {
    name: "Libyan Dinar",
    symbol: "LYD",
  },
  {
    name: "Moldovan Leu",
    symbol: "MDL",
  },
  {
    name: "Moroccan Dirham",
    symbol: "MAD",
  },
  {
    name: "Lesotho Loti",
    symbol: "LSL",
  },
  {
    name: "Malagasy Ariary",
    symbol: "MGA",
  },
  {
    name: "Macedonian Denar",
    symbol: "MKD",
  },
  {
    name: "Mauritian Rupee",
    symbol: "MUR",
  },
  {
    name: "Mongolian Tugrik",
    symbol: "MNT",
  },
  {
    name: "Mauritanian Ouguiya",
    symbol: "MRU",
  },
  {
    name: "Mexican Peso",
    symbol: "MXN",
  },
  {
    name: "Malawian Kwacha",
    symbol: "MWK",
  },
  {
    name: "Myanma Kyat",
    symbol: "MMK",
  },
  {
    name: "Maldivian Rufiyaa",
    symbol: "MVR",
  },
  {
    name: "Macanese Pataca",
    symbol: "MOP",
  },
  {
    name: "Malaysian Ringgit",
    symbol: "MYR",
  },
  {
    name: "Mozambican Metical",
    symbol: "MZN",
  },
  {
    name: "Namibian Dollar",
    symbol: "NAD",
  },
  {
    name: "Nicaraguan C\u00f3rdoba",
    symbol: "NIO",
  },
  {
    name: "Nigerian Naira",
    symbol: "NGN",
  },
  {
    name: "Nepalese Rupee",
    symbol: "NPR",
  },
  {
    name: "New Zealand Dollar",
    symbol: "NZD",
  },
  {
    name: "Panamanian Balboa",
    symbol: "PAB",
  },
  {
    name: "Omani Rial",
    symbol: "OMR",
  },
  {
    name: "Peruvian Nuevo Sol",
    symbol: "PEN",
  },
  {
    name: "Norwegian Krone",
    symbol: "NOK",
  },
  {
    name: "Papua New Guinean Kina",
    symbol: "PGK",
  },
  {
    name: "Philippine Peso",
    symbol: "PHP",
  },
  {
    name: "Pakistani Rupee",
    symbol: "PKR",
  },
  {
    name: "Qatari Rial",
    symbol: "QAR",
  },
  {
    name: "Paraguayan Guarani",
    symbol: "PYG",
  },
  {
    name: "Serbian Dinar",
    symbol: "RSD",
  },
  {
    name: "Russian Ruble",
    symbol: "RUB",
  },
  {
    name: "Polish Zloty",
    symbol: "PLN",
  },
  {
    name: "Rwandan Franc",
    symbol: "RWF",
  },
  {
    name: "Romanian Leu",
    symbol: "RON",
  },
  {
    name: "Saudi Riyal",
    symbol: "SAR",
  },
  {
    name: "Solomon Islands Dollar",
    symbol: "SBD",
  },
  {
    name: "Seychellois Rupee",
    symbol: "SCR",
  },
  {
    name: "Sudanese Pound",
    symbol: "SDG",
  },
  {
    name: "Swedish Krona",
    symbol: "SEK",
  },
  {
    name: "Singapore Dollar",
    symbol: "SGD",
  },
  {
    name: "Saint Helena Pound",
    symbol: "SHP",
  },
  {
    name: "Sierra Leonean Leone",
    symbol: "SLL",
  },
  {
    name: "Somali Shilling",
    symbol: "SOS",
  },
  {
    name: "Surinamese Dollar",
    symbol: "SRD",
  },
  {
    name: "South Sudanese Pound",
    symbol: "SSP",
  },
  {
    name: "Thai Baht",
    symbol: "THB",
  },
  {
    name: "S\u00e3o Tom\u00e9 and Pr\u00edncipe Dobra",
    symbol: "STN",
  },
  {
    name: "Salvadoran Col\u00f3n",
    symbol: "SVC",
  },
  {
    name: "S\u00e3o Tom\u00e9 and Pr\u00edncipe Dobra (pre-2018)",
    symbol: "STD",
  },
  {
    name: "Swazi Lilangeni",
    symbol: "SZL",
  },
  {
    name: "Syrian Pound",
    symbol: "SYP",
  },
  {
    name: "Turkmenistani Manat",
    symbol: "TMT",
  },
  {
    name: "Tajikistani Somoni",
    symbol: "TJS",
  },
  {
    name: "Tunisian Dinar",
    symbol: "TND",
  },
  {
    name: "Tongan Pa'anga",
    symbol: "TOP",
  },
  {
    name: "Trinidad and Tobago Dollar",
    symbol: "TTD",
  },
  {
    name: "Turkish Lira",
    symbol: "TRY",
  },
  {
    name: "Tanzanian Shilling",
    symbol: "TZS",
  },
  {
    name: "New Taiwan Dollar",
    symbol: "TWD",
  },
  {
    name: "Ukrainian Hryvnia",
    symbol: "UAH",
  },
  {
    name: "Ugandan Shilling",
    symbol: "UGX",
  },
  {
    name: "United States Dollar",
    symbol: "USD",
  },
  {
    name: "Uruguayan Peso",
    symbol: "UYU",
  },
  {
    name: "Uzbekistan Som",
    symbol: "UZS",
  },
  {
    name: "Venezuelan Bol\u00edvar Soberano",
    symbol: "VES",
  },
  {
    name: "Vanuatu Vatu",
    symbol: "VUV",
  },
  {
    name: "Vietnamese Dong",
    symbol: "VND",
  },
  {
    name: "CFA Franc BEAC",
    symbol: "XAF",
  },
  {
    name: "Samoan Tala",
    symbol: "WST",
  },
  {
    name: "Gold Ounce",
    symbol: "XAU",
  },
  {
    name: "Silver Ounce",
    symbol: "XAG",
  },
  {
    name: "East Caribbean Dollar",
    symbol: "XCD",
  },
  {
    name: "Special Drawing Rights",
    symbol: "XDR",
  },
  {
    name: "CFA Franc BCEAO",
    symbol: "XOF",
  },
  {
    name: "Palladium Ounce",
    symbol: "XPD",
  },
  {
    name: "CFP Franc",
    symbol: "XPF",
  },
  {
    name: "Platinum Ounce",
    symbol: "XPT",
  },
  {
    name: "Yemeni Rial",
    symbol: "YER",
  },
  {
    name: "South African Rand",
    symbol: "ZAR",
  },
  {
    name: "Zimbabwean Dollar",
    symbol: "ZWL",
  },
  {
    name: "Zambian Kwacha",
    symbol: "ZMW",
  },
] as const;

export const THEME_OPTIONS = [
  {
    icon: FaSun,
    label: "Default Light",
    value: "light",
  },
  {
    icon: FaMoon,
    label: "Default Dark",
    value: "dark",
  },
  {
    icon: FaDesktop,
    label: "System",
    value: "system",
  },
  {
    icon: MdOutlineColorLens,
    label: "Monokai Pro",
    value: "monokai",
  },
];
