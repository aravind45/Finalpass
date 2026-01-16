# Test Vercel Deployment Script
# This script tests your deployed application

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$FrontendUrl
)

Write-Host "🧪 Testing Vercel Deployment" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $BackendUrl" -ForegroundColor Yellow
Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor Yellow
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Test 1: Backend Health Check
Write-Host "Test 1: Backend Health Check..." -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/db-health" -Method Get -TimeoutSec 10
    if ($response.status -eq "connected") {
        Write-Host "✅ PASS: Backend is healthy" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "❌ FAIL: Backend health check failed" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "❌ FAIL: Cannot reach backend - $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}
Write-Host ""

# Test 2: Frontend Loads
Write-Host "Test 2: Frontend Loads..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri $FrontendUrl -Method Get -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PASS: Frontend loads successfully" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "❌ FAIL: Frontend returned status $($response.StatusCode)" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "❌ FAIL: Cannot reach frontend - $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}
Write-Host ""

# Test 3: API Login Endpoint
Write-Host "Test 3: API Login Endpoint..." -ForegroundColor Blue
try {
    $body = @{
        email = "demo@example.com"
        password = "password123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BackendUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
    
    if ($response.token) {
        Write-Host "✅ PASS: Login endpoint works" -ForegroundColor Green
        $testsPassed++
        $token = $response.token
    } else {
        Write-Host "❌ FAIL: Login endpoint did not return token" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "❌ FAIL: Login endpoint error - $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}
Write-Host ""

# Test 4: Dashboard API (if we have token)
if ($token) {
    Write-Host "Test 4: Dashboard API..." -ForegroundColor Blue
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "$BackendUrl/api/estates/dashboard" -Method Get -Headers $headers -TimeoutSec 10
        
        if ($response.success) {
            Write-Host "✅ PASS: Dashboard API works" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "❌ FAIL: Dashboard API returned error" -ForegroundColor Red
            $testsFailed++
        }
    } catch {
        Write-Host "❌ FAIL: Dashboard API error - $($_.Exception.Message)" -ForegroundColor Red
        $testsFailed++
    }
    Write-Host ""
}

# Test 5: Forms API
Write-Host "Test 5: Forms API..." -ForegroundColor Blue
try {
    if ($token) {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "$BackendUrl/api/forms" -Method Get -Headers $headers -TimeoutSec 10
        
        if ($response.success) {
            Write-Host "✅ PASS: Forms API works" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "❌ FAIL: Forms API returned error" -ForegroundColor Red
            $testsFailed++
        }
    } else {
        Write-Host "⚠️  SKIP: No token available" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAIL: Forms API error - $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed! Deployment is successful!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some tests failed. Please check the logs above." -ForegroundColor Yellow
    exit 1
}
