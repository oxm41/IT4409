# Kết quả bài tập CSS khuyến mãi Tết

| Bài 1: lỗi CSS, triệu chứng và nguyên nhân | Bài 1: trang sau sửa | Bài 2: prompt dùng AI | Bài 2: trang sau sửa |
| --- | --- | --- | --- |
| Xem [phân tích Bài 1](#bài-tập-1--phân-tích-lỗi) bên dưới. | [Mở trang Bài 1](https://maidt2416271.id.vn/assignment_3/bai-1/trang.html) | [Nội dung prompt Bài 2](prompt-bai-2.md) | [Mở trang Bài 2](https://maidt2416271.id.vn/assignment_3/bai-2/trang.html) |

## Bài tập 1 — phân tích lỗi

| CSS lỗi | Triệu chứng nhìn thấy | Nguyên nhân và cách sửa |
| --- | --- | --- |
| `.site-header { position: sticky }` thiếu `top` và `z-index` | Menu cuộn khỏi đỉnh hoặc nằm dưới nội dung khác. | Sticky cần mốc `top: 0`; đặt `z-index: 100` để nằm trên overlay/ảnh. |
| `.hero` thiếu `position: relative` | Chữ hero lệch khỏi tâm ảnh. | `.hero-overlay` là `position: absolute` nhưng không có khung định vị là hero. Thêm `position: relative` cho `.hero`. |
| `.hero-bg` thiếu `object-fit: cover` | Ảnh bị kéo giãn để vừa khung. | `width: 100%` và `height: 100%` ép sai tỉ lệ ảnh. Thêm `object-fit: cover` để ảnh phủ khung mà không biến dạng. |
| `.card` dùng flex-basis theo phần trăm nhưng mặc định `content-box` | Thẻ thứ ba rơi xuống hàng trên desktop. | Padding/viền cộng thêm ngoài độ rộng flex; đặt `box-sizing: border-box` để ba thẻ và hai khoảng cách vừa một hàng. |
| `.card` thiếu `position: relative` | Các nhãn `-20%` tụ vào góc trang. | `.badge` có định vị tuyệt đối nhưng không neo vào từng thẻ; thêm `position: relative` cho `.card`. |
| `.card { height: 300px }`, ảnh không có kích thước/fit | Ảnh nhỏ không đều, nội dung dài có thể tràn khỏi thẻ. | Bỏ chiều cao cố định, dùng `min-height`, đặt ảnh `width: 100%`, `height: 180px`, `object-fit: cover`. |
| `.back-to-top { top: 24px }` | Nút ↑ nằm ở góc trên phải. | Thay `top` bằng `bottom: 24px`, giữ `position: fixed` và đặt z-index để nút luôn nổi. |

## Bài tập 2 — sửa lỗi từ prompt

Giữ các hiệu ứng đúng của CSS gốc. Đổi `.page` từ `overflow-x: hidden` sang `clip` để vẫn cắt phần tràn nhưng không tạo scroll container làm mất sticky. Đổi `.card` về `border-box` để ba thẻ vừa hàng. Đặt `z-index: 3` cho `.badge`, cao hơn ảnh có `z-index: 2`, để cả ba nhãn nhìn thấy. Thêm điểm ngắt cho màn hình hẹp để thẻ không tràn ngang. Prompt đầy đủ ở [prompt-bai-2.md](prompt-bai-2.md).

Hai file HTML nguồn không bị thay đổi. Bài 1 trong đề yêu cầu tự làm không dùng AI; phân tích và bản sửa trong báo cáo này **có AI hỗ trợ**, nên cần tự kiểm tra và diễn giải lại nếu nộp theo đúng yêu cầu đó.
