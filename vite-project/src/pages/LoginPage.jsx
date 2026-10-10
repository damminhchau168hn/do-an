import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useRole } from '../context/RoleContext';

// Đăng nhập xong thì về trang riêng của từng vai trò
const HOME_BY_ROLE = {
  admin: '/admin/users',
  reviewer: '/admin/courses',
  instructor: '/dashboard',
};

// Tài khoản nào trong db.json chưa có trường "password" thì dùng mật khẩu này
const DEFAULT_PASSWORD = '123456';

const labelStyle = { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 };

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosClient.get('/users', { params: { email: email.trim() } });
      const found = res.data?.[0];
      const expected = found?.password ?? DEFAULT_PASSWORD;

      if (!found || password !== expected) {
        setError('Email hoặc mật khẩu không đúng.');
        return;
      }
      if (found.status === 'locked') {
        setError('Tài khoản này đã bị khóa.');
        return;
      }

      login({ id: found.id, full_name: found.full_name, email: found.email, role: found.role });
      navigate(HOME_BY_ROLE[found.role] || '/');
    } catch {
      setError('Không kết nối được máy chủ, kiểm tra json-server đã chạy chưa.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: 440 }}>
      <h1 style={{ marginBottom: 8 }}>Đăng nhập</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
        Đăng nhập để vào khu vực theo vai trò của bạn.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <label style={labelStyle} htmlFor="email">Email</label>
        <input id="email" type="email" className="search-box" style={{ width: '100%', marginBottom: 16 }}
          value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />

        <label style={labelStyle} htmlFor="password">Mật khẩu</label>
        <input id="password" type="password" className="search-box" style={{ width: '100%', marginBottom: 16 }}
          value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <div className="state-block error" style={{ marginBottom: 16 }}>{error}</div>}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}