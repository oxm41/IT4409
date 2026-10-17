/* Trình bày thống kê và thẻ bài viết; giữ phần bài tập và bộ hỗ trợ nguyên vẹn. */
(function () {
	document.getElementById("thong-ke-tin").textContent =
		daDang.length + " bài đã đăng · " + tongLuotXem.toLocaleString("vi-VN") + " lượt xem";

	document.querySelectorAll("#list > li").forEach((muc, viTri) => {
		const cacThe = document.createElement("div");
		cacThe.className = "article-tags";
		for (const the of daDang[viTri].tags) {
			const nhan = document.createElement("span");
			nhan.textContent = "#" + the;
			cacThe.append(nhan);
		}
		muc.append(cacThe);
	});
})();
