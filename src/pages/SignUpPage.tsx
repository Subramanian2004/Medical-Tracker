import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill } from 'lucide-react';
import { signUpSchema, SignUpFormData } from '../lib/validations';
import { useAuth } from '../lib/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError(null);
      await signUp(
        data.email,
        data.password,
        data.caretakerEmail || undefined
      );
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">
            MedsTracker
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Sign Up Form */}
        <Card variant="elevated">
          <CardBody className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign Up</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Account created successfully! Redirecting...
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                type="email"
                label="Email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
                helperText="At least 6 characters"
                {...register('password')}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Input
                type="email"
                label="Caretaker Email (Optional)"
                placeholder="caretaker@email.com"
                error={errors.caretakerEmail?.message}
                helperText="Email address to notify if medication is missed"
                {...register('caretakerEmail')}
              />

              <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
