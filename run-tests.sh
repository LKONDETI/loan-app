#!/bin/bash

# Maestro Test Runner Script
# This script helps run Maestro tests with various options

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════╗"
    echo "║  Loan App - Maestro Test Runner        ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Print menu
print_menu() {
    echo -e "${YELLOW}Choose a test to run:${NC}"
    echo ""
    echo "1. Run all tests"
    echo "2. Run login test (01_login.yaml)"
    echo "3. Run registration test (02_register.yaml)"
    echo "4. Run dashboard navigation test (03_dashboard_navigation.yaml)"
    echo "5. Run loan application test (04_loan_application.yaml)"
    echo "6. Run profile & logout test (05_profile_logout.yaml)"
    echo "7. Run all tests with verbose output"
    echo "8. Run all tests and generate report"
    echo "9. Exit"
    echo ""
}

# Run test
run_test() {
    local test_file=$1
    local verbose=$2
    
    echo -e "${BLUE}Running: $test_file${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ "$verbose" = "true" ]; then
        maestro test "$test_file" --verbose
    else
        maestro test "$test_file"
    fi
    
    echo -e "${GREEN}✅ Test passed!${NC}"
    echo ""
}

# Run all tests
run_all_tests() {
    local verbose=$1
    
    echo -e "${BLUE}Running all tests...${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    local tests=(
        "maestro/flows/01_login.yaml"
        "maestro/flows/02_register.yaml"
        "maestro/flows/03_dashboard_navigation.yaml"
        "maestro/flows/04_loan_application.yaml"
        "maestro/flows/05_profile_logout.yaml"
    )
    
    local total=${#tests[@]}
    local passed=0
    local failed=0
    
    for test in "${tests[@]}"; do
        if [ "$verbose" = "true" ]; then
            maestro test "$test" --verbose && ((passed++)) || ((failed++))
        else
            maestro test "$test" && ((passed++)) || ((failed++))
        fi
    done
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}Total: $total | Passed: $passed | Failed: $failed${NC}"
    echo ""
}

# Main loop
main() {
    print_banner
    
    # Check if app is running
    echo -e "${YELLOW}Note: Make sure your app is running!${NC}"
    echo "1. In another terminal, run: npm start"
    echo "2. Select iOS Simulator (i) or Android Emulator (a)"
    echo ""
    
    while true; do
        print_menu
        read -p "Enter your choice (1-9): " choice
        
        case $choice in
            1)
                run_all_tests false
                ;;
            2)
                run_test "maestro/flows/01_login.yaml" false
                ;;
            3)
                run_test "maestro/flows/02_register.yaml" false
                ;;
            4)
                run_test "maestro/flows/03_dashboard_navigation.yaml" false
                ;;
            5)
                run_test "maestro/flows/04_loan_application.yaml" false
                ;;
            6)
                run_test "maestro/flows/05_profile_logout.yaml" false
                ;;
            7)
                run_all_tests true
                ;;
            8)
                echo -e "${BLUE}Running all tests with report generation...${NC}"
                mkdir -p test-results
                maestro test maestro/flows/ --format junit
                echo -e "${GREEN}✅ Report generated in test-results/${NC}"
                ;;
            9)
                echo -e "${GREEN}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice. Please try again.${NC}"
                ;;
        esac
    done
}

# Run main if script is executed directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main
fi
