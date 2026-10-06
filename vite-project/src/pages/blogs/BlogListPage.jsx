import { Link } from 'react-router-dom';

export const POSTS = [
  {
    id: 1,
    title: '5 cách học lập trình hiệu quả cho người mới bắt đầu',
    excerpt: 'Những phương pháp thực tế giúp bạn tiếp cận lập trình nhanh hơn, tránh nản chí khi mới học.',
    date: '20/09/2026',
    content: 'Khi mới bắt đầu học lập trình, nhiều bạn dễ nản vì khối lượng kiến thức quá lớn. Dưới đây là 5 cách giúp bạn học hiệu quả hơn: (1) Học qua dự án thực tế thay vì chỉ đọc lý thuyết, (2) Code mỗi ngày dù chỉ 30 phút, (3) Tham gia cộng đồng để hỏi đáp, (4) Đọc code của người khác, (5) Kiên trì và chấp nhận mắc lỗi là một phần của quá trình học.',
  },
  {
    id: 2,
    title: 'Cấu trúc dữ liệu nào cần nắm vững trước khi phỏng vấn?',
    excerpt: 'Tổng hợp các cấu trúc dữ liệu và giải thuật thường gặp nhất trong các buổi phỏng vấn kỹ thuật.',
    date: '15/09/2026',
    content: 'Các cấu trúc dữ liệu quan trọng nhất cần ôn trước phỏng vấn gồm: mảng, danh sách liên kết, ngăn xếp, hàng đợi, cây nhị phân, bảng băm (hash table) và đồ thị. Bên cạnh đó, các giải thuật sắp xếp, tìm kiếm, quy hoạch động cũng thường xuyên xuất hiện trong các bài test kỹ thuật.',
  },
  {
    id: 3,
    title: 'Lộ trình tự học ReactJS trong 30 ngày',
    excerpt: 'Một lộ trình chi tiết theo từng tuần giúp bạn làm chủ ReactJS từ cơ bản đến nâng cao.',
    date: '08/09/2026',
    content: 'Tuần 1: nắm vững JavaScript ES6+ và JSX. Tuần 2: Component, Props, State, Hooks cơ bản (useState, useEffect). Tuần 3: React Router, gọi API với Axios, quản lý state nâng cao. Tuần 4: Xây dựng một dự án hoàn chỉnh để luyện tập toàn bộ kiến thức đã học.',
  },
  {
    id: 4,
    title: 'Vì sao kỹ năng thuyết trình quan trọng với dân IT?',
    excerpt: 'Kỹ năng mềm không chỉ dành cho dân kinh doanh — đây là lý do lập trình viên cũng cần nó.',
    date: '01/09/2026',
    content: 'Lập trình viên không chỉ viết code mà còn cần trình bày ý tưởng, giải thích giải pháp kỹ thuật cho đồng nghiệp, khách hàng không chuyên. Kỹ năng thuyết trình tốt giúp bạn thuyết phục team lựa chọn giải pháp của mình, và cũng là yếu tố quan trọng để thăng tiến lên vị trí lead hoặc quản lý.',
  },
];

export default function BlogListPage() {
  return (
    <div className="page-container">
      <h1 style={{ marginBottom: 24 }}>Bài viết</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {POSTS.map((post) => (
          <Link key={post.id} to={`/blogs/${post.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 8 }}>{post.date}</p>
            <h3 style={{ marginBottom: 10 }}>{post.title}</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}