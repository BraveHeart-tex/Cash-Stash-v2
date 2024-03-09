import {
  mysqlTable,
  uniqueIndex,
  varchar,
  boolean,
  timestamp,
  float,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    name: varchar("name", {
      length: 256,
    }),
    email: varchar("email", {
      length: 256,
    }),
    hashedPassword: varchar("hashed_password", {
      length: 256,
    }),
    emailVerified: boolean("email_verified").default(false),
    prefersTwoFactorAuthentication: boolean(
      "prefers_two_factor_authentication"
    ).default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (users) => ({
    idIndex: uniqueIndex("user_id_index").on(users.id),
    emailIndex: uniqueIndex("user_email_index").on(users.email),
  })
);

export const userRelations = relations(users, ({ one, many }) => ({
  twoFactorAuthenticationSecret: one(twoFactorAuthenticationSecrets),
  passwordResetToken: one(passwordResetTokens),
  emailVerificationCode: one(emailVerificationCodes),
  sessions: many(sessions),
  accounts: many(accounts),
  transactions: many(transactions),
  budgets: many(budgets),
  goals: many(goals),
  reminders: many(reminders),
}));

export const twoFactorAuthenticationSecrets = mysqlTable(
  "two_factor_authentication_secrets",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    secret: varchar("secret", {
      length: 256,
    }).notNull(),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (twoFactorAuthenticationSecrets) => ({
    idIndex: uniqueIndex("two_factor_authentication_secret_id_index").on(
      twoFactorAuthenticationSecrets.id
    ),
    userIdIndex: uniqueIndex(
      "two_factor_authentication_secret_user_id_index"
    ).on(twoFactorAuthenticationSecrets.userId),
  })
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

export const passwordResetTokens = mysqlTable(
  "password_reset_tokens",
  {
    id: varchar("id", {
      length: 128,
    }),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (passwordResetTokens) => ({
    idIndex: uniqueIndex("password_reset_token_id_index").on(
      passwordResetTokens.id
    ),
    userIdIndex: uniqueIndex("password_reset_token_user_id_index").on(
      passwordResetTokens.userId
    ),
  })
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

export const emailVerificationCodes = mysqlTable(
  "email_verification_codes",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    code: varchar("code", {
      length: 56,
    }).notNull(),
    email: varchar("email", {
      length: 256,
    }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (emailVerificationCodes) => ({
    idIndex: uniqueIndex("email_verification_code_id_index").on(
      emailVerificationCodes.id
    ),
    userIdIndex: uniqueIndex("email_verification_code_user_id_index").on(
      emailVerificationCodes.userId
    ),
    emailIndex: uniqueIndex("email_verification_code_email_index").on(
      emailVerificationCodes.email
    ),
  })
);

export const emailVerificationCodeRelations = relations(
  emailVerificationCodes,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationCodes.userId],
      references: [users.id],
    }),
  })
);

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (sessions) => ({
    idIndex: uniqueIndex("session_id_index").on(sessions.id),
    userIdIndex: uniqueIndex("session_user_id_index").on(sessions.userId),
  })
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accounts = mysqlTable(
  "acconts",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", {
      length: 256,
    }).notNull(),
    balance: float("balance").default(0),
    category: mysqlEnum("category", [
      "CHECKING",
      "SAVINGS",
      "CREDIT_CARD",
      "LOAN",
      "OTHER",
    ]).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (accounts) => ({
    idIndex: uniqueIndex("account_id_index").on(accounts.id),
    userIdIndex: uniqueIndex("account_user_id_index").on(accounts.userId),
  })
);

export const accountRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactions = mysqlTable(
  "transactions",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    amount: float("amount").notNull(),
    accountId: varchar("account_id", {
      length: 128,
    })
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    description: varchar("description", {
      length: 256,
    }).notNull(),
    category: mysqlEnum("category", [
      "FOOD",
      "TRANSPORTATION",
      "ENTERTAINMENT",
      "UTILITIES",
      "SHOPPING",
      "HOUSING",
      "OTHER",
    ]).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (transactions) => ({
    idIndex: uniqueIndex("transaction_id_index").on(transactions.id),
    accountIdIndex: uniqueIndex("transaction_account_id_index").on(
      transactions.accountId
    ),
    userIdIndex: uniqueIndex("transaction_user_id_index").on(
      transactions.userId
    ),
  })
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
}));

export const budgets = mysqlTable(
  "budgets",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", {
      length: 256,
    }).notNull(),
    budgetAmount: float("budget_amount").notNull(),
    spentAmount: float("spent_amount").default(0),
    progress: float("progress").default(0),
    category: mysqlEnum("category", [
      "FOOD",
      "TRANSPORTATION",
      "ENTERTAINMENT",
      "UTILITIES",
      "SHOPPING",
      "HOUSING",
      "OTHER",
    ]).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (budgets) => ({
    idIndex: uniqueIndex("budget_id_index").on(budgets.id),
    userIdIndex: uniqueIndex("budget_user_id_index").on(budgets.userId),
  })
);

export const budgetRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
}));

export const goals = mysqlTable(
  "goals",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    name: varchar("name", {
      length: 256,
    }).notNull(),
    goalAmount: float("goal_amount").notNull(),
    currentAmount: float("current_amount").default(0),
    progress: float("progress").default(0),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (goals) => ({
    idIndex: uniqueIndex("goal_id_index").on(goals.id),
    userIdIndex: uniqueIndex("goal_user_id_index").on(goals.userId),
  })
);

export const goalRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export const reminders = mysqlTable(
  "reminders",
  {
    id: varchar("id", {
      length: 128,
    }).$defaultFn(() => createId()),
    title: varchar("title", {
      length: 256,
    }).notNull(),
    description: varchar("description", {
      length: 256,
    }).notNull(),
    reminderDate: timestamp("reminder_date").notNull(),
    userId: varchar("user_id", {
      length: 128,
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    markedAsReadAt: timestamp("marked_as_read_at"),
  },
  (reminders) => ({
    idIndex: uniqueIndex("reminder_id_index").on(reminders.id),
    userIdIndex: uniqueIndex("reminder_user_id_index").on(reminders.userId),
  })
);

export const reminderRelations = relations(reminders, ({ one }) => ({
  user: one(users, {
    fields: [reminders.userId],
    references: [users.id],
  }),
}));
