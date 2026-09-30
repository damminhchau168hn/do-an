import axiosClient from './axiosClient';

export async function getUsers({ page = 1, limit = 10, search = '', role = '' } = {}) {
  const params = { _page: page, _limit: limit };
  if (search) params.q = search;
  if (role) params.role = role;
  const res = await axiosClient.get('/users', { params });
  return { data: res.data, total: Number(res.headers['x-total-count'] || 0) };
}

export async function countUsers(filter = {}) {
  const res = await axiosClient.get('/users', { params: { _page: 1, _limit: 1, ...filter } });
  return Number(res.headers['x-total-count'] || 0);
}

export async function updateUserRole(userId, role) {
  const res = await axiosClient.patch(`/users/${userId}`, { role, updated_at: new Date().toISOString() });
  return res.data;
}

export async function setUserStatus(userId, status) {
  const res = await axiosClient.patch(`/users/${userId}`, { status, updated_at: new Date().toISOString() });
  return res.data;
}