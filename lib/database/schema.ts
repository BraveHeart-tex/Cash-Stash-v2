import {
  datetime,
  double,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import {
  InferInsertModel,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const accounts = mysqlTable(
  "Account",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    balance: double("balance", {
      precision: 10,
      scale: 2,
    }).notNull(),
    userId: varchar("userId", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    category: mysqlEnum("category", [
      "CHECKING",
      "SAVINGS",
      "CREDIT_CARD",
      "INVESTMENT",
      "LOAN",
      "OTHER",
    ])
      .default("CHECKING")
      .notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`
    ),
  },
  (table) => {
    return {
      userAccountsUserIdFkey: index("userAccounts_userId_fkey").on(
        table.userId
      ),
    };
  }
);

export const accountRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const budgets = mysqlTable(
  "Budget",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    budgetAmount: double("budgetAmount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    spentAmount: double("spentAmount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    userId: varchar("userId", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    progress: double("progress").notNull(),
    categoryId: int("categoryId")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`
    ),
  },
  (table) => {
    return {
      budgetsUserIdFKey: index("budgets_userId_fkey").on(table.userId),
      budgetsCategoryIdFkey: index("budgets_categoryId_fkey").on(
        table.categoryId
      ),
      budgetId: primaryKey({ columns: [table.id], name: "Budget_id" }),
    };
  }
);

export const budgetRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
}));

export const emailVerificationCode = mysqlTable(
  "EmailVerificationCode",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 191 }).notNull(),
    userId: varchar("userId", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    email: varchar("email", { length: 191 }).notNull(),
    expiresAt: datetime("expiresAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      emailVerificationCodesUserIdFkey: index(
        "emailVerificationCodes_userId_fkey"
      ).on(table.userId),
      emailVerificationCodesEmailFkey: index(
        "emailVerificationCodes_email_fkey"
      ).on(table.email),
      emailVerificationCodeId: primaryKey({
        columns: [table.id],
        name: "EmailVerificationCode_id",
      }),
      emailVerificationCodeUserIdKey: unique(
        "EmailVerificationCode_userId_key"
      ).on(table.userId),
      emailVerificationCodeEmailKey: unique(
        "EmailVerificationCode_email_key"
      ).on(table.email),
    };
  }
);

export const emailVerificationCodeRelations = relations(
  emailVerificationCode,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationCode.userId],
      references: [users.id],
    }),
  })
);

export const goals = mysqlTable(
  "Goal",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    goalAmount: double("goalAmount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    currentAmount: double("currentAmount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    progress: double("progress").notNull(),
    userId: varchar("userId", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`
    ),
  },
  (table) => {
    return {
      goalsUserIdFkey: index("goals_userId_fkey").on(table.userId),
      goalId: primaryKey({ columns: [table.id], name: "Goal_id" }),
    };
  }
);

export const goalRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokens = mysqlTable(
  "PasswordResetToken",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expiresAt: datetime("expires_At", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      passwordResetTokensUserIdFkey: index(
        "passwordResetTokens_user_id_fkey"
      ).on(table.userId),
      passwordResetTokenId: primaryKey({
        columns: [table.id],
        name: "PasswordResetToken_id",
      }),
      passwordResetTokenUserIdKey: unique("PasswordResetToken_user_id_key").on(
        table.userId
      ),
    };
  }
);

export const passwordResetTokenRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  })
);

export const reminders = mysqlTable(
  "Reminder",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 191 }).notNull(),
    description: varchar("description", { length: 512 }).notNull(),
    reminderDate: datetime("reminderDate", {
      mode: "string",
      fsp: 3,
    }),
    userId: varchar("userId", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`
    ),
    markedAsReadAt: datetime("markedAsReadAt", { mode: "string", fsp: 3 }),
    status: mysqlEnum("status", ["PENDING", "COMPLETED"]).default("PENDING"),
    type: mysqlEnum("type", ["ONE_TIME", "RECURRING"]).default("ONE_TIME"),
    recurrence: mysqlEnum("recurrence", [
      "DAILY",
      "EVERY_2_DAYS",
      "EVERY_3_DAYS",
      "EVERY_4_DAYS",
      "EVERY_5_DAYS",
      "EVERY_6_DAYS",
      "WEEKLY",
      "EVERY_TWO_WEEKS",
      "MONTHLY",
      "WEEKDAYS",
      "WEEKENDS",
      "YEARLY",
    ]).default("DAILY"),
  },
  (table) => {
    return {
      remindersUserIdFkey: index("reminders_userId_fkey").on(table.userId),
      reminderId: primaryKey({ columns: [table.id], name: "Reminder_id" }),
    };
  }
);

export const reminderRelations = relations(reminders, ({ one }) => ({
  user: one(users, {
    fields: [reminders.userId],
    references: [users.id],
  }),
}));

