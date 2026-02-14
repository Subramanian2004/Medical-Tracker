import { z } from 'zod';

// Auth Schemas
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  caretakerEmail: z.string().email('Invalid caretaker email').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Medication Schemas
export const medicationSchema = z.object({
  name: z.string()
    .min(1, 'Medication name is required')
    .max(100, 'Name must be less than 100 characters')
    .transform(val => val.trim()),
  dosage: z.string()
    .min(1, 'Dosage is required')
    .max(50, 'Dosage must be less than 50 characters')
    .transform(val => val.trim()),
  time_to_take: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  reminder_window_minutes: z.number()
    .min(5, 'Reminder window must be at least 5 minutes')
    .max(240, 'Reminder window must be less than 4 hours')
    .default(30),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
