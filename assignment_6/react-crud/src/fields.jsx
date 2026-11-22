import { updateField } from './users.mjs';

// A rendering helper, not another React component: the forms own their state.
export function renderFields(user, setUser, prefix) {
  const fields = [
    ['name', 'Họ và tên', 'text', true],
    ['username', 'Tên đăng nhập', 'text', true],
    ['email', 'Email', 'email'],
    ['phone', 'Số điện thoại', 'tel'],
    ['street', 'Đường', 'text'],
    ['suite', 'Căn hộ / số nhà', 'text'],
    ['city', 'Thành phố', 'text'],
    ['website', 'Website', 'text']
  ];
  return fields.map(([field, label, type, required]) => (
    <div className="field" key={field}>
      <label htmlFor={prefix + '-' + field}>{label}{required && <span className="required" aria-hidden="true"> *</span>}</label>
      <input
        id={prefix + '-' + field}
        name={field}
        type={type}
        value={['street', 'suite', 'city'].includes(field) ? user.address[field] : user[field]}
        required={!!required}
        onChange={e => setUser(prev => updateField(prev, field, e.target.value))}
      />
    </div>
  ));
}
