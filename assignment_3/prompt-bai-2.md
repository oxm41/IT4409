# Prompt dùng AI cho Bài tập 2

Bạn là frontend developer chuyên CSS box model, flexbox, stacking context và `position: sticky`. Hãy đọc **bản gốc chưa sửa** của `Bai tap 2 Tim va sua loi CSS/trang.html` và `style-loi.css`; kiểm tra trang bằng trình duyệt ở desktop và điện thoại, cả trước và sau khi cuộn.

Yêu cầu: menu dính ở đỉnh và nằm trên hero; ảnh hero phủ kín, tiêu đề ở giữa; ba thẻ sản phẩm cùng hàng trên desktop, ảnh/chữ nằm gọn, nhãn `-20%` ở góc trên phải của từng thẻ và hiện trên ảnh; nút ↑ cố định ở góc dưới phải màn hình. Trên màn hình hẹp, thẻ có thể xuống hàng nhưng không tràn ngang.

**Chỉ sửa các khai báo sai trong `style-loi.css`; tuyệt đối không thay HTML, ảnh hoặc phần khác.** Không xóa các quy tắc nhìn lạ nhưng đang có tác dụng: cách crop ảnh hero, hiệu ứng phóng nhẹ, khối sản phẩm chồng lên hero, lớp ảnh trong thẻ và việc giới hạn tràn ngang. Nếu một quy tắc trong số đó gây lỗi, hãy giải thích bằng computed style/containing block trước khi sửa và giữ hiệu ứng ban đầu.

Trả lời bằng bảng `selector/khai báo lỗi | triệu chứng | nguyên nhân CSS | thay đổi tối thiểu`. Sau đó cung cấp CSS diff và kiểm tra lại sticky khi cuộn, z-index của nhãn, số hàng của thẻ, vị trí nút, asset và tràn ngang. Nếu không chứng minh được một thay đổi là cần thiết thì giữ nguyên quy tắc đó.
