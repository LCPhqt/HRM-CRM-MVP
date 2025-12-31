# CRM Service (Customers MVP)

Service CRM độc lập theo kiến trúc SOA của dự án HRM.

## Chạy service

```bash
cd backend-hrmSOA/services/crm-service
npm i
# copy env template (Windows PowerShell)
# Copy-Item .\env.example .\.env
npm run dev
```

## Biến môi trường (gợi ý)

- `PORT`: mặc định `5007`
- `MONGO_URL`: mặc định `mongodb://127.0.0.1:27017/hrm-crm` (tránh lỗi IPv6 `::1` trên Windows)
- `JWT_SECRET` (hoặc `ACCESS_TOKEN_SECRET` / `SECRET`): nên đặt giống identity-service để verify token OK.

## Endpoints (MVP)

- `GET /health`
- `GET /crm/customers?search=&status=&ownerId=&page=&limit=`
- `GET /crm/customers/:id`
- `POST /crm/customers/import` (nhập danh sách từ file sau khi frontend parse JSON/CSV)
- `POST /crm/customers` (mặc định **admin**)
- `PUT /crm/customers/:id` (mặc định **admin**)
- `DELETE /crm/customers/:id` (mặc định **admin**)

## File mẫu để import

- `samples/customers.sample.csv`
- `samples/customers.sample.json`


