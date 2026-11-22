import { useEffect, useRef, useState } from 'react';
import { filterUsers, nextUserId, validateUser } from './users.mjs';
import { renderFields } from './fields.jsx';

export default function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(null);
  const [editError, setEditError] = useState('');
  const dialog = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch('https://jsonplaceholder.typicode.com/users', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data) || !data.every(u => typeof u.name === 'string' && typeof u.username === 'string' && Number.isFinite(u.id))) {
          throw new Error('Dữ liệu không hợp lệ');
        }
        if (!controller.signal.aborted) setUsers(data.map(u => ({
          ...u,
          email: u.email || '', phone: u.phone || '', website: u.website || '',
          address: { street: '', suite: '', city: '', ...u.address }
        })));
      })
      .catch(reason => {
        if (!controller.signal.aborted) setError('Không tải được danh sách người dùng. Kiểm tra kết nối và thử lại. (' + reason.message + ')');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  // Hold pending additions until the first fetch succeeds so it cannot overwrite them.
  useEffect(() => {
    if (user && !loading && !error) {
      setUsers(prev => [...prev, { ...user, address: { ...user.address }, id: nextUserId(prev) }]);
      onAdded();
    }
  }, [user, loading, error, onAdded]);

  useEffect(() => {
    if (editing && !dialog.current.open) dialog.current.showModal();
  }, [editing]);

  function editUser(selected) {
    setEditing({ ...selected, address: { ...selected.address } });
    setEditError('');
  }

  function saveUser(e) {
    e.preventDefault();
    const message = validateUser(editing);
    if (message) {
      setEditError(message);
      return;
    }
    setUsers(prev => prev.map(u => u.id === editing.id ? { ...editing, name: editing.name.trim(), username: editing.username.trim() } : u));
    dialog.current.close();
  }

  function removeUser(id) {
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  const filteredUsers = filterUsers(users, keyword);

  return (
    <>
      <div className="list-heading">
        <div><h2>Danh sách người dùng</h2><p aria-live="polite">{loading ? 'Đang tải danh sách…' : filteredUsers.length + ' / ' + users.length + ' người dùng'}</p></div>
        <span className="list-badge">DANH BẠ</span>
      </div>
      {error && <div className="load-error" role="alert"><p>{error}</p><button className="button secondary" type="button" onClick={() => setAttempt(a => a + 1)}>Thử lại</button></div>}
      {loading ? <div className="loading" role="status"><span className="spinner" />Đang tải dữ liệu người dùng…</div> : (
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Thông tin người dùng và thao tác sửa, xóa</caption>
            <thead><tr><th scope="col">ID</th><th scope="col">Họ và tên</th><th scope="col">Tên đăng nhập</th><th scope="col">Email</th><th scope="col">Địa chỉ</th><th scope="col">Điện thoại</th><th scope="col"><span className="sr-only">Thao tác</span></th></tr></thead>
            <tbody>{filteredUsers.map(u => (
              <tr key={u.id}>
                <td data-label="ID"><span className="row-id">{String(u.id).padStart(2, '0')}</span></td>
                <td data-label="Họ và tên"><div className="person"><span className="avatar" aria-hidden="true">{u.name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('')}</span><span className="person-name">{u.name}</span></div></td>
                <td data-label="Tên đăng nhập"><span className="username">@{u.username}</span></td>
                <td data-label="Email"><span className="contact-value">{u.email || '—'}</span></td>
                <td data-label="Địa chỉ"><span className="address">{[u.address.street, u.address.suite, u.address.city].filter(Boolean).join(', ') || '—'}</span></td>
                <td data-label="Điện thoại"><span className="contact-value">{u.phone || '—'}</span></td>
                <td className="row-actions"><button type="button" aria-label={'Sửa ' + u.name} onClick={() => editUser(u)}>Sửa</button><button className="delete" type="button" aria-label={'Xóa ' + u.name} onClick={() => removeUser(u.id)}>Xóa</button></td>
              </tr>
            ))}</tbody>
          </table>
          {!error && filteredUsers.length === 0 && <div className="empty-state"><strong>{users.length ? 'Không tìm thấy người dùng phù hợp.' : 'Danh sách đang trống.'}</strong><p>{users.length ? 'Thử từ khóa khác hoặc xóa nội dung tìm kiếm.' : 'Thêm một người dùng để bắt đầu.'}</p></div>}
        </div>
      )}
      <dialog ref={dialog} aria-labelledby="edit-title" onClose={() => { setEditing(null); setEditError(''); }}>
        {editing && <form noValidate onSubmit={saveUser}>
          <div className="dialog-heading"><div><p className="eyebrow">HỒ SƠ #{editing.id}</p><h2 id="edit-title">Chỉnh sửa người dùng</h2></div><button className="close-button" type="button" aria-label="Đóng form sửa" onClick={() => dialog.current.close()}>×</button></div>
          <p className="form-hint">Thay đổi chỉ áp dụng khi bạn chọn lưu.</p>
          <div className="fields-grid">{renderFields(editing, setEditing, 'edit')}</div>
          {editError && <p className="form-error" role="alert">{editError}</p>}
          <div className="dialog-actions"><button className="button secondary" type="button" onClick={() => dialog.current.close()}>Hủy</button><button className="button primary" type="submit">Lưu thay đổi</button></div>
        </form>}
      </dialog>
    </>
  );
}
