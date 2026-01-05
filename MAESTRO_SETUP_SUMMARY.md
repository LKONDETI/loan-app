# Maestro Testing - Complete Setup Summary

## What Was Created

### 1. **Test Flows** (5 comprehensive tests)
```
maestro/flows/
├── 01_login.yaml                    # User login
├── 02_register.yaml                 # New user registration
├── 03_dashboard_navigation.yaml     # Bottom tab navigation
├── 04_loan_application.yaml         # Complete loan application
└── 05_profile_logout.yaml           # Profile & logout
```

### 2. **Documentation Files**
- **MAESTRO_GUIDE.md** - Complete feature reference
- **MAESTRO_TUTORIAL.md** - Step-by-step learning guide
- **MAESTRO_QUICK_REFERENCE.md** - Quick command reference
- **run-tests.sh** - Interactive test runner script

---

## Quick Start (3 Steps)

### Step 1: Start Your App
```bash
npm start
# Select: i (iOS) or a (Android)
```

### Step 2: Open New Terminal
```bash
cd loan-app
```

### Step 3: Run Tests
```bash
# Option A: Interactive menu
./run-tests.sh

# Option B: Run specific test
maestro test maestro/flows/01_login.yaml

# Option C: Run all tests
maestro test maestro/flows/
```

---

## What Each Test Does

### 01_login.yaml (2-3 seconds)
Tests basic login functionality:
1. Verify login screen appears
2. Enter email credentials
3. Enter password
4. Click sign in
5. Verify dashboard loads

**Test Data**: john@example.com / password123

### 02_register.yaml (8-10 seconds)
Tests user registration:
1. Click sign up link
2. Fill registration form (6 fields)
3. Scroll to see all fields
4. Submit registration
5. Verify success message
6. Return to login

### 03_dashboard_navigation.yaml (5-6 seconds)
Tests bottom tab navigation:
1. Login to dashboard
2. Verify Home tab
3. Navigate to My Loans tab
4. Navigate to Profile tab
5. Return to Home tab

### 04_loan_application.yaml (12-15 seconds)
Tests complete loan application:
1. Login
2. Select loan type (Personal)
3. Fill Details tab (amount, term, purpose)
4. Fill You tab (personal info)
5. Fill Income tab (salary, employment)
6. View Documents tab
7. Submit application

### 05_profile_logout.yaml (6-8 seconds)
Tests profile management:
1. Login with admin account
2. Navigate to Profile tab
3. Click menu items (Personal info, Documents, Settings)
4. Scroll to find logout
5. Click logout button
6. Verify back at login screen

---

## Test Scenarios Covered

### Authentication Flow ✅
- User login with valid credentials
- New user registration with form validation
- Complete authentication cycle
- Logout functionality

### Navigation Flow ✅
- Bottom tab navigation
- Moving between Home, My Loans, and Profile
- Back navigation
- Screen transitions

### Form Interactions ✅
- Text input across multiple fields
- Form submission
- Tab-based form navigation
- Input validation (implied)

### API Integration ✅
- Fetching loans from JSON Server
- Creating new users via API
- Real data display in lists

---

## How to Use run-tests.sh

```bash
# Make it executable (already done)
chmod +x run-tests.sh

# Run interactive menu
./run-tests.sh

# Follow the on-screen menu:
# 1. Run all tests
# 2. Run login test
# 3. Run registration test
# ... etc
```

The script provides:
- ✅ Easy menu selection
- ✅ Colored output for readability
- ✅ Test status tracking
- ✅ Report generation
- ✅ Pass/fail counts

---

## Understanding Maestro Concepts

### What is Maestro?
Maestro is a mobile testing framework that:
- Reads test flows from YAML files
- Interacts with your app like a real user
- Verifies expected UI elements
- Reports pass/fail results
- Works with iOS and Android

### How Tests Work
1. **Read YAML File** - Maestro reads your test flow
2. **Find Element** - Uses text, placeholders, or coordinates
3. **Perform Action** - Taps, types, scrolls, etc.
4. **Verify Result** - Checks if expected UI appeared
5. **Report Result** - Shows pass or fail

### Example Flow
```yaml
# Find and click sign in button
- action: tap
  target:
    text: "Sign in"

# Type text in input
- action: input
  text: "john@example.com"

# Wait for dashboard to load
- action: wait
  timeout: 3

# Verify we're logged in
- action: assertVisible
  text: "My Loans"
```

---

## Key Maestro Actions

