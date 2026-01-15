# Test script for API endpoints

Write-Host "Testing Estate Settlement Platform API..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing health check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3000/db-health" -Method Get
Write-Host "   Status: $($health.status)" -ForegroundColor Green
Write-Host "   Estate Count: $($health.count)" -ForegroundColor Green

# Test 2: Login (assuming demo user exists)
Write-Host "`n2. Testing login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "demo@example.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   Login successful!" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Green
} catch {
    Write-Host "   Login failed (user may not exist yet)" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $token = $null
}

# Test 3: Get Dashboard (if logged in)
if ($token) {
    Write-Host "`n3. Testing dashboard endpoint..." -ForegroundColor Yellow
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        $dashboard = Invoke-RestMethod -Uri "http://localhost:3000/api/estates/dashboard" -Method Get -Headers $headers
        Write-Host "   Dashboard loaded successfully!" -ForegroundColor Green
        Write-Host "   Estate: $($dashboard.estate.name)" -ForegroundColor Green
        Write-Host "   Assets: $($dashboard.estate.assets.Count)" -ForegroundColor Green
        
        # Test 4: Get communications for first asset
        if ($dashboard.estate.assets.Count -gt 0) {
            $assetId = $dashboard.estate.assets[0].id
            Write-Host "`n4. Testing communications endpoint..." -ForegroundColor Yellow
            try {
                $comms = Invoke-RestMethod -Uri "http://localhost:3000/api/assets/$assetId/communications" -Method Get -Headers $headers
                Write-Host "   Communications loaded successfully!" -ForegroundColor Green
                Write-Host "   Communication Count: $($comms.communications.Count)" -ForegroundColor Green
            } catch {
                Write-Host "   Communications endpoint failed" -ForegroundColor Red
                Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
            }
            
            # Test 5: Get next actions
            Write-Host "`n5. Testing next actions endpoint..." -ForegroundColor Yellow
            try {
                $actions = Invoke-RestMethod -Uri "http://localhost:3000/api/assets/$assetId/next-actions" -Method Get -Headers $headers
                Write-Host "   Next actions loaded successfully!" -ForegroundColor Green
                Write-Host "   Recommendations: $($actions.recommendations.Count)" -ForegroundColor Green
            } catch {
                Write-Host "   Next actions endpoint failed" -ForegroundColor Red
                Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "   Dashboard failed" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n✅ API Testing Complete!" -ForegroundColor Cyan
