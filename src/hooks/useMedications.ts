import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Medication, MedicationLog, MedicationWithLog } from '../types';
import { getTodayDate, isMedicationOverdue } from '../utils/helpers';
import { useAuth } from '../lib/AuthContext';

export const useMedications = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<MedicationWithLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = useCallback(async () => {
    if (!user) {
      setMedications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch medications
      const { data: medsData, error: medsError } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('time_to_take', { ascending: true });

      if (medsError) throw medsError;

      const today = getTodayDate();

      // Fetch today's logs
      const { data: logsData, error: logsError } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);

      if (logsError) throw logsError;

      // Combine medications with logs
      const medsWithLogs: MedicationWithLog[] = (medsData || []).map((med) => {
        const todayLog = (logsData || []).find(
          (log) => log.medication_id === med.id
        );
        const isOverdue = !todayLog && isMedicationOverdue(
          med.time_to_take,
          med.reminder_window_minutes
        );

        return {
          ...med,
          today_log: todayLog,
          is_taken_today: !!todayLog,
          is_overdue: isOverdue,
        };
      });

      setMedications(medsWithLogs);
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  const addMedication = async (
    name: string,
    dosage: string,
    timeToTake: string,
    reminderWindowMinutes: number
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const { error: insertError } = await supabase
      .from('medications')
      .insert({
        user_id: user.id,
        name,
        dosage,
        time_to_take: timeToTake,
        reminder_window_minutes: reminderWindowMinutes,
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    await fetchMedications();
  };

  const deleteMedication = async (medicationId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    // Delete all logs for this medication first
    const { error: logsError } = await supabase
      .from('medication_logs')
      .delete()
      .eq('medication_id', medicationId);

    if (logsError) {
      throw new Error(`Failed to delete logs: ${logsError.message}`);
    }

    // Delete the medication
    const { error: medError } = await supabase
      .from('medications')
      .delete()
      .eq('id', medicationId)
      .eq('user_id', user.id);

    if (medError) {
      throw new Error(medError.message);
    }

    await fetchMedications();
  };

  const markAsTaken = async (medicationId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const today = getTodayDate();

    // Check if already marked for today
    const { data: existingLog } = await supabase
      .from('medication_logs')
      .select('id')
      .eq('medication_id', medicationId)
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (existingLog) {
      throw new Error('Medication already marked as taken today');
    }

    const { error } = await supabase
      .from('medication_logs')
      .insert({
        medication_id: medicationId,
        user_id: user.id,
        date: today,
        taken_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(error.message);
    }

    await fetchMedications();
  };

  return {
    medications,
    loading,
    error,
    addMedication,
    deleteMedication,
    markAsTaken,
    refetch: fetchMedications,
  };
};
