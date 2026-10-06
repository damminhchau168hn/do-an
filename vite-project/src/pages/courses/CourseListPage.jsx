import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/courses')
      .then(res => {
        const courseData = res.data?.data || res.data || [];
        const publishedCourses = courseData.filter(c => c.status === 'published');
        setCourses(publishedCourses);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy danh sách khóa học:", err);
        setLoading(false);
      });
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