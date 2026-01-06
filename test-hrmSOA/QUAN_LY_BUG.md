# Quản Lý Bug - Automation Tests

## 📊 Dashboard

| Tổng số bug | Đang mở | Đã fix | Đang fix | Đã đóng |
|------------|---------|--------|----------|---------|
| 4 | 3 | 1 | 0 | 0 |

---

## 🐛 Danh Sách Bug

### Bug #BUG-001: MongoDB Connection Timeout trong Backend Tests

| Thông tin | Chi tiết |
|-----------|----------|
| **ID** | BUG-001 |
| **Tiêu đề** | MongoDB Connection Timeout trong Backend Tests |
| **Severity** | 🔴 HIGH |
| **Priority** | P0 - Critical |
| **Status** | ❌ Open |
| **Assignee** | - |
| **Reporter** | AI Assistant |
| **Ngày tạo** | Hôm nay |
| **Ngày cập nhật** | Hôm nay |
| **File liên quan** | `test-hrmSOA/backend/identity-service/__tests__/authController.test.js` |
| **Test Cases ảnh hưởng** | 10/13 backend tests (77%) |

#### Mô tả
Backend tests bị lỗi "buffering timed out" do MongoDB connection chưa sẵn sàng khi models được load.

#### Lỗi
```
Operation users.findOne() buffering timed out after 10000ms
Operation users.insertOne() buffering timed out after 10000ms
```

#### Nguyên nhân
- Models được load trước khi MongoDB connection sẵn sàng
- Mongoose đang buffer operations nhưng không thể execute
- Connection timeout sau 10 giây

#### Giải pháp đề xuất
1. Sử dụng `mongodb-memory-server` thay vì MongoDB thật
2. Đảm bảo models chỉ được load sau khi connection sẵn sàng
3. Tăng timeout hoặc thêm retry logic
4. Sử dụng connection pooling

#### Test Cases bị ảnh hưởng
1. should register successfully with valid data
2. should return 409 when email already exists
3. should hash password before storing
4. should work without full_name
5. should login successfully with correct credentials
6. should return 400 when email is missing (login)
7. should return 400 when password is missing (login)
8. should return 401 when email does not exist
9. should return 401 when password is incorrect
10. should return valid JWT token on successful login

#### Ghi chú
- Bug này ảnh hưởng đến hầu hết backend tests
- Cần fix sớm để có thể chạy được các integration tests

---

### Bug #BUG-002: Alert Handling Không Ổn Định trong Frontend Tests

| Thông tin | Chi tiết |
|-----------|----------|
| **ID** | BUG-002 |
| **Tiêu đề** | Alert Handling Không Ổn Định trong Frontend Tests |
| **Severity** | 🟡 MEDIUM |
| **Priority** | P1 - High |
| **Status** | ⚠️ Open (có workaround) |
| **Assignee** | - |
| **Reporter** | AI Assistant |
| **Ngày tạo** | Hôm nay |
| **Ngày cập nhật** | Hôm nay |
| **File liên quan** | `test-hrmSOA/frontend/ui/staff-customer.test.js` |
| **Test Cases ảnh hưởng** | Frontend login/register tests |

#### Mô tả
Frontend tests gặp lỗi "unexpected alert open" khi xử lý alert dialog, đặc biệt là khi đăng nhập/đăng ký.

#### Lỗi
```
unexpected alert open: {Alert text : Sai mật khẩu hoặc tài khoản}
```

#### Nguyên nhân
- Alert xuất hiện nhưng không được handle trước khi thao tác tiếp theo
- Selenium WebDriver không tự động dismiss alert
- Timing issue: alert xuất hiện sau khi code đã chạy tiếp

#### Giải pháp đề xuất
1. Luôn check và handle alert trước mỗi action
2. Sử dụng explicit wait cho alert
3. Wrap alert handling trong try-catch tốt hơn
4. Sử dụng WebDriverWait với expected conditions

#### Workaround hiện tại
- Đã thêm try-catch để handle alert
- Vẫn có thể fail trong một số trường hợp

