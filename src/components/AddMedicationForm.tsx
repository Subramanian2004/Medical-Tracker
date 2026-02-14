import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicationSchema, MedicationFormData } from '../lib/validations';
import { Input } from './Input';
import { Button } from './Button';

interface AddMedicationFormProps {
  onSubmit: (data: MedicationFormData) => Promise<void>;
  onCancel: () => void;
}

export const AddMedicationForm = ({ onSubmit, onCancel }: AddMedicationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      reminder_window_minutes: 30,
    },
  });

  const handleFormSubmit = async (data: MedicationFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Medication Name"
        placeholder="e.g., Aspirin"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Dosage"
        placeholder="e.g., 100mg"
        error={errors.dosage?.message}
        helperText="Include the amount and unit (e.g., 100mg, 2 tablets)"
        {...register('dosage')}
      />

      <Input
        label="Time to Take"
        type="time"
        error={errors.time_to_take?.message}
        helperText="When should this medication be taken daily?"
        {...register('time_to_take')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reminder Window (minutes)
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          {...register('reminder_window_minutes', { valueAsNumber: true })}
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
          <option value={180}>3 hours</option>
        </select>
        {errors.reminder_window_minutes && (
          <p className="mt-1 text-sm text-red-600">
            {errors.reminder_window_minutes.message}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          How long after the scheduled time before sending an alert to caretaker
        </p>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          Add Medication
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
