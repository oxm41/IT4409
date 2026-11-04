# Bài tập HTML5 — Blakletterpress

Website sử dụng trực tiếp bộ template Blakletterpress trong `public/`. GitHub Pages xuất bản các file trong thư mục này đã được theo dõi bằng Git. Các trang gốc `index.html`, `about.html`, `news.html`, `blog.html`, CSS, ảnh và font được giữ lại. Website cũ trong `archive/` không bị sửa và không được push/deploy.

## Các trang bổ sung

- `public/index_new.html`: refactor trang index gốc sang `header`, `nav`, `main`, `article`, `aside`, `section`, `figure`, `footer`; bổ sung ngôn ngữ, description, canonical, alt và tên truy cập. Nội dung, ảnh, liên kết và bố cục hiển thị được giữ nguyên.
- `public/register.html`: form ba nhóm thông tin, các trường bắt buộc, mật khẩu ít nhất 8 ký tự, nút Đăng ký/Nhập lại. Chỉ kiểm tra dữ liệu trên trình duyệt, không có backend và không lưu/gửi dữ liệu.
- `public/media.html`: bài “Ngày hội Công nghệ Xanh 2026”, ảnh/chú thích, video có phụ đề, audio, bản đồ Hà Nội và ảnh mùa trước. Nội dung và media là minh họa.
- `public/css/semantic.css`: bổ sung selector cho thẻ semantic để giữ cách hiển thị của CSS gốc.
- `public/css/assignment.css`: form, media và responsive cho hai trang mới, không áp dụng cho index.
- `public/assets/`: JavaScript, favicon, font tiếng Việt Noto Serif/Noto Sans kèm giấy phép OFL và media mẫu local.

Header, menu HOME / ABOUT / NEWS / BLOG, sidebar và footer lấy từ template gốc. Trong ba trang mới, logo, HOME và các liên kết về trang chủ dẫn tới `index_new.html`; ABOUT / NEWS / BLOG vẫn dẫn tới các trang gốc. Cuối nội dung register/media có liên kết đến bài tập còn lại.

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

Website hiện xuất bản tại https://oxm41.github.io/IT4409/. Đường dẫn gốc chuyển đến `index_new.html`. Trên GitHub Pages, bản index gốc được giữ tại `index_original.html` để đối chiếu; `public/index.html` trong repo vẫn giữ nguyên.

Workflow `.github/workflows/github-pages.yml` kiểm tra và deploy khi push `main`; cũng hỗ trợ Run workflow. Trong Settings → Pages, Source là GitHub Actions. Bản xuất bản được tạo trong `.checks/pages/`, chỉ chứa file đã được Git theo dõi, không lấy các bài làm chưa commit hay file cấu hình Firebase.

```sh
npm run check
npm run build:pages
```

Các link bài tập:

- Bài 2 — Home: https://oxm41.github.io/IT4409/assignment_4/bai-2/index.html
- Bài 2 — News: https://oxm41.github.io/IT4409/assignment_4/bai-2/news.html
- Bài 3 — Home: https://oxm41.github.io/IT4409/assignment_4/bai-3/index.html
- Bài 3 — News: https://oxm41.github.io/IT4409/assignment_4/bai-3/news.html

`firebase.json` và `.firebaserc` giữ lại làm cấu hình cũ; workflow không còn deploy Firebase tự động.
