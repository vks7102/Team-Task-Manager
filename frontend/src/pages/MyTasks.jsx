import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/index';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import { ClipboardList, ArrowLeft } from 'lucide-react';

export default function MyTasks() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const projectsRes = await projectService.getProjects();
      const projectsData = projectsRes.data || [];
      const allTasks = [];
      for (const project of projectsData) {
        const tasksRes = await taskService.getProjectTasks(project._id);
        allTasks.push(...(tasksRes.data || []));
      }
      const myTasks = allTasks.filter(t => {
        const id = typeof t.assignedTo === 'object' ? t.assignedTo?._id : t.assignedTo;
        return id === user?._id;
      });
      setTasks(myTasks);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <ClipboardList size={32} className="text-blue-600" />
            <h1 className="text-4xl font-bold">My Tasks</h1>
          </div>
          <p className="text-gray-500 mt-1">Tasks assigned to you across all projects</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      <div className="card">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No tasks assigned to you</p>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} onUpdate={loadTasks} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
