# Prompt tạo trang đăng ký, media và refactor semantic HTML5

Dán nội dung bên dưới vào công cụ AI có quyền đọc và sửa project. Cung cấp `index.html` gốc, CSS, asset liên quan và hai ảnh minh họa cùng prompt.

---

## C — Context

Tôi có một website dùng giao diện Blakletterpress: nền vàng, vùng nội dung nền giấy, header/logo BLP, menu HOME / ABOUT / NEWS / BLOG bên trái, sidebar và footer bốn cột.

Tôi cần hoàn thành ba công việc:

1. Tạo `register.html` cho đăng ký nhận thông tin.
2. Tạo `media.html` cho bài viết đa phương tiện.
3. Refactor **trang `index.html` gốc được cung cấp** thành `index_new.html`, sử dụng semantic HTML5 và cải thiện SEO cơ bản, giữ nguyên toàn bộ nội dung và bố cục hiển thị.

Ảnh minh họa 1 thể hiện trang đăng ký; ảnh minh họa 2 thể hiện trang media. Các trang phải dùng cùng khung giao diện với trang gốc, không thiết kế một layout khác.

Nếu thiếu `index.html` gốc hoặc không đọc được ảnh minh họa, hãy báo chính xác tài nguyên thiếu và hỏi lại trước khi triển khai phần phụ thuộc. **Không tự tạo một trang mới rồi gọi đó là bản refactor giữ nguyên trang gốc.**

Nguồn chính xác nằm trong `public/`: `index.html`, `about.html`, `news.html`, `blog.html`, `css/style.css`, `images/`, `fonts/`. Tạo hoặc sửa ba trang bài tập ngay trong thư mục này; giữ nguyên byte của mọi file gốc. Website tĩnh không cần build và được deploy trực tiếp từ `public/`. Không sửa, di chuyển hoặc lấy nội dung trong `archive/` làm nguồn cho bài tập.

## R — Role

Bạn là senior frontend developer có kinh nghiệm với semantic HTML5, responsive CSS, accessibility và SEO cơ bản.

## A — Action

### 1. Kiểm tra đầu vào trước khi viết code

- Đọc `index.html` gốc, các trang hiện có, CSS/JS và asset liên quan.
- Xác định header, navigation, sidebar, vùng nội dung chính, footer và các selector CSS/JS phụ thuộc tên thẻ.
- Liệt kê file sẽ tạo hoặc sửa; chỉ sửa trong phạm vi phục vụ ba công việc này.
- Giữ `index.html` gốc để đối chiếu. Bản refactor phải được lưu thành `index_new.html`.

### 2. Trang `register.html`

Giữ khung header, navigation, sidebar, footer; thay vùng nội dung chính bằng form có tiêu đề **Đăng ký nhận thông tin**.

Form gồm ba nhóm `fieldset` có `legend`:

**Thông tin tài khoản**

- Họ và tên: `type="text"`, bắt buộc.
- Email: `type="email"`, bắt buộc.
- Mật khẩu: `type="password"`, bắt buộc, `minlength="8"`.
- Số điện thoại: `type="tel"`, bắt buộc; nếu áp dụng quy tắc 10 chữ số bắt đầu bằng 0 như ảnh mẫu, phải có hướng dẫn rõ.

**Thông tin cá nhân**

- Ngày sinh: `type="date"`, bắt buộc.
- Độ tuổi: `type="number"`, bắt buộc.
- Giới tính: radio Nam, Nữ, Khác, cùng một `name`.

**Tùy chọn nhận tin**

- Chủ đề quan tâm: checkbox Tin tức, Blog, Sự kiện.
- Khu vực: `select` có lựa chọn mặc định.
- Lời nhắn: `textarea`.
- Checkbox đồng ý điều khoản sử dụng: bắt buộc.

Dùng `form`, `fieldset`, `legend`, `label`; tất cả trường bắt buộc có `required`. Label phải liên kết đúng với control. Có nút **Đăng ký** và **Nhập lại**, lần lượt `type="submit"` và `type="reset"`.

Không xây dựng backend. Nếu có thao tác gửi thử, chỉ kiểm tra trên trình duyệt và hiển thị thông báo form mẫu, không gửi hoặc lưu dữ liệu và không tuyên bố đã tạo tài khoản hay đăng ký thành công trên máy chủ.

### 3. Trang `media.html`

Giữ cùng khung giao diện. Tiêu đề bài viết: **Ngày hội Công nghệ Xanh 2026**.

Sử dụng đúng ngữ nghĩa các thẻ `header`, `main`, `article`, `section`, `figure`, `figcaption`, `footer`. Nội dung gồm:

