import axiosClient from './axiosClient';

// Lấy toàn bộ bản ghi ghi danh của 1 khóa học — dùng để đếm sinh viên,
// tính % hoàn thành trung bình, điểm quiz trung bình cho khóa đó
export async function getEnrollmentsByCourse(courseId) {
  const res = await axiosClient.get('/enrollments', {
    params: { course_id: courseId, _limit: 200 },
  });
  return res.data;
}