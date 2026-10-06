import { useParams, Link } from 'react-router-dom';
import { POSTS } from './BlogListPage';

export default function BlogDetailPage() {
  const { id } = useParams();
  const post = POSTS.find((p) => String(p.id) === id);

  if (!post) {
    return (
      <div className="page-container">
        <div className="card"><div className="state-block">Không tìm thấy bài viết này.</div></div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      <Link to="/blogs" className="btn btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>← Quay lại danh sách</Link>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 8 }}>{post.date}</p>
      <h1 style={{ marginBottom: 20 }}>{post.title}</h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{post.content}</p>
    </div>
  );
}