export const sessions = mysqlTable(
  "Session",
  {
    id: varchar("id", {
      length: 128,
    }).primaryKey(),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expiresAt: datetime("expires_at").notNull(),
  },
  (table) => {
    return {
      sessionsUserIdFkey: index("sessions_userId_fkey").on(table.userId),
      sessionId: primaryKey({ columns: [table.id], name: "Session_id" }),
    };
  }
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const transactions = mysqlTable(
  "Transaction",
  {
    id: int("id").autoincrement().primaryKey(),
    amount: double("amount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`
    ),
    description: varchar("description", { length: 191 }).notNull(),
    categoryId: int("categoryId")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    accountId: int("accountId")
      .notNull()
      .references(() => accounts.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: varchar("userId", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      transactionsCategoryIdFkey: index("transactions_categoryId_fkey").on(
        table.categoryId
      ),
      transactionsUserIdFkey: index("transactions_userId_fkey").on(
        table.userId
      ),
      transactionsAccountIdFkey: index("transaction_account_id_fkey").on(
        table.accountId
      ),
      transactionId: primaryKey({
        columns: [table.id],
        name: "Transaction_id",
      }),
    };
  }
);

export const transactionRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const twoFactorAuthenticationSecrets = mysqlTable(
  "TwoFactorAuthenticationSecret",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    secret: varchar("secret", { length: 191 }).notNull(),
    userId: varchar("userId", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
  },
  (table) => {
    return {
      twoFactorAuthenticationSecretsUserIdFkey: index(
        "twoFactorAuthenticationSecrets_userId_fkey"
      ).on(table.userId),
      twoFactorAuthenticationSecretId: primaryKey({
        columns: [table.id],
        name: "TwoFactorAuthenticationSecret_id",
      }),
      twoFactorAuthenticationSecretUserIdKey: unique(
        "TwoFactorAuthenticationSecret_userId_key"
      ).on(table.userId),
    };
  }
);

export const twoFactorAuthenticationSecretRelations = relations(
  twoFactorAuthenticationSecrets,
  ({ one }) => ({
    user: one(users, {
      fields: [twoFactorAuthenticationSecrets.userId],
      references: [users.id],
    }),
  })
);

export const users = mysqlTable(
  "User",
  {
    id: varchar("id", {
      length: 128,
    })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    hashedPassword: varchar("hashedPassword", { length: 191 }).notNull(),
    emailVerified: tinyint("email_verified").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`
    ),
    prefersTwoFactorAuthentication: tinyint("prefersTwoFactorAuthentication")
      .default(0)
      .notNull(),
    activatedTwoFactorAuthentication: tinyint(
      "activatedTwoFactorAuthentication"
    ).default(0),
    preferredCurrency: varchar("preferredCurrency", { length: 3 })
      .default("USD")
      .notNull(),
  },
  (table) => {
    return {
      userId: primaryKey({ columns: [table.id], name: "User_id" }),
      userEmailKey: unique("User_email_key").on(table.email),
    };
  }
);

export const userRelations = relations(users, ({ one, many }) => ({
  twoFactorAuthenticationSecret: one(twoFactorAuthenticationSecrets),
  passwordResetToken: one(passwordResetTokens),
  emailVerificationCode: one(emailVerificationCode),
  sessions: many(sessions),
  accounts: many(accounts),
  transactions: many(transactions),
  budgets: many(budgets),
  goals: many(goals),
  reminders: many(reminders),
}));

export const currencyRates = mysqlTable(
  "CurrencyRate",
  {
    id: int("id").autoincrement().primaryKey(),
    rate: double("rate").notNull(),
    symbol: varchar("symbol", { length: 191 }).notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`
    ),
  },
  (table) => {
    return {
      currencyRateSymbolKey: unique("CurrencyRate_symbol_key").on(table.symbol),
      currencyRateId: primaryKey({
        columns: [table.id],
        name: "CurrencyRate_id",
      }),
    };
  }
);

export const categories = mysqlTable(
  "Category",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
      .notNull(),
    type: int("type").notNull(),
    userId: varchar("userId", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      uniqueNameUserType: unique("unique_name_user_type").on(
        table.name,
        table.userId,
        table.type
      ),
    };
  }
);

export const categoryRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  budget: many(budgets, {
    relationName: "budget-categories",
  }),
  transactions: many(transactions, {
    relationName: "transaction-categories",
  }),
}));

export type UserInsertModel = InferInsertModel<typeof users>;
export type UserSelectModel = InferSelectModel<typeof users>;

export type AccountInsertModel = InferInsertModel<typeof accounts>;
export type AccountSelectModel = InferSelectModel<typeof accounts>;

export type BudgetInsertModel = InferInsertModel<typeof budgets>;

export type BudgetSelectModel = InferSelectModel<typeof budgets>;

export type GoalInsertModel = InferInsertModel<typeof goals>;
export type GoalSelectModel = InferSelectModel<typeof goals>;

export type TransactionInsertModel = InferInsertModel<typeof transactions>;
export type TransactionSelectModel = InferSelectModel<typeof transactions>;

export type ReminderInsertModel = InferInsertModel<typeof reminders>;
export type ReminderSelectModel = InferSelectModel<typeof reminders>;

export type SessionInsertModel = InferInsertModel<typeof sessions>;
export type SessionSelectModel = InferSelectModel<typeof sessions>;

export type CategoryInsertModel = InferInsertModel<typeof categories>;
export type CategorySelectModel = InferSelectModel<typeof categories>;

export type EmailVerificationCodeInsertModel = InferInsertModel<
  typeof emailVerificationCode
>;

export type EmailVerificationCodeSelectModel = InferSelectModel<
  typeof emailVerificationCode
>;

export type PasswordResetTokenInsertModel = InferInsertModel<
  typeof passwordResetTokens
>;

export type PasswordResetTokenSelectModel = InferSelectModel<
  typeof passwordResetTokens
>;

export type TwoFactorAuthenticationSecretInsertModel = InferInsertModel<
  typeof twoFactorAuthenticationSecrets
>;

export type TwoFactorAuthenticationSecretSelectModel = InferSelectModel<
  typeof twoFactorAuthenticationSecrets
>;

export type CurrencyRateInsertModel = InferInsertModel<typeof currencyRates>;
export type CurrencyRateSelectModel = InferSelectModel<typeof currencyRates>;
