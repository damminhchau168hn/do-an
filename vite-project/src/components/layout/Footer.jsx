const COLUMNS = [
  {
    title: 'Khám phá',
    links: [
      { label: 'Danh sách khóa học', href: '/courses' },
      { label: 'Giảng viên', href: '/instructors' },
      { label: 'Bài viết', href: '/blogs' },
    ],
  },
  {
    title: 'Học viên',
    links: [
      { label: 'Khóa học yêu thích', href: '/favorites' },
      { label: 'Tra cứu đăng ký', href: '/enrollment-lookup' },
    ],
  },
  {
    title: 'Liên hệ',
    links: [
      { label: 'hello@education.vn', href: 'mailto:hello@education.vn' },
      { label: '090 000 0000', href: 'tel:0900000000' },
    ],
  },
];

const headingStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--ink-soft)',
  marginBottom: 14,
};

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', padding: '56px 24px 28px', marginTop: 56 }}>
      <style>{`
        .edu-footer-link { color: var(--ink); opacity: 0.85; text-decoration: none; font-size: 14px; }
        .edu-footer-link:hover { opacity: 1; text-decoration: underline; }
        @media (max-width: 760px) {
          .edu-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div
          className="edu-footer-grid"
          style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 36 }}
        >
          <div>
            <a href="/" className="logo" style={{ color: 'var(--ink)', textDecoration: 'none' }}>
              Edu<span style={{ color: 'var(--clay)' }}>cation</span>
            </a>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: 260, marginTop: 12 }}>
              Nền tảng tìm kiếm và đăng ký khóa học kỹ năng ngắn hạn dành cho sinh viên và người đi làm.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 style={headingStyle}>{col.title}</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="edu-footer-link">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 40,
            paddingTop: 20,
            borderTop: '1px solid var(--line)',
            fontSize: 12,
            color: 'var(--ink-soft)',
          }}
        >
          <span>© 2026 Education. Website đồ án học tập.</span>
          <span>Xây dựng bằng ReactJS + Node.js + MongoDB</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;