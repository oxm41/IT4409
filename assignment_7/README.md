# Bài tập 7 — Review và thiết kế API RBAC

Kết quả: https://oxm41.github.io/IT4409/assignment_7/

Đặc tả tài liệu, không triển khai backend. Nguồn đề: `Ex. Web API RBAC.pdf` tại thư mục này.

- `content.mjs`: 28 phát hiện review, danh mục quyền, ma trận và 26 endpoint.
- `details.mjs`: hợp đồng request/response/lỗi của 10 endpoint.
- `build-report.mjs`: tạo HTML trong `public/assignment_7/`.
- `check.mjs`: kiểm tra độ bao phủ, tính nhất quán, JSON ví dụ và liên kết nội bộ.

Từ thư mục gốc repo:

```sh
node assignment_7/build-report.mjs
node assignment_7/check.mjs
npm run dev
```

Mở `/assignment_7/index.html` trên máy chủ dev. Sửa nội dung nguồn rồi sinh lại HTML trước khi commit.
GitHub Pages xuất bản bản HTML đã được commit bằng pipeline hiện có; không cần dependency mới.
