import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Joined</label>
            <input
              type="text"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
