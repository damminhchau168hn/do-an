import { useState } from 'react';
import './Header.css';
import { useRole } from '../../context/RoleContext';
import { ROLE_LABELS, PAGE_ACCESS } from '../../context/roles';
import QuestionMenu from '../question/QuestionMenu';

const ADMIN_LINKS = [
  { to: '/admin/users', label: 'Quản lý người dùng' },
  { to: '/admin/courses', label: 'Duyệt khoá học' },
  { to: '/dashboard', label: 'Dashboard giảng viên' },
];

const noWrap = { whiteSpace: 'nowrap' };

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { user, role, logout } = useRole();

  // Chỉ giữ những trang mà vai trò hiện tại được vào
  const adminLinks = ADMIN_LINKS.filter((l) => PAGE_ACCESS[l.to].includes(role));

  function handleLogout() {
    logout();
    window.location.href = '/';
  }

  return (
    <header className="site-header">
      <div className="wrap nav-row">
        <a href="/" className="logo" style={{ color: 'var(--ink)', textDecoration: 'none' }}>
          Edu<span style={{ color: 'var(--clay)' }}>cation</span>
        </a>

        <nav className={`nav-primary ${menuOpen ? 'open' : ''}`}>
          <a href="/courses" style={noWrap}>Khóa học</a>
          <a href="/quiz-list" style={noWrap}>Quiz</a>
          <a href="/instructors" style={noWrap}>Giảng viên</a>
          <a href="/blogs" style={noWrap}>Bài viết</a>
          <a href="/enrollment-lookup" style={noWrap}>Tra cứu đăng ký</a>

          {/* Export Excel / Import Excel / Tải file mẫu (chỉ admin và giảng viên thấy) */}
          <QuestionMenu />

          {adminLinks.length > 0 && (
            <div style={{ position: 'relative' }} onMouseLeave={() => setAdminOpen(false)}>
              <button
                type="button"
                onClick={() => setAdminOpen(!adminOpen)}
                style={{
                  ...noWrap,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  font: 'inherit',
                  color: 'inherit',
                  fontWeight: 600,
                }}
              >
                Quản trị ▾
              </button>

              {adminOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 10, zIndex: 50 }}>
                  <div
                    style={{
                      minWidth: 220,
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 8,
                      background: 'var(--card)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    {adminLinks.map((l) => (
                      <a key={l.to} href={l.to} style={{ ...noWrap, padding: '10px 12px' }}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span
                title={`${user.full_name} (${user.email})`}
                style={{ ...noWrap, fontSize: 14, fontWeight: 600, color: 'var(--ink-soft)' }}
              >
                {ROLE_LABELS[role] ?? role}
              </span>
              <button className="btn btn-ghost" style={noWrap} onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <a href="/login" className="btn btn-ghost" style={noWrap}>Đăng nhập</a>
          )}

          <a href="/favorites" className="icon-btn has-data">♡<span className="badge-count">4</span></a>
          <button className="hamburger" aria-label="Mở menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;