import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const STATUS_LABEL = { pending: 'Chờ duyệt', published: 'Đã duyệt', removed: 'Đã gỡ' };
const VALID_TRANSITIONS = {
  pending: ['published', 'removed'],
  published: ['removed'],
  removed: ['published'],
};

export default function CourseApprovalPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [counts, setCounts] = useState({ pending: 0, published: 0, removed: 0 });

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = { _limit: 100 };
        if (search) params.q = search;
        if (statusFilter) params.status = statusFilter;
        const res = await axiosClient.get('/courses', { params });
        if (!ignore) setCourses(res.data);
      } catch (e) {
        if (!ignore) setError('Không tải được danh sách khoá học.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [search, statusFilter]);

  useEffect(() => {
    let ignore = false;
    async function loadCounts() {
      try {
        const [p, pub, rem] = await Promise.all([
          axiosClient.get('/courses', { params: { status: 'pending', _limit: 1 } }),
          axiosClient.get('/courses', { params: { status: 'published', _limit: 1 } }),
          axiosClient.get('/courses', { params: { status: 'removed', _limit: 1 } }),
        ]);
        if (!ignore) {
          setCounts({
            pending: Number(p.headers['x-total-count'] || 0),
            published: Number(pub.headers['x-total-count'] || 0),
            removed: Number(rem.headers['x-total-count'] || 0),
          });
        }
      } catch (e) { /* bỏ qua lỗi đếm */ }
    }
    loadCounts();
    return () => { ignore = true; };
  }, [courses]);

  async function changeStatus(course, newStatus) {
    const allowed = VALID_TRANSITIONS[course.status] || [];
    if (!allowed.includes(newStatus)) {
      alert(`Không thể chuyển từ "${course.status}" sang "${newStatus}"`);
      return;
    }
    const prev = courses;
    setCourses((cs) => cs.map((c) => (c.id === course.id ? { ...c, status: newStatus } : c)));
    try {
      await axiosClient.patch(`/courses/${course.id}`, { status: newStatus });
      await axiosClient.post('/courseStatusLogs', {
        course_id: course.id,
        from_status: course.status,
        to_status: newStatus,
        changed_at: new Date().toISOString(),
      });
    } catch (e) {
      setCourses(prev);
      alert('Cập nhật thất bại, thử lại.');
    }
  }

  return (
    <div className="page-container">
      <h1>Duyệt khoá học</h1>

      <div className="stat-row">
        <div className="stat-tile"><div className="num">{counts.pending}</div><div className="label">Chờ duyệt</div></div>
        <div className="stat-tile"><div className="num">{counts.published}</div><div className="label">Đã duyệt</div></div>
        <div className="stat-tile"><div className="num">{counts.removed}</div><div className="label">Đã gỡ</div></div>
      </div>

      <div className="filter-bar">
        <input
          className="search-box"
          placeholder="Tìm khoá học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {['', 'pending', 'published', 'removed'].map((s) => (
          <button
            key={s || 'all'}
            className={`chip ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s ? STATUS_LABEL[s] : 'Tất cả'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="state-block">Đang tải...</div>
        ) : error ? (
          <div className="state-block error">{error}</div>
        ) : courses.length === 0 ? (
          <div className="state-block">Không có khoá học nào.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Tên khoá học</th><th>Giảng viên</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.created_by}</td>
                  <td><span className={`badge badge-${c.status}`}>{STATUS_LABEL[c.status] || c.status}</span></td>
                  <td>
                    {c.status === 'pending' && (
                      <>
                        <button className="btn btn-primary" style={{ marginRight: 8 }} onClick={() => changeStatus(c, 'published')}>Duyệt</button>
                        <button className="btn btn-danger" onClick={() => changeStatus(c, 'removed')}>Từ chối</button>
                      </>
                    )}
                    {c.status === 'published' && (
                      <button className="btn btn-danger" onClick={() => changeStatus(c, 'removed')}>Gỡ bỏ</button>
                    )}
                    {c.status === 'removed' && (
                      <button className="btn btn-primary" onClick={() => changeStatus(c, 'published')}>Khôi phục</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}