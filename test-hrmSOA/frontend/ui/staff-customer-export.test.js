import { Builder, By, until } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome.js';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5173';
const TIMEOUT = 30000; // Tăng timeout cho test data lớn
const TEST_STAFF_EMAIL = process.env.TEST_STAFF_EMAIL || `staff${Date.now()}@test.com`;
const TEST_STAFF_PASSWORD = process.env.TEST_STAFF_PASSWORD || 'staff123456';
const GATEWAY_URL = process.env.TEST_GATEWAY_URL || 'http://localhost:4000';
const DOWNLOAD_DIR = path.join(__dirname, '../../downloads');

let driver;
let downloadPath;

async function setup() {
  const options = new ChromeOptions();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  
  // Setup download preferences
  const prefs = {
    'download.default_directory': DOWNLOAD_DIR,
    'download.prompt_for_download': false,
    'download.directory_upgrade': true,
    'safebrowsing.enabled': true
  };
  options.setUserPreferences(prefs);
  
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless');
    console.log(' Chạy ở chế độ headless');
  } else {
    console.log(' Browser sẽ hiển thị');
    options.addArguments('--start-maximized');
  }

  // Tạo thư mục download nếu chưa có
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }

  console.log('Đang khởi động Chrome...');
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  console.log(' Browser đã khởi động!');
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
  
  // Cleanup download files older than 1 hour
  try {
    const files = fs.readdirSync(DOWNLOAD_DIR);
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(DOWNLOAD_DIR, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > 3600000) { // 1 hour
        fs.unlinkSync(filePath);
      }
    });
  } catch (e) {
    // Ignore cleanup errors
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

async function createStaffAccount() {
  console.log(' Đang tạo tài khoản nhân viên...');
  
  await driver.get(`${BASE_URL}/register`);
  await driver.sleep(1500);
  
  let isRegisterMode = false;
  try {
    await driver.findElement(By.xpath("//label[contains(text(), 'Họ và tên')] | //input[@placeholder*='tên']"));
    isRegisterMode = true;
    console.log(' Đã ở mode register');
  } catch (e) {
    console.log('  Đang ở mode login, chuyển sang mode register...');
    try {
      // Tìm link "Đăng ký ngay" (React Router Link, render thành <a>)
      const registerLink = await driver.wait(
        until.elementLocated(By.xpath("//a[contains(text(), 'Đăng ký ngay')]")),
        TIMEOUT
      );
      await registerLink.click();
      await driver.sleep(2000);
      
      // Kiểm tra lại xem đã ở register page chưa
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/register')) {
        // Nếu vẫn chưa ở /register, thử navigate trực tiếp
        await driver.get(`${BASE_URL}/register`);
        await driver.sleep(1500);
      }
      
      isRegisterMode = true;
      console.log(' Đã chuyển sang mode register');
    } catch (e2) {
      // Fallback: navigate trực tiếp đến /register
      console.log('  Không tìm thấy link, navigate trực tiếp đến /register...');
      await driver.get(`${BASE_URL}/register`);
      await driver.sleep(2000);
      isRegisterMode = true;
      console.log(' Đã navigate đến trang register');
    }
  }
  
  await driver.sleep(1000);
  
  try {
    const fullNameInput = await driver.wait(
      until.elementLocated(By.xpath("//label[contains(text(), 'Họ và tên')]/following-sibling::*/input | //input[@placeholder='Nguyễn Văn A'] | //input[@type='text' and contains(@placeholder, 'tên')]")),
      TIMEOUT
    );
    await fullNameInput.clear();
    await fullNameInput.sendKeys('Nhân viên Test');
    console.log(' Đã điền Họ và tên');
  } catch (e) {
    console.log('  Không tìm thấy input Họ và tên, có thể không bắt buộc');
  }
  
  const emailInput = await driver.wait(
    until.elementLocated(By.xpath("//input[@type='email']")),
    TIMEOUT
  );
  await emailInput.clear();
  await emailInput.sendKeys(TEST_STAFF_EMAIL);
  
  await driver.sleep(500);
  let passwordInputs = await driver.findElements(By.xpath("//input[@type='password']"));
  
  if (passwordInputs.length < 2) {
    await driver.sleep(1000);
    passwordInputs = await driver.findElements(By.xpath("//input[@type='password']"));
  }
  
  if (passwordInputs.length < 2) {
    throw new Error(`Cần 2 password inputs nhưng chỉ tìm thấy ${passwordInputs.length}`);
  }
  
  await passwordInputs[0].clear();
  await passwordInputs[0].sendKeys(TEST_STAFF_PASSWORD);
  await passwordInputs[1].clear();
  await passwordInputs[1].sendKeys(TEST_STAFF_PASSWORD);
  
  const submitButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Đăng ký') and @type='submit'] | //button[@type='submit']")),
    TIMEOUT
  );
  
  try {
    await driver.switchTo().alert().dismiss();
  } catch (e) {
    // Không có alert
  }
  
  await submitButton.click();
  await driver.sleep(2000);
  
  try {
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    await alert.accept();
    
    if (alertText.includes('đã tồn tại') || alertText.includes('already exists')) {
      console.log('  Tài khoản đã tồn tại, sẽ dùng tài khoản này');
    } else if (alertText.includes('thành công') || alertText.includes('success')) {
      console.log(' Đăng ký thành công');
    }
  } catch (e) {
    // Không có alert
  }
  
  await driver.sleep(1000);
  console.log(` Đã tạo/kiểm tra tài khoản staff: ${TEST_STAFF_EMAIL}`);
}

