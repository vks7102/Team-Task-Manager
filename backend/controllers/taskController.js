import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, projectId, assignedTo } = req.body;

    if (!title || !dueDate || !projectId || !assignedTo) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority: priority || 'Medium',
      projectId,
      assignedTo,
      createdBy: req.user.id,
    });

    await Activity.create({
      userId: req.user.id,
      projectId,
      action: `${req.user.name || 'User'} created task "${title}"`,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name admin');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAdmin = req.user.role === 'Admin';
    const isAssigned = task.assignedTo && task.assignedTo._id.toString() === req.user.id;

    const project = await Project.findById(task.projectId);
    const isProjectCreator = project && project.admin.toString() === req.user.id;

    if (!isAdmin && !isAssigned && !isProjectCreator) {
      return res.status(403).json({ message: 'You are not authorized to update this task' });
    }

    task.status = status;
    task.updatedAt = Date.now();
    await task.save();

    await Activity.create({
      userId: req.user.id,
      projectId: task.projectId,
      action: `${req.user.name || 'User'} updated task status to "${status}"`,
    });

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name admin');

    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, priority, assignedTo, updatedAt: Date.now() },
      { new: true }
    ).populate('assignedTo', 'name email').populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });

    await Activity.create({
      userId: req.user.id,
      projectId: task.projectId,
      action: `${req.user.name || 'User'} deleted task "${task.title}"`,
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
