# MedsTracker - Architecture Documentation

## Overview

MedsTracker is a medication tracking application built with a modern React/TypeScript stack. This document explains the architecture decisions, component structure, and key design patterns.

## Architecture Principles

### 1. **Separation of Concerns**
- UI components are separate from business logic
- API calls isolated in custom hooks
- Validation logic centralized in schema files
- Utilities separated by function

### 2. **Type Safety**
- Strict TypeScript configuration
- No `any` types allowed
- Comprehensive interface definitions
- Zod schemas for runtime validation

### 3. **Security First**
- Row Level Security (RLS) on all tables
- Input sanitization
- Protected routes
- Secure authentication flow

### 4. **Performance Optimization**
- Memoized callbacks with useCallback
- Efficient data fetching strategies
- Optimized re-renders
- Lazy loading of routes

## Technology Stack Rationale

### Frontend

**React 18**
- Industry standard
- Excellent TypeScript support
- Large ecosystem
- Concurrent rendering features

**TypeScript**
- Type safety prevents runtime errors
- Better developer experience
- Self-documenting code
- Easier refactoring

**Vite**
- Extremely fast HMR (Hot Module Replacement)
- Optimized production builds
- Modern ES modules support
- Better than Create React App

**Tailwind CSS**
- Utility-first approach
- No CSS files to manage
- Consistent design system
- Easy responsive design
- Small production bundle

**React Router v6**
- Declarative routing
- Nested routes support
- Protected routes
- Type-safe navigation

**React Hook Form + Zod**
- Performant form handling
- Schema-based validation
- Type-safe forms
- Great developer experience

### Backend

**Supabase**
- PostgreSQL database (reliable & powerful)
- Built-in authentication
- Row Level Security
- Real-time capabilities (if needed later)
- Free tier generous enough
- Easy to set up and deploy

## Application Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level components
├── hooks/              # Custom React hooks (business logic)
├── lib/                # Third-party library configurations
├── types/              # TypeScript type definitions
├── utils/              # Pure utility functions
└── App.tsx            # Root component with routing
```

### Component Architecture

**Atomic Design Principles:**

1. **Atoms** (Button, Input, Card)
   - Smallest reusable components
   - No business logic
   - Pure UI presentation

2. **Molecules** (MedicationCard, AddMedicationForm)
   - Combinations of atoms
   - Some component-specific logic
   - Reusable in different contexts

3. **Organisms** (Dashboard sections)
   - Complex components
   - Business logic included
   - May contain side effects

4. **Pages** (LoginPage, DashboardPage)
   - Route-level components
   - Compose organisms
   - Handle page-specific state

## State Management

### Global State
**AuthContext**: Manages authentication state
- User information
- Loading states
- Auth methods (signIn, signUp, signOut)

**Why Context API over Redux?**
- Simpler for this scale
- Less boilerplate
- Built-in to React
- Sufficient for auth state
- Can scale with additional contexts if needed

### Local State
**useMedications Hook**: Manages medication data
- Fetching medications
- CRUD operations
- Derived state (is_taken_today, is_overdue)

**Component State**: UI-specific state
- Modal open/close
- Form state (handled by React Hook Form)
- Loading indicators

## Data Flow

```
User Action (Click/Submit)
      ↓
Component Event Handler
      ↓
Custom Hook or Context Method
      ↓
Supabase Client API Call
      ↓
Database (with RLS checks)
      ↓
Response Back to Hook
      ↓
State Update
      ↓
Component Re-render
```

## Security Implementation

### 1. Authentication
- Email/password via Supabase Auth
- Session tokens stored securely
- Auto-refresh tokens
- Logout clears all session data

### 2. Authorization
- Row Level Security (RLS) policies
- Users can only access their own data
- Enforced at database level
- Cannot be bypassed from frontend

### 3. Input Validation
- Client-side: Zod schemas
- Server-side: PostgreSQL constraints
- XSS prevention: Input sanitization
- SQL injection: Prevented by Supabase client

### 4. Protected Routes
- ProtectedRoute wrapper component
- Checks authentication state
- Redirects to login if unauthenticated
- Loading state during auth check

## Error Handling Strategy

### 1. **API Errors**
```typescript
try {
  await someAPICall();
} catch (error) {
  console.error('Error:', error);
  alert(error instanceof Error ? error.message : 'Operation failed');
}
```

### 2. **Form Validation Errors**
- Zod schema validation
- React Hook Form error handling
- Inline error messages
- Field-level feedback

### 3. **Network Errors**
- Try-catch in all async operations
- User-friendly error messages
- Fallback UI states
- Retry mechanisms where appropriate

### 4. **Loading States**
- Skeleton screens or spinners
- Disabled buttons during operations
- Loading text feedback

## Performance Optimizations

### 1. **Efficient Queries**
```typescript
// Fetch medications and today's logs in one call
const { data: medsData } = await supabase
  .from('medications')
  .select('*')
  .eq('user_id', user.id);

