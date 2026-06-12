import Project from '../models/Project.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import { sendEmail } from '../config/mailer.js';

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id],
    });

    await Activity.create({
      userId: req.user.id,
      projectId: project._id,
      action: `${req.user.name || 'User'} created project "${name}"`,
    });

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    }).populate('admin', 'name email').populate('members', 'name email');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member (admins bypass this check)
    if (req.user.role !== 'Admin' && !project.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin (site admins bypass)
    if (req.user.role !== 'Admin' && project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    if (project.members.some(m => m.toString() === user._id.toString())) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(user._id);
    await project.save();

    await Activity.create({
      userId: req.user.id,
      projectId: project._id,
      action: `${req.user.name || 'Admin'} added ${user.name} to the project`,
    });

    const updatedProject = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    res.json({
      message: 'Member added successfully',
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin (site admins bypass)
    if (req.user.role !== 'Admin' && project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can remove members' });
    }

    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();

    await Activity.create({
      userId: req.user.id,
      projectId: project._id,
      action: `${req.user.name || 'Admin'} removed a member`,
    });

    res.json({
      message: 'Member removed successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'Admin' && project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only admin can delete project' });
    }

    await Project.deleteOne({ _id: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
