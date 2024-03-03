export interface Goal {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  progress: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
