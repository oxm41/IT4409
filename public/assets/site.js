const registration = document.querySelector('#registration-form');
if (registration) {
  document.querySelector('#registration-submit').disabled = false;
  const status = document.querySelector('#form-status');
  const birthDate = document.querySelector('#birth-date');
  const now = new Date();
  birthDate.max = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  registration.addEventListener('submit', event => {
    event.preventDefault();
    if (!registration.reportValidity()) return;
    status.textContent = 'Thông tin hợp lệ. Đây là form mẫu; dữ liệu chưa được gửi hoặc lưu.';
    status.focus();
  });
  registration.addEventListener('reset', () => { status.textContent = ''; });
  registration.addEventListener('input', () => { status.textContent = ''; });
  document.querySelector('.terms-label a').addEventListener('click', () => {
    document.querySelector('#terms-details').open = true;
  });
}

// Tìm từ khóa trong bài viết; nội dung vẫn đọc được khi tắt JavaScript.
const query = new URLSearchParams(location.search).get('q')?.trim().slice(0, 100);
if (query && document.querySelector('.event-article')) {
  document.querySelector('#site-search').value = query;
  const status = document.querySelector('#search-result');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const sections = [...document.querySelectorAll('[data-search-section]')];
  const matches = sections.filter(section => normalize(section.textContent).includes(normalize(query)));
  status.hidden = false;
  status.textContent = matches.length ? `Tìm thấy ${matches.length} mục phù hợp với “${query}”.` : `Không có mục phù hợp với “${query}”. Bạn có thể đọc toàn bộ bài bên dưới.`;
  for (const section of matches) {
    const heading = section.querySelector('h2');
    if (heading) {
      const mark = document.createElement('mark');
      mark.textContent = heading.textContent;
      heading.replaceChildren(mark);
    }
  }
  if (matches.length) matches[0].scrollIntoView({ block: 'start' });
}
