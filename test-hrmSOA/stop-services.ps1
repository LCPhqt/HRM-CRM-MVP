# Script để dừng tất cả services
Write-Host "🛑 Dừng tất cả services..." -ForegroundColor Yellow

# Dừng Gateway
$gateway = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { 
    $_.Path -like "*gateway*" -or (Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue)
}
if ($gateway) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Đã dừng Gateway" -ForegroundColor Green
}

# Dừng Identity Service
$identity = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    (Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue)
}
if ($identity) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Đã dừng Identity Service" -ForegroundColor Green
}

# Dừng Admin HR Service
$admin = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    (Get-NetTCPConnection -LocalPort 5003 -ErrorAction SilentlyContinue)
}
if ($admin) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Đã dừng Admin HR Service" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Đã dừng tất cả services" -ForegroundColor Green

