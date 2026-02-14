import { useState } from 'react';
import { Pill, Clock, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { MedicationWithLog } from '../types';
import { formatTime } from '../utils/helpers';
import { Button } from './Button';
import { Card, CardBody } from './Card';

interface MedicationCardProps {
  medication: MedicationWithLog;
  onMarkAsTaken: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isPatientView: boolean;
}

export const MedicationCard = ({
  medication,
  onMarkAsTaken,
  onDelete,
  isPatientView,
}: MedicationCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMarkAsTaken = async () => {
    try {
      setIsLoading(true);
      await onMarkAsTaken(medication.id);
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      alert(error instanceof Error ? error.message : 'Failed to mark medication as taken');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${medication.name}?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(medication.id);
    } catch (error) {
      console.error('Error deleting medication:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete medication');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card variant="elevated" className="hover:shadow-xl transition-shadow duration-300">
      <CardBody className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Icon */}
            <div
              className={`
                p-3 rounded-xl
                ${medication.is_taken_today ? 'bg-green-100' : medication.is_overdue ? 'bg-red-100' : 'bg-primary-100'}
              `}
            >
              <Pill
                className={`w-6 h-6 ${
                  medication.is_taken_today ? 'text-green-600' : medication.is_overdue ? 'text-red-600' : 'text-primary-600'
                }`}
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {medication.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{medication.dosage}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(medication.time_to_take)}</span>
                </div>
                
                {medication.is_taken_today && medication.today_log && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Taken today</span>
                  </div>
                )}
                
                {medication.is_overdue && !medication.is_taken_today && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Overdue</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            {isPatientView && !medication.is_taken_today && (
              <Button
                size="sm"
                onClick={handleMarkAsTaken}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Mark as Taken
              </Button>
            )}
            
            {!isPatientView && (
              <Button
                size="sm"
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