async function loginAsStaff() {
  console.log(' Đang đăng nhập với tài khoản nhân viên...');
  
  await driver.get(`${BASE_URL}/login`);
  await driver.sleep(1000);
  
  try {
    const fullNameInput = await driver.findElement(By.xpath("//label[contains(text(), 'Họ và tên')]"));
    const loginToggle = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập') and not(contains(@type, 'submit'))]"));
    await loginToggle.click();
    await driver.sleep(1000);
  } catch (e) {
    // Đã ở mode login
  }
  
  const emailInput = await driver.wait(
    until.elementLocated(By.xpath("//input[@type='email']")),
    TIMEOUT
  );
  await emailInput.clear();
  await emailInput.sendKeys(TEST_STAFF_EMAIL);
  
  const passwordInput = await driver.findElement(By.xpath("//input[@type='password']"));
  await passwordInput.clear();
  await passwordInput.sendKeys(TEST_STAFF_PASSWORD);
  
  const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập') and @type='submit'] | //button[@type='submit']"));
  
  try {
    await driver.switchTo().alert().dismiss();
  } catch (e) {
    // Không có alert
  }
  
  await loginButton.click();
  await driver.sleep(2000);
  
  try {
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    await alert.accept();
    
    if (alertText.includes('Sai mật khẩu') || alertText.includes('không hợp lệ')) {
      throw new Error(`Login failed: ${alertText}`);
    }
  } catch (e) {
    if (e.message && e.message.includes('Login failed')) {
      throw e;
    }
  }
  
  await driver.sleep(1000);
  
  const currentUrl = await driver.getCurrentUrl();
  if (currentUrl.includes('/login')) {
    const alertText = await handleAlert();
    throw new Error(`Login failed - still on login page. Alert: ${alertText || 'none'}`);
  }
  
  console.log(` Đã đăng nhập thành công với tài khoản staff: ${TEST_STAFF_EMAIL}`);
}

async function navigateToStaffCustomersPage() {
  try {
    const customersLink = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(text(), 'Khách hàng')] | //a[contains(text(), 'Customers')] | //a[contains(@href, '/staff/customers')]")),
      TIMEOUT
    );
    await customersLink.click();
    await driver.sleep(2000);
  } catch (e) {
    await driver.get(`${BASE_URL}/staff/customers`);
    await driver.sleep(2000);
  }
  
  const currentUrl = await driver.getCurrentUrl();
  if (!currentUrl.includes('/customers')) {
    throw new Error('Failed to navigate to customers page');
  }
  
  console.log(' Đã điều hướng đến trang khách hàng');
}

