import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const CURRENT_INSTRUCTOR_ID = 'u2'; // TODO: thay bằng id thật khi có login

function Dial({ percent = 0, size = 90, color = '#2f6f6a' }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e3e0d6" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fontSize="18" fontWeight="600">{percent}%</text>
    </svg>
  );
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, avgCompletion: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const coursesRes = await axiosClient.get('/courses', { params: { created_by: CURRENT_INSTRUCTOR_ID, _limit: 100 } });
        const myCourses = coursesRes.data;

        let totalStudents = 0;
        let completionSum = 0;
        let scoreSum = 0;
        let scoreCount = 0;

        for (const course of myCourses) {
          const enrollRes = await axiosClient.get('/enrollments', { params: { course_id: course.id, _limit: 200 } });
          const enrollments = enrollRes.data;
          totalStudents += enrollments.length;

          const progressRes = await axiosClient.get('/progress', { params: { course_id: course.id, _limit: 200 } });
          const progresses = progressRes.data;
          if (progresses.length > 0) {
            completionSum += progresses.reduce((sum, p) => sum + (p.percent || 0), 0) / progresses.length;
          }

          const attemptsRes = await axiosClient.get('/attempts', { params: { course_id: course.id, _limit: 200 } });
          const attempts = attemptsRes.data;
          if (attempts.length > 0) {
            scoreSum += attempts.reduce((sum, a) => sum + (a.score || 0), 0);
            scoreCount += attempts.length;
          }

          course._studentCount = enrollments.length;
          course._completion = progresses.length > 0
            ? Math.round(progresses.reduce((sum, p) => sum + (p.percent || 0), 0) / progresses.length)
            : 0;
        }

        if (!ignore) {
          setCourses(myCourses);
          setStats({
            totalStudents,
            avgCompletion: myCourses.length > 0 ? Math.round(completionSum / myCourses.length) : 0,
            avgScore: scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  if (loading) return <div className="page-container"><div className="state-block">Đang tải...</div></div>;

  return (
    <div className="page-container">
      <h1>Dashboard giảng viên</h1>

      <div className="stat-row">
        <div className="stat-tile"><div className="num">{courses.length}</div><div className="label">Khoá học</div></div>
        <div className="stat-tile"><div className="num">{stats.totalStudents}</div><div className="label">Học viên</div></div>
        <div className="stat-tile"><div className="num">{stats.avgScore}</div><div className="label">Điểm quiz TB</div></div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
        <Dial percent={stats.avgCompletion} color="#c8553d" />
        <div>
          <h3>Tỉ lệ hoàn thành trung bình</h3>
          <p style={{ color: 'var(--ink-soft)' }}>Tính trên toàn bộ khoá học bạn phụ trách</p>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>Khoá học</th><th>Học viên</th><th>Hoàn thành</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c._studentCount}</td>
                <td>{c._completion}%</td>
                <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}