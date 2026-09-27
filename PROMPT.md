# Prompt bài tập HTML5

## C — Context

Website Blakletterpress nằm trong `public/`, dùng `index.html` làm bản gốc. Dựa vào template và hai ảnh minh họa để thêm trang đăng ký, trang media và bản index semantic. Nếu thiếu nguồn hoặc ảnh không rõ, hỏi lại trước khi làm.

## R — Role

Bạn là frontend developer chuyên HTML5, responsive CSS, accessibility và SEO cơ bản.

## A — Action

1. Tạo `register.html`, tiêu đề “Đăng ký nhận thông tin”. Form dùng `form`, `fieldset`, `legend`, `label`, gồm:
   - Tài khoản: họ tên, email, mật khẩu tối thiểu 8 ký tự, điện thoại; đều bắt buộc.
   - Cá nhân: ngày sinh và độ tuổi bắt buộc; giới tính Nam/Nữ/Khác.
   - Nhận tin: checkbox Tin tức/Blog/Sự kiện, khu vực, lời nhắn, đồng ý điều khoản bắt buộc.
   - Input đúng kiểu, trường bắt buộc có `required`, nút Đăng ký/Nhập lại; không cần backend.
2. Tạo `media.html`, bài “Ngày hội Công nghệ Xanh 2026”: ảnh và chú thích, giới thiệu, video/audio có `controls`, iframe bản đồ có `title`, ảnh mùa trước. Dùng `header`, `main`, `article`, `section`, `figure`, `figcaption`, `footer`; ảnh có `alt`, media responsive, tài nguyên hợp lệ hoặc mẫu ghi rõ minh họa.
3. Refactor `index.html` thành `index_new.html`: chuyển wrapper sang semantic HTML5 theo vai trò; bổ sung `lang`, meta description, alt, tên truy cập và heading hợp lý. Giữ nguyên chữ, ảnh, bố cục, font và CSS gốc; chỉ bổ sung selector khi đổi tên thẻ. Giữ `index.html` để đối chiếu.

Cả ba trang mới dùng lại header, navigation, sidebar và footer gốc. Đổi mọi liên kết về trang chủ trong ba trang mới sang `href="index_new.html"`. Register/media responsive, dùng font hỗ trợ tiếng Việt và icon của template; index_new giữ hành vi bố cục cố định của index gốc. Chỉ sửa trong `public/` và file hỗ trợ liên quan, không đụng `archive/`.

## F — Format

Trước khi sửa, kiểm tra cấu trúc và liệt kê file dự kiến thay đổi. Sau khi sửa, tóm tắt kết quả, chỉ ra các thay đổi semantic; kiểm tra desktop/mobile, HTML/CSS, asset, liên kết, console và form/media. Chạy `npm run check`; không cần build.

## T — Tone

Trả lời tiếng Việt, ngắn gọn, rõ ràng, có tính kỹ thuật.
