import { Builder } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';

console.log('🔧 Test hiển thị browser...');
console.log('📱 Browser sẽ mở và hiển thị Google.com');
console.log('⏳ Đợi 15 giây để bạn quan sát...\n');

const options = new ChromeOptions();
options.addArguments('--no-sandbox');
options.addArguments('--disable-dev-shm-usage');
options.addArguments('--start-maximized');

// Đảm bảo KHÔNG headless
if (process.env.HEADLESS === 'true') {
  console.log('⚠️  HEADLESS=true được set, browser sẽ KHÔNG hiển thị!');
  console.log('   Hãy chạy: $env:HEADLESS = $null\n');
  options.addArguments('--headless');
} else {
  console.log('✅ Browser sẽ hiển thị (HEADLESS không được set)\n');
}

try {
  console.log('   Đang tạo driver...');
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  console.log('✅ Driver đã được tạo!');
  console.log('📱 Browser window sẽ hiển thị ngay bây giờ...\n');
  
  // Đợi browser hiển thị
  await driver.sleep(2000);
  
  // Mở Google.com
  console.log('   Đang mở Google.com...');
  await driver.get('https://www.google.com');
  console.log('🌐 Đã mở Google.com');
  console.log('👀 Bạn có thấy browser window không?\n');
  
  // Đợi 15 giây để quan sát
  console.log('⏳ Đợi 15 giây để bạn quan sát browser...');
  for (let i = 15; i > 0; i--) {
    await driver.sleep(1000);
    process.stdout.write(`\r   Còn lại: ${i} giây...`);
  }
  console.log('\n');
  
  await driver.quit();
  console.log('✅ Test hoàn thành!');
  console.log('\n💡 Nếu bạn KHÔNG thấy browser:');
  console.log('   1. Kiểm tra Chrome đã được cài đặt');
  console.log('   2. Kiểm tra HEADLESS không được set: $env:HEADLESS');
  console.log('   3. Browser có thể bị ẩn sau các cửa sổ khác (thử Alt+Tab)');
  console.log('   4. Kiểm tra Task Manager xem có process chrome.exe không\n');
  
} catch (error) {
  console.error('\n❌ Lỗi:', error.message);
  process.exit(1);
}

