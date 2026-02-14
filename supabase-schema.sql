-- MedsTracker Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  caretaker_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Medications table
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  time_to_take TEXT NOT NULL, -- Format: "HH:MM"
  reminder_window_minutes INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Medications policies
CREATE POLICY "Users can view their own medications"
  ON public.medications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medications"
  ON public.medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications"
  ON public.medications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications"
  ON public.medications FOR DELETE
  USING (auth.uid() = user_id);

-- Medication logs table
CREATE TABLE IF NOT EXISTS public.medication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- Format: "YYYY-MM-DD"
  taken_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(medication_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

-- Medication logs policies
CREATE POLICY "Users can view their own logs"
  ON public.medication_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON public.medication_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON public.medication_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON public.medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_user_id ON public.medication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_medication_id ON public.medication_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_medication_logs_date ON public.medication_logs(date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for medications table
CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON public.medications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check for overdue medications and send emails
-- This would be called by a scheduled Supabase Edge Function
CREATE OR REPLACE FUNCTION check_overdue_medications()
RETURNS void AS $$
DECLARE
  med_record RECORD;
  current_time TIME;
  scheduled_time TIME;
  deadline_time TIME;
  today_date TEXT;
BEGIN
  today_date := TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD');
  current_time := CURRENT_TIME;

  FOR med_record IN
    SELECT 
      m.id,
      m.name,
      m.time_to_take,
      m.reminder_window_minutes,
      u.email as user_email,
      u.caretaker_email
    FROM public.medications m
    JOIN public.users u ON m.user_id = u.id
    WHERE u.caretaker_email IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.medication_logs l
        WHERE l.medication_id = m.id
        AND l.date = today_date
      )
  LOOP
    scheduled_time := med_record.time_to_take::TIME;
    deadline_time := scheduled_time + (med_record.reminder_window_minutes || ' minutes')::INTERVAL;
    
    IF current_time > deadline_time THEN
      -- Send email notification (implement with Supabase Edge Function)
      -- This is a placeholder - actual implementation would use pg_net or Edge Functions
      RAISE NOTICE 'Medication % for user % is overdue. Notify: %',
        med_record.name,
        med_record.user_email,
        med_record.caretaker_email;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
