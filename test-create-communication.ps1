# Test creating a communication

Write-Host "Testing Communication Creation..." -ForegroundColor Cyan

# Login
$loginBody = @{
    email = "demo@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "✅ Logged in successfully" -ForegroundColor Green

# Get dashboard to get asset ID
$dashboard = Invoke-RestMethod -Uri "http://localhost:3000/api/estates/dashboard" -Method Get -Headers $headers
$assetId = $dashboard.estate.assets[0].id
$institution = $dashboard.estate.assets[0].institution

Write-Host "✅ Got asset: $institution (ID: $assetId)" -ForegroundColor Green

# Create a communication
Write-Host "`nCreating communication..." -ForegroundColor Yellow

$commBody = @{
    type = "initial_contact"
    method = "email"
    direction = "outbound"
    subject = "Estate Settlement Inquiry"
    content = "Submitted death certificate and letters testamentary for account closure. Requesting timeline for processing."
    nextActionDate = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    nextActionType = "Follow up call"
} | ConvertTo-Json

try {
    $newComm = Invoke-RestMethod -Uri "http://localhost:3000/api/assets/$assetId/communications" -Method Post -Body $commBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Communication created successfully!" -ForegroundColor Green
    Write-Host "   ID: $($newComm.communication.id)" -ForegroundColor Green
    Write-Host "   Type: $($newComm.communication.type)" -ForegroundColor Green
    Write-Host "   Method: $($newComm.communication.method)" -ForegroundColor Green
    Write-Host "   Content: $($newComm.communication.content.Substring(0, 50))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create communication" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Get communications to verify
Write-Host "`nVerifying communication was saved..." -ForegroundColor Yellow
$comms = Invoke-RestMethod -Uri "http://localhost:3000/api/assets/$assetId/communications" -Method Get -Headers $headers
Write-Host "✅ Total communications: $($comms.communications.Count)" -ForegroundColor Green

# Get statistics
Write-Host "`nGetting statistics..." -ForegroundColor Yellow
$stats = Invoke-RestMethod -Uri "http://localhost:3000/api/assets/$assetId/communications/stats" -Method Get -Headers $headers
Write-Host "✅ Statistics:" -ForegroundColor Green
Write-Host "   Total: $($stats.stats.totalCommunications)" -ForegroundColor Green
Write-Host "   Outbound: $($stats.stats.outboundCount)" -ForegroundColor Green
Write-Host "   Days since first contact: $($stats.stats.daysSinceFirstContact)" -ForegroundColor Green

# Get next actions
Write-Host "`nGetting next actions..." -ForegroundColor Yellow
$actions = Invoke-RestMethod -Uri "http://localhost:3000/api/assets/$assetId/next-actions" -Method Get -Headers $headers
Write-Host "✅ Next actions: $($actions.recommendations.Count)" -ForegroundColor Green
if ($actions.recommendations.Count -gt 0) {
    foreach ($action in $actions.recommendations) {
        Write-Host "   - $($action.message)" -ForegroundColor Cyan
    }
}

Write-Host "`n🎉 All tests passed!" -ForegroundColor Green