#### Ghi chú
- Đã có workaround nhưng chưa hoàn hảo
- Cần cải thiện để test ổn định hơn

---

### Bug #BUG-003: Element Finding Không Chính Xác (XPath Selectors)

| Thông tin | Chi tiết |
|-----------|----------|
| **ID** | BUG-003 |
| **Tiêu đề** | Element Finding Không Chính Xác (XPath Selectors) |
| **Severity** | 🟡 MEDIUM |
| **Priority** | P1 - High |
| **Status** | ⚠️ Open (partial fix) |
| **Assignee** | - |
| **Reporter** | AI Assistant |
| **Ngày tạo** | Hôm nay |
| **Ngày cập nhật** | Hôm nay |
| **File liên quan** | `test-hrmSOA/frontend/ui/staff-customer.test.js` |
| **Test Cases ảnh hưởng** | Frontend form tests |

#### Mô tả
Một số test fail do không tìm thấy elements, đặc biệt là khi form chuyển đổi giữa login/register mode.

#### Lỗi
```
Should have 2 password inputs (password and confirm password) but only found 1
```

#### Nguyên nhân
- XPath selectors không đủ robust
- Form có thể đang ở mode login thay vì register
- Timing issue: elements chưa render xong
- Dynamic content: form thay đổi theo state

#### Giải pháp đề xuất
1. Sử dụng explicit wait với expected conditions
2. Kiểm tra mode (login/register) trước khi tìm elements
3. Sử dụng multiple selectors với fallback
4. Thêm retry logic
5. Sử dụng data-testid attributes

#### Fix đã thực hiện
- Đã thêm logic kiểm tra mode register/login
- Đã thêm retry logic cho password inputs
- Vẫn có thể cải thiện thêm

#### Ghi chú
- Đã có một số fix nhưng vẫn có thể cải thiện
- Nên sử dụng data-testid để test ổn định hơn

---

### Bug #BUG-004: Export Excel Không Có Thông Báo Khi Danh Sách Rỗng

| Thông tin | Chi tiết |
|-----------|----------|
| **ID** | BUG-004 |
| **Tiêu đề** | Export Excel Không Có Thông Báo Khi Danh Sách Rỗng |
| **Severity** | 🟡 MEDIUM |
| **Priority** | P2 - Medium |
| **Status** | ✅ Fixed (đã thêm validation) |
| **Assignee** | - |
| **Reporter** | AI Assistant |
| **Ngày tạo** | Hôm nay |
| **Ngày cập nhật** | Hôm nay (đã fix) |
| **File liên quan** | `frontend-hrmSOA/src/pages/StaffCustomersPage.jsx`, `frontend-hrmSOA/src/pages/CRMPage.jsx` |
| **Test Cases ảnh hưởng** | 3 test cases (1 cần cập nhật, 2 không bị ảnh hưởng) |

#### Mô tả
Khi nhân viên bấm nút "Xuất Excel" nhưng danh sách khách hàng đang rỗng, hệ thống vẫn tải file Excel xuống (file rỗng hoặc chỉ có header) mà không có thông báo hoặc hướng dẫn người dùng thêm khách hàng trước.

#### Kết quả hiện tại (trước khi fix)
- File Excel được tải xuống ngay cả khi danh sách rỗng
- File chỉ có header, không có dữ liệu
- Không có thông báo cho người dùng

#### Fix đã thực hiện
- ✅ Đã thêm validation vào `exportToExcel()` trong `CRMPage.jsx`
- ✅ Đã thêm validation vào `exportToExcel()` trong `StaffCustomersPage.jsx`
- ✅ Kiểm tra `customers.length === 0` trước khi export
- ✅ Hiển thị alert: "Danh sách khách hàng đang trống. Vui lòng thêm khách hàng trước khi xuất file."
- ✅ Không tải file Excel khi danh sách rỗng

