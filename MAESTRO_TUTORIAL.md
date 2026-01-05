# Step-by-Step Maestro Testing Tutorial

## Introduction
This tutorial will walk you through testing your Loan App using Maestro, from the basics to running complete test flows.

## Prerequisites
- ✅ Maestro installed
- ✅ React Native app: Loan App (ready to run)
- ✅ iOS Simulator or Android Emulator running
- ✅ Test flows created in `maestro/flows/`

---

## Part 1: Understanding Test Flow Structure

### What is a Test Flow?
A test flow is a YAML file that describes a sequence of user interactions with your app. Each action represents something a user does (tap, type, swipe, etc.).

### Basic Structure
```yaml
appId: com.loanapp              # Your app's identifier
---                             # Separator (required)
- action: comment               # Comments for documentation
  description: "Test description"

- action: tap                   # Action type
  target:                       # How to find the element
    text: "Button text"

- action: input                 # Type text
  text: "some text"

- action: assertVisible         # Verify element exists
  text: "Expected text"
```

---

## Part 2: Running Your First Test

### Step 1: Start Your App
Before running tests, your app must be running:

```bash
# Terminal 1: Start the Expo app
cd loan-app
npm start
```

Then select:
- Press `i` for iOS Simulator, or
- Press `a` for Android Emulator

### Step 2: Run the Login Test
In a new terminal:

```bash
# Terminal 2: Run the first test
maestro test maestro/flows/01_login.yaml
```

### Expected Output
```
✅ 01_login.yaml passed
```

### What Happened?
Maestro automatically:
1. Found the app on your simulator
2. Read the YAML file
3. Executed each action in order
4. Verified expected elements appeared
5. Reported success/failure

---

## Part 3: Understanding Test Actions

### 1. **Tap Action** - Click on elements
```yaml
- action: tap
  target:
    text: "Sign in"              # Find button by text
```

Other ways to find elements:
```yaml
# By exact text match
- action: tap
  target:
    text: "Sign in"

# By placeholder text
- action: tap
  target:
    text: "Email/Phone"

# Multiple options (tries in order)
- action: tap
  target:
    - text: "Create Account"
    - text: "Sign up"
```

### 2. **Input Action** - Type text
```yaml
- action: tap                   # First focus the input
  target:
    text: "Email/Phone"

- action: input                 # Then type
  text: "john@example.com"
```

### 3. **Wait Action** - Pause execution
```yaml
# Wait for a specific time (in seconds)
- action: wait
  timeout: 3                    # Wait up to 3 seconds

# Wait for an element to appear
- action: assertVisible
  text: "Dashboard"             # Will fail if not visible
```

### 4. **Scroll Action** - Move content
```yaml
# Scroll down to see more content
- action: scroll
  direction: down               # or "up"

# Scroll to find an element
- action: scroll
  direction: down
  
- action: assertVisible
  text: "Log out"               # Element appears after scroll
```

### 5. **Assert Actions** - Verify UI state
```yaml
# Verify element is visible
- action: assertVisible
  text: "My Loans"

# Verify element is NOT visible
- action: assertNotVisible
  text: "Loading..."
```

### 6. **Comment Action** - Document tests
```yaml
- action: comment
  description: "This is a test comment"
```

---

## Part 4: Running All Test Flows

### Run a Single Test
```bash
maestro test maestro/flows/01_login.yaml
```

### Run All Tests in Order
```bash
maestro test maestro/flows/
```

### Expected Output
```
✅ 01_login.yaml passed (2.5s)
✅ 02_register.yaml passed (8.3s)
✅ 03_dashboard_navigation.yaml passed (5.1s)
✅ 04_loan_application.yaml passed (12.4s)
✅ 05_profile_logout.yaml passed (6.8s)

All tests passed! ✅
```

### Run with Verbose Output
See detailed logs:
```bash
maestro test maestro/flows/01_login.yaml --verbose
```

---

## Part 5: Troubleshooting Common Issues

### Issue 1: "Element not found"
**Problem**: Maestro can't find the element you're trying to tap

**Solutions**:
1. Check the exact text on screen
   ```yaml
   - action: takeScreenshot     # See what's on screen
   
   - action: tap
     target:
       text: "Exact text from screenshot"
   ```

2. Use placeholder text instead
   ```yaml
   - action: tap
     target:
       text: "Enter email"       # Placeholder text
   ```

3. Scroll first if element might be off-screen
   ```yaml
   - action: scroll
     direction: down
   
   - action: tap
     target:
       text: "Hidden button"
   ```

### Issue 2: "Element disappeared"
**Problem**: Element is no longer visible when Maestro tries to interact with it

**Solution**: Add a wait before the action
```yaml
- action: wait
  timeout: 2                    # Wait for animation

- action: tap
  target:
    text: "Sign in"
```

### Issue 3: Test passes locally but fails in CI/CD
**Problem**: Timing is different in CI/CD environments

**Solution**: Increase timeouts
```yaml
- action: wait
  timeout: 5                    # Longer timeout

- action: assertVisible
  text: "Dashboard"
```

