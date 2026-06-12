import { useState, useContext } from 'react';
import { taskService } from '../services/index';
import { AuthContext } from '../context/AuthContext';

export default function TaskCard({ task, onUpdate }) {
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  const assignedId = typeof task.assignedTo === 'object' ? task.assignedTo?._id : task.assignedTo;
  const projectAdminId = typeof task.projectId === 'object' ? task.projectId?.admin : null;
  const canEdit = user && (user.role === 'Admin' || assignedId === user._id || projectAdminId === user._id);

  const handleStatusChange = async (newStatus) => {
    if (!canEdit) return;
    setIsUpdating(true);
    try {
      await taskService.updateTaskStatus(task._id, newStatus);
      onUpdate();
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h4 className="font-semibold mb-2 truncate">{task.title}</h4>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

      <div className="text-xs text-gray-400 mb-2">
        Project: {typeof task.projectId === 'object' ? task.projectId?.name : task.projectId}
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>

      {task.assignedTo && (
        <div className="text-xs text-gray-600 mb-3">
          Assigned to: {task.assignedTo.name}
        </div>
      )}

      <div className="flex gap-2">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating || !canEdit}
          className="text-xs px-2 py-1 border rounded cursor-pointer disabled:opacity-50"
          title={!canEdit ? 'Only the assigned person or an admin can change status' : ''}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        {!canEdit && (
          <span className="text-xs text-gray-400 italic">read-only</span>
        )}
      </div>
    </div>
  );
}