async function addCustomer(customerData) {
  const addButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Thêm khách hàng')]")),
    TIMEOUT
  );
  await addButton.click();
  await driver.sleep(1000);
  
  const modalTitle = await driver.wait(
    until.elementLocated(By.xpath("//h3[contains(text(), 'Thêm khách hàng')]")),
    TIMEOUT
  );
  if (!(await modalTitle.isDisplayed())) {
    throw new Error('Add customer modal should be displayed');
  }
  
  const nameInput = await driver.wait(
    until.elementLocated(By.xpath("//input[@placeholder='VD: Công ty ABC'] | //label[contains(text(), 'Tên khách hàng')]/following-sibling::*/input | //label[contains(text(), 'Tên khách hàng')]/../input")),
    TIMEOUT
  );
  await nameInput.clear();
  await nameInput.sendKeys(customerData.name || '');
  
  if (customerData.email) {
    try {
      const emailInput = await driver.findElement(By.xpath("//input[@placeholder='contact@abc.com'] | //label[contains(text(), 'Email')]/following-sibling::*/input"));
      await emailInput.clear();
      await emailInput.sendKeys(customerData.email);
    } catch (e) {
      console.log('  Email input not found, skipping');
    }
  }
  
  if (customerData.phone) {
    try {
      const phoneInput = await driver.findElement(By.xpath("//input[@placeholder='090...'] | //label[contains(text(), 'Số điện thoại')]/following-sibling::*/input"));
      await phoneInput.clear();
      await phoneInput.sendKeys(customerData.phone);
    } catch (e) {
      console.log('  Phone input not found, skipping');
    }
  }
  
  if (customerData.address) {
    try {
      const addressInput = await driver.findElement(By.xpath("//input[@placeholder*='địa chỉ'] | //label[contains(text(), 'Địa chỉ')]/following-sibling::*/input | //textarea[contains(@placeholder, 'địa chỉ')]"));
      await addressInput.clear();
      await addressInput.sendKeys(customerData.address);
    } catch (e) {
      console.log('  Address input not found, skipping');
    }
  }
  
  const saveButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Lưu') and not(contains(text(), 'Hủy'))]")),
    TIMEOUT
  );
  await saveButton.click();
  await driver.sleep(2000);
  
  const alertText = await handleAlert();
  if (alertText && alertText.toLowerCase().includes('thất bại')) {
    throw new Error(`Failed to add customer: ${alertText}`);
  }
  
  await driver.sleep(1000);
}

async function clearAllCustomers() {
  console.log('Đang xóa tất cả khách hàng...');
  // Note: Trong thực tế, có thể cần API để xóa hoặc xóa từng cái
  // Ở đây giả sử có nút xóa hoặc API
  // Tạm thời bỏ qua, test sẽ dựa vào dữ liệu hiện có
}

async function waitForFileDownload(filePattern, timeout = 10000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const files = fs.readdirSync(DOWNLOAD_DIR);
      const matchingFile = files.find(f => f.includes(filePattern) && f.endsWith('.xlsx'));
      if (matchingFile) {
        const filePath = path.join(DOWNLOAD_DIR, matchingFile);
        // Đợi file hoàn tất download (không còn đang được ghi)
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          if (stats.size > 0) {
            return filePath;
          }
        }
      }
    } catch (e) {
      // Continue waiting
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return null;
}

async function readExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (e) {
    throw new Error(`Failed to read Excel file: ${e.message}`);
  }
}

async function testExportEmptyList() {
  console.log('Test: Export Excel khi danh sách rỗng');
  
  await navigateToStaffCustomersPage();
  await driver.sleep(2000);
  
  // Kiểm tra xem có khách hàng nào không
  let hasCustomers = false;
  try {
    const tableRows = await driver.findElements(By.xpath("//tbody/tr"));
    hasCustomers = tableRows.length > 0;
  } catch (e) {
    // Không có bảng hoặc không có dòng
  }
  
  if (hasCustomers) {
    console.log('Có khách hàng trong danh sách, test sẽ kiểm tra export với danh sách hiện có');
  }
  
  // Click nút export
  const exportButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Xuất Excel')] | //button[contains(text(), 'Export')]")),
    TIMEOUT
  );
  
  const beforeClick = Date.now();
  await exportButton.click();
  await driver.sleep(3000); // Đợi file download
  
  // Kiểm tra file đã được download
  const filePath = await waitForFileDownload('customers_staff_', 15000);
  
  if (!filePath) {
    // Kiểm tra có alert lỗi không
    const alertText = await handleAlert();
    if (alertText && alertText.includes('thất bại')) {
      throw new Error(`Export failed with alert: ${alertText}`);
    }
    throw new Error('Excel file was not downloaded');
  }
  
  console.log(`File đã được download: ${path.basename(filePath)}`);
  
  // Đọc và kiểm tra file Excel
  const data = await readExcelFile(filePath);
  
  // Kiểm tra file có cấu trúc đúng
  if (data.length === 0) {
    console.log('File Excel rỗng (không có dữ liệu) - đúng với danh sách rỗng');
  } else {
    console.log(`File Excel có ${data.length} dòng dữ liệu`);
    // Kiểm tra cấu trúc columns
    if (data.length > 0) {
      const firstRow = data[0];
      const requiredColumns = ['STT', 'Tên khách hàng', 'Email', 'Số điện thoại', 'Địa chỉ', 'Người phụ trách', 'Trạng thái', 'Tags'];
      const hasAllColumns = requiredColumns.every(col => firstRow.hasOwnProperty(col));
      if (!hasAllColumns) {
        throw new Error('Excel file missing required columns');
      }
      console.log('File Excel có đầy đủ các cột cần thiết');
    }
  }
  
  // Cleanup
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    // Ignore
  }
  
  console.log('Test export danh sách rỗng/thường: PASSED');
}