### Issue 4: Input doesn't clear previous text
**Problem**: Text input has old content

**Solution**: Clear before typing
```yaml
- action: tap
  target:
    text: "Email"

- action: input
  text: "new@example.com"       # Replaces old text automatically
```

---

## Part 6: Test Flow Walkthrough

### Login Flow (01_login.yaml)
Let's walk through what each step does:

```yaml
appId: com.loanapp
---
# Step 1: Verify the login screen is visible
- action: assertVisible
  text: "Sign in"

# Step 2-3: Find and fill email field
- action: tap
  target:
    text: "Email/Phone"
- action: input
  text: "john@example.com"

# Step 4-5: Find and fill password field
- action: tap
  target:
    text: "Password"
- action: input
  text: "password123"

# Step 6: Click sign in button
- action: tap
  target:
    text: "Sign in"

# Step 7-8: Wait and verify we're logged in
- action: wait
  timeout: 3
- action: assertVisible
  text: "Home"
```

### Registration Flow (02_register.yaml)
More complex flow with:
- Finding "Sign up" link
- Filling multiple form fields
- Scrolling to see more fields
- Handling success alert
- Returning to login

---

## Part 7: Best Practices

### 1. **Use Comments for Clarity**
```yaml
- action: comment
  description: "Step 1: Verify login screen"

- action: assertVisible
  text: "Sign in"
```

### 2. **Keep Tests Focused**
Each YAML file tests ONE feature:
- `01_login.yaml` - Just login
- `02_register.yaml` - Just registration
- `04_loan_application.yaml` - Just loan application

### 3. **Use Meaningful Waits**
```yaml
# Good - waits for specific change
- action: tap
  target:
    text: "Submit"
- action: wait
  timeout: 2
- action: assertVisible
  text: "Success"

# Bad - arbitrary wait
- action: wait
  timeout: 10
```

### 4. **Test Edge Cases**
```yaml
# Valid input
- action: input
  text: "valid@email.com"

# In separate test file, test invalid:
- action: input
  text: "invalid-email"
- action: tap
  target:
    text: "Submit"
- action: assertVisible
  text: "Invalid email"
```

### 5. **Make Tests Independent**
Each test can run alone:
- `01_login.yaml` starts from login screen
- `04_loan_application.yaml` logs in first
- Tests don't depend on previous test results

---

## Part 8: Running Tests in Real Scenarios

### Scenario 1: Test New User Registration
```bash
# Run just registration test
maestro test maestro/flows/02_register.yaml

# Verify new user credentials work
maestro test maestro/flows/01_login.yaml
```

### Scenario 2: Test Complete User Journey
```bash
# Run all tests in sequence
maestro test maestro/flows/
```

This covers:
1. User registers
2. User logs in
3. User navigates app
4. User applies for loan
5. User logs out

### Scenario 3: Test Specific Feature
```bash
# Test only loan application
maestro test maestro/flows/04_loan_application.yaml
```

---

## Part 9: Advanced Features

### Taking Screenshots
```yaml
- action: takeScreenshot
  path: "screenshots/login_screen.png"
```

### Conditional Logic
```yaml
- action: waitForAnimationToEnd   # Wait for UI to settle

- action: assertVisible
  text: "Expected element"
```

### Device Interactions
```yaml
# Copy text
- action: copyToClipboard
  text: "some text"

# Paste
- action: pasteFromClipboard
```

---

## Part 10: Summary and Next Steps

### What You Learned
✅ How Maestro works
✅ How to write test flows in YAML
✅ How to run individual and batch tests
✅ How to troubleshoot common issues
✅ Best practices for test writing

### Your Test Flows Cover
✅ User authentication (login/register)
✅ Navigation between screens
✅ Form filling and submission
✅ Profile management
✅ Complete user journeys

### Next Steps
1. **Run all tests** to ensure app stability
2. **Add more edge case tests** for error scenarios
3. **Integrate with CI/CD** to run tests automatically
4. **Generate reports** from test results
5. **Expand coverage** as you add features

---

## Useful Commands Reference

```bash
# Run single test
maestro test maestro/flows/01_login.yaml

# Run all tests
maestro test maestro/flows/

# Verbose output
maestro test maestro/flows/01_login.yaml --verbose

# Format output as JUnit (for CI/CD)
maestro test maestro/flows/ --format junit

# List available commands
maestro --help

# Show Maestro version
maestro --version
```

---

## Troubleshooting Checklist

- [ ] App is running in simulator
- [ ] appId in YAML matches your app
- [ ] Using correct text/placeholders from UI
- [ ] All wait timeouts are sufficient
- [ ] Scrolling before hidden elements
- [ ] No typos in action names
- [ ] YAML syntax is valid (proper indentation)
- [ ] Test runs locally before adding to CI/CD

---

## Resources

- [Maestro Official Docs](https://maestro.mobile.dev)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
- [Test Writing Examples](https://maestro.mobile.dev/best-practices)
- [Community Discussion](https://github.com/mobile-dev-inc/maestro/discussions)

---

**Happy Testing! 🎯**
