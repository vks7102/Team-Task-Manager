import Task from '../models/Task.js';
import Activity from '../models/Activity.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId });
    
    const totalTasks = tasks.length;
    const todo = tasks.filter(t => t.status === 'To Do').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const done = tasks.filter(t => t.status === 'Done').length;
    
    const now = new Date();
    const overdue = tasks.filter(t => 
      new Date(t.dueDate) < now && t.status !== 'Done'
    ).length;

    res.json({
      totalTasks,
      todo,
      inProgress,
      done,
      overdue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivity = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const activities = await Activity.find({ projectId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