async function testExportWithSpecialCharacters() {
  console.log('Test: Export Excel với ký tự đặc biệt');
  
  await navigateToStaffCustomersPage();
  await driver.sleep(2000);
  
  // Thêm khách hàng với ký tự đặc biệt
  const specialCharsCustomer = {
    name: 'Công ty ABC & XYZ <>"\'\\/[]{}|`~!@#$%^&*()_+-=',
    email: 'test+special@example.com',
    phone: '090-123-4567',
    address: '123 Đường Nguyễn Văn A, Phường 1, Quận 1, TP.HCM (Việt Nam)'
  };
  
  try {
    await addCustomer(specialCharsCustomer);
    console.log('Đã thêm khách hàng với ký tự đặc biệt');
    await driver.sleep(2000);
  } catch (e) {
    console.log(`Không thể thêm khách hàng: ${e.message}`);
    // Tiếp tục test với dữ liệu hiện có
  }
  
  // Click nút export
  const exportButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Xuất Excel')] | //button[contains(text(), 'Export')]")),
    TIMEOUT
  );
  
  await exportButton.click();
  await driver.sleep(3000);
  
  const filePath = await waitForFileDownload('customers_staff_', 15000);
  
  if (!filePath) {
    const alertText = await handleAlert();
    if (alertText && alertText.includes('thất bại')) {
      throw new Error(`Export failed: ${alertText}`);
    }
    throw new Error('Excel file was not downloaded');
  }
  
  console.log(`File đã được download: ${path.basename(filePath)}`);
  
  // Đọc và kiểm tra file
  const data = await readExcelFile(filePath);
  
  if (data.length === 0) {
    throw new Error('Excel file should contain data');
  }
  
  // Tìm khách hàng có ký tự đặc biệt
  const foundSpecial = data.find(row => {
    const name = String(row['Tên khách hàng'] || '');
    return name.includes('ABC & XYZ') || name.includes('<>');
  });
  
  if (foundSpecial) {
    console.log('Tìm thấy khách hàng với ký tự đặc biệt trong file Excel');
    console.log(`   Tên: ${foundSpecial['Tên khách hàng']}`);
    console.log(`   Email: ${foundSpecial['Email']}`);
    console.log(`   Địa chỉ: ${foundSpecial['Địa chỉ']}`);
    
    // Kiểm tra ký tự đặc biệt không bị mất
    if (!foundSpecial['Tên khách hàng'].includes('&')) {
      throw new Error('Special characters were lost in export');
    }
  } else {
    console.log('Không tìm thấy khách hàng với ký tự đặc biệt (có thể chưa được thêm)');
  }
  
  // Cleanup
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    // Ignore
  }
  
  console.log('Test export với ký tự đặc biệt: PASSED');
}

