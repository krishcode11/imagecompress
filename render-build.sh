#!/bin/bash
set -o errexit
set -x  # Enable debug mode

# Print environment info
echo "=== Environment Info ==="
node -v
npm -v
ls -la

# Install Node.js version if needed
NODE_VERSION=$(cat .nvmrc 2>/dev/null || echo "20.x")
echo "Required Node.js version: $NODE_VERSION"

# Install NVM if not present
export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
    echo "Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Load NVM
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use the required Node.js version
if ! nvm use $NODE_VERSION 2>/dev/null; then
    echo "Installing Node.js $NODE_VERSION..."
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
fi

echo "Using Node.js $(node -v)"

# Install dependencies
echo "=== Installing Dependencies ==="
npm ci --production=false

# Install tsx as a dev dependency if not present
if ! npm list tsx &>/dev/null; then
    echo "Installing tsx as dev dependency..."
    npm install --save-dev tsx
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

# Make sure all files are readable
chmod -R a+rX .

echo "=== Build completed successfully ==="
