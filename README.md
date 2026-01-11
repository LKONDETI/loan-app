# Loan App

A full-stack React Native loan management application with a FastAPI backend, PostgreSQL database, and comprehensive loan processing features.

## 📱 Overview

This is a mobile-first loan application that allows users to:
- Browse and apply for different types of loans (Personal, Business, Auto, Mortgage)
- Manage loan applications and track their status
- View loan details, payment schedules, and progress
- Upload documents and manage personal information
- Secure authentication and user profile management

## 🏗️ Tech Stack

### Frontend (React Native)
- **Framework**: Expo ~54.0.30
- **Language**: TypeScript 5.9.2
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **UI Components**: React Native with Expo Vector Icons
- **State Management**: React Hooks

### Backend (FastAPI)
- **Framework**: FastAPI 0.109.0
- **Language**: Python
- **Database ORM**: Prisma 0.11.0
- **Database**: PostgreSQL
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Passlib with bcrypt
- **Server**: Uvicorn 0.27.0

## 📁 Project Structure

```
loan-app/
├── src/                          # React Native source code
│   ├── screens/                  # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── LoansListScreen.tsx
│   │   ├── LoanApplicationScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/               # Navigation configuration
│   └── components/               # Reusable components
├── backend/                      # FastAPI backend
│   ├── app/                      # Application code
│   ├── prisma/                   # Database schema and migrations
│   │   └── schema.prisma
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables
│   └── venv/                     # Python virtual environment
├── assets/                       # Images and static files
├── maestro/                      # E2E test flows
├── db.json                       # Mock JSON server data
└── package.json                  # Node.js dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+
- PostgreSQL
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Expo development server**:
   ```bash
   npm start
   ```

3. **Run on specific platform**:
   ```bash
   npm run ios       # iOS
   npm run android   # Android
   npm run web       # Web browser
   ```

4. **(Optional) Start mock JSON server** (for development without backend):
   ```bash
   npm run api
   ```
   This starts json-server on `http://localhost:3001`

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your database connection and other settings.

5. **Set up PostgreSQL database**:
   - Create a new PostgreSQL database
   - Update `DATABASE_URL` in `.env` with your connection string

6. **Run Prisma migrations**:
   ```bash
   prisma generate
   prisma db push
   ```

7. **Start the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`

8. **View API documentation**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## 🎨 Features

### Authentication
- User registration with email/phone
- Secure login with JWT tokens
- Password hashing with bcrypt
- Session management

### Loan Management
- **Loan Types**: Personal, Business, Auto, Mortgage
- **Application Process**: Multi-step form with tabs
  - Details: Loan amount, term, purpose
  - Personal Info: Name, email, phone
  - Income: Annual income, employment status
  - Documents: File upload
- **Loan Tracking**: View all loans with status badges
- **Status Types**: Active, Pending, Completed

### User Interface
- **Bottom Tab Navigation**: Home, My Loans, Profile
- **Color Scheme**:
  - Primary Teal: `#1FA29C`
  - Primary Navy: `#1B2B5C`
  - Status colors for loan states
- **Responsive Design**: Works on iOS, Android, and Web

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `GET /users/{id}` - Get user by ID

### Loans
- `GET /loans` - Get all loans
- `POST /loans` - Create new loan application
- `GET /loans/{id}` - Get loan details
- `PUT /loans/{id}` - Update loan
- `DELETE /loans/{id}` - Delete loan

### Payments
- `GET /payments` - Get all payments
- `POST /payments` - Record new payment
- `GET /payments/{id}` - Get payment details

## 🧪 Testing

### E2E Testing with Maestro
The project includes Maestro test flows for automated UI testing:

```bash
./run-tests.sh
```

Test documentation:
- `MAESTRO_GUIDE.md` - Complete testing guide
- `MAESTRO_TUTORIAL.md` - Step-by-step tutorial
- `MAESTRO_QUICK_REFERENCE.md` - Quick command reference

## 🔐 Test Credentials

**User 1:**
- Email: `john@example.com`
- Password: `password123`

**User 2:**
- Email: `jane@example.com`
- Password: `password123`

**Admin:**
- Email: `admin@loanapp.com`
- Password: `admin123`

## 📝 Development Notes

### Database Schema
The Prisma schema includes:
- Users table with authentication fields
- Loans table with application details
- Payments table for tracking loan payments
- Relationships between entities

### Environment Variables
Key environment variables (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

## 🛠️ Scripts

### Frontend
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run api` - Start mock JSON server

### Backend
- `uvicorn app.main:app --reload` - Start FastAPI server with hot reload
- `prisma generate` - Generate Prisma client
- `prisma db push` - Push schema changes to database
- `prisma studio` - Open Prisma Studio (database GUI)

## 📚 Documentation

- `SCREENS.md` - Detailed screen documentation
- `MAESTRO_*.md` - Testing documentation
- `PROJECT_STATUS.md` - Project status and progress
- `VERIFICATION_REPORT.md` - Verification and testing reports

## 🚧 Future Enhancements

- [ ] Real-time notifications for loan status updates
- [ ] Advanced document upload with image picker
- [ ] Credit score integration
- [ ] Payment gateway integration
- [ ] Loan calculator with amortization schedule
- [ ] Admin dashboard for loan approval workflow
- [ ] Push notifications
- [ ] Biometric authentication
- [ ] Multi-language support

## 📄 License

ISC

## 👥 Author

Your Name

---

**Note**: This is a development project. For production deployment, ensure proper security measures, environment configuration, and compliance with financial regulations.
