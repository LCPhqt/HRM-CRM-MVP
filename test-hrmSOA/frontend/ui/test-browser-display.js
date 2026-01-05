import { Builder } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

function findChromePath() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`
  ];
  
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }
  
  // Thử tìm bằng where command
  try {
    const result = execSync('where chrome', { encoding: 'utf8', timeout: 2000 }).trim();
    if (result && existsSync(result)) {
      return result;
    }
  } catch (e) {
    // Ignore
  }
  
  return null;
}

async function testBrowserDisplay() {
  console.log('🔧 Đang khởi động Chrome browser...');
  
  const options = new ChromeOptions();
  
  // Các arguments cơ bản
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--start-maximized');
  
  try {
    console.log('   Đang tạo WebDriver instance...');
    
    // Tạo driver đơn giản như test-simple.js
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    console.log('✅ Browser đã được khởi động!');
    console.log('📱 Browser window sẽ hiển thị ngay bây giờ...');
    
    // Đợi browser hiển thị
    await driver.sleep(2000);
    
    // Mở một trang để đảm bảo browser hiển thị
    console.log('   Đang mở Google.com...');
    await driver.get('https://www.google.com');
    console.log('🌐 Đã mở Google.com - Bạn có thấy browser không?');
    
    // Đợi 10 giây để quan sát
    console.log('⏳ Đợi 10 giây để bạn quan sát browser...');
    await driver.sleep(10000);
    
    await driver.quit();
    console.log('✅ Test hoàn thành!');
    
  } catch (error) {
    console.error('\n❌ Lỗi khi khởi động browser:');
    console.error('   Message:', error.message);
    if (error.stack) {
      console.error('   Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
    }
    console.error('\n💡 Các bước khắc phục:');
    console.error('   1. Kiểm tra Chrome đã được cài đặt: Get-Command chrome');
    console.error('   2. Cài đặt lại chromedriver: npm install chromedriver --save-dev');
    console.error('   3. Kiểm tra Chrome version: chrome --version');
    console.error('   4. Kiểm tra chromedriver: npx chromedriver --version');
    process.exit(1);
  }
}

testBrowserDisplay();

