export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
  streak: number;
  lastCompleted: string | null;
  completedDates: string[]; // Array of dates in YYYY-MM-DD format
}
