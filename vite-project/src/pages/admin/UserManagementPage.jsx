import { useEffect, useState } from 'react';
import { getUsers, countUsers, updateUserRole, setUserStatus } from '../../api/userApi';

const PAGE_SIZE = 10;
const ROLE_LABEL = { student: 'Student', instructor: 'Instructor', admin: 'Admin' };

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('vi-VN');
}

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({ total: 0, instructor: 0, locked: 0 });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const result = await getUsers({ page, limit: PAGE_SIZE, search, role: roleFilter });
        if (!ignore) {
          setUsers(result.data);
          setTotal(result.total);
        }
      } catch (err) {
        if (!ignore) setError('Không tải được danh sách người dùng. Kiểm tra json-server đã chạy chưa (npm run server)?');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchUsers();
    return () => { ignore = true; };
  }, [search, roleFilter, page]);

  useEffect(() => {
    async function fetchStats() {
      const [totalCount, instructorCount, lockedCount] = await Promise.all([
        countUsers({}),
        countUsers({ role: 'instructor' }),
        countUsers({ status: 'locked' }),
      ]);
      setStats({ total: totalCount, instructor: instructorCount, locked: lockedCount });
    }
    fetchStats();
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function handleRoleChange(userId, newRole) {
    if (!newRole) return;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    try {
      await updateUserRole(userId, newRole);
    } catch (err) {
      setError('Đổi vai trò thất bại, thử lại.');
    }
  }

  async function handleToggleLock(user) {
    const nextStatus = user.status === 'locked' ? 'active' : 'locked';
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    try {
      await setUserStatus(user.id, nextStatus);
    } catch (err) {
      setError('Cập nhật trạng thái thất bại, thử lại.');
    }
  }

  return (
    <div className="wrap">
      <div style={{ marginBottom: 20 }}>
        <p className="eyebrow">Quản trị hệ thống</p>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Quản lý người dùng</h1>
      </div>

      <div className="stat-row">
        <div className="stat-tile">
          <div className="lab">Tổng người dùng</div>
          <div className="num">{stats.total}</div>
        </div>
        <div className="stat-tile">
          <div className="lab">Giảng viên</div>
          <div className="num">{stats.instructor}</div>
        </div>
        <div className="stat-tile">
          <div className="lab">Tài khoản bị khóa</div>
          <div className="num" style={{ color: 'var(--error)' }}>{stats.locked}</div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          />
        </div>
        {['', 'student', 'instructor', 'admin'].map((r) => (
          <button
            key={r || 'all'}
            className={`chip ${roleFilter === r ? 'active' : ''}`}
            onClick={() => { setPage(1); setRoleFilter(r); }}
          >
            {r ? ROLE_LABEL[r] : 'Tất cả'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading && <div className="state-block">Đang tải danh sách người dùng...</div>}
        {error && <div className="state-block error">{error}</div>}
        {!loading && !error && users.length === 0 && (
          <div className="state-block">Không tìm thấy người dùng phù hợp.</div>
        )}

        {!loading && !error && users.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="mini-avatar"></div>
                      <b>{u.full_name}</b>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{u.email}</td>
                  <td><span className="badge badge-ink">{ROLE_LABEL[u.role]}</span></td>
                  <td>{formatDate(u.created_at)}</td>
                  <td>
                    {u.status === 'locked'
                      ? <span className="badge badge-error">Đã khóa</span>
                      : <span className="badge badge-teal">Hoạt động</span>}
                  </td>
                  <td>
                    <select
                      className="role-select"
                      value=""
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="">Đổi vai trò</option>
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className={`btn ${u.status === 'locked' ? 'btn-ghost' : 'btn-danger'}`}
                      style={{ marginLeft: 6 }}
                      onClick={() => handleToggleLock(u)}
                    >
                      {u.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <div className="pagination-info">
            Trang <b>{page}</b> / {totalPages} — tổng <b>{total}</b> người dùng
          </div>
          <div className="pagination-controls">
            <button className="page-btn-nav" disabled={page === 1} onClick={() => setPage(page - 1)}>‹ Trước</button>
            <button className="page-btn-nav" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Sau ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementPage;