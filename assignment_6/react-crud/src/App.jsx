import { useCallback, useState } from 'react';
import SearchForm from './SearchForm.jsx';
import AddUser from './AddUser.jsx';
import ResultTable from './ResultTable.jsx';

export default function App() {
  const [kw, setKeyword] = useState('');
  const [newUser, setNewUser] = useState(null);
  const handleAdded = useCallback(() => setNewUser(null), []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="./"><span className="brand-mark" aria-hidden="true">u.</span>directory<span className="brand-slash">/</span><span className="brand-caption">quản lý người dùng</span></a>
        <a className="report-link" href="./report.html">Báo cáo bài tập <span aria-hidden="true">↗</span></a>
      </header>
      <main>
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">BÀI TẬP 06 <span>REACT / CRUD</span></p>
            <h1 id="page-title">Mọi người, <em>một nơi.</em></h1>
            <p className="intro-copy">Tìm kiếm, thêm và cập nhật thông tin người dùng.<br />Một danh sách rõ ràng, mọi thao tác trong tầm tay.</p>
          </div>
          <div className="intro-note"><span className="status-dot" /> Dữ liệu thực hành<p>JSONPlaceholder<br />10 hồ sơ mẫu để bắt đầu.</p></div>
        </section>
        <section className="workspace" aria-label="Quản lý người dùng">
          <div className="toolbar">
            <SearchForm onChangeValue={setKeyword} />
            <AddUser onAdd={setNewUser} pending={newUser !== null} />
          </div>
          <ResultTable keyword={kw} user={newUser} onAdded={handleAdded} />
        </section>
      </main>
      <footer className="page-footer"><span>React 18 · Functional Components · State Lifting</span><span>Bản thực hành: thay đổi chỉ được giữ đến khi tải lại trang.</span></footer>
    </div>
  );
}
