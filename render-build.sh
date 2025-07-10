#!/bin/bash
set -o errexit
set -x  # Enable debug mode

# Print environment info
echo "=== Environment Info ==="
node -v
npm -v
ls -la

# Install dependencies
echo "=== Installing Dependencies ==="
npm ci --production=false

# Install tsx globally if not present
if ! command -v tsx &> /dev/null; then
    echo "tsx not found, installing globally..."
    npm install -g tsx
fi

# Build the application
echo "=== Building Application ==="
NODE_ENV=production npm run build

# Verify build output
echo "=== Build Output ==="
ls -la dist/
if [ -d "dist/server" ]; then
  echo "=== Server Files ==="
  ls -la dist/server/
fi

# Verify the entry point exists
if [ ! -f "dist/server/index.js" ]; then
  echo "Error: dist/server/index.js not found!"
  echo "Current directory: $(pwd)"
  echo "Files in dist/:"
  ls -la dist/
  exit 1
fi

echo "=== Build completed successfully ==="
