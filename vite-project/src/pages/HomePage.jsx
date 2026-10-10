import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { POSTS } from './blogs/BlogListPage';

const BRAND = 'Education';

const SERVICES = [
  { icon: '🎓', title: 'Khóa học trực tuyến', desc: 'Khóa học được người duyệt kiểm tra nội dung trước khi xuất bản, chia thành từng chương rõ ràng.', to: '/courses' },
  { icon: '📝', title: 'Quiz & kiểm tra', desc: 'Làm quiz sau mỗi chương, đạt điểm yêu cầu để mở khóa chương tiếp theo, xem lời giải ngay sau khi nộp bài.', to: '/quiz-list' },
  { icon: '👩‍🏫', title: 'Đội ngũ giảng viên', desc: 'Giảng viên chuyên môn thiết kế khóa học, câu hỏi và theo dõi kết quả của học viên.', to: '/instructors' },
  { icon: '📰', title: 'Bài viết kiến thức', desc: 'Chia sẻ phương pháp học, lộ trình và kinh nghiệm hữu ích cho người học.', to: '/blogs' },
  { icon: '🔎', title: 'Tra cứu đăng ký', desc: 'Nhập email để xem các khóa học đã đăng ký, tiến độ và điểm quiz trung bình.', to: '/enrollment-lookup' },
  { icon: '📊', title: 'Theo dõi tiến độ', desc: 'Tỉ lệ hoàn thành và điểm quiz được ghi nhận để người học biết mình đang ở đâu.' },
];

// Dữ liệu mẫu cho phần Sự kiện, bạn sửa trực tiếp ở đây
const EVENTS = [
  { day: '15', month: 'T10', title: 'Workshop: Lộ trình tự học ReactJS trong 30 ngày', time: '19:00 – 21:00', place: 'Trực tuyến (Zoom)' },
  { day: '22', month: 'T10', title: 'Hội thảo: Kỹ năng thuyết trình cho dân IT', time: '14:00 – 16:30', place: 'Hội trường A' },
  { day: '05', month: 'T11', title: 'Cuộc thi Quiz: Cấu trúc dữ liệu & Giải thuật', time: '08:30 – 10:30', place: 'Phòng máy 3' },
  { day: '19', month: 'T11', title: 'Ngày hội việc làm công nghệ', time: '09:00 – 16:00', place: 'Sảnh tầng 1' },
];

function SectionTitle({ title, subtitle, to, linkText }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
      <div>
        <h2 style={{ marginBottom: 6 }}>{title}</h2>
        {subtitle && <p style={{ color: 'var(--ink-soft)' }}>{subtitle}</p>}
      </div>
      {to && <Link to={to} className="btn btn-ghost" style={{ whiteSpace: 'nowrap' }}>{linkText}</Link>}
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      axiosClient.get('/courses'),
      axiosClient.get('/users', { params: { role: 'instructor', _limit: 100 } }),
      axiosClient.get('/quizzes'),
    ])
      .then(([courses, instructors, quizzes]) => {
        if (ignore) return;
        setStats({
          courses: courses.data.filter((c) => c.status === 'published').length,
          instructors: instructors.data.length,
          quizzes: quizzes.data.length,
        });
      })
      .catch(() => { /* không có số liệu thì hiện dấu gạch */ });
    return () => { ignore = true; };
  }, []);

  const statItems = [
    { label: 'Khóa học đang mở', value: stats?.courses },
    { label: 'Giảng viên', value: stats?.instructors },
    { label: 'Bài quiz', value: stats?.quizzes },
  ];

  return (
    <div className="page-container">
      {/* 1. Giới thiệu */}
      <section style={{ marginTop: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: 14 }}>Giới thiệu về {BRAND}</h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 12 }}>
              {BRAND} là nền tảng học trực tuyến kết hợp bài kiểm tra Quiz, giúp người học nắm chắc kiến thức
              từng chương trước khi đi tiếp. Hoàn thành quiz với số điểm đạt để mở khóa chương kế tiếp, xem
              lời giải ngay sau khi nộp bài và theo dõi tiến độ học tập của chính mình.
            </p>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 20 }}>
              Mỗi khóa học đều do giảng viên chuyên môn xây dựng và được người duyệt kiểm tra nội dung
              trước khi xuất bản, để học viên luôn được học những nội dung rõ ràng và đáng tin cậy.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn btn-primary">Khám phá khóa học</Link>
              <Link to="/quiz-list" className="btn btn-ghost">Làm quiz ngay</Link>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {statItems.map((s) => (
              <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>{s.value ?? '—'}</div>
                <div style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Dịch vụ */}
      <section style={{ marginTop: 64 }}>
        <SectionTitle title={`Các dịch vụ của ${BRAND}`} subtitle="Mọi thứ bạn cần để học, kiểm tra và theo dõi tiến độ trong một nơi." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {SERVICES.map((s) => {
            const body = (
              <>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
                <h3 style={{ marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </>
            );
            return s.to ? (
              <Link key={s.title} to={s.to} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                {body}
              </Link>
            ) : (
              <div key={s.title} className="card">{body}</div>
            );
          })}
        </div>
      </section>

      {/* 3. Tin tức */}
      <section style={{ marginTop: 64 }}>
        <SectionTitle title="Tin tức" subtitle="Bài viết mới nhất từ cộng đồng học tập." to="/blogs" linkText="Xem tất cả" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {POSTS.slice(0, 3).map((post) => (
            <Link key={post.id} to={`/blogs/${post.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 8 }}>{post.date}</p>
              <h3 style={{ marginBottom: 10 }}>{post.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Sự kiện */}
      <section style={{ marginTop: 64, marginBottom: 24 }}>
        <SectionTitle title="Sự kiện" subtitle="Các hoạt động sắp diễn ra." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {EVENTS.map((ev) => (
            <div key={ev.title} className="card" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <div
                style={{
                  minWidth: 64,
                  padding: '10px 0',
                  textAlign: 'center',
                  borderRadius: 'var(--radius)',
                  background: 'var(--teal)',
                  color: '#fff',
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{ev.day}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{ev.month}</div>
              </div>
              <div>
                <h3 style={{ marginBottom: 6, fontSize: 17 }}>{ev.title}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>🕒 {ev.time} · 📍 {ev.place}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}