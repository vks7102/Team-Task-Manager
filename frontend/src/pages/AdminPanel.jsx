import { useState, useEffect } from 'react';
import { adminService, projectService } from '../services/index';
import { useAuth } from '../hooks/useAuth';
import { Users, FolderOpen, CheckSquare, BarChart3, Trash2, AlertCircle, Plus, ExternalLink, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin/users') setActiveSection('users');
    else if (path === '/admin/projects') setActiveSection('projects');
    else if (path === '/admin/tasks') setActiveSection('tasks');
    else setActiveSection('overview');
  }, [location.pathname]);

  useEffect(() => {
    fetchAdminData();
  }, [activeSection]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeSection === 'overview') {
        const response = await adminService.getStats();
        setStats(response.data);
      } else if (activeSection === 'users') {
        const response = await adminService.getUsers();
        setUsers(response.data);
      } else if (activeSection === 'projects') {
        const response = await adminService.getProjects();
        setProjects(response.data);
      } else if (activeSection === 'tasks') {
        const response = await adminService.getTasks();
        setTasks(response.data);
      }
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setSuccess(`User role updated to ${newRole}`);
      fetchAdminData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete their tasks and remove them from projects.')) {
      try {
        await adminService.deleteUser(userId);
        setSuccess('User deleted successfully');
        fetchAdminData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectService.createProject(projectForm);
      setSuccess('Project created successfully');
      setShowCreateProject(false);
      setProjectForm({ name: '', description: '' });
      fetchAdminData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      try {
        await adminService.deleteProject(projectId);
        setSuccess('Project deleted successfully');
        fetchAdminData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await adminService.deleteTask(taskId);
        setSuccess('Task deleted successfully');
        fetchAdminData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const renderOverview = () => {
    if (!stats) return null;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
            <p className="text-sm text-gray-600 mt-1">Registered users in system</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FolderOpen className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalProjects}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Total Projects</h3>
            <p className="text-sm text-gray-600 mt-1">Active projects in system</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CheckSquare className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalTasks}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Total Tasks</h3>
            <p className="text-sm text-gray-600 mt-1">All tasks in system</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.usersByRole?.length || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">User Roles</h3>
            <p className="text-sm text-gray-600 mt-1">Different roles in system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Users by Role</h3>
            {stats.usersByRole?.length > 0 ? (
              <div className="space-y-3">
                {stats.usersByRole.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item._id}</span>
                    <span className="text-sm text-gray-600">{item.count} users</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No user role data available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Tasks by Status</h3>
            {stats.tasksByStatus?.length > 0 ? (
              <div className="space-y-3">
                {stats.tasksByStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item._id}</span>
                    <span className="text-sm text-gray-600">{item.count} tasks</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No task status data available</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    if (loading) return <div className="text-center py-10">Loading...</div>;
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold">User Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold text-blue-600">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="px-3 py-1 border rounded text-sm font-medium"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (loading) return <div className="text-center py-10">Loading...</div>;
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold">Project Management</h3>
            <button
              onClick={() => setShowCreateProject(!showCreateProject)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              {showCreateProject ? 'Cancel' : 'Create Project'}
            </button>
          </div>

          {showCreateProject && (
            <div className="p-6 bg-gray-50 border-b">
              <form onSubmit={handleCreateProject} className="max-w-lg space-y-4">
                <input
                  type="text"
                  placeholder="Project name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  rows={3}
                />
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Create Project
                </button>
              </form>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No projects found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {projects.map(project => (
                <div key={project._id} className="border rounded-lg p-5 hover:shadow-lg transition">
                  <h4 className="font-bold text-lg mb-2 truncate">{project.name}</h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description || 'No description'}</p>
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <p>Admin: {project.admin?.name || 'N/A'}</p>
                    <p>Members: {project.members?.length || 0}</p>
                    <p>Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/project/${project._id}`)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
                    >
                      <ExternalLink size={14} />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/project/${project._id}/settings`)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-sm"
                    >
                      <Settings size={14} />
                      Manage
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm ml-auto"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTasks = () => {
    if (loading) return <div className="text-center py-10">Loading...</div>;
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold">Task Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Project</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Assigned To</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium">{task.title}</span>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.projectId?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.assignedTo?.name}</td>
                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        adminService.updateTask(task._id, { status: e.target.value })
                          .then(() => fetchAdminData())
                          .catch(() => setError('Failed to update task'));
                      }}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage users, projects, and tasks</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      ) : (
        activeSection === 'overview' && renderOverview()
      )}
      {activeSection === 'users' && renderUsers()}
      {activeSection === 'projects' && renderProjects()}
      {activeSection === 'tasks' && renderTasks()}
    </div>
  );
}