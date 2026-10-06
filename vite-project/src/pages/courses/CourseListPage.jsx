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

  if (loading) return <div style={{ padding: '20px' }}>Đang tải danh sách khóa học...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Danh sách khóa học hiện có</h2>
      {courses.length === 0 ? (
        <p>Hiện tại chưa có khóa học nào được xuất bản.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {courses.map(course => (
            <div key={course.id} style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: '0', color: '#0056b3' }}>{course.title}</h3>
              <p style={{ color: '#666', minHeight: '50px', fontSize: '14px' }}>{course.description}</p>
              <Link to={`/courses/${course.id}`} style={{ display: 'inline-block', marginTop: '10px', color: '#fff', backgroundColor: '#007bff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
