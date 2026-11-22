export default function SearchForm({ onChangeValue }) {
  return (
    <form className="search-form" role="search" onSubmit={e => e.preventDefault()}>
      <label className="sr-only" htmlFor="keyword">Tìm theo họ tên hoặc tên đăng nhập</label>
      <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
      <input id="keyword" type="search" placeholder="Tìm họ tên hoặc tên đăng nhập…" onChange={e => onChangeValue(e.target.value)} autoComplete="off" />
    </form>
  );
}
