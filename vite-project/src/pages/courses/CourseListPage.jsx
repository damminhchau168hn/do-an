import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

// Bỏ dấu + chữ thường để gõ "lap trinh" vẫn tìm ra "Lập trình"
const normalize = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

const selectStyle = {
  padding: '9px 12px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--line)',
  background: 'var(--card)',
  color: 'var(--ink)',
  fontSize: 14,
  minWidth: 180,
};

const SORTERS = {
  'title-asc': (a, b) => (a.title || '').localeCompare(b.title || '', 'vi'),
  'title-desc': (a, b) => (b.title || '').localeCompare(a.title || '', 'vi'),
  newest: (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
  chapters: (a, b) => (b.total_chapters ?? 0) - (a.total_chapters ?? 0),
};

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [instructorNames, setInstructorNames] = useState({}); // id -> họ tên
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const instructor = searchParams.get('instructor') ?? '';
  const sort = searchParams.get('sort') ?? '';

  useEffect(() => {
    let ignore = false;
    Promise.all([
      axiosClient.get('/courses'),
      axiosClient.get('/users', { params: { role: 'instructor', _limit: 100 } })
        .catch(() => ({ data: [] })), // không có tên giảng viên vẫn hiện được khóa học
    ])
      .then(([courseRes, userRes]) => {
        if (ignore) return;
        setCourses(courseRes.data.filter((c) => c.status === 'published'));
        const map = {};
        userRes.data.forEach((u) => { map[u.id] = u.full_name; });
        setInstructorNames(map);
      })
      .catch(() => { if (!ignore) setError('Không tải được danh sách khóa học.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  function updateParam(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next, { replace: true });
  }

  const nameOf = (id) => instructorNames[id] ?? id ?? '';

  // Danh sách lựa chọn lấy từ chính dữ liệu khóa học
  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
  const instructorIds = [...new Set(courses.map((c) => c.created_by).filter(Boolean))];
  const hasCreatedAt = courses.some((c) => c.created_at);
  const hasChapters = courses.some((c) => c.total_chapters != null);

  const key = normalize(keyword.trim());
  const filtered = courses.filter((c) => {
    if (category && c.category !== category) return false;
    if (instructor && c.created_by !== instructor) return false;
    if (key) {
      const haystack = normalize(`${c.title ?? ''} ${c.description ?? ''} ${c.category ?? ''} ${nameOf(c.created_by)}`);
      if (!haystack.includes(key)) return false;
    }
    return true;
  });
  const result = SORTERS[sort] ? [...filtered].sort(SORTERS[sort]) : filtered;

  const hasFilter = Boolean(key || category || instructor || sort);

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: 20 }}>Danh sách khóa học hiện có</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <input
          type="search"
          className="search-box"
          style={{ width: '100%', marginBottom: 14 }}
          placeholder="Tìm theo tên khóa học, mô tả, danh mục hoặc giảng viên..."
          value={keyword}
          onChange={(e) => updateParam('q', e.target.value)}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          {categories.length > 0 && (
            <select style={selectStyle} value={category} onChange={(e) => updateParam('category', e.target.value)} aria-label="Lọc theo danh mục">
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          {instructorIds.length > 0 && (
            <select style={selectStyle} value={instructor} onChange={(e) => updateParam('instructor', e.target.value)} aria-label="Lọc theo giảng viên">
              <option value="">Tất cả giảng viên</option>
              {instructorIds.map((id) => <option key={id} value={id}>{nameOf(id)}</option>)}
            </select>
          )}

          <select style={selectStyle} value={sort} onChange={(e) => updateParam('sort', e.target.value)} aria-label="Sắp xếp">
            <option value="">Sắp xếp mặc định</option>
            <option value="title-asc">Tên A → Z</option>
            <option value="title-desc">Tên Z → A</option>
            {hasCreatedAt && <option value="newest">Mới nhất</option>}
            {hasChapters && <option value="chapters">Nhiều chương nhất</option>}
          </select>

          {hasFilter && (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => setSearchParams({}, { replace: true })}>
                Xóa bộ lọc
              </button>
              <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
                {result.length} / {courses.length} khóa học
              </span>
            </>
          )}
        </div>
      </div>

      {loading && <div className="card"><div className="state-block">Đang tải danh sách khóa học...</div></div>}

      {!loading && error && <div className="card"><div className="state-block error">{error}</div></div>}

      {!loading && !error && result.length === 0 && (
        <div className="card">
          <div className="state-block">
            {hasFilter
              ? 'Không có khóa học nào phù hợp với bộ lọc hiện tại.'
              : 'Hiện tại chưa có khóa học nào được xuất bản.'}
          </div>
        </div>
      )}

      {!loading && !error && result.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {result.map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: 8 }}>{c.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 10 }}>
                {[nameOf(c.created_by), c.category, c.total_chapters != null ? `${c.total_chapters} chương` : null]
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