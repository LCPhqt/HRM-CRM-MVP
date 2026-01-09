import { Builder, By, until } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';
import http from 'http';
import axios from 'axios';

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';
const TIMEOUT = 15000;

let driver;

async function setup() {
  const options = new ChromeOptions();
  
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless');
    console.log(' Chạy ở chế độ headless');
  } else {
    console.log(' Browser sẽ hiển thị');
    options.addArguments('--start-maximized');
  }

  console.log(' Đang khởi động Chrome...');
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  console.log(' Browser đã khởi động!');
  await driver.sleep(2000);
  await driver.get('about:blank');
  await driver.sleep(1000);
  console.log(' Browser đã sẵn sàng!\n');
  
  await driver.manage().setTimeouts({ implicit: TIMEOUT });
  
  // Setup alert handler
  try {
    await driver.executeScript(`
      window.originalAlert = window.alert;
      window.alert = function(msg) {
        window.lastAlert = msg;
        console.log('Alert:', msg);
      };
    `);
  } catch (e) {
    // Ignore if script fails
  }
}

async function teardown() {
  if (driver) {
    try {
      await driver.quit();
      console.log(' Browser đã đóng');
    } catch (e) {
      console.error('Lỗi khi đóng browser:', e.message);
    }
  }
}

async function handleAlert() {
  try {
    const alertText = await driver.executeScript('return window.lastAlert || null;');
    if (alertText) {
      await driver.executeScript('window.lastAlert = null;');
      return alertText;
    }
  } catch (e) {
    // No alert
  }
  return null;
}

async function checkBackendConnection() {
  return new Promise((resolve) => {
    const gatewayUrl = process.env.TEST_GATEWAY_URL || 'http://127.0.0.1:4000';
    const req = http.get(`${gatewayUrl}/health`, { timeout: 2000 }, (res) => {
      if (res.statusCode === 200) {
        console.log(' Backend server đang chạy\n');
      } else {
        console.warn('  Warning: Backend server có thể không chạy. Một số tests có thể fail.\n');
      }
      resolve();
    });
    
    req.on('error', () => {
      console.warn('  Warning: Backend server có thể không chạy. Một số tests có thể fail.\n');
      resolve();
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.warn('  Warning: Backend server có thể không chạy. Một số tests có thể fail.\n');
      resolve();
    });
  });
}

async function getCurrentUrl() {
  return await driver.getCurrentUrl();
}

async function getCurrentPath() {
  const url = await getCurrentUrl();
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch (e) {
    return url;
  }
}

async function waitForUrlChange(initialUrl, timeout = 5000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const currentUrl = await getCurrentUrl();
    if (currentUrl !== initialUrl) {
      await driver.sleep(500); // Đợi thêm một chút để đảm bảo navigation hoàn tất
      return true;
    }
    await driver.sleep(100);
  }
  return false;
}

async function clearAuth() {
  try {
    await driver.executeScript('localStorage.clear();');
    await driver.executeScript('sessionStorage.clear();');
  } catch (e) {
    // Ignore
  }
}

// Test 1: Test link "Đăng ký ngay" từ trang Login → Register
async function testLoginToRegisterLink() {
  await clearAuth();
  await driver.get(`${BASE_URL}/login`);
  await driver.sleep(2000);

  // Kiểm tra đang ở trang login (có form đăng nhập)
  const loginButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng nhập')]")),
    TIMEOUT
  );
  
  // Tìm link "Đăng ký ngay"
  const registerLink = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng ký ngay')]")),
    TIMEOUT
  );
  
  // Click vào link
  await registerLink.click();
  await driver.sleep(1500);

  // Kiểm tra đã chuyển sang mode register
  const registerButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng ký')]")),
    TIMEOUT
  );
  
  // Kiểm tra có form đăng ký (có field "Họ và tên")
  const fullNameInput = await driver.findElement(By.xpath("//input[@placeholder='Nguyễn Văn A']"));
  
  if (!fullNameInput) {
    throw new Error('Không tìm thấy form đăng ký sau khi click "Đăng ký ngay"');
  }

  // Kiểm tra URL vẫn là /login (vì cùng một component)
  const path = await getCurrentPath();
  if (!path.includes('/login')) {
    throw new Error(`Sau khi click "Đăng ký ngay", URL không đúng. Expected: /login, Got: ${path}`);
  }
}

