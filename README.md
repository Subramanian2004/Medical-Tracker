# MedsTracker - Medication Tracking Application

A comprehensive medication tracking application built with React, TypeScript, and Supabase that helps patients remember their medications and notifies caretakers when doses are missed.

## 🚀 Features

### Patient Features
- ✅ Mark medications as taken for the day
- 📊 View all medications with status (taken/pending/overdue)
- 🔔 Visual indicators for overdue medications
- 📱 Clean, intuitive interface

### Caretaker Features
- ➕ Add new medications with dosage and timing
- ⏰ Set reminder windows for each medication
- 🗑️ Delete medications
- 📧 Email notifications when patient misses medication (via Supabase)
- 📈 Dashboard with medication statistics

### Dual Role Support
- 🔄 Switch between Patient and Caretaker views
- 👥 Single account for both patient and caretaker
- 🔐 Secure authentication with Supabase Auth

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Backend**: Supabase (Auth + Database)
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Basic knowledge of React and TypeScript

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd meds-tracker-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to initialize (takes ~2 minutes)
3. Go to Project Settings > API
4. Copy your project URL and anon key

### 4. Create Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL to create all necessary tables, policies, and functions

### 5. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🗂️ Project Structure

```
meds-tracker-app/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── MedicationCard.tsx
│   │   ├── AddMedicationForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useMedications.ts
│   ├── lib/              # Library configurations
│   │   ├── supabase.ts
│   │   ├── validations.ts
│   │   └── AuthContext.tsx
│   ├── pages/            # Page components
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   └── DashboardPage.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── supabase-schema.sql   # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 📱 Usage

### Sign Up
1. Click "Sign Up" on the login page
2. Enter your email and password
3. Optionally add a caretaker email for notifications
4. Create your account

### Adding Medications (Caretaker View)
1. Switch to "Caretaker" mode in the dashboard
2. Click "Add Medication"
3. Fill in:
   - Medication name
   - Dosage (e.g., "100mg", "2 tablets")
   - Time to take (24-hour format)
   - Reminder window (how long before alerting caretaker)
4. Click "Add Medication"

### Taking Medications (Patient View)
1. Switch to "Patient" mode in the dashboard
2. View all medications for the day
3. Click "Mark as Taken" when you take a medication
4. Status updates automatically

## 🔒 Security Features

- **Row Level Security (RLS)**: All database queries are protected
- **Input Sanitization**: XSS prevention on all inputs
- **Type Safety**: Full TypeScript coverage
- **Secure Authentication**: Handled by Supabase Auth
- **Protected Routes**: Authentication required for dashboard

## 🎨 Key Design Decisions

### Architecture
- **Component-based**: Modular, reusable components
- **Custom hooks**: Separation of business logic from UI
- **Context API**: Global auth state management
- **Type-safe**: Strict TypeScript with no `any` types

### Performance
- **Optimized queries**: Fetch medications and logs in single calls
- **Memoization**: Callbacks memoized with useCallback
- **Efficient updates**: Only refetch when needed
- **Lazy loading**: Components loaded on-demand via routing

### Error Handling
- **Try-catch blocks**: All async operations wrapped
- **User feedback**: Clear error messages displayed
- **Fallback states**: Loading and error states for all components
- **Input validation**: Client-side validation with Zod

## 📧 Email Notifications

To enable email notifications for missed medications:

1. Set up a Supabase Edge Function to run periodically
2. Use the `check_overdue_medications()` SQL function
3. Configure Supabase Auth email templates
4. Set up SMTP settings in Supabase

See [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Settings > Environment
6. Deploy!

## 🧪 Testing Checklist

- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Add medication in caretaker view
- [ ] Mark medication as taken in patient view
- [ ] Verify overdue status appears after reminder window
- [ ] Delete medication in caretaker view
- [ ] Test form validations
- [ ] Test responsive design on mobile
- [ ] Verify logout functionality
- [ ] Test error states (network failures)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons
- [React Hook Form](https://react-hook-form.com) for form handling
- [Zod](https://zod.dev) for validation

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Supabase logs for backend issues

---

Built with ❤️ for better medication management
