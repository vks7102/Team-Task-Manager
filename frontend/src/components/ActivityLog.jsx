import { useState, useEffect } from 'react';
import { dashboardService } from '../services/index';

export default function ActivityLog({ projectId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivities();
  }, [projectId]);

  const fetchActivities = async () => {
    try {
      const response = await dashboardService.getActivity(projectId);
      setActivities(response.data || []);
    } catch (err) {
      setError('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading activity...</div>;
  if (error) return <div className="text-red-600 py-4">{error}</div>;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg">Activity Log</h3>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 py-4 text-center">No activities yet</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <div
              key={activity._id || index}
              className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-800">{activity.action}</p>
                <span className="text-xs text-gray-500">
                  {activity.userId?.name && `by ${activity.userId.name}`}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={fetchActivities}
        className="text-sm text-blue-600 hover:text-blue-800 mt-3"
      >
        Refresh Activity Log
      </button>
    </div>
  );
}