// Test 2: Test link "Đăng nhập" từ trang Register → Login
async function testRegisterToLoginLink() {
  await clearAuth();
  await driver.get(`${BASE_URL}/login`);
  await driver.sleep(2000);

  // Chuyển sang mode register trước
  const registerLink = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng ký ngay')]")),
    TIMEOUT
  );
  await registerLink.click();
  await driver.sleep(1500);

  // Kiểm tra đã ở mode register
  const registerButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng ký')]")),
    TIMEOUT
  );

  // Tìm link "Đăng nhập"
  const loginLink = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng nhập')]")),
    TIMEOUT
  );
  
  // Click vào link
  await loginLink.click();
  await driver.sleep(1500);

  // Kiểm tra đã chuyển về mode login
  const loginButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng nhập')]")),
    TIMEOUT
  );

  // Kiểm tra không còn form đăng ký (không có field "Họ và tên")
  try {
    await driver.findElement(By.xpath("//input[@placeholder='Nguyễn Văn A']"));
    throw new Error('Vẫn còn form đăng ký sau khi click "Đăng nhập"');
  } catch (e) {
    // Expected: không tìm thấy field đăng ký
    if (e.message.includes('no such element')) {
      // OK - đây là điều mong đợi
    } else {
      throw e;
    }
  }
}

// Test 3: Test redirect sau đăng nhập thành công → Trang chủ
async function testLoginRedirectToHome() {
  await clearAuth();
  await driver.get(`${BASE_URL}/login`);
  await driver.sleep(2000);

  const testEmail = process.env.TEST_ADMIN_EMAIL || 'admin@gmail.com';
  const testPassword = process.env.TEST_ADMIN_PASSWORD || 'admin123';

  // Điền form đăng nhập
  const emailInput = await driver.wait(
    until.elementLocated(By.xpath("//input[@type='email']")),
    TIMEOUT
  );
  await emailInput.clear();
  await emailInput.sendKeys(testEmail);

  const passwordInput = await driver.findElement(By.xpath("//input[@type='password']"));
  await passwordInput.sendKeys(testPassword);

  const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
  
  // Lưu URL hiện tại
  const initialUrl = await getCurrentUrl();
  
  // Click đăng nhập
  await loginButton.click();
  
  // Đợi redirect
  await driver.sleep(3000);

  // Kiểm tra đã redirect
  const currentPath = await getCurrentPath();
  
  if (!currentPath.includes('/home') && !currentPath.includes('/admin')) {
    throw new Error(`Sau khi đăng nhập thành công, không redirect đúng. Expected: /home hoặc /admin, Got: ${currentPath}`);
  }

  // Kiểm tra không còn ở trang login
  if (currentPath.includes('/login')) {
    throw new Error('Vẫn còn ở trang login sau khi đăng nhập thành công');
  }
}

// Test 4: Test redirect sau đăng ký thành công → Trang Login
async function testRegisterRedirectToLogin() {
  await clearAuth();
  await driver.get(`${BASE_URL}/login`);
  await driver.sleep(2000);

  // Chuyển sang mode register
  const registerLink = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng ký ngay')]")),
    TIMEOUT
  );
  await registerLink.click();
  await driver.sleep(1500);

  // Tạo email ngẫu nhiên để đăng ký
  const randomId = Math.floor(Math.random() * 100000);
  const testEmail = `test.navigation.${randomId}@example.com`;
  const testPassword = 'Test123456!';
  const testFullName = 'Test User Navigation';

  // Điền form đăng ký
  const fullNameInput = await driver.wait(
    until.elementLocated(By.xpath("//input[@placeholder='Nguyễn Văn A']")),
    TIMEOUT
  );
  await fullNameInput.clear();
  await fullNameInput.sendKeys(testFullName);

  const emailInput = await driver.findElement(By.xpath("//input[@type='email']"));
  await emailInput.clear();
  await emailInput.sendKeys(testEmail);

  const passwordInput = await driver.findElements(By.xpath("//input[@type='password']"));
  await passwordInput[0].clear();
  await passwordInput[0].sendKeys(testPassword);
  
  await passwordInput[1].clear();
  await passwordInput[1].sendKeys(testPassword);

  const registerButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng ký')]"));
  
  // Click đăng ký
  await registerButton.click();
  
  // Đợi alert và redirect
  await driver.sleep(2000);
  
  // Kiểm tra có alert thành công
  const alertText = await handleAlert();
  if (!alertText || !alertText.includes('Đăng ký thành công')) {
    console.warn('  Không thấy alert "Đăng ký thành công". Có thể đăng ký thất bại hoặc alert không hiển thị.');
  }

  // Đợi redirect
  await driver.sleep(2000);

  // Kiểm tra đã redirect về trang login
  const currentPath = await getCurrentPath();
  
  if (!currentPath.includes('/login')) {
    throw new Error(`Sau khi đăng ký thành công, không redirect về trang login. Got: ${currentPath}`);
  }

  // Kiểm tra đã chuyển về mode login (không còn form đăng ký)
  try {
    await driver.findElement(By.xpath("//input[@placeholder='Nguyễn Văn A']"));
    throw new Error('Vẫn còn form đăng ký sau khi đăng ký thành công và redirect');
  } catch (e) {
    if (!e.message.includes('no such element')) {
      throw e;
    }
    // OK - không còn form đăng ký
  }
}

