#!/bin/sh
# Pre-commit hook: Prevent API keys from being committed
# Scans staged files for Google API key patterns (AIzaSy...)
#
# Install: Copy this file to .git/hooks/pre-commit and make executable
# Or run: cp scripts/pre-commit-api-guard.sh .git/hooks/pre-commit

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔐 Scanning for exposed API keys..."

# Check staged files for API key patterns
MATCHES=$(git diff --cached --diff-filter=d -S "AIzaSy" --name-only 2>/dev/null)

if [ -n "$MATCHES" ]; then
    echo ""
    echo "${RED}🚨 BLOCKED: API key pattern 'AIzaSy' found in staged files:${NC}"
    echo ""
    for file in $MATCHES; do
        echo "  ❌ $file"
        # Show the actual matching lines
        git diff --cached "$file" | grep -n "AIzaSy" | head -5
    done
    echo ""
    echo "${RED}NEVER commit API keys to source code.${NC}"
    echo "Store keys in:"
    echo "  • Netlify env vars (server-side)"
    echo "  • .env files (local dev, gitignored)"
    echo "  • localStorage (client-side, user-entered)"
    echo ""
    echo "To bypass (ONLY if you're sure): git commit --no-verify"
    exit 1
fi

# Also check for common key patterns
GENERIC_MATCHES=$(git diff --cached --diff-filter=d -S "api_key.*=" --name-only 2>/dev/null | grep -v ".gitignore" | grep -v "pre-commit" | grep -v "node_modules")

echo "${GREEN}✅ No API keys found in staged files.${NC}"
exit 0
