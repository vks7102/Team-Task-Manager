import { useState, useEffect } from 'react';
import { taskService } from '../services/index';
import TaskCard from './TaskCard';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getProjectTasks(projectId);
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading tasks...</div>;

  const columns = {
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done'),
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <div key={status} className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-4">{status}</h3>
            <div className="space-y-3">
              {columnTasks.map(task => (
                <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
              ))}
              {columnTasks.length === 0 && (
                <p className="text-gray-500 text-center py-8">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
