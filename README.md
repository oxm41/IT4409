# NULLBYTE / field notes

Template personal blog cho CTF writeups và security notes. Nền giấy sáng, điểm nhấn xanh acid, typography tối giản, đồ họa orbital SVG và chế độ tối.

## Xem thử

Mở `public/index.html` trực tiếp bằng trình duyệt, hoặc chạy từ thư mục gốc repo trong WSL:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory public
```

Truy cập http://localhost:4173. Không cần cài dependency hay build.

## Cấu trúc và Firebase Hosting

```text
./
├── firebase.json          # Cấu hình Hosting: hosting.public = "public"
├── .firebaserc            # Liên kết Firebase project
├── .github/workflows/     # Deploy main và preview pull request
├── public/                # Toàn bộ nội dung website được deploy
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── favicon.svg
└── README.md
```

Chạy Firebase CLI từ thư mục gốc repo, nơi có `firebase.json` và `.firebaserc`. Project hiện được liên kết là `personal-blog-dd5ad`. GitHub Actions deploy trực tiếp `public/`, không cần bước npm install/build. Thư mục `.firebase/` là cache do Firebase CLI tự tạo, không chứa mã nguồn website.

## Chỉnh nội dung

- `public/index.html`: tên blog, placeholder `your_alias`, giới thiệu, sidebar và menu.
- `public/app.js`: giới thiệu trong trang About và mảng `posts` chứa 6 bài mẫu. Mỗi bài có `id`, `type` (`writeup` hoặc `note`), `date`, `title`, `description`, `tags`, `minutes` và `body` (HTML tự biên soạn). Đặt `featured: true` để làm nổi bật bài.
- `public/styles.css`: màu trong `:root`, font chữ và bố cục responsive.
- `public/favicon.svg`: favicon của blog.

Có lọc loại bài, tìm kiếm theo tiêu đề/nội dung giới thiệu/tag, lọc chủ đề, chế độ đọc bài, link trực tiếp dạng `#post/xor` và lưu lựa chọn sáng/tối. Nhấn `/` để tìm kiếm, `Esc` để đóng bài.

Đây là bản template tham khảo với bài viết và thông tin hồ sơ minh họa. Nội dung bài được render bằng JavaScript; chưa có CMS hoặc quy trình đăng Markdown. Font Google Fonts cần internet, có font hệ thống dự phòng.