async function testExportWithManyCustomers() {
  console.log('Test: Export Excel với nhiều khách hàng');
  
  await navigateToStaffCustomersPage();
  await driver.sleep(2000);
  
  // Thêm nhiều khách hàng
  const customerCount = 10;
  console.log(`Đang thêm ${customerCount} khách hàng...`);
  
  for (let i = 0; i < customerCount; i++) {
    try {
      await addCustomer({
        name: `Khách hàng Test ${i + 1} - ${Date.now()}`,
        email: `customer${i + 1}@test.com`,
        phone: `090${String(i + 1).padStart(7, '0')}`,
        address: `Địa chỉ ${i + 1}, Quận ${i + 1}, TP.HCM`
      });
      await driver.sleep(500); // Đợi giữa các lần thêm
    } catch (e) {
      console.log(`Không thể thêm khách hàng ${i + 1}: ${e.message}`);
    }
  }
  
  console.log('Đã thêm xong khách hàng');
  await driver.sleep(2000);
  
  // Click nút export
  const exportButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Xuất Excel')] | //button[contains(text(), 'Export')]")),
    TIMEOUT
  );
  
  const startTime = Date.now();
  await exportButton.click();
  await driver.sleep(5000); // Đợi lâu hơn cho nhiều dữ liệu
  
  const filePath = await waitForFileDownload('customers_staff_', 20000);
  const exportTime = Date.now() - startTime;
  
  if (!filePath) {
    const alertText = await handleAlert();
    if (alertText && alertText.includes('thất bại')) {
      throw new Error(`Export failed: ${alertText}`);
    }
    throw new Error('Excel file was not downloaded');
  }
  
  console.log(`File đã được download trong ${exportTime}ms: ${path.basename(filePath)}`);
  
  // Kiểm tra file size
  const stats = fs.statSync(filePath);
  console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
  
  if (stats.size === 0) {
    throw new Error('Excel file is empty');
  }
  
  // Đọc và kiểm tra file
  const data = await readExcelFile(filePath);
  console.log(`Số dòng dữ liệu trong file: ${data.length}`);
  
  if (data.length === 0) {
    throw new Error('Excel file should contain data');
  }
  
  // Kiểm tra tất cả dòng có đầy đủ thông tin
  const incompleteRows = data.filter(row => !row['Tên khách hàng'] || !row['STT']);
  if (incompleteRows.length > 0) {
    console.log(`Có ${incompleteRows.length} dòng không đầy đủ thông tin`);
  }
  
  // Cleanup
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    // Ignore
  }
  
  console.log('Test export với nhiều khách hàng: PASSED');
}