#### Kết quả mong đợi (đã đạt được)
- Hiển thị thông báo: "Danh sách khách hàng đang trống. Vui lòng thêm khách hàng trước khi xuất file."
- Hoặc disable nút "Xuất Excel" khi danh sách rỗng
- Hoặc hiển thị modal hướng dẫn thêm khách hàng

#### Code cần sửa
```javascript
// File: frontend-hrmSOA/src/pages/StaffCustomersPage.jsx
// Function: exportToExcel()

// Thêm validation trước khi export
const exportToExcel = async () => {
  // Kiểm tra danh sách rỗng
  if (!customers || customers.length === 0) {
    alert("Danh sách khách hàng đang trống. Vui lòng thêm khách hàng trước khi xuất file.");
    return;
  }
  
  // Hoặc disable button: disabled={customers.length === 0}
  
  // Tiếp tục export...
};
```

#### Giải pháp đề xuất
1. **Option 1**: Thêm validation và alert
   - Kiểm tra `customers.length === 0` trước khi export
   - Hiển thị alert thông báo

2. **Option 2**: Disable button khi rỗng
   - Disable nút "Xuất Excel" khi `customers.length === 0`
   - Thêm tooltip giải thích

3. **Option 3**: Hiển thị modal hướng dẫn
   - Khi click export với danh sách rỗng
   - Hiển thị modal với nút "Thêm khách hàng"

#### Test Cases ảnh hưởng
1. **testExportEmptyList()** - Export Excel khi danh sách rỗng
   - File: `test-hrmSOA/frontend/ui/staff-customer-export.test.js`
   - Mô tả: Test export Excel khi không có khách hàng nào
   - Kết quả mong đợi: 
     - Hiển thị alert: "Danh sách khách hàng đang trống. Vui lòng thêm khách hàng trước khi xuất file."
     - Hoặc nút "Xuất Excel" bị disable
     - Không tải file Excel xuống
   - Status: ⚠️ Cần cập nhật test để kiểm tra validation

2. **testExportWithData()** - Export Excel khi có dữ liệu
   - File: `test-hrmSOA/frontend/ui/staff-customer-export.test.js`
   - Mô tả: Test export Excel khi có khách hàng
   - Kết quả mong đợi: File Excel được tải xuống với dữ liệu đúng
   - Status: ✅ Test này vẫn pass

3. **testExportWithSpecialCharacters()** - Export Excel với ký tự đặc biệt
   - File: `test-hrmSOA/frontend/ui/staff-customer-export.test.js`
   - Mô tả: Test export Excel với dữ liệu có ký tự đặc biệt
   - Status: ✅ Không bị ảnh hưởng

#### Test Case mới cần thêm
```javascript
// test-hrmSOA/frontend/ui/staff-customer-export.test.js

async function testExportEmptyListWithValidation() {
  console.log('▶️  Test: Export Excel với validation khi danh sách rỗng');
  
  await navigateToStaffCustomersPage();
  await driver.sleep(2000);
  
  // Đảm bảo danh sách rỗng
  const tableRows = await driver.findElements(By.xpath("//tbody/tr"));
  if (tableRows.length > 0) {
    console.log('⚠️  Có khách hàng trong danh sách, test sẽ bỏ qua');
    return;
  }
  
  // Click nút export
  const exportButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(), 'Xuất Excel')] | //button[contains(text(), 'Export')]")),
    TIMEOUT
  );
  
  // Kiểm tra nút có bị disable không
  const isDisabled = await exportButton.getAttribute('disabled');
  if (isDisabled !== null) {
    console.log('✅ Nút "Xuất Excel" đã bị disable khi danh sách rỗng');
    return;
  }
  
  // Nếu nút không bị disable, click và kiểm tra alert
  await exportButton.click();
  await driver.sleep(1000);
  
  // Kiểm tra alert xuất hiện
  try {
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    await alert.accept();
    
    if (alertText.includes('trống') || alertText.includes('thêm khách hàng')) {
      console.log('✅ Alert validation đã hiển thị:', alertText);
    } else {
      throw new Error(`Alert không đúng: ${alertText}`);
    }
  } catch (e) {
    // Kiểm tra xem có file được download không
    const filePath = await waitForFileDownload('customers_staff_', 5000);
    if (filePath) {
      throw new Error('File Excel vẫn được tải xuống khi danh sách rỗng (BUG)');
    }
    throw new Error(`Không có alert validation và không có file download: ${e.message}`);
  }
  
  console.log('✅ Test export với validation: PASSED');
}
```

