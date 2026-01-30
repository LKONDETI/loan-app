import json
import asyncio
import os
import sys
from prisma import Prisma
from passlib.context import CryptContext

# Add parent directory to path to import app modules if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Initialize password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def main():
    print("🚀 Starting data migration...")
    
    # Initialize Prisma
    db = Prisma()
    await db.connect()
    
    try:
        # Read db.json
        # Read db.json
        db_json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'db.json')
        print(f"Reading data from: {db_json_path}")
        
        with open(db_json_path, 'r') as f:
            data = json.load(f)
            
        users_map = {}  # Map old ID to new UUID
        loans_map = {}  # Map old ID to new UUID
        
        # 1. Migrate Users
        print(f"\nMigrating {len(data.get('users', []))} users...")
        for user in data.get('users', []):
            try:
                # Handle potential duplicate emails by skipping or appending timestamp?
                # For now assuming db.json has unique emails
                
                # Check if user with email already exists
                existing = await db.user.find_unique(where={'email': user['email']})
                if existing:
                    print(f"  ⚠️ User {user['email']} already exists. Skipping creation, mapping to existing ID.")
                    users_map[str(user['id'])] = existing.id
                    continue

                new_user = await db.user.create(
                    data={
                        'name': user['name'],
                        'email': user['email'],
                        'phone': user.get('phone'),
                        'password': hash_password(user['password']),
                        'role': user.get('role', 'user')
                    }
                )
                users_map[str(user['id'])] = new_user.id
                print(f"  ✅ Created user: {user['name']}")
            except Exception as e:
                print(f"  ❌ Failed to create user {user['name']}: {e}")

        # 2. Migrate Loans
        print(f"\nMigrating {len(data.get('loans', []))} loans...")
        for loan in data.get('loans', []):
            try:
                old_user_id = str(loan['userId']) if 'userId' in loan else None
                # Try to find userId from borrowerName if strictly needed? 
                # Wait, the db.json structure showed earlier doesn't explicitly show userId in loans array in view_file output?
                # Let's check the db.json structure again if needed, but usually json-server uses userId.
                # Actually, in the view_file output earlier (Step 54), loans entries looked like:
                # { "id": "1", "borrowerName": "John Doe", "amount": 50000, ... }
                # They DID NOT have userId! They rely on borrowerName? Or maybe json-server was loosely coupled?
                # Wait, looking at db.json again (Step 54):
                # Loans have "borrowerName". 
                # Users have "name".
                # I should probably map by name if userId keys are missing.
                
                owner_id = None
                
                # Check if there is a 'userId' field
                if 'userId' in loan:
                     if str(loan['userId']) in users_map:
                         owner_id = users_map[str(loan['userId'])]
                
                # Fallback: Match by borrowerName
                if not owner_id:
                     borrower_name = loan.get('borrowerName')
                     # Find user ID by name from the users we just created/mapped
                     # This is a bit inefficient but fine for migration
                     for uid_old, uid_new in users_map.items():
                         # Find the user object in data['users'] with uid_old
                         original_user = next((u for u in data['users'] if str(u['id']) == uid_old), None)
                         if original_user and original_user['name'] == borrower_name:
                             owner_id = uid_new
                             break
                
                if not owner_id:
                    print(f"  ⚠️ Warning: Could not find user for loan {loan['id']} (borrower: {loan.get('borrowerName')}). Skipping.")
                    continue

                # Ensure date format
                # db.json dates are likely strings "YYYY-MM-DD". Prisma needs ISO-8601 datetime.
                # We'll just append T00:00:00Z if it's just a date
                start_date = loan['startDate']
                if len(start_date) == 10: # YYYY-MM-DD
                    start_date += "T00:00:00.000Z"
                    
                new_loan = await db.loan.create(
                    data={
                        'borrowerName': loan['borrowerName'],
                        'amount': float(loan['amount']),
                        'interestRate': float(loan['interestRate']),
                        'loanTerm': int(loan['loanTerm']),
                        'startDate': start_date,
                        'status': loan['status'],
                        'monthlyPayment': float(loan['monthlyPayment']),
                        'userId': owner_id
                    }
                )
                loans_map[str(loan['id'])] = new_loan.id
                print(f"  ✅ Created loan for: {loan['borrowerName']}")
                
            except Exception as e:
                print(f"  ❌ Failed to create loan {loan['id']}: {e}")

        # 3. Migrate Payments
        print(f"\nMigrating {len(data.get('payments', []))} payments...")
        for payment in data.get('payments', []):
            try:
                old_loan_id = str(payment['loanId'])
                if old_loan_id not in loans_map:
                    print(f"  ⚠️ Warning: Could not find loan {old_loan_id} for payment {payment['id']}. Skipping.")
                    continue
                
                payment_date = payment['date']
                if len(payment_date) == 10:
                    payment_date += "T00:00:00.000Z"
                
                await db.payment.create(
                    data={
                        'loanId': loans_map[old_loan_id],
                        'amount': float(payment['amount']),
                        'date': payment_date,
                        'status': payment.get('status', 'completed')
                    }
                )
                print(f"  ✅ Created payment for loan {old_loan_id}")
            except Exception as e:
                print(f"  ❌ Failed to create payment {payment['id']}: {e}")

        print("\n✨ Migration completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
