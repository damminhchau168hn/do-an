import axiosClient from './axiosClient';

// Khai báo rõ ràng: từ trạng thái nào được phép đi tới trạng thái nào.
// Bất kỳ chuyển đổi nào không có trong danh sách này đều bị từ chối.
const VALID_TRANSITIONS = {
  pending: ['published', 'removed'],   // Duyệt hoặc Từ chối
  published: ['removed'],
  removed: ['published'],              // Khôi phục
};

export async function getCourses({ page = 1, limit = 10, search = '', status = '' } = {}) {
  const params = { _page: page, _limit: limit };
  if (search) params.q = search;
  if (status) params.status = status;

  const res = await axiosClient.get('/courses', { params });
  return { data: res.data, total: Number(res.headers['x-total-count'] || 0) };
}

export async function countCourses(filter = {}) {
  const res = await axiosClient.get('/courses', { params: { _page: 1, _limit: 1, ...filter } });
  return Number(res.headers['x-total-count'] || 0);
}

// Đếm số sinh viên đã ghi danh 1 khóa học (đếm qua collection enrollments)
export async function countEnrollmentsByCourse(courseId) {
  const res = await axiosClient.get('/enrollments', {
    params: { course_id: courseId, _page: 1, _limit: 1 },
  });
  return Number(res.headers['x-total-count'] || 0);
}

// Hàm cốt lõi: đổi trạng thái khóa học, CÓ kiểm tra hợp lệ + lưu lịch sử
export async function changeCourseStatus(course, toStatus) {
  const fromStatus = course.status;
  const allowed = VALID_TRANSITIONS[fromStatus] || [];

  if (!allowed.includes(toStatus)) {
    throw new Error(`Không thể chuyển từ "${fromStatus}" sang "${toStatus}".`);
  }

  // 1. Cập nhật trạng thái khóa học
  await axiosClient.patch(`/courses/${course.id}`, {
    status: toStatus,
    updated_at: new Date().toISOString(),
  });

  // 2. Lưu lịch sử — bản ghi "audit log" cho thao tác vừa làm
  await axiosClient.post('/courseStatusLogs', {
    course_id: course.id,
    from_status: fromStatus,
    to_status: toStatus,
    changed_at: new Date().toISOString(),
  });
}

// Lấy nhanh bảng tra tên giảng viên: { u2: "TS. Nguyễn Hải", ... }
export async function getInstructorMap() {
  const res = await axiosClient.get('/users', { params: { role: 'instructor', _limit: 100 } });
  const map = {};
  res.data.forEach((u) => { map[u.id] = u.full_name; });
  return map;
}