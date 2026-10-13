import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useRole } from '../../context/RoleContext';

export default function EnrollPage() {
  const { courseId } = useParams();
  const { user } = useRole();

  const [course, setCourse] = useState(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    async function load() {
      try {
        const courseRes = await axiosClient.get(`/courses/${courseId}`);
        if (ignore) return;
        setCourse(courseRes.data);

        if (user?.id) {
          const enrollRes = await axiosClient.get('/enrollments', {
            params: { user_id: user.id, course_id: courseId },
          });
          if (!ignore) setAlreadyEnrolled(enrollRes.data.length > 0);
        }
      } catch {
        if (!ignore) setError('Không tải được thông tin khóa học.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [courseId, user?.id]);

  async function handleEnroll() {
    if (!user?.id || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      // Kiểm tra lại lần nữa để tránh đăng ký trùng
      const check = await axiosClient.get('/enrollments', {
        params: { user_id: user.id, course_id: courseId },
      });
      if (check.data.length > 0) {
        setAlreadyEnrolled(true);
        return;
      }

      await axiosClient.post('/enrollments', {
        user_id: user.id,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        completion_rate: 0,
        average_quiz_score: null,
        status: 'active',
      });
      setDone(true);
    } catch {
      setError('Đăng ký chưa thành công. Hãy kiểm tra JSON Server tại cổng 3001.');
    } finally {
      setSubmitting(false);
    }
  }

  const infoStyle = { color: 'var(--ink-soft)', fontSize: 14, margin: '4px 0' };

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: 24 }}>Đăng ký khóa học</h1>

      {loading && (
        <div className="card"><div className="state-block">Đang tải...</div></div>
      )}

      {!loading && error && !course && (
        <div className="card"><div className="state-block error">{error}</div></div>
      )}

      {!loading && course && (
        <div className="card">
          <h2 style={{ marginBottom: 8 }}>{course.title}</h2>
          {course.description && (
            <p style={{ ...infoStyle, marginBottom: 16 }}>{course.description}</p>
          )}

          {/* Chưa đăng nhập */}
          {!user && (
            <div className="state-block">
              Bạn cần đăng nhập để đăng ký khóa học.
              <div style={{ marginTop: 14 }}>
                <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
              </div>
            </div>
          )}

          {/* Đã đăng nhập */}
          {user && !done && !alreadyEnrolled && (
            <>
              <div
                style={{
                  background: 'var(--paper-dim, #EFE9D8)',
                  borderRadius: 'var(--radius, 4px)',
                  padding: '14px 16px',
                  marginBottom: 16,
                }}
              >
                <p style={infoStyle}>Đăng ký với tài khoản:</p>
                <p style={{ margin: '4px 0', fontWeight: 600 }}>
                  {user.name ?? user.full_name ?? user.email}
                </p>
                {user.email && <p style={infoStyle}>{user.email}</p>}
              </div>

              {error && (
                <p style={{ color: '#c23b3b', fontSize: 14, marginBottom: 12 }}>{error}</p>
              )}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEnroll}
                  disabled={submitting}
                >
                  {submitting ? 'Đang đăng ký...' : 'Xác nhận đăng ký'}
                </button>
                <Link to="/courses" className="btn btn-ghost">Quay lại danh sách</Link>
              </div>
            </>
          )}

          {/* Đã đăng ký từ trước */}
          {user && alreadyEnrolled && !done && (
            <div className="state-block">
              Bạn đã đăng ký khóa học này rồi.
              <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/enrollment-lookup" className="btn btn-primary">Tra cứu đăng ký</Link>
                <Link to={`/courses/${courseId}`} className="btn btn-ghost">Vào học</Link>
              </div>
            </div>
          )}

          {/* Đăng ký thành công */}
          {done && (
            <div className="state-block">
              <strong>Đăng ký thành công!</strong>
              <div style={{ marginTop: 6 }}>
                Dùng email {user?.email ? <b>{user.email}</b> : 'của bạn'} để tra cứu khóa học đã đăng ký.
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to={`/courses/${courseId}`} className="btn btn-primary">Vào học ngay</Link>
                <Link to="/enrollment-lookup" className="btn btn-ghost">Tra cứu đăng ký</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}