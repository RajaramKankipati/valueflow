#!/usr/bin/env bash
# exit on error
set -o errexit

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing client dependencies..."
cd client
npm install

echo "🏗️  Building client..."
npm run build

echo "✅ Build complete!"
