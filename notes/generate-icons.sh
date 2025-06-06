#!/bin/bash

# Script to generate PNG icons from SVG source
# Make sure you have ImageMagick installed: brew install imagemagick

cd "$(dirname "$0")"

if ! command -v magick &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it first:"
    echo "   brew install imagemagick"
    exit 1
fi

echo "🎨 Generating extension icons from SVG..."

# Generate PNG icons at different sizes
magick icon-source.svg -resize 16x16 icon16.png
magick icon-source.svg -resize 32x32 icon32.png  
magick icon-source.svg -resize 48x48 icon48.png
magick icon-source.svg -resize 128x128 icon128.png

echo "✅ Icons generated successfully!"
echo "   - icon16.png (16x16)"
echo "   - icon32.png (32x32)" 
echo "   - icon48.png (48x48)"
echo "   - icon128.png (128x128)"

echo ""
echo "🔄 To reload the extension:"
echo "   1. Go to chrome://extensions/"
echo "   2. Click the reload button on 'Element AI Extractor'"
echo "   3. The new icon should appear in the toolbar"