// Test 5: Test các menu items trong Admin Sidebar
async function testAdminSidebarNavigation() {
  // Đăng nhập với admin trước
  await clearAuth();
  await driver.get(`${BASE_URL}/login`);
  await driver.sleep(2000);

  const testEmail = process.env.TEST_ADMIN_EMAIL || 'admin@gmail.com';
  const testPassword = process.env.TEST_ADMIN_PASSWORD || 'admin123';

  const emailInput = await driver.wait(
    until.elementLocated(By.xpath("//input[@type='email']")),
    TIMEOUT
  );
  await emailInput.clear();
  await emailInput.sendKeys(testEmail);

  const passwordInput = await driver.findElement(By.xpath("//input[@type='password']"));
  await passwordInput.sendKeys(testPassword);

  const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
  await loginButton.click();
  await driver.sleep(3000);

  // Danh sách menu items cần test
  const menuItems = [
    { label: 'Tổng quan', path: '/home' },
    { label: 'Nhân viên', path: '/admin' },
    { label: 'Khách hàng', path: '/crm' },
    { label: 'Lịch sử khách hàng', path: '/crm/history' },
    { label: 'Phòng ban', path: '/departments' },
    { label: 'Lương thưởng', path: '/payroll' },
  ];

  for (const item of menuItems) {
    try {
      // Tìm menu item
      const menuButton = await driver.wait(
        until.elementLocated(By.xpath(`//button[contains(., '${item.label}')]`)),
        TIMEOUT
      );

      // Click menu item
      await menuButton.click();
      await driver.sleep(2000);

      // Kiểm tra đã navigate đúng
      const currentPath = await getCurrentPath();
      if (!currentPath.includes(item.path)) {
        throw new Error(`Menu "${item.label}" không navigate đúng. Expected: ${item.path}, Got: ${currentPath}`);
      }

      console.log(`   Menu "${item.label}" navigate đúng đến ${item.path}`);
    } catch (error) {
      throw new Error(`Lỗi khi test menu "${item.label}": ${error.message}`);
    }
  }
}

// Test 6: Test các menu items trong Staff Sidebar
async function testStaffSidebarNavigation() {
  // Tạo user staff và đăng nhập
  // Vì không có API tạo staff, ta sẽ test với user đã có role staff
  // Hoặc skip test này nếu không có staff user
  
  await clearAuth();
  await driver.get(`${BASE_URL}/login`);
  await driver.sleep(2000);

  // Thử đăng nhập với staff user (nếu có)
  // Nếu không có, sẽ skip test này
  const staffEmail = process.env.TEST_STAFF_EMAIL;
  const staffPassword = process.env.TEST_STAFF_PASSWORD;

  if (!staffEmail || !staffPassword) {
    console.log('  Không có TEST_STAFF_EMAIL và TEST_STAFF_PASSWORD. Skipping staff sidebar test.');
    return;
  }

  const emailInput = await driver.wait(
    until.elementLocated(By.xpath("//input[@type='email']")),
    TIMEOUT
  );
  await emailInput.clear();
  await emailInput.sendKeys(staffEmail);

  const passwordInput = await driver.findElement(By.xpath("//input[@type='password']"));
  await passwordInput.sendKeys(staffPassword);

  const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
  await loginButton.click();
  await driver.sleep(3000);

  // Danh sách menu items cho staff
  const menuItems = [
    { label: 'Tổng quan', path: '/home' },
    { label: 'Hồ sơ', path: '/staff/employees' },
    { label: 'Khách hàng', path: '/staff/customers' },
    { label: 'Phòng ban', path: '/staff/departments' },
  ];

  for (const item of menuItems) {
    try {
      const menuButton = await driver.wait(
        until.elementLocated(By.xpath(`//button[contains(., '${item.label}')]`)),
        TIMEOUT
      );

      await menuButton.click();
      await driver.sleep(2000);

      const currentPath = await getCurrentPath();
      if (!currentPath.includes(item.path)) {
        throw new Error(`Menu "${item.label}" không navigate đúng. Expected: ${item.path}, Got: ${currentPath}`);
      }

      console.log(`   Menu "${item.label}" navigate đúng đến ${item.path}`);
    } catch (error) {
      throw new Error(`Lỗi khi test menu "${item.label}": ${error.message}`);
    }
  }
}

