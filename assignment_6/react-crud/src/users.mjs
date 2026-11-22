export function emptyUser() {
  return { name: '', username: '', email: '', phone: '', website: '', address: { street: '', suite: '', city: '' } };
}

export function updateField(user, field, value) {
  return ['street', 'suite', 'city'].includes(field)
    ? { ...user, address: { ...user.address, [field]: value } }
    : { ...user, [field]: value };
}

export function filterUsers(users, keyword) {
  const query = keyword.trim().toLowerCase();
  return users.filter(user => user.name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query));
}

export function nextUserId(users) {
  return users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
}

export function validateUser(user) {
  if (!user.name.trim() || !user.username.trim()) return 'Vui lòng nhập họ tên và tên đăng nhập.';
  if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return 'Vui lòng nhập email hợp lệ.';
  return '';
}
