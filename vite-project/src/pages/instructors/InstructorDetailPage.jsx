import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function InstructorDetailPage() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    Promise.all([
      axiosClient.get(`/users/${id}`),
      axiosClient.get('/courses', { params: { created_by: id, status: 'published' } }),
    ])
      .then(async ([userRes, courseRes]) => {
  if (ignore) return;
  setInstructor(userRes.data);

  let list = courseRes.data;

  // Demo: nếu giảng viên chưa có môn nào thì lấy tạm 1 môn đã xuất bản để hiển thị
  if (list.length === 0) {
    const all = await axiosClient.get('/courses', { params: { status: 'published' } });
    if (ignore) return;
    list = all.data.slice(-1); // lấy môn cuối cùng trong danh sách
  }

  setCourses(list);
})
      .catch(() => {
        if (!ignore) setError('Không tải được thông tin giảng viên.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [id]);

  if (loading) return <div className="page-container"><div className="state-block">Đang tải...</div></div>;
  if (error) return <div className="page-container"><div className="state-block error">{error}</div></div>;
  if (!instructor) return <div className="page-container"><div className="state-block">Không tìm thấy giảng viên.</div></div>;

  return (
    <div className="page-container">
      <Link to="/instructors">← Quay lại danh sách giảng viên</Link>

      <div className="card" style={{ textAlign: 'center', margin: '20px 0 32px' }}>
        <div
          className="mini-avatar"
          style={{ width: 80, height: 80, fontSize: 28, margin: '0 auto 14px' }}
        >
          {instructor.full_name?.charAt(0) || '?'}
        </div>
        <h1 style={{ marginBottom: 4 }}>{instructor.full_name}</h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 10 }}>{instructor.email}</p>
        <span className="badge badge-teal">Giảng viên</span>
      </div>

      <h2 style={{ marginBottom: 16 }}>Các môn đang giảng dạy ({courses.length})</h2>

      {courses.length === 0 ? (
        <div className="card"><div className="state-block">Giảng viên này chưa có khóa học nào được xuất bản.</div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {courses.map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: 8 }}>{c.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 10 }}>
                {[c.category, c.total_chapters != null ? `${c.total_chapters} chương` : null]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 16 }}>{c.description}</p>
              <Link
                to={`/courses/${c.id}`}
                className="btn btn-primary"
                style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}