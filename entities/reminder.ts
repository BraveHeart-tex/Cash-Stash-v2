export interface Reminder {
  id: string;
  title: string;
  description: string;
  reminderDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  markedAsReadAt: Date | null;
}

enum NotificationCategory {
  FOOD = "FOOD",
  TRANSPORTATION = "TRANSPORTATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  UTILITIES = "UTILITIES",
  SHOPPING = "SHOPPING",
  HOUSING = "HOUSING",
  OTHER = "OTHER",
}
