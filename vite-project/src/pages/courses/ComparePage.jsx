import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function ComparePage() {
  const [courses, setCourses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/courses', { params: { status: 'published', _limit: 100 } })
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        alert('Chỉ so sánh được tối đa 3 khoá học.');
        return prev;
      }
      return [...prev, id];
    });
  }

  const selectedCourses = courses.filter((c) => selectedIds.includes(c.id));

  if (loading) return <div className="page-container"><div className="state-block">Đang tải...</div></div>;

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: 24 }}>So sánh khoá học</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ marginBottom: 12, color: 'var(--ink-soft)' }}>Chọn tối đa 3 khoá học để so sánh:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {courses.map((c) => (
            <button
              key={c.id}
              className={`chip ${selectedIds.includes(c.id) ? 'active' : ''}`}
              onClick={() => toggleSelect(c.id)}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {selectedCourses.length === 0 ? (
        <div className="card"><div className="state-block">Chọn ít nhất 1 khoá học ở trên để xem so sánh.</div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedCourses.length}, 1fr)`, gap: 20 }}>
          {selectedCourses.map((c) => (
            <div key={c.id} className="card">
              <h3 style={{ marginBottom: 8 }}>{c.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 14 }}>{c.description}</p>
              <table className="table">
                <tbody>
                  <tr><th>Danh mục</th><td>{c.category || '—'}</td></tr>
                  <tr><th>Số chương</th><td>{c.total_chapters ?? '—'}</td></tr>
                  <tr><th>Trạng thái</th><td><span className="badge badge-published">{c.status}</span></td></tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}