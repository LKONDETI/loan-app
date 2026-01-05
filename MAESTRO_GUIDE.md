# Maestro Testing Guide for Loan App

## Overview
This guide explains how to use Maestro for UI testing your React Native Loan App. Maestro is a fast, simple, and reliable mobile UI testing framework.

## What is Maestro?

Maestro is an open-source mobile testing framework that allows you to:
- Write tests in YAML format (simple and readable)
- Test across iOS, Android, and web
- Simulate user interactions (taps, swipes, text input)
- Verify UI elements and text
- Run tests in CI/CD pipelines
- Capture screenshots and videos

## Installation

Maestro is already installed on your system 

If it wasn't installed, you could install it with:
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
export PATH="$PATH:$HOME/.maestro/bin"
```

## Directory Structure

```
maestro/
├── flows/                          # All test flows
│   ├── auth/
│   │   ├── 01_login.yaml          # Test login flow
│   │   ├── 02_register.yaml       # Test registration flow
│   │   └── 03_login_logout.yaml   # Test complete auth cycle
│   ├── loans/
│   │   ├── 01_view_loans.yaml     # Test viewing loans list
│   │   ├── 02_apply_loan.yaml     # Test loan application
│   │   └── 03_loan_details.yaml   # Test viewing loan details
│   ├── navigation/
│   │   ├── 01_bottom_tabs.yaml    # Test tab navigation
│   │   └── 02_app_navigation.yaml # Test overall app flow
│   └── profile/
│       ├── 01_profile_screen.yaml # Test profile screen
│       └── 02_edit_profile.yaml   # Test profile editing
├── config.yaml                     # Maestro configuration
└── README.md                       # This file
```

## Key Maestro Concepts

### 1. **Commands**
- `tap`: Click on an element
- `input`: Type text
- `swipe`: Swipe in a direction
- `scroll`: Scroll up/down
- `wait`: Wait for condition
- `assertVisible`: Check if element exists
- `assertNotVisible`: Check element doesn't exist
- `takeScreenshot`: Capture screen

### 2. **Selectors**
```yaml
# By text
tap:
  text: "Sign in"

# By label
tap:
  label: "Email input"

# By ID (testID)
tap:
  id: "loginButton"

# By point coordinates
tap:
  point: "50%, 50%"
```

### 3. **Flow Structure**
```yaml
appId: com.example.app          # App identifier
---
- action: comment
  description: "Test description"

- action: tap
  target:
    text: "Button text"
    
- action: input
  text: "user@example.com"
  
- action: assertVisible
  text: "Expected text"
```

## Step-by-Step Test Creation

### Step 1: Basic Login Test
Create a simple login flow to test:
1. App launches
2. Login screen appears
3. Enter credentials
4. Click sign in
5. Dashboard appears

### Step 2: Navigation Test
Test the bottom tab navigation:
1. Navigate between tabs
2. Verify each tab loads correctly
3. Check tab icons and labels

### Step 3: Registration Test
Test the complete registration flow:
1. Click "Sign up"
2. Fill form fields
3. Submit registration
4. Return to login

### Step 4: Loan Application Test
Test the loan application process:
1. Select loan type
2. Fill application form
3. Navigate tabs
4. Submit application

## Running Tests

### Run a single flow:
```bash
maestro test maestro/flows/auth/01_login.yaml
```

### Run all flows in a directory:
```bash
maestro test maestro/flows/auth/
```

### Run all tests:
```bash
maestro test maestro/flows/
```

### Run with debugging:
```bash
maestro test maestro/flows/auth/01_login.yaml --verbose
```

### View test results:
```bash
maestro test maestro/flows/auth/01_login.yaml --format junit
```

## Best Practices

1. **Use descriptive names**: `01_login.yaml`, `02_register.yaml`
2. **Keep flows focused**: Test one feature per flow
3. **Use comments**: Add descriptions for clarity
4. **Test error cases**: Invalid inputs, network errors
5. **Avoid hardcoded waits**: Use proper conditions
6. **Make tests repeatable**: Clean up after tests
7. **Use variables**: For common test data

## Common Patterns

### Wait for element to appear
```yaml
- action: wait
  condition:
    visible:
      text: "Dashboard"
```

### Conditional logic
```yaml
- action: waitForAnimationToEnd

- action: assertVisible
  text: "Expected element"
```

### Input with clearing
```yaml
- action: tap
  target:
    id: "emailInput"

- action: input
  text: "test@example.com"
```

### Scroll and find element
```yaml
- action: scroll
  direction: down
  
- action: tap
  target:
    text: "Find this after scroll"
```

## Troubleshooting

### App won't start
- Ensure app is properly built
- Check `appId` in YAML matches your app
- Verify device/simulator is running

### Element not found
- Check selector syntax
- Use `takeScreenshot` to debug
- Verify element is visible on screen
- Check for nested navigation

### Flaky tests
- Add proper waits for animations
- Increase wait times for slow devices
- Use `waitForAnimationToEnd` before assertions

### Network issues
- Mock API responses in test data
- Use local test server (json-server)
- Add timeout conditions

## Integration with CI/CD

### GitHub Actions example
```yaml
- name: Run Maestro tests
  run: |
    maestro test maestro/flows/ --format junit
    
- name: Upload test results
  uses: actions/upload-artifact@v2
  with:
    name: maestro-results
    path: test-results/
```

## Next Steps

1. Create basic test flows (follow Step 1-4 below)
2. Run tests against your app
3. Expand test coverage
4. Integrate with CI/CD
5. Generate reports
6. Monitor test results

## Resources

- [Maestro Documentation](https://maestro.mobile.dev)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
- [UI Testing Best Practices](https://maestro.mobile.dev/best-practices)
