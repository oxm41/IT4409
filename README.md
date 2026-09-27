# Blakletterpress — hai trang HTML5

Website mới dựng theo hai ảnh minh họa: nền vàng, logo BLP, menu bên trái, sidebar và footer bốn cột. Hai trang dùng chung `public/assets/site.css` và `public/assets/site.js`.

Website NULLBYTE cũ được giữ local trong `archive/`, không push lên GitHub và không thuộc thư mục phục vụ hoặc deploy của website này.

## File của website mới

```text
public/
  register.html
  media.html
  assets/
    site.css
    site.js
    icons.svg
    favicon.svg
    fonts/
      unifrakturcook-bold.ttf
      OFL.txt
      reading.css
      noto-serif-*.woff2
      noto-serif-OFL.txt
      noto-sans-*.woff2
      noto-sans-OFL.txt
    media/
      event-intro.jpg
      previous-season.jpg
      garden.mp4
      garden-poster.svg
      garden-captions.vtt
      podcast-sample.wav
scripts/
  serve.mjs
  check.mjs
package.json
package-lock.json
firebase.json
.firebaserc
README.md
```

Script kiểm tra và ảnh chụp desktop/mobile nằm trong `.checks/`, được Git bỏ qua và không được deploy.

## Chạy local trong WSL

Yêu cầu Node.js 18 trở lên. Không cần cài package hoặc chạy bước build.

```sh
npm run dev
```

- Trang sự kiện: http://localhost:4173/media.html
- Trang đăng ký: http://localhost:4173/register.html
- Trang gốc http://localhost:4173/ hiển thị trang sự kiện.

`npm run preview` chạy cùng bản HTML tĩnh. `npm run check` kiểm tra cấu trúc HTML cơ bản, label, alt, anchor nội bộ, đường dẫn asset và cấu hình thư mục Hosting. Đây không thay thế trình kiểm định HTML đầy đủ hoặc kiểm tra trình duyệt.

## Nội dung

- `public/register.html`: form chia ba fieldset, kiểm tra bắt buộc, email, mật khẩu tối thiểu 8 ký tự, điện thoại 10 chữ số bắt đầu bằng 0, ngày sinh và độ tuổi. Nút Nhập lại dùng reset native. Form không có backend; JavaScript chặn gửi và chỉ báo thông tin hợp lệ. Không lưu dữ liệu, không tạo tài khoản. Nút gửi bị vô hiệu hóa khi JavaScript bị tắt.
- `public/media.html`: bài viết semantic với ảnh, giới thiệu, video có phụ đề mô tả, audio, bản đồ Hà Nội và ảnh minh họa các mùa trước. Tìm kiếm ở header dẫn tới bài viết và đánh dấu các mục phù hợp; hỗ trợ từ khóa tiếng Việt có hoặc không có dấu.
- `public/assets/`: CSS/JS, SVG, font và tài nguyên media local. Icon dùng SVG để tránh thay đổi hình dạng emoji trên iPhone. Trường nhập trên mobile dùng chữ 16px để tránh Safari tự phóng to khi focus.
- `scripts/serve.mjs`: server local chỉ phục vụ `public/`, hỗ trợ MIME và HTTP Range cho video/audio.

Menu HOME / ABOUT / NEWS / BLOG lần lượt dẫn tới trang sự kiện, giới thiệu, video và podcast; không tạo thêm trang HTML ngoài hai trang được yêu cầu. Các biểu tượng mạng xã hội hiện dẫn tới trang chủ nền tảng, chưa cấu hình tài khoản của đơn vị tổ chức.

## Tài nguyên mẫu

Nội dung sự kiện là minh họa. Ảnh/video/audio có chú thích phân biệt với tư liệu sự kiện thật. Tất cả được lưu local, trừ iframe bản đồ:

- Ảnh giới thiệu: [Pexels, ảnh 1181406](https://www.pexels.com/photo/group-of-people-sitting-in-front-of-table-1181406/).
- Ảnh mùa trước: [Pexels, ảnh 3183150](https://www.pexels.com/photo/group-of-people-sitting-near-table-3183150/). Điều kiện sử dụng ảnh: [Pexels License](https://www.pexels.com/license/).
- Video vườn hoa: [MDN — flower.mp4, bộ tài nguyên cc0-videos](https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4). Poster SVG và phụ đề tiếng Việt được tạo riêng cho trang.
- Audio WAV 12 giây: giai điệu tổng hợp tự tạo, không có lời thoại; thay bằng podcast thật khi có nội dung.
- Font logo: [UnifrakturCook — Google Fonts](https://fonts.google.com/specimen/UnifrakturCook), bản local kèm giấy phép SIL Open Font License trong `public/assets/fonts/OFL.txt`.
- Font nội dung: Noto Serif, font ô nhập: Noto Sans, có bộ Latin và tiếng Việt; regular/bold theo trục variable, Noto Serif có italic riêng. Tất cả là WOFF2 local trong `public/assets/fonts/`, kèm giấy phép OFL. Nội dung dùng giãn dòng rộng cho dấu tiếng Việt; footer căn trái để tránh khoảng trắng lớn giữa các từ.
- Bản đồ: [Google Maps — Hà Nội](https://www.google.com/maps/search/?api=1&query=Hanoi), cần kết nối mạng. Liên kết mở bản đồ lớn luôn có dưới iframe.

Khi thay media, giữ tên file hoặc cập nhật `src`, `poster`, `track`, `alt` và chú thích trong HTML. Không cần thay CSS.

## Firebase Hosting

`firebase.json` chỉ deploy `public/`, giữ đường dẫn `/register.html` và `/media.html`; trang gốc được rewrite tới `/media.html`. `archive/` không được đưa lên Hosting. `.firebaserc` dùng project hiện tại `personal-blog-dd5ad` để tiếp tục dùng custom domain đã kết nối.

Workflow `.github/workflows/firebase-hosting-merge.yml` kiểm tra website rồi deploy lên Hosting khi push vào `main`; cũng có thể chạy bằng nút **Run workflow** trong GitHub Actions. Workflow dùng secret đã cấu hình `FIREBASE_SERVICE_ACCOUNT_PERSONAL_BLOG_DD5AD`.

Khi muốn đưa website mới lên domain, chạy trong WSL:

```sh
npm run check
npx firebase-tools deploy --only hosting
```

Không cần bước build. Nếu CLI chưa đăng nhập, chạy `npx firebase-tools login --no-localhost` trước. Deploy này sẽ thay website đang hiển thị trên cùng Firebase Hosting site; mã nguồn website cũ trong `archive/` vẫn được giữ lại.
