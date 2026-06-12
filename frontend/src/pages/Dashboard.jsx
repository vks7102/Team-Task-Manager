import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService, dashboardService } from '../services/index';
import StatCard from '../components/StatCard';
import TaskBoard from '../components/TaskBoard';
import TaskCard from '../components/TaskCard';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const assignedTasks = tasks.filter(t => {
    const id = typeof t.assignedTo === 'object' ? t.assignedTo?._id : t.assignedTo;
    return id === user?._id;
  });

  const loadTasks = async () => {
    try {
      const projectsRes = await projectService.getProjects();
      const projectsData = projectsRes.data || [];
      setProjects(projectsData);

      if (projectId) {
        const response = await dashboardService.getStats(projectId);
        setStats(response.data);
      } else {
        const allTasks = [];
        for (const project of projectsData) {
          const tasksRes = await taskService.getProjectTasks(project._id);
          allTasks.push(...(tasksRes.data || []));
        }
        setTasks(allTasks);
        const myTasks = allTasks.filter(t => {
          const id = typeof t.assignedTo === 'object' ? t.assignedTo?._id : t.assignedTo;
          return id === user?._id;
        });
        const totalTasks = myTasks.length;
        const todo = myTasks.filter(t => t.status === 'To Do').length;
        const inProgress = myTasks.filter(t => t.status === 'In Progress').length;
        const done = myTasks.filter(t => t.status === 'Done').length;
        const now = new Date();
        const overdue = myTasks.filter(t => 
          new Date(t.dueDate) < now && t.status !== 'Done'
        ).length;
        setStats({ totalTasks, todo, inProgress, done, overdue });
      }
    } catch (err) {
      setError('Failed to load dashboard');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadTasks();
      setLoading(false);
    };
    fetchData();
  }, [projectId]);

  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your task overview</p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          View Projects
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Tasks" value={stats?.totalTasks || 0} color="bg-blue-500" />
        <StatCard title="To Do" value={stats?.todo || 0} color="bg-gray-500" />
        <StatCard title="In Progress" value={stats?.inProgress || 0} color="bg-yellow-500" />
        <StatCard title="Done" value={stats?.done || 0} color="bg-green-500" />
        <StatCard title="Overdue" value={stats?.overdue || 0} color="bg-red-500" />
      </div>

      {/* Tasks Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        {assignedTasks.length === 0 ? (
          <div className="text-center py-12">
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
            {assignedTasks.map(task => (
              <TaskCard key={task._id} task={task} onUpdate={loadTasks} />
            ))}
          </div>
        )}
      </div>

      {/* Task Board if in project view */}
      {projectId && (
        <div className="card">
          <TaskBoard projectId={projectId} />
        </div>
      )}
    </div>
  );
}
