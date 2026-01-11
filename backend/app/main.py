from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import connect_db, disconnect_db
from app.routes import auth, users, loans, payments


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup: Connect to database
    await connect_db()
    print("✅ Connected to database")
    yield
    # Shutdown: Disconnect from database
    await disconnect_db()
    print("✅ Disconnected from database")


# Create FastAPI application
app = FastAPI(
    title="Loan App API",
    description="RESTful API for loan management application with JWT authentication",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(loans.router)
app.include_router(payments.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Loan App API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
