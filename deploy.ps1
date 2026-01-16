# FinalPass Deployment Script for Vercel (PowerShell)
# This script helps deploy the application to Vercel

Write-Host "🚀 FinalPass Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
}

Write-Host ""

# Ask deployment type
Write-Host "Select deployment type:" -ForegroundColor Yellow
Write-Host "1) Production deployment"
Write-Host "2) Preview deployment"
Write-Host "3) Deploy backend only"
Write-Host "4) Deploy frontend only"
$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Deploying to PRODUCTION..." -ForegroundColor Green
        Write-Host ""
        vercel --prod
    }
    "2" {
        Write-Host ""
        Write-Host "🔍 Creating PREVIEW deployment..." -ForegroundColor Yellow
        Write-Host ""
        vercel
    }
    "3" {
        Write-Host ""
        Write-Host "🔧 Deploying BACKEND only..." -ForegroundColor Blue
        Write-Host ""
        Set-Location backend
        vercel --prod
        Set-Location ..
    }
    "4" {
        Write-Host ""
        Write-Host "🎨 Deploying FRONTEND only..." -ForegroundColor Magenta
        Write-Host ""
        Set-Location frontend
        vercel --prod
        Set-Location ..
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test your deployment"
Write-Host "2. Check Vercel dashboard for logs"
Write-Host "3. Update environment variables if needed"
Write-Host ""
