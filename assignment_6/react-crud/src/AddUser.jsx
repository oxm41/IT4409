import { useEffect, useRef, useState } from 'react';
import { emptyUser, validateUser } from './users.mjs';
import { renderFields } from './fields.jsx';

export default function AddUser({ onAdd, pending }) {
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [error, setError] = useState('');
  const dialog = useRef(null);

  useEffect(() => {
    if (adding && !dialog.current.open) dialog.current.showModal();
  }, [adding]);

  function closeForm() {
    dialog.current.close();
  }

  function handleAdd(e) {
    e.preventDefault();
    const message = validateUser(user);
    if (message) {
      setError(message);
      return;
    }
    onAdd({ ...user, name: user.name.trim(), username: user.username.trim() });
    closeForm();
  }

  return (
    <>
      <button className="button primary" type="button" disabled={pending} onClick={() => setAdding(true)}><span aria-hidden="true">+</span>{pending ? 'Đang chờ tải dữ liệu…' : 'Thêm người dùng'}</button>
      <dialog ref={dialog} aria-labelledby="add-title" onClose={() => { setAdding(false); setUser(emptyUser()); setError(''); }}>
        <form noValidate onSubmit={handleAdd}>
          <div className="dialog-heading"><div><p className="eyebrow">HỒ SƠ MỚI</p><h2 id="add-title">Thêm người dùng</h2></div><button className="close-button" type="button" aria-label="Đóng form thêm" onClick={closeForm}>×</button></div>
          <p className="form-hint">Các trường có dấu * là bắt buộc.</p>
          <div className="fields-grid">{renderFields(user, setUser, 'add')}</div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="dialog-actions"><button className="button secondary" type="button" onClick={closeForm}>Hủy</button><button className="button primary" type="submit">Thêm người dùng</button></div>
        </form>
      </dialog>
    </>
  );
}