const { data: logsData } = await supabase
  .from('medication_logs')
  .select('*')
  .eq('user_id', user.id)
  .eq('date', today);
```

### 2. **Memoization**
```typescript
// useMedications hook
const fetchMedications = useCallback(async () => {
  // fetch logic
}, [user]);
```

### 3. **Optimistic Updates** (Future Enhancement)
- Update UI immediately
- Rollback on failure
- Better perceived performance

### 4. **Code Splitting**
- Route-based splitting with React Router
- Lazy loading of pages
- Smaller initial bundle

## Database Schema Design

### Users Table
- Extends Supabase auth.users
- Stores caretaker_email for notifications
- Links to all user data

### Medications Table
- Stores medication details
- Time in HH:MM format for consistency
- Reminder window in minutes

### Medication Logs Table
- One log per medication per day
- UNIQUE constraint prevents duplicates
- Date in YYYY-MM-DD for easy querying

### Relationships
```
users (1) ────── (many) medications
                     │
                     │ (one medication)
                     │
                     └── (many) medication_logs
```

## Future Enhancements

### 1. **Email Notifications**
- Supabase Edge Function
- Cron job to check overdue medications
- Send emails via SMTP
- Implement using `check_overdue_medications()` function

### 2. **Real-time Updates**
- Use Supabase real-time subscriptions
- Live updates when caretaker adds medication
- Collaborative features

### 3. **Mobile App**
- React Native version
- Push notifications
- Offline support

### 4. **Analytics Dashboard**
- Medication adherence rates
- Historical tracking
- Reports generation

### 5. **Multiple Patients per Caretaker**
- Patient-caretaker relationships table
- Caretaker can manage multiple patients
- Patient can have multiple caretakers

## Testing Strategy (Recommended)

### Unit Tests
- Component rendering tests
- Hook tests
- Utility function tests
- Use: Jest + React Testing Library

### Integration Tests
- User flow tests
- API integration tests
- Use: Playwright or Cypress

### E2E Tests
- Critical user paths
- Sign up → Add medication → Mark as taken
- Use: Playwright

## Deployment Considerations

### Environment Variables
- Never commit `.env`
- Use platform-specific env var management
- Different values for dev/staging/prod

### Build Optimization
```bash
npm run build
# Creates optimized production bundle
# Tree-shaking removes unused code
# Minification reduces file size
```

### Monitoring (Recommended)
- Error tracking: Sentry
- Analytics: Google Analytics or Mixpanel
- Performance: Lighthouse CI

## Code Quality Practices

### 1. **TypeScript Strict Mode**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

### 2. **ESLint Rules**
- No `any` types
- Unused variables flagged
- React hooks rules enforced

### 3. **Code Organization**
- One component per file
- Co-located styles (if any)
- Consistent naming conventions
- Clear file structure

### 4. **Git Practices**
- Feature branches
- Descriptive commit messages
- Pull request reviews
- Conventional commits

## Scalability Considerations

### Current Scale
- Single user/patient per account
- Hundreds of medications
- Thousands of logs
- Works well on free tier

### Future Scale
- Database indexes already in place
- RLS policies optimized
- Can handle thousands of users
- May need:
  - Database connection pooling
  - CDN for static assets
  - Caching layer for API calls

## Conclusion

This architecture balances:
- **Simplicity**: Easy to understand and maintain
- **Security**: Multiple layers of protection
- **Performance**: Optimized for fast loading and updates
- **Scalability**: Room to grow
- **Developer Experience**: Type-safe, well-organized, documented

The modular structure allows for easy feature additions and modifications without affecting existing code.
