import { Builder } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';

console.log('🔧 Test đơn giản khởi động Chrome...');

const options = new ChromeOptions();
options.addArguments('--no-sandbox');
options.addArguments('--disable-dev-shm-usage');

// Thử không set binary path trước
console.log('   Đang tạo driver (không set binary path)...');
try {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  console.log('✅ Driver đã được tạo!');
  await driver.get('https://www.google.com');
  console.log('✅ Đã mở Google.com!');
  await driver.sleep(3000);
  await driver.quit();
  console.log('✅ Test thành công!');
} catch (error) {
  console.error('❌ Lỗi:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

