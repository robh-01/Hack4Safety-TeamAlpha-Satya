#!/bin/bash
# Installation script for satya Firefox Extension
# Usage: bash install.sh

echo "satya Extension - Installation Helper"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo -e "${YELLOW}Error: manifest.json not found${NC}"
    echo "Please run this script from the extension directory"
    echo "Usage: cd /home/santosh/dev/Team-Alpha/extension && bash install.sh"
    exit 1
fi

echo -e "${GREEN}Extension files found${NC}"
echo ""

# Verify all required files
echo "Checking required files..."
REQUIRED_FILES=("manifest.json" "content.js" "background.js" "popup.html" "popup.css" "popup.js")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}OK${NC} $file"
    else
        echo -e "${YELLOW}MISSING${NC} $file"
    fi
done

echo ""
echo "Checking icons..."
ICON_FILES=("icons/icon-16.svg" "icons/icon-48.svg" "icons/icon-96.svg" "icons/scan.svg")
for file in "${ICON_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}OK${NC} $file"
    else
        echo -e "${YELLOW}MISSING${NC} $file"
    fi
done

echo ""
echo -e "${BLUE}=================================================="
echo "Installation Instructions:"
echo "==================================================${NC}"
echo ""

echo "1. Start your Team-Alpha server:"
echo "   $ cd /home/santosh/dev/Team-Alpha/server"
echo "   $ npm start"
echo ""

echo "2. Open Firefox and go to:"
echo "   about:debugging#/runtime/this-firefox"
echo ""

echo "3. Click 'Load Temporary Add-on'"
echo ""

echo "4. Navigate to and select this file:"
echo "   $(pwd)/manifest.json"
echo ""

echo -e "${GREEN}5. You're done.${NC}"
echo ""
echo "Try it out:"
echo "  - Visit any website with images (google.com, unsplash.com)"
echo "  - Hover over an image"
echo "  - Click the scan button"
echo "  - Wait for analysis"
echo "  - View results"
echo ""

echo -e "${BLUE}Configuration:${NC}"
echo "  • Server URL: extension/background.js (line 3)"
echo "  • Button styling: extension/popup.css"
echo "  • Score thresholds: extension/popup.js"
echo ""

echo -e "${BLUE}Documentation:${NC}"
echo "  • Quick Start: extension/QUICKSTART.md"
echo "  • Full Guide: extension/README.md"
echo ""

echo "Done"
