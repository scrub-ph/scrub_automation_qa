#!/bin/bash

echo "🧪 SCRUB E2E Test Suite Runner"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

run_test_suite() {
    local suite_name=$1
    local suite_path=$2
    local description=$3
    
    echo -e "\n${BLUE}📁 Running $suite_name Tests${NC}"
    echo -e "${YELLOW}$description${NC}"
    echo "----------------------------------------"
    
    if npx playwright test "$suite_path" --reporter=line; then
        echo -e "${GREEN}✅ $suite_name tests completed successfully${NC}"
    else
        echo -e "${RED}❌ $suite_name tests failed${NC}"
    fi
}

# Check if specific suite is requested
if [ "$1" != "" ]; then
    case $1 in
        "pages")
            run_test_suite "Pages" "tests/e2e/pages/" "Public pages and navigation"
            ;;
        "registration")
            run_test_suite "Registration" "tests/e2e/registration/" "Account creation flows"
            ;;
        "auth")
            run_test_suite "Authentication" "tests/e2e/auth/" "Login and authentication"
            ;;
        "booking")
            run_test_suite "Booking" "tests/e2e/booking/" "Service booking flows"
            ;;
        "dashboard")
            run_test_suite "Dashboard" "tests/e2e/dashboard/" "User dashboards"
            ;;
        "stubs")
            echo -e "${GREEN}🧪 Running API stub tests (ready for implementation)${NC}"
            run_test_suite "Booking Stubs" "tests/e2e/booking/booking-with-stubs.spec.ts" "Booking flow with API mocking"
            run_test_suite "Dashboard Stubs" "tests/e2e/dashboard/cleaner-dashboard-with-stubs.spec.ts tests/e2e/dashboard/client-dashboard-with-stubs.spec.ts" "Dashboard functionality with API mocking"
            run_test_suite "Communication Stubs" "tests/e2e/communication/" "Chat and notifications with API mocking"
            run_test_suite "Payment Stubs" "tests/e2e/payment/" "Payment processing with API mocking"
            ;;
        "payment")
            run_test_suite "Payment" "tests/e2e/payment/" "Payment and billing features"
            ;;
        "communication")
            run_test_suite "Communication" "tests/e2e/communication/" "Chat and notification features"
            ;;
        "working")
            echo -e "${GREEN}🚀 Running only working tests${NC}"
            run_test_suite "Pages" "tests/e2e/pages/" "Public pages and navigation"
            run_test_suite "Registration" "tests/e2e/registration/account-creation.spec.ts" "Account creation (working tests only)"
            ;;
        *)
            echo "Usage: ./run-tests.sh [pages|registration|auth|booking|dashboard|working|stubs|communication|payment]"
            exit 1
            ;;
    esac
else
    # Run all test suites
    echo -e "${BLUE}🚀 Running all test suites${NC}\n"
    
    run_test_suite "Pages" "tests/e2e/pages/" "Public pages and navigation"
    run_test_suite "Registration" "tests/e2e/registration/" "Account creation flows"
    run_test_suite "Authentication" "tests/e2e/auth/" "Login and authentication"
    run_test_suite "Booking" "tests/e2e/booking/" "Service booking flows"
    run_test_suite "Dashboard" "tests/e2e/dashboard/" "User dashboards"
    
    echo -e "\n${BLUE}📊 Test Suite Summary${NC}"
    echo "================================"
    echo -e "${GREEN}✅ Working: Pages, Registration${NC}"
    echo -e "${YELLOW}⚠️  Partial: Authentication, Booking${NC}"
    echo -e "${RED}❌ Blocked: Dashboard (requires auth)${NC}"
fi
