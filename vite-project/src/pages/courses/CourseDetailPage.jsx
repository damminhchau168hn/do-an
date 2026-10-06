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
      const getCourseSessions = axiosClient.get(`/sessions?course_id=${id}`);

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

  if (loading) return <div className="page-container"><div className="state-block">Đang tải nội dung khóa học...</div></div>;
  if (!course) return <div className="page-container"><div className="state-block">Không tìm thấy khóa học này!</div></div>;

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <h1>{course.title}</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, borderBottom: '1px solid var(--line)', paddingBottom: 20 }}>
        {course.description}
      </p>

      <h3 style={{ marginTop: 25, marginBottom: 15 }}>Cấu trúc chương trình học (Chapters)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {chapters.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)', fontStyle: 'italic' }}>Khóa học này chưa được cập nhật chương học nào.</p>
        ) : (
          chapters.map((chap, index) => (
            <div key={chap.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
              <strong>Chương {index + 1}: {chap.title}</strong>
              <Link to={`/lessons?sessionId=${chap.id}`} className="btn btn-primary">
                Vào học bài →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}