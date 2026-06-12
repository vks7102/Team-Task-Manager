import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/index';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus } from 'lucide-react';
import ActivityLog from '../components/ActivityLog';

export default function ProjectSettings() {
  const { user } = useContext(AuthContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await projectService.getProjectById(projectId);
      const projectData = response.data;
      if (user?.role !== 'Admin' && projectData.admin._id !== user?._id) {
        navigate('/projects', { replace: true });
        return;
      }
      setProject(projectData);
    } catch (err) {
      setError('Failed to load project settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectService.addMember(projectId, newMemberId);
      setSuccess('Member added successfully');
      setNewMemberId('');
      setShowAddMember(false);
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await projectService.removeMember(projectId, userId);
        setSuccess('Member removed successfully');
        fetchProject();
      } catch (err) {
        setError('Failed to remove member');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure? This will permanently delete the project and all its tasks.')) {
      try {
        await projectService.deleteProject(projectId);
        navigate('/projects');
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!project) return <div className="text-center py-10 text-red-600">Project not found</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Project Settings</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">{success}</div>}

      {/* Project Info */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
        <p className="text-gray-600 mb-6">{project.description}</p>
        <div className="text-sm text-gray-500">
          Admin: <span className="font-semibold">{project.admin?.name || 'Unknown'}</span>
        </div>
      </div>

      {/* Members Management */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Team Members</h3>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="flex items-center gap-2 btn-primary"
          >
            <Plus size={18} />
            {showAddMember ? 'Cancel' : 'Add Member'}
          </button>
        </div>

        {showAddMember && (
          <form onSubmit={handleAddMember} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <input
              type="email"
              placeholder="Member email"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-3"
              required
            />
            <button type="submit" className="btn-primary">Add Member</button>
          </form>
        )}

        <div className="space-y-3">
          {project.members && project.members.length > 0 ? (
            project.members.map(member => (
              <div key={member._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                {project.admin._id !== member._id && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Remove member"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No members yet</p>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-red-200">
        <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
        <button
          onClick={handleDeleteProject}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete Project
        </button>
        <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
      </div>

      {/* Activity Log */}
      <div className="card">
        <ActivityLog projectId={projectId} />
      </div>
    </div>
  );
}
