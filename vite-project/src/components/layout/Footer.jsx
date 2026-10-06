import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <a href="/" className="logo">
            Skill<span>book</span>
          </a>
          <p>
            Nền tảng tìm kiếm và đăng ký khóa học kỹ năng ngắn hạn dành cho
            sinh viên và người đi làm.
          </p>
        </div>

        <div className="footer-col">
          <h4>Khám phá</h4>
          <a href="/courses">Danh sách khóa học</a>
          <a href="/instructors">Giảng viên</a>
          <a href="/compare">So sánh khóa học</a>
          <a href="/blogs">Bài viết</a>
        </div>

        <div className="footer-col">
          <h4>Học viên</h4>
          <a href="/favorites">Khóa học yêu thích</a>
          <a href="/enrollment-lookup">Tra cứu đăng ký</a>
        </div>

        <div className="footer-col">
          <h4>Liên hệ</h4>
          <a href="mailto:hello@skillbook.vn">hello@skillbook.vn</a>
          <a href="tel:0900000000">090 000 0000</a>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>© 2026 Skillbook. Website đồ án học tập.</span>
        <span>Xây dựng bằng ReactJS + Node.js + MongoDB</span>
      </div>
    </footer>
  );
}

export default Footer;