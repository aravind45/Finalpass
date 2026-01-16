#!/bin/bash

# FinalPass Deployment Script for Vercel
# This script helps deploy the application to Vercel

echo "🚀 FinalPass Deployment Script"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI found"
echo ""

# Ask deployment type
echo "Select deployment type:"
echo "1) Production deployment"
echo "2) Preview deployment"
echo "3) Deploy backend only"
echo "4) Deploy frontend only"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to PRODUCTION..."
        echo ""
        vercel --prod
        ;;
    2)
        echo ""
        echo "🔍 Creating PREVIEW deployment..."
        echo ""
        vercel
        ;;
    3)
        echo ""
        echo "🔧 Deploying BACKEND only..."
        echo ""
        cd backend
        vercel --prod
        cd ..
        ;;
    4)
        echo ""
        echo "🎨 Deploying FRONTEND only..."
        echo ""
        cd frontend
        vercel --prod
        cd ..
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test your deployment"
echo "2. Check Vercel dashboard for logs"
echo "3. Update environment variables if needed"
echo ""