| Action | Purpose | Example |
|--------|---------|---------|
| `tap` | Click element | Tap button, input field |
| `input` | Type text | Enter email, password |
| `wait` | Pause execution | Wait for animation |
| `scroll` | Move content | Scroll down for hidden elements |
| `assertVisible` | Verify element | Check success message |
| `assertNotVisible` | Verify absent | Check error gone |
| `takeScreenshot` | Capture screen | Debug what's visible |
| `comment` | Document test | Explain test steps |

---

## Best Practices for Tests

### 1. Keep Tests Focused
- One test = one feature
- Don't test multiple features in one flow
- Easy to debug when something breaks

### 2. Use Descriptive Comments
```yaml
- action: comment
  description: "Step 1: Verify login screen appears"
```

### 3. Wait for Transitions
```yaml
- action: tap
  target:
    text: "Submit"

- action: wait
  timeout: 2  # Wait for navigation

- action: assertVisible
  text: "Success"
```

### 4. Test Real Scenarios
- Register → Login → Use app → Logout
- Users apply for loans, not just click buttons
- Test the user journey, not just UI elements

### 5. Make Tests Independent
- Each test can run standalone
- No dependencies on other tests
- Tests don't affect each other

---

## Troubleshooting

### "Element not found" Error
```bash
# 1. Take a screenshot to see what's on screen
- action: takeScreenshot

# 2. Use exact text visible on screen
- action: tap
  target:
    text: "Exact text from screenshot"

# 3. If hidden, scroll first
- action: scroll
  direction: down
- action: tap
  target:
    text: "Hidden element"
```

### Test Hangs or Times Out
```bash
# 1. Increase timeout
- action: wait
  timeout: 5

# 2. Check element appears with assertion
- action: assertVisible
  text: "Loading..."
```

### Works Locally, Fails in CI/CD
```bash
# 1. Increase all timeouts
- action: wait
  timeout: 10  # Higher for CI

# 2. Add extra waits between actions
- action: wait
  timeout: 2
```

---

## Next Steps

### Immediate
1. ✅ Run `./run-tests.sh` to see tests in action
2. ✅ Review MAESTRO_TUTORIAL.md for deep understanding
3. ✅ Modify tests to match your app changes

### Short Term
1. Add tests for error scenarios
2. Test with invalid credentials
3. Test network failures
4. Test edge cases

### Long Term
1. Add more comprehensive tests
2. Integrate with GitHub Actions CI/CD
3. Generate automated reports
4. Monitor test coverage
5. Create test for every new feature

---

## File Locations

```
loan-app/
├── maestro/
│   └── flows/
│       ├── 01_login.yaml
│       ├── 02_register.yaml
│       ├── 03_dashboard_navigation.yaml
│       ├── 04_loan_application.yaml
│       └── 05_profile_logout.yaml
├── MAESTRO_GUIDE.md
├── MAESTRO_TUTORIAL.md
├── MAESTRO_QUICK_REFERENCE.md
├── run-tests.sh
└── ... (other app files)
```

---

## Commands Reference

```bash
# Start app
npm start

# Run specific test
maestro test maestro/flows/01_login.yaml

# Run all tests
maestro test maestro/flows/

# Run with verbose output
maestro test maestro/flows/01_login.yaml --verbose

# Generate junit report
maestro test maestro/flows/ --format junit

# Interactive test runner
./run-tests.sh

# Help
maestro --help
```

---

## Success Indicators

When tests pass, you'll see:
```
✅ 01_login.yaml passed (2.5s)
✅ 02_register.yaml passed (8.3s)
✅ 03_dashboard_navigation.yaml passed (5.1s)
✅ 04_loan_application.yaml passed (12.4s)
✅ 05_profile_logout.yaml passed (6.8s)

All tests passed! ✅
```

---

## Resources

- 📖 [Maestro Official Docs](https://maestro.mobile.dev)
- 💻 [GitHub Repository](https://github.com/mobile-dev-inc/maestro)
- 🎯 [Best Practices](https://maestro.mobile.dev/best-practices)
- 🔗 [Community](https://github.com/mobile-dev-inc/maestro/discussions)

---

## Need Help?

If tests aren't working:
1. Check app is running: `npm start`
2. Verify test file syntax (YAML format)
3. Take screenshot: Add `takeScreenshot` action
4. Check exact UI text matches test
5. Increase timeouts if too fast
6. Review MAESTRO_TUTORIAL.md

---

**Happy Testing! 🎉**

Your loan app now has comprehensive UI test coverage covering:
- ✅ Authentication
- ✅ Navigation
- ✅ Forms
- ✅ API Integration
- ✅ User Journeys
