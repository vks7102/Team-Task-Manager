import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/index';
import { AuthContext } from '../context/AuthContext';
import { Settings } from 'lucide-react';
import TaskCard from '../components/TaskCard';

export default function ProjectDetail() {
  const { user } = useContext(AuthContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: '',
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getProjectTasks(projectId),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Failed to fetch project details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask({
        ...formData,
        projectId,
      });
      setFormData({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      setShowTaskForm(false);
      fetchProjectDetails();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!project) return <div className="text-center py-10 text-red-600">Project not found</div>;

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          {(user?.role === 'Admin' || project.admin._id === user?._id) && (
            <button
              onClick={() => navigate(`/project/${projectId}/settings`)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              title="Project Settings"
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          )}
        </div>
        
        <div className="card">
          <h3 className="font-bold mb-4">Members ({project.members?.length || 0})</h3>
          <div className="flex flex-wrap gap-4">
            {project.members?.map(member => (
              <div key={member._id} className="bg-blue-50 px-3 py-2 rounded">
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="btn-primary"
        >
          {showTaskForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {showTaskForm && (
        <form onSubmit={handleCreateTask} className="card mb-6">
          <input
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded mb-3"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded mb-3"
          />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-4 py-2 border rounded"
              required
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="px-4 py-2 border rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full px-4 py-2 border rounded mb-3"
            required
          >
            <option value="">Select assignee</option>
            {project.members?.map(member => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Create Task</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onUpdate={fetchProjectDetails} />
        ))}
      </div>
    </div>
  );
}
