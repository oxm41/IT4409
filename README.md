# Bài tập HTML5 — Blakletterpress

Website sử dụng trực tiếp bộ template Blakletterpress trong `public/`. Đây là thư mục nguồn duy nhất và cũng là thư mục deploy. Các trang gốc `index.html`, `about.html`, `news.html`, `blog.html`, CSS, ảnh và font được giữ lại. Website cũ trong `archive/` không bị sửa và không được push/deploy.

## Các trang bổ sung

- `public/index_new.html`: refactor trang index gốc sang `header`, `nav`, `main`, `article`, `aside`, `section`, `figure`, `footer`; bổ sung ngôn ngữ, description, canonical, alt và tên truy cập. Nội dung, ảnh, liên kết và bố cục hiển thị được giữ nguyên.
- `public/register.html`: form ba nhóm thông tin, các trường bắt buộc, mật khẩu ít nhất 8 ký tự, nút Đăng ký/Nhập lại. Chỉ kiểm tra dữ liệu trên trình duyệt, không có backend và không lưu/gửi dữ liệu.
- `public/media.html`: bài “Ngày hội Công nghệ Xanh 2026”, ảnh/chú thích, video có phụ đề, audio, bản đồ Hà Nội và ảnh mùa trước. Nội dung và media là minh họa.
- `public/css/semantic.css`: bổ sung selector cho thẻ semantic để giữ cách hiển thị của CSS gốc.
- `public/css/assignment.css`: form, media và responsive cho hai trang mới, không áp dụng cho index.
- `public/assets/`: JavaScript, favicon, font tiếng Việt Noto Serif/Noto Sans kèm giấy phép OFL và media mẫu local.
- [PROMPT.md](PROMPT.md): prompt C–R–A–F–T cho cả ba yêu cầu.

Header, menu HOME / ABOUT / NEWS / BLOG, sidebar và footer lấy từ template gốc; menu vẫn dẫn đến các trang gốc. Cuối nội dung hai trang mới có liên kết đến bài tập còn lại.

Trang index gốc có bố cục cố định 960px. `index_new.html` giữ cả hành vi này để đối chiếu đúng bản gốc; cải tiến responsive chỉ áp dụng cho register/media. Các trang mới sử dụng icon PNG của template, không dùng emoji; trường nhập trên điện thoại có chữ 16px.

## Chạy local trong WSL

Yêu cầu Node.js 18 trở lên; không có dependency runtime.

```sh
npm run dev
```

- Trang semantic: http://localhost:4173/index_new.html
- Trang gốc: http://localhost:4173/index.html
- Form: http://localhost:4173/register.html
- Media: http://localhost:4173/media.html

`npm run dev` và `npm run preview` phục vụ trực tiếp `public/`, không cần build. Khi chỉnh web, sửa HTML, CSS, JavaScript và asset ngay trong `public/`.

```sh
npm run check
```

Kiểm tra tự động xác nhận các trang, cấu trúc semantic, label, alt, ID, asset, anchor nội bộ, CSS và cấu hình Hosting. `public/index.html` là bản gốc để đối chiếu với `public/index_new.html`. Các kiểm tra trình duyệt, HTML validator và ảnh đối chiếu nằm local trong `.checks/`, không deploy.

## Asset và Hosting

Ảnh, logo và font giao diện gốc giữ từ Free Website Templates, bao gồm attribution trong footer. Video mẫu vườn hoa từ bộ CC0 của MDN; audio là giai điệu tổng hợp 12 giây. Font Noto local có giấy phép trong `assets/fonts/`. Bản đồ Google Maps cần mạng và có liên kết mở bản đồ bên dưới.

Firebase Hosting dùng project `personal-blog-dd5ad` và chỉ xuất bản `public/`. Đường dẫn `/` chuyển đến `/index_new.html`; `/index.html` vẫn giữ bản gốc để so sánh. Domain hiện tại: https://maidt2416271.id.vn/.

Workflow `.github/workflows/firebase-hosting-merge.yml` kiểm tra rồi deploy trực tiếp `public/` khi push `main`; cũng hỗ trợ Run workflow. Deploy thủ công trong WSL:

```sh
npm run check
npx firebase-tools deploy --only hosting
```
