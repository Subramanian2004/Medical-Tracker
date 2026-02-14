import { format, parse, isAfter, addMinutes } from 'date-fns';

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Format time string for display (HH:MM to h:mm AM/PM)
 */
export const formatTime = (time: string): string => {
  try {
    const parsed = parse(time, 'HH:mm', new Date());
    return format(parsed, 'h:mm a');
  } catch {
    return time;
  }
};

/**
 * Check if medication is overdue based on time and reminder window
 */
export const isMedicationOverdue = (
  timeToTake: string,
  reminderWindowMinutes: number
): boolean => {
  try {
    const now = new Date();
    const today = getTodayDate();
    
    // Parse the scheduled time for today
    const scheduledTime = parse(timeToTake, 'HH:mm', parse(today, 'yyyy-MM-dd', new Date()));
    
    // Add reminder window to get deadline
    const deadline = addMinutes(scheduledTime, reminderWindowMinutes);
    
    // Check if current time is after deadline
    return isAfter(now, deadline);
  } catch (error) {
    console.error('Error checking if medication is overdue:', error);
    return false;
  }
};

/**
 * Format date for display
 */
export const formatDate = (date: string): string => {
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return date;
  }
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};
