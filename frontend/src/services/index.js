import apiClient from './api';

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
};

export const projectService = {
  createProject: (data) => apiClient.post('/projects', data),
  getProjects: () => apiClient.get('/projects'),
  getProjectById: (id) => apiClient.get(`/projects/${id}`),
  addMember: (projectId, email) => apiClient.post(`/projects/${projectId}/member`, { email }),
  removeMember: (projectId, userId) => apiClient.delete(`/projects/${projectId}/member/${userId}`),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),
};

export const taskService = {
  createTask: (data) => apiClient.post('/tasks', data),
  getProjectTasks: (projectId) => apiClient.get(`/tasks/project/${projectId}`),
  updateTaskStatus: (taskId, status) => apiClient.patch(`/tasks/${taskId}/status`, { status }),
  updateTask: (taskId, data) => apiClient.patch(`/tasks/${taskId}`, data),
  deleteTask: (taskId) => apiClient.delete(`/tasks/${taskId}`),
};

export const dashboardService = {
  getStats: (projectId) => apiClient.get(`/dashboard/stats/${projectId}`),
  getActivity: (projectId) => apiClient.get(`/dashboard/activity/${projectId}`),
};

export const adminService = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: () => apiClient.get('/admin/users'),
  updateUserRole: (userId, role) => apiClient.patch(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  getProjects: () => apiClient.get('/admin/projects'),
  deleteProject: (projectId) => apiClient.delete(`/admin/projects/${projectId}`),
  getTasks: () => apiClient.get('/admin/tasks'),
  updateTask: (taskId, data) => apiClient.patch(`/admin/tasks/${taskId}`, data),
  deleteTask: (taskId) => apiClient.delete(`/admin/tasks/${taskId}`),
};
