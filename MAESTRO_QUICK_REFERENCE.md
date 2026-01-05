# Maestro Testing - Quick Reference

## Quick Start

### 1. Start Your App
```bash
cd loan-app
npm start
# Press 'i' for iOS or 'a' for Android
```

### 2. Run Tests (in another terminal)
```bash
# Option A: Interactive menu
./run-tests.sh

# Option B: Run specific test
maestro test maestro/flows/01_login.yaml

# Option C: Run all tests
maestro test maestro/flows/
```

---

## Test Files Available

| File | Purpose | Duration | Coverage |
|------|---------|----------|----------|
| `01_login.yaml` | User login | ~2-3s | Login flow |
| `02_register.yaml` | User registration | ~8-10s | Signup flow |
| `03_dashboard_navigation.yaml` | Tab navigation | ~5-6s | Navigation |
| `04_loan_application.yaml` | Apply for loan | ~12-15s | Form filling |
| `05_profile_logout.yaml` | Profile & logout | ~6-8s | Profile management |

---

## Common Maestro Actions

### Find & Click
```yaml
- action: tap
  target:
    text: "Button Text"
```

### Type Text
```yaml
- action: input
  text: "your text here"
```

### Wait
```yaml
- action: wait
  timeout: 3
```

### Verify Visible
```yaml
- action: assertVisible
  text: "Expected text"
```

### Scroll
```yaml
- action: scroll
  direction: down
```

### Take Screenshot
```yaml
- action: takeScreenshot
```

---

## Running Tests

### Single Test
```bash
maestro test maestro/flows/01_login.yaml
```

### All Tests
```bash
maestro test maestro/flows/
```

### With Details
```bash
maestro test maestro/flows/01_login.yaml --verbose
```

### Generate Report
```bash
maestro test maestro/flows/ --format junit
```

---

## Debugging

### Take a Screenshot
```yaml
- action: takeScreenshot
```

### Add Comments
```yaml
- action: comment
  description: "What this does"
```

### Check What's Visible
1. Run test
2. Look at screenshot output
3. Use exact text from screenshot in selector

---

## Test Structure

```yaml
appId: com.loanapp              # App identifier
---                             # Required separator

- action: comment               # Documentation
  description: "What test does"

- action: assertVisible         # Verify setup
  text: "Initial screen"

- action: tap                   # User interaction
  target:
    text: "Button"

- action: input                 # Type text
  text: "user input"

- action: wait                  # Wait for transition
  timeout: 2

- action: assertVisible         # Verify result
  text: "Success"
```

---

## Troubleshooting

### "Element not found"
```yaml
# Check exact text on screen
- action: takeScreenshot

# Try placeholder text
- action: tap
  target:
    text: "Enter email"  # Use placeholder
```

### "Test hangs"
```yaml
# Add timeout
- action: wait
  timeout: 5

# Or check element appears
- action: assertVisible
  text: "Loading..."
```

### "Works locally, fails in CI"
```yaml
# Increase timeouts
- action: wait
  timeout: 10  # Longer for CI
```

---

## Test Credentials

```
User 1:
  Email: john@example.com
  Password: password123

User 2:
  Email: jane@example.com
  Password: password123

Admin:
  Email: admin@loanapp.com
  Password: admin123
```

---

## Documentation Files

- **MAESTRO_GUIDE.md** - Full guide with all features
- **MAESTRO_TUTORIAL.md** - Step-by-step tutorial
- **MAESTRO_QUICK_REFERENCE.md** - This file
- **run-tests.sh** - Interactive test runner script

---

## Next Steps

1. ✅ Start app with `npm start`
2. ✅ Run test with `./run-tests.sh` or `maestro test maestro/flows/01_login.yaml`
3. ✅ View output and verify pass/fail
4. ✅ Run more tests
5. ✅ Add new test flows for new features
6. ✅ Integrate with CI/CD pipeline

---

## Useful Links

- [Maestro Docs](https://maestro.mobile.dev)
- [Test Examples](https://maestro.mobile.dev/best-practices)
- [GitHub Issues](https://github.com/mobile-dev-inc/maestro/issues)

---

**Last Updated:** January 2026
