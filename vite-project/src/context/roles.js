export const ROLE_LABELS = {
  student: 'Học viên',
  instructor: 'Giảng viên',
  reviewer: 'Người duyệt',
  admin: 'Admin',
};

// Trang nào cho vai trò nào vào
export const PAGE_ACCESS = {
  '/admin/users': ['admin'],
  '/admin/courses': ['admin', 'reviewer'],
  '/dashboard': ['admin', 'instructor'],
};