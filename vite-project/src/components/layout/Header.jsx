import { useState } from 'react';
import './Header.css';

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="wrap nav-row">
        <a href="/" className="logo">
          Skill<span>book</span>
        </a>

        <nav className={`nav-primary ${menuOpen ? 'open' : ''}`}>
          <a href="/courses">Khóa học</a>
          <a href="/instructors">Giảng viên</a>
          <a href="/blogs">Bài viết</a>
          <a href="/enrollment-lookup">Tra cứu đăng ký</a>
          <a href="/quiz-list">Quiz</a>
        </nav>

        <div className="nav-actions">
          <div className="search-widget">
            {!searchOpen ? (
              <button
                className="icon-btn"
                aria-label="Tìm kiếm"
                onClick={() => setSearchOpen(true)}
              >
                🔍
              </button>
            ) : (
              <input
                type="text"
                autoFocus
                placeholder="Tìm khóa học nhanh..."
                onBlur={() => setSearchOpen(false)}
              />
            )}
          </div>

          <a href="/favorites" className="icon-btn has-data">
            ♡
            <span className="badge-count">4</span>
          </a>

          <a href="/courses" className="btn btn-primary">
            Tìm khóa học
          </a>

          <button
            className="hamburger"
            aria-label="Mở menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;