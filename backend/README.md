# FastAPI Backend for Loan App

A production-ready backend API built with FastAPI, Prisma Client Python, PostgreSQL, JWT authentication, and password hashing.

## Features

- ✅ **FastAPI** - Modern, fast web framework for building APIs
- ✅ **Prisma Client Python** - Type-safe database ORM
- ✅ **PostgreSQL** - Robust relational database
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - Bcrypt password encryption via passlib
- ✅ **Pydantic** - Data validation and serialization
- ✅ **CORS** - Configured for React Native development

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── database.py          # Prisma client initialization
│   ├── auth/                # Authentication modules
│   │   ├── jwt_handler.py   # JWT token utilities
│   │   ├── password.py      # Password hashing
│   │   └── dependencies.py  # Auth dependencies
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   └── routes/              # API endpoints
│       ├── auth.py          # Authentication routes
│       ├── users.py         # User management
│       ├── loans.py         # Loan management
│       └── payments.py      # Payment management
├── prisma/
│   └── schema.prisma        # Database schema
├── venv/                    # Python virtual environment
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
└── README.md               # This file
```

## Setup

### 1. Activate Virtual Environment

```bash
cd backend
source venv/bin/activate
```

### 2. Generate Prisma Client

```bash
prisma generate
```

### 3. Push Database Schema

```bash
prisma db push
```

### 4. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user info

### Users
- `GET /users` - List all users (admin only)
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user (admin only)

### Loans
- `POST /loans` - Create new loan
- `GET /loans` - List loans (with filters)
- `GET /loans/{id}` - Get loan by ID
- `PUT /loans/{id}` - Update loan
- `DELETE /loans/{id}` - Delete loan

### Payments
- `POST /payments` - Create new payment
- `GET /payments` - List payments (with filters)
- `GET /payments/loan/{loanId}` - Get payments for a loan
- `GET /payments/{id}` - Get payment by ID
- `PUT /payments/{id}` - Update payment
- `DELETE /payments/{id}` - Delete payment

## Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret key for JWT signing
- `JWT_ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Access token expiry (default: 15)
- `REFRESH_TOKEN_EXPIRE_DAYS` - Refresh token expiry (default: 7)
- `CORS_ORIGINS` - Comma-separated list of allowed origins

## Database Schema

### User
- id (UUID)
- name
- email (unique)
- phone (optional)
- password (hashed)
- role (user/admin)
- loans (relation)

### Loan
- id (UUID)
- borrowerName
- amount
- interestRate
- loanTerm
- startDate
- status (pending/active/completed/defaulted)
- monthlyPayment
- userId (foreign key)
- payments (relation)

### Payment
- id (UUID)
- loanId (foreign key)
- amount
- date
- status (pending/completed/failed)

## Development

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Update Database Schema

After modifying `prisma/schema.prisma`:

```bash
prisma db push
prisma generate
```

### Run in Development Mode

```bash
uvicorn app.main:app --reload --port 8000
```

## Testing

You can test the API using:
- Swagger UI at `/docs`
- curl commands
- Postman
- Your React Native app

Example curl request:

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123","role":"user"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```
