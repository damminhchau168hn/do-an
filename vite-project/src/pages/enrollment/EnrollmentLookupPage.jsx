import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

const STATUS_LABEL = { active: 'Đang học', completed: 'Đã hoàn thành' };

export default function EnrollmentLookupPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const userRes = await axiosClient.get('/users', { params: { email: email.trim() } });
      const user = userRes.data?.[0];

      if (!user) {
        setResults([]);
        setError('Không tìm thấy tài khoản với email này.');
        return;
      }

      const enrollRes = await axiosClient.get('/enrollments', { params: { user_id: user.id, _limit: 100 } });
      const enrollments = enrollRes.data;

      const enriched = await Promise.all(
        enrollments.map(async (en) => {
          try {
            const courseRes = await axiosClient.get(`/courses/${en.course_id}`);
            return { ...en, courseTitle: courseRes.data.title };
          } catch {
            return { ...en, courseTitle: 'Khoá học không tồn tại' };
          }
        })
      );

      setResults(enriched);
    } catch (err) {
      setError('Có lỗi xảy ra khi tra cứu, thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: 24 }}>Tra cứu đăng ký khoá học</h1>

      <form onSubmit={handleSearch} className="card" style={{ marginBottom: 24, display: 'flex', gap: 10 }}>
        <input
          type="email"
          className="search-box"
          placeholder="Nhập email đã đăng ký..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1 }}
          required
        />
        <button type="submit" className="btn btn-primary">Tra cứu</button>
      </form>

      {loading && <div className="card"><div className="state-block">Đang tra cứu...</div></div>}

      {!loading && error && (
        <div className="card"><div className="state-block error">{error}</div></div>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <div className="card"><div className="state-block">Email này chưa đăng ký khoá học nào.</div></div>
      )}

      {!loading && results.length > 0 && (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Khoá học</th>
                <th>Ngày đăng ký</th>
                <th>Tiến độ</th>
                <th>Điểm quiz TB</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {results.map((en) => (
                <tr key={en.id}>
                  <td>{en.courseTitle}</td>
                  <td>{new Date(en.enrolled_at).toLocaleDateString('vi-VN')}</td>
                  <td>{en.completion_rate}%</td>
                  <td>{en.average_quiz_score ?? '—'}</td>
                  <td>
                    <span className={`badge ${en.status === 'completed' ? 'badge-published' : 'badge-pending'}`}>
                      {STATUS_LABEL[en.status] || en.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}