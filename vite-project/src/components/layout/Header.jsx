import { useState } from 'react';
import './Header.css';

function Header() {
  // searchOpen: true/false — ô tìm kiếm đang thu gọn (icon) hay mở rộng (input)
  const [searchOpen, setSearchOpen] = useState(false);
  // menuOpen: true/false — menu mobile (hamburger) đang mở hay đóng
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="wrap nav-row">
        <a href="/" className="logo">
          Skill<span>book</span>
        </a>

        {/* Thêm class "open" khi menuOpen = true, để CSS hiện menu trên mobile */}
        <nav className={`nav-primary ${menuOpen ? 'open' : ''}`}>
          <a href="/courses">Khóa học</a>
          <a href="/instructors">Giảng viên</a>
          <a href="/compare">So sánh</a>
          <a href="/blogs">Bài viết</a>
          <a href="/enrollment-lookup">Tra cứu đăng ký</a>
          <a href="/quiz-list">Quiz</a>
        </nav>

        <div className="nav-actions">
          {/* Ô tìm kiếm: chưa mở -> hiện icon; đã mở -> hiện input */}
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

          <a href="/compare" className="icon-btn">
            ⇄
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