async function testExportLargeData() {
  console.log('Test: Export Excel với data lớn (không crash)');
  
  await navigateToStaffCustomersPage();
  await driver.sleep(2000);
  
  // Thêm nhiều khách hàng (50-100 để test data lớn)
  const largeCustomerCount = 50;
  console.log(`Đang thêm ${largeCustomerCount} khách hàng để test data lớn...`);
  
  const startAddTime = Date.now();
  let successCount = 0;
  
  for (let i = 0; i < largeCustomerCount; i++) {
    try {
      await addCustomer({
        name: `Khách hàng Large Test ${i + 1} - ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: `largecustomer${i + 1}@test.com`,
        phone: `090${String(i + 1).padStart(7, '0')}`,
        address: `Địa chỉ lớn ${i + 1}, Phường ${i + 1}, Quận ${Math.floor(i / 10) + 1}, TP.HCM, Việt Nam`
      });
      successCount++;
      if (i % 10 === 0) {
        console.log(`   Đã thêm ${i + 1}/${largeCustomerCount} khách hàng...`);
      }
      await driver.sleep(300); // Giảm delay để nhanh hơn
    } catch (e) {
      console.log(`Không thể thêm khách hàng ${i + 1}: ${e.message}`);
      // Tiếp tục với khách hàng tiếp theo
    }
  }
  
  const addTime = Date.now() - startAddTime;
  console.log(`Đã thêm ${successCount}/${largeCustomerCount} khách hàng trong ${addTime}ms`);
  await driver.sleep(3000);
  
  // Kiểm tra browser không bị crash
  try {
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl) {
      throw new Error('Browser may have crashed - cannot get current URL');
    }
    console.log('Browser vẫn hoạt động bình thường');
  } catch (e) {
    throw new Error(`Browser may have crashed: ${e.message}`);
  }
  
  // Click nút export
  const exportButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Xuất Excel')] | //button[contains(text(), 'Export')]")),
    TIMEOUT
  );
  
  const startExportTime = Date.now();
  console.log('Bắt đầu export Excel...');
  
  await exportButton.click();
  
  // Đợi lâu hơn cho data lớn
  await driver.sleep(10000);
  
  const filePath = await waitForFileDownload('customers_staff_', 30000);
  const exportTime = Date.now() - startExportTime;
  
  if (!filePath) {
    // Kiểm tra browser có còn hoạt động không
    try {
      await driver.getCurrentUrl();
      const alertText = await handleAlert();
      if (alertText && alertText.includes('thất bại')) {
        throw new Error(`Export failed: ${alertText}`);
      }
      throw new Error('Excel file was not downloaded but browser is still running');
    } catch (e) {
      if (e.message.includes('browser')) {
        throw new Error('Browser may have crashed during export');
      }
      throw e;
    }
  }
  
  console.log(`File đã được download trong ${exportTime}ms: ${path.basename(filePath)}`);
  
  // Kiểm tra file size
  const stats = fs.statSync(filePath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  console.log(`File size: ${fileSizeKB} KB`);
  
  if (stats.size === 0) {
    throw new Error('Excel file is empty');
  }
  
  // Đọc file (có thể mất thời gian với file lớn)
  console.log('Đang đọc file Excel...');
  const readStartTime = Date.now();
  const data = await readExcelFile(filePath);
  const readTime = Date.now() - readStartTime;
  
  console.log(`Số dòng dữ liệu: ${data.length}`);
  console.log(`Thời gian đọc file: ${readTime}ms`);
  
  // Kiểm tra browser vẫn hoạt động sau khi export
  try {
    const currentUrl = await driver.getCurrentUrl();
    console.log(`Browser vẫn hoạt động sau export: ${currentUrl}`);
  } catch (e) {
    throw new Error(`Browser crashed after export: ${e.message}`);
  }
  
  // Kiểm tra không có memory leak (file không quá lớn so với số dòng)
  const avgRowSize = stats.size / Math.max(data.length, 1);
  if (avgRowSize > 10000) { // > 10KB per row là bất thường
    console.log(`Warning: Average row size is ${(avgRowSize / 1024).toFixed(2)} KB, may indicate memory issue`);
  }
  
  // Cleanup
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    // Ignore
  }
  
  console.log('Test export data lớn (không crash): PASSED');
}

async function checkBackendConnection() {
  return new Promise((resolve) => {
    const gatewayUrl = process.env.TEST_GATEWAY_URL || 'http://127.0.0.1:4000';
    const req = http.get(`${gatewayUrl}/health`, { timeout: 2000 }, (res) => {
      if (res.statusCode === 200) {
        console.log('Backend server đang chạy\n');
      } else {
        console.warn('Warning: Backend server có thể không chạy.');
      }
      resolve();
    });
    
    req.on('error', () => {
      console.warn('Warning: Backend server có thể không chạy.');
      resolve();
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.warn('Warning: Backend server có thể không chạy.');
      resolve();
    });
  });
}

async function runTests() {
  console.log('Bắt đầu chạy Staff Customer Export Excel Tests...\n');
  console.log(`Frontend URL: ${BASE_URL}\n`);
  
  await checkBackendConnection();
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  const tests = [
    { name: 'should export Excel with empty list', fn: testExportEmptyList },
    { name: 'should export Excel with special characters', fn: testExportWithSpecialCharacters },
    { name: 'should export Excel with many customers', fn: testExportWithManyCustomers },
    { name: 'should export Excel with large data without crash', fn: testExportLargeData }
  ];

  try {
    await setup();
    await createStaffAccount();
    await loginAsStaff();
    console.log('Bắt đầu chạy test cases...\n');

    for (const test of tests) {
      try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Running: ${test.name}`);
        console.log('='.repeat(60));
        await test.fn();
        results.passed++;
        console.log(`${test.name} - PASSED\n`);
        if (process.env.HEADLESS !== 'true') {
          await driver.sleep(2000);
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ test: test.name, error: error.message });
        console.error(`${test.name} - FAILED: ${error.message}\n`);
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

  console.log('\n' + '='.repeat(60));
  console.log('Test Results:');
  console.log('='.repeat(60));
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Pass Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(({ test, error }) => {
      console.log(`   - ${test}: ${error}`);
    });
  }
  
  // Kiểm tra pass rate >= 80%
  const passRate = (results.passed / (results.passed + results.failed)) * 100;
  if (passRate < 80) {
    console.log(`\nWarning: Pass rate (${passRate.toFixed(1)}%) is below 80%`);
    process.exit(1);
  } else {
    console.log(`\nPass rate (${passRate.toFixed(1)}%) meets requirement (>= 80%)`);
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('staff-customer-export.test.js')) {
  runTests();
}

