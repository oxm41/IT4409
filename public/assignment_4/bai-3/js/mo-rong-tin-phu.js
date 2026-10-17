/* Mở rộng tại chỗ các Read more trong cột tin phụ. */
(function () {
	const khungTin = document.getElementById("posts");
	if (khungTin === null) return;

	khungTin.querySelectorAll("a.more").forEach((nut, viTri) => {
		const doanVan = nut.closest("li").querySelector("p");
		if (doanVan === null) return;
		doanVan.classList.add("tom-tat-tin-phu");
		if (!doanVan.id) doanVan.id = "tin-phu-" + (viTri + 1);
		nut.textContent = "Read more >>";
		nut.setAttribute("role", "button");
		nut.setAttribute("aria-expanded", "false");
		nut.setAttribute("aria-controls", doanVan.id);
	});

	khungTin.addEventListener("click", (e) => {
		const nut = e.target.closest("a.more[aria-controls]");
		if (nut === null || !khungTin.contains(nut)) return;
		e.preventDefault();
		const doanVan = document.getElementById(nut.getAttribute("aria-controls"));
		const daMo = doanVan.classList.toggle("day-du");
		nut.textContent = daMo ? "Thu gọn <<" : "Read more >>";
		nut.setAttribute("aria-expanded", String(daMo));
	});

	khungTin.addEventListener("keydown", (e) => {
		const nut = e.target.closest("a.more[aria-controls]");
		if (e.key === " " && nut !== null && khungTin.contains(nut)) {
			e.preventDefault();
			nut.click();
		}
	});
})();
