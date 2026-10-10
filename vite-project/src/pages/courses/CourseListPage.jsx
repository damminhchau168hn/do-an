import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    // Biến các ô trên màn hình thành danh sách các Chương
    const mockChaptersData = [
      {
        id: "1",
        title: "Chương 1: Cấu trúc dữ liệu & Giải thuật cơ bản",
        description: "Học về nền tảng cấu trúc dữ liệu cốt lõi bao gồm danh sách liên kết, ngăn xếp, hàng đợi và các giải thuật sắp xếp.",
      },
      {
        id: "2",
        title: "Chương 2: Nhập môn Lập trình Web với NodeJS",
        description: "Khóa học nền tảng giúp hiểu về môi trường chạy JavaScript phía Server và cách quản lý thư viện với NPM.",
      },
      {
        id: "3",
        title: "Chương 3: Lập trình Web nâng cao (React & Express)",
        description: "Xây dựng ứng dụng web full-stack, định tuyến routing nâng cao và tương tác dữ liệu qua REST API.",
      },
      {
        id: "4",
        title: "Chương 4: Kết nối và Quản trị Cơ sở dữ liệu MongoDB",
        description: "Học cách thiết kế cơ sở dữ liệu NoSQL, sử dụng Mongoose ORM để thực hiện các thao tác CRUD dữ liệu.",
      }
    ];

    // Thay thế hàm set state tương ứng trong file của bạn (Ví dụ: setCourses hoặc setChapters)
    setCourses(mockChaptersData); 
    setLoading(false);
  }, []);



  if (loading) return <div className="page-container"><div className="state-block">Đang tải danh sách khóa học...</div></div>;

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: 24 }}>Danh sách khóa học hiện có</h1>

      {courses.length === 0 ? (
        <div className="card">
          <div className="state-block">Hiện tại chưa có khóa học nào được xuất bản.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {courses.map(course => (
            <div key={course.id} className="card">
              <h3 style={{ marginBottom: 8 }}>{course.title}</h3>
              <p style={{ color: 'var(--ink-soft)', minHeight: 50, fontSize: 14 }}>{course.description}</p>
              <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ display: 'inline-block', marginTop: 10 }}>
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}