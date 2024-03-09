import {
  mysqlTable,
  index,
  primaryKey,
  varchar,
  double,
  mysqlEnum,
  datetime,
  unique,
  tinyint,
} from "drizzle-orm/mysql-core";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const accounts = mysqlTable(
  "Account",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    balance: double("balance").notNull(),
    userId: varchar("userId", { length: 191 })
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
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userAccountsUserIdFkey: index("userAccounts_userId_fkey").on(
        table.userId
      ),
      accountId: primaryKey({ columns: [table.id], name: "Account_id" }),
    };
  }
);

export const budgets = mysqlTable(
  "Budget",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    budgetAmount: double("budgetAmount").notNull(),
    spentAmount: double("spentAmount").notNull(),
    userId: varchar("userId", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    progress: double("progress").notNull(),
    category: mysqlEnum("category", [
      "FOOD",
      "TRANSPORTATION",
      "ENTERTAINMENT",
      "UTILITIES",
      "SHOPPING",
      "HOUSING",
      "OTHER",
    ])
      .default("OTHER")
      .notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      budgetsUserIdFkey: index("budgets_userId_fkey").on(table.userId),
      budgetId: primaryKey({ columns: [table.id], name: "Budget_id" }),
    };
  }
);

export const emailVerificationCode = mysqlTable(
  "EmailVerificationCode",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    code: varchar("code", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 })
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

export const goals = mysqlTable(
  "Goal",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    goalAmount: double("goalAmount").notNull(),
    currentAmount: double("currentAmount").notNull(),
    progress: double("progress").notNull(),
    userId: varchar("userId", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      goalsUserIdFkey: index("goals_userId_fkey").on(table.userId),
      goalId: primaryKey({ columns: [table.id], name: "Goal_id" }),
    };
  }
);

export const passwordResetTokens = mysqlTable(
  "PasswordResetToken",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 191 })
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

export const reminders = mysqlTable(
  "Reminder",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    title: varchar("title", { length: 191 }).notNull(),
    description: varchar("description", { length: 191 }).notNull(),
    reminderDate: datetime("reminderDate", {
      mode: "string",
      fsp: 3,
    }).notNull(),
    userId: varchar("userId", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    markedAsReadAt: datetime("markedAsReadAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      remindersUserIdFkey: index("reminders_userId_fkey").on(table.userId),
      reminderId: primaryKey({ columns: [table.id], name: "Reminder_id" }),
    };
  }
);

export const sessions = mysqlTable(
  "Session",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    userId: varchar("user_id", { length: 191 })
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

export const transactions = mysqlTable(
  "Transaction",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    amount: double("amount").notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    description: varchar("description", { length: 191 }).notNull(),
    category: mysqlEnum("category", [
      "FOOD",
      "TRANSPORTATION",
      "ENTERTAINMENT",
      "UTILITIES",
      "SHOPPING",
      "HOUSING",
      "OTHER",
    ])
      .default("OTHER")
      .notNull(),
    accountId: varchar("accountId", { length: 191 })
      .notNull()
      .references(() => accounts.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: varchar("userId", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      transactionsAccountIdFkey: index("transactions_accountId_fkey").on(
        table.accountId
      ),
      transactionsUserIdFkey: index("transactions_userId_fkey").on(
        table.userId
      ),
      transactionId: primaryKey({
        columns: [table.id],
        name: "Transaction_id",
      }),
    };
  }
);

export const twoFactorAuthenticationSecrets = mysqlTable(
  "TwoFactorAuthenticationSecret",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    secret: varchar("secret", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
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

export const users = mysqlTable(
  "User",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    hashedPassword: varchar("hashedPassword", { length: 191 }).notNull(),
    emailVerified: tinyint("email_verified").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    prefersTwoFactorAuthentication: tinyint("prefersTwoFactorAuthentication")
      .default(0)
      .notNull(),
  },
  (table) => {
    return {
      userId: primaryKey({ columns: [table.id], name: "User_id" }),
      userEmailKey: unique("User_email_key").on(table.email),
    };
  }
);

export type UserInsertModel = InferInsertModel<typeof users>;
export type UserSelectModel = InferSelectModel<typeof users>;