- Ảnh giới thiệu sự kiện và chú thích.
- Giới thiệu sự kiện.
- Video HTML5 có `controls`; dùng `playsinline` cho điện thoại, phụ đề hoặc mô tả phù hợp nếu cần.
- Audio HTML5 có `controls` và mô tả nội dung âm thanh.
- Bản đồ hoặc bản đồ nhúng bằng `iframe`, có `title` mô tả và liên kết mở bản đồ.
- Hình ảnh các mùa trước kèm chú thích.

Mọi ảnh nội dung phải có `alt` phù hợp. Dùng tài nguyên có đường dẫn hợp lệ; nếu chưa có tư liệu sự kiện thật, dùng media mẫu hợp lệ và ghi rõ là minh họa. Giữ tỷ lệ ảnh/video trên mobile, không để thuộc tính chiều cao HTML làm media bị kéo dài.

### 4. Refactor `index.html` thành `index_new.html`

Giữ nguyên nội dung hiển thị: chữ, ảnh, thứ tự khối, màu sắc, kích thước, khoảng cách, navigation, sidebar, footer và hành vi tương tác. Không thêm, xóa hoặc viết lại nội dung bài. Không đổi font hoặc layout khi làm riêng bước refactor này.

Chuyển các wrapper sang semantic HTML5 dựa trên vai trò thật:

- `header` cho đầu trang và phần mở đầu của bài khi phù hợp.
- `nav` cho các nhóm liên kết điều hướng, có nhãn phân biệt nếu nhiều nhóm.
- Một `main` cho nội dung chính.
- `article` cho nội dung độc lập như một bài viết hoặc bản tin.
- `section` cho nhóm nội dung có chủ đề và heading phù hợp.
- `aside` cho sidebar hoặc nội dung bổ trợ.
- `figure` và `figcaption` cho media và chú thích liên quan.
- `footer` cho cuối trang hoặc bài viết.

Không thay mọi `div` bằng `section`; giữ `div` cho wrapper phục vụ bố cục. Bảo toàn `class`, `id`, `data-*`, anchor và hook JavaScript. Nếu CSS/JS phụ thuộc tên thẻ, điều chỉnh selector tối thiểu để bản gốc và bản refactor vẫn hiển thị giống nhau.

SEO/accessibility cơ bản:

- `<!DOCTYPE html>`, ngôn ngữ trang đúng và UTF-8. Thêm viewport responsive cho register/media. Riêng index_new giữ hành vi viewport và bố cục cố định 960px của index gốc để không đổi hiển thị.
- Title và meta description mô tả nội dung hiện có, không thêm từ khóa không liên quan.
- Một `h1` chính, heading theo thứ bậc hợp lý. Nếu sửa cấp heading, bảo toàn kiểu hiển thị bằng class.
- Ảnh có alt; liên kết và control có tên truy cập rõ ràng.
- Có thể bổ sung skip link chỉ hiển thị khi focus.
- Nếu thêm canonical, dùng URL chính thức đã xác minh hoặc một đường dẫn dựa trên cấu hình có sẵn. Không đoán domain.
- Không bịa dữ liệu structured data, tác giả, thời gian hoặc thông tin tổ chức.

### 5. Responsive và typography

Tái sử dụng CSS và asset chung. Giữ font tiếng Việt đã thiết lập trong project; không dùng emoji làm icon nếu có SVG tương đương. Form và media không gây cuộn ngang trên mobile; các ô nhập trên iPhone dùng cỡ chữ đủ đọc và không khóa pinch zoom.

## F — Format và kiểm tra

Trước triển khai: nêu cấu trúc project, các thành phần dùng lại và danh sách file dự kiến sửa.

Sau triển khai:

1. Liệt kê file đã tạo/sửa và tóm tắt chức năng.
2. Nêu các thay đổi semantic giữa `index.html` và `index_new.html`.
3. Đối chiếu nội dung text, ảnh, liên kết và tương tác của hai bản index.
4. Chụp và so sánh hai bản ở cùng kích thước desktop và mobile; báo sai lệch bố cục nếu có.
5. Kiểm tra HTML, CSS, asset, anchor, console, keyboard, form và khả năng phát video/audio.
6. Chạy `npm run check` cho bảy trang trong `public/`: index, index_new, about, news, blog, register, media. Không cần bước build. Xác minh mọi file gốc không bị thay đổi.
7. Không ghi đè `index.html` gốc bằng bản refactor, không chỉnh sửa `archive/`. Không commit/push/deploy nếu chưa có yêu cầu hoặc ủy quyền tương ứng trong phiên làm việc.

Nếu chưa có trang index gốc, hãy hoàn thành phần độc lập và báo phần refactor còn chờ nguồn, không tuyên bố cả ba công việc đã hoàn tất.

## T — Tone

Trả lời bằng tiếng Việt, ngắn gọn, rõ ràng, có tính kỹ thuật. Phân biệt việc đã thực hiện, kết quả đã kiểm tra và phần còn thiếu đầu vào.
