# Script để khởi động services và chạy tests
# Usage: .\start-services-and-test.ps1 [test-type]
# test-type: backend, frontend, admin, all-ui, all

param(
    [string]$TestType = "all"
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $PSScriptRoot
$testDir = $PSScriptRoot

Write-Host "🚀 Bắt đầu khởi động services và chạy tests..." -ForegroundColor Green
Write-Host ""

# Kiểm tra MongoDB
Write-Host "📦 Kiểm tra MongoDB..." -ForegroundColor Yellow
try {
    $mongoCheck = Get-Process -Name mongod -ErrorAction SilentlyContinue
    if ($mongoCheck) {
        Write-Host "✓ MongoDB đang chạy" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB không chạy. Vui lòng khởi động MongoDB trước." -ForegroundColor Yellow
        Write-Host "   Hoặc sử dụng mongodb-memory-server (đã được cấu hình trong tests)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Không thể kiểm tra MongoDB" -ForegroundColor Yellow
}

Write-Host ""

# Khởi động Identity Service (port 5001)
Write-Host "🔐 Khởi động Identity Service (port 5001)..." -ForegroundColor Yellow
$identityService = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$rootDir\backend-hrmSOA\services\identity-service" -PassThru -WindowStyle Minimized
Start-Sleep -Seconds 3
Write-Host "✓ Identity Service đã khởi động (PID: $($identityService.Id))" -ForegroundColor Green

# Khởi động Admin HR Service (port 5003)
Write-Host "👔 Khởi động Admin HR Service (port 5003)..." -ForegroundColor Yellow
$adminService = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$rootDir\backend-hrmSOA\services\admin-hr-service" -PassThru -WindowStyle Minimized
Start-Sleep -Seconds 3
Write-Host "✓ Admin HR Service đã khởi động (PID: $($adminService.Id))" -ForegroundColor Green

# Khởi động Gateway (port 4000)
Write-Host "🌐 Khởi động Gateway (port 4000)..." -ForegroundColor Yellow
$gateway = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$rootDir\backend-hrmSOA\gateway" -PassThru -WindowStyle Minimized
Start-Sleep -Seconds 3
Write-Host "✓ Gateway đã khởi động (PID: $($gateway.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "⏳ Đợi services khởi động hoàn toàn..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Kiểm tra services
Write-Host ""
Write-Host "🔍 Kiểm tra services..." -ForegroundColor Yellow

$gatewayCheck = try { 
    $response = Invoke-WebRequest -Uri "http://localhost:4000/health" -TimeoutSec 2 -ErrorAction Stop
    $response.StatusCode -eq 200
} catch { $false }

if ($gatewayCheck) {
    Write-Host "✓ Gateway đang chạy" -ForegroundColor Green
} else {
    Write-Host "✗ Gateway không phản hồi" -ForegroundColor Red
}

Write-Host ""

# Chạy tests
Write-Host "🧪 Bắt đầu chạy tests..." -ForegroundColor Green
Write-Host ""

Set-Location $testDir

switch ($TestType.ToLower()) {
    "backend" {
        Write-Host "📝 Chạy Backend Unit Tests..." -ForegroundColor Cyan
        Set-Location "$testDir\backend\identity-service"
        npm test
    }
    "frontend" {
        Write-Host "🎨 Chạy Frontend UI Tests (Login/Register)..." -ForegroundColor Cyan
        Set-Location $testDir
        npm run test:frontend
    }
    "admin" {
        Write-Host "🔍 Chạy Admin Search & Filter Tests..." -ForegroundColor Cyan
        Set-Location $testDir
        npm run test:admin
    }
    "all-ui" {
        Write-Host "🎨 Chạy tất cả UI Tests..." -ForegroundColor Cyan
        Set-Location $testDir
        npm run test:all-ui
    }
    "all" {
        Write-Host "📝 Chạy Backend Unit Tests..." -ForegroundColor Cyan
        Set-Location "$testDir\backend\identity-service"
        npm test
        Write-Host ""
        Write-Host "🎨 Chạy Frontend UI Tests..." -ForegroundColor Cyan
        Set-Location $testDir
        npm run test:all-ui
    }
    default {
        Write-Host "❌ Loại test không hợp lệ: $TestType" -ForegroundColor Red
        Write-Host "Các loại hợp lệ: backend, frontend, admin, all-ui, all" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Hoàn thành!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Lưu ý: Các services vẫn đang chạy ở background." -ForegroundColor Yellow
Write-Host "   Để dừng services, chạy: .\stop-services.ps1" -ForegroundColor Yellow

