export interface User {
  id: string;
  email: string;
  caretaker_email?: string;
  created_at: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  time_to_take: string; // Format: "HH:MM"
  reminder_window_minutes: number; // How many minutes after time_to_take before alert
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  date: string; // Format: "YYYY-MM-DD"
  created_at: string;
}

export interface MedicationWithLog extends Medication {
  today_log?: MedicationLog;
  is_taken_today: boolean;
  is_overdue: boolean;
}

export type UserRole = 'patient' | 'caretaker';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, caretakerEmail?: string) => Promise<void>;
  signOut: () => Promise<void>;
}
