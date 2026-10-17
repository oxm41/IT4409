/* Lưu JSON của giỏ và phục hồi khi khách mở lại trang Home. */
(function () {
	const khoaLuu = "blakletterpress-bai2-gio-hang";

	function luuGioHang() {
		try {
			localStorage.setItem(khoaLuu, gio.xuatJSON());
		} catch (loi) {
			console.warn("Không lưu được giỏ hàng:", loi.message);
		}
	}

	try {
		const chuoiJSON = localStorage.getItem(khoaLuu);
		if (chuoiJSON !== null) {
			const gioDaLuu = napGioHang(chuoiJSON);
			gio.dsDong = gioDaLuu.dsDong;
			veGioHang(gio.layDanhSach(), gio.tongTien());
		}
	} catch (loi) {
		console.warn("Không đọc được giỏ hàng đã lưu:", loi.message);
	}

	luuGioHang();
	window.addEventListener("pagehide", luuGioHang);
})();
