import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function InstructorListPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    axiosClient.get('/users', { params: { role: 'instructor', _limit: 100 } })
      .then((res) => {
        if (!ignore) setInstructors(res.data);
      })
      .catch(() => {
        if (!ignore) setError('Không tải được danh sách giảng viên.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, []);

  if (loading) return <div className="page-container"><div className="state-block">Đang tải danh sách giảng viên...</div></div>;
  if (error) return <div className="page-container"><div className="state-block error">{error}</div></div>;

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: 24 }}>Đội ngũ giảng viên</h1>

      {instructors.length === 0 ? (
        <div className="card"><div className="state-block">Hiện chưa có giảng viên nào.</div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {instructors.map((ins) => (
            <div key={ins.id} className="card" style={{ textAlign: 'center' }}>
              <div
                className="mini-avatar"
                style={{ width: 64, height: 64, fontSize: 22, margin: '0 auto 14px' }}
              >
                {ins.full_name?.charAt(0) || '?'}
              </div>
              <h3 style={{ marginBottom: 4 }}>{ins.full_name}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 10 }}>{ins.email}</p>
              <span className="badge badge-teal">Giảng viên</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}