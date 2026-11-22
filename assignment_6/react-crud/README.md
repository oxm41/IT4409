# Bài 6 — React CRUD

React 18, functional components; dữ liệu ban đầu từ JSONPlaceholder.
Thêm, sửa, xóa chỉ cập nhật state trong phiên hiện tại; tải lại trang sẽ lấy dữ liệu mẫu lại.

```sh
cd assignment_6/react-crud
npm ci
npm test
npm run build
npm run preview
```

Mở http://127.0.0.1:4176/. Dùng `npm run test:browser` để chạy 6 kiểm thử giao diện
(Windows dùng Chrome đã cài; Linux chạy `npx playwright install chromium` trước).

- `App`: chia sẻ `kw`, `newUser` giữa các component con.
- `SearchForm`: nhập từ khóa, gọi callback của App.
- `AddUser`: giữ bản nháp và điều khiển hộp thoại thêm.
- `ResultTable`: tải danh sách, lọc, sửa và xóa; xử lý người dùng mới.
- `fields.jsx`: hàm dùng chung tạo các input, không phải component độc lập.
- `users.mjs`: các hàm dữ liệu thuần và kiểm tra đầu vào.

Từ thư mục gốc, `npm run build:pages` đóng gói vào `.checks/pages/assignment_6/`.
Báo cáo HTML/PDF đặt trong `public/assignment_6/`. GitHub Actions triển khai khi push `main`.
