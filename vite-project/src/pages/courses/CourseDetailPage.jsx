import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function CourseDetailPage() {
  const { id } = useParams(); 
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const getCourseDetail = axiosClient.get(`/courses/${id}`);
      const getCourseSessions = axiosClient.get(`/sessions?courseId=${id}`);

      Promise.all([getCourseDetail, getCourseSessions])
        .then(([courseRes, sessionsRes]) => {
          setCourse(courseRes.data || courseRes);
          
          const sessionData = sessionsRes.data?.data || sessionsRes.data || [];
          setChapters(sessionData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi tải chi tiết khóa học:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div style={{ padding: '20px' }}>Đang tải nội dung khóa học...</div>;
  if (!course) return <div style={{ padding: '20px' }}>Không tìm thấy khóa học này!</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#222' }}>{course.title}</h1>
      <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        {course.description}
      </p>
      
      <h3 style={{ marginTop: '25px', color: '#333' }}>Cấu trúc chương trình học (Chapters)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
        {chapters.length === 0 ? (
          <p style={{ color: '#999', italic: 'true' }}>Khóa học này chưa được cập nhật chương học nào.</p>
        ) : (
          chapters.map((chap, index) => (
            <div key={chap.id} style={{ padding: '15px', background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#495057' }}>Chương {index + 1}: {chap.title}</strong>
              </div>
              <Link to={`/lessons?sessionId=${chap.id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
                Vào học bài →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
