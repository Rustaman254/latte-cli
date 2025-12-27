#!/bin/bash

# Latte Package Manager - Demo Script
# This script demonstrates the basic usage of Latte

echo "☕ Latte Package Manager Demo"
echo "=============================="
echo ""

# Set API base URL
export LATTE_API_BASE=http://localhost:4000

# Navigate to CLI directory
cd "$(dirname "$0")/latte-cli"

echo "1️⃣  Checking Latte version..."
node dist/index.js --version
echo ""

echo "2️⃣  Creating test project..."
mkdir -p ../demo-project
cd ../demo-project
rm -rf * 2>/dev/null

echo ""
echo "3️⃣  Initializing Latte project..."
echo -e "demo-app\n1.0.0\nA demo Latte project\nDemo User\n" | node ../latte-cli/dist/index.js init
echo ""

echo "4️⃣  Checking package.json..."
cat package.json
echo ""

echo "5️⃣  Adding a package (lodash)..."
node ../latte-cli/dist/index.js add lodash
echo ""

echo "6️⃣  Listing installed packages..."
node ../latte-cli/dist/index.js list
echo ""

echo "7️⃣  Checking lock file..."
if [ -f "latte-lock.json" ]; then
    echo "✓ latte-lock.json created"
    echo "Sample content:"
    head -20 latte-lock.json
else
    echo "✗ latte-lock.json not found"
fi
echo ""

echo "8️⃣  Removing package..."
node ../latte-cli/dist/index.js remove lodash
echo ""

echo "✅ Demo complete!"
echo ""
echo "Next steps:"
echo "  - Try: latte add express"
echo "  - Try: latte set-price my-package --price 5 --wallet 0xYourAddress"
echo "  - Check API: curl http://localhost:4000/stats"