#### Ghi chú
- Đây là UX issue, không ảnh hưởng chức năng chính
- Cải thiện trải nghiệm người dùng
- Nên implement Option 1 hoặc Option 2
- Test case cần được cập nhật sau khi fix bug

---

## 📈 Thống Kê Bug

### Theo Severity
- 🔴 HIGH: 1 bug (25%)
- 🟡 MEDIUM: 3 bugs (75%)
- 🟢 LOW: 0 bug (0%)

### Theo Status
- ❌ Open: 2 bugs (50%)
- ⚠️ Open (có workaround): 2 bugs (50%)
- ✅ Fixed: 1 bug (25%) - BUG-004
- 🔄 In Progress: 0 bug (0%)

### Theo Priority
- P0 - Critical: 1 bug (25%)
- P1 - High: 2 bugs (50%)
- P2 - Medium: 1 bug (25%)

---

## 🎯 Roadmap Fix Bug

### Sprint 1 (Ưu tiên cao)
- [ ] **BUG-001**: MongoDB Connection Timeout
  - Ước tính: 4-6 giờ
  - Impact: Fix được 77% backend tests

### Sprint 2 (Ưu tiên trung bình)
- [ ] **BUG-002**: Alert Handling
  - Ước tính: 2-3 giờ
  - Impact: Cải thiện stability của frontend tests

- [ ] **BUG-003**: Element Finding
  - Ước tính: 2-3 giờ
  - Impact: Cải thiện stability của form tests

### Sprint 3 (Ưu tiên thấp)
- [x] **BUG-004**: Export Excel khi danh sách rỗng
  - Ước tính: 1-2 giờ
  - Impact: Cải thiện UX
  - Status: ✅ Đã fix - đã thêm validation vào CRMPage.jsx và StaffCustomersPage.jsx

---

## 📝 Template Bug Report

```markdown
### Bug #[ID]

| Thông tin | Chi tiết |
|-----------|----------|
| **ID** | BUG-XXX |
| **Tiêu đề** | [Tiêu đề bug] |
| **Severity** | 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW |
| **Priority** | P0-P3 |
| **Status** | ❌ Open / ⚠️ In Progress / ✅ Fixed |
| **Assignee** | [Người được giao] |
| **Reporter** | [Người báo bug] |
| **Ngày tạo** | [Ngày] |
| **Ngày cập nhật** | [Ngày] |
| **File liên quan** | [Đường dẫn file] |

#### Mô tả
[Chi tiết bug]

#### Lỗi
[Error message hoặc screenshot]

#### Nguyên nhân
[Phân tích nguyên nhân]

#### Giải pháp đề xuất
[Giải pháp]

#### Test Cases ảnh hưởng
[List test cases]

#### Ghi chú
[Ghi chú thêm]
```

---

## 🔄 Lịch Sử Cập Nhật

| Ngày | Bug ID | Thay đổi | Người thực hiện |
|------|--------|----------|----------------|
| Hôm nay | BUG-001, BUG-002, BUG-003, BUG-004 | Tạo bug reports | AI Assistant |
| Hôm nay | BUG-004 | Đã fix - thêm validation cho export Excel | AI Assistant |

---

## 📚 Tài Liệu Liên Quan

- [Danh Sách Bug Chi Tiết](./DANH_SACH_BUG_AUTOMATION_TEST.md)
- [Test Cases Thành Công](./backend/TEST_CASES_THANH_CONG.md)
- [Hướng Dẫn Chạy Test](./HUONG_DAN_CHAY_TEST.md)