// Test 7: Test protected routes redirect to login
async function testProtectedRouteRedirect() {
  await clearAuth();
  
  // Thử truy cập protected route khi chưa đăng nhập
  await driver.get(`${BASE_URL}/admin`);
  await driver.sleep(2000);

  // Kiểm tra đã redirect về login
  const currentPath = await getCurrentPath();
  if (!currentPath.includes('/login')) {
    throw new Error(`Protected route không redirect về login. Got: ${currentPath}`);
  }
}

async function runTests() {
  console.log(' Bắt đầu chạy Navigation Tests...\n');
  console.log(` Frontend URL: ${BASE_URL}\n`);
  
  await checkBackendConnection();
  
  const results = {
    passed: 0,
    failed: 0,
    errors: [],
    bugs: []
  };

  const tests = [
    { 
      name: 'AC1: Test link "Đăng ký ngay" từ trang Login → Register', 
      fn: testLoginToRegisterLink 
    },
    { 
      name: 'AC2: Test link "Đăng nhập" từ trang Register → Login', 
      fn: testRegisterToLoginLink 
    },
    { 
      name: 'AC3: Test redirect sau đăng nhập thành công → Trang chủ', 
      fn: testLoginRedirectToHome 
    },
    { 
      name: 'AC4: Test redirect sau đăng ký thành công → Trang Login', 
      fn: testRegisterRedirectToLogin 
    },
    { 
      name: 'AC5: Test các menu items trong Admin Sidebar điều hướng đúng trang', 
      fn: testAdminSidebarNavigation 
    },
    { 
      name: 'AC6: Test các menu items trong Staff Sidebar điều hướng đúng trang', 
      fn: testStaffSidebarNavigation 
    },
    { 
      name: 'Test protected routes redirect to login', 
      fn: testProtectedRouteRedirect 
    },
  ];

  try {
    await setup();
    console.log(' Bắt đầu chạy test cases...\n');

    for (const test of tests) {
      try {
        console.log(`  Running: ${test.name}`);
        await test.fn();
        results.passed++;
        console.log(` ${test.name} - PASSED\n`);
        if (process.env.HEADLESS !== 'true') {
          await driver.sleep(1000);
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ test: test.name, error: error.message });
        console.error(` ${test.name} - FAILED: ${error.message}\n`);
        
        // Ghi nhận bug
        results.bugs.push({
          test: test.name,
          description: error.message,
          severity: 'Medium'
        });
        
        if (process.env.HEADLESS !== 'true') {
          await driver.sleep(2000);
        }
      }
    }
  } catch (error) {
    console.error(`Setup error: ${error.message}`);
    results.failed++;
  } finally {
    await teardown();
  }

  console.log('\n Test Results:');
  console.log(` Passed: ${results.passed}`);
  console.log(` Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n Errors:');
    results.errors.forEach(({ test, error }) => {
      console.log(`   - ${test}: ${error}`);
    });
  }

  if (results.bugs.length > 0) {
    console.log('\n Bugs phát hiện được:');
    results.bugs.forEach(({ test, description, severity }) => {
      console.log(`   - [${severity}] ${test}`);
      console.log(`     Mô tả: ${description}`);
    });
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('navigation.test.js')) {
  runTests();
}

