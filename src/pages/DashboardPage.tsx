import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Plus, User, LogOut, Users } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useMedications } from '../hooks/useMedications';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { MedicationCard } from '../components/MedicationCard';
import { AddMedicationForm } from '../components/AddMedicationForm';
import { MedicationFormData } from '../lib/validations';
import { UserRole } from '../types';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { medications, loading, addMedication, deleteMedication, markAsTaken } = useMedications();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddMedication = async (data: MedicationFormData) => {
    try {
      await addMedication(
        data.name,
        data.dosage,
        data.time_to_take,
        data.reminder_window_minutes
      );
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding medication:', error);
      alert(error instanceof Error ? error.message : 'Failed to add medication');
    }
  };

  const takenCount = medications.filter(m => m.is_taken_today).length;
  const overdueCount = medications.filter(m => m.is_overdue).length;
  const totalCount = medications.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold font-display text-gray-900">
                MedsTracker
              </h1>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentRole('patient')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentRole === 'patient'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Patient
                </button>
                <button
                  onClick={() => setCurrentRole('caretaker')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentRole === 'caretaker'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  Caretaker
                </button>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Medications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCount}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-xl">
                <Pill className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taken Today</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{takenCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Pill className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{overdueCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Pill className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentRole === 'patient' ? 'My Medications' : 'Manage Medications'}
          </h2>
          {currentRole === 'caretaker' && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Medication
            </Button>
          )}
        </div>

        {/* Caretaker Info */}
        {user?.caretaker_email && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Caretaker Email:</strong> {user.caretaker_email}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              They will be notified if medications are missed
            </p>
          </div>
        )}

        {/* Medications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : medications.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No medications added yet
            </h3>
            <p className="text-gray-600 mb-6">
              {currentRole === 'caretaker'
                ? 'Add medications to get started with tracking'
                : 'Ask your caretaker to add medications'}
            </p>
            {currentRole === 'caretaker' && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Medication
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onMarkAsTaken={markAsTaken}
                onDelete={deleteMedication}
                isPatientView={currentRole === 'patient'}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Medication Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Medication"
      >
        <AddMedicationForm
          onSubmit={handleAddMedication}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
