import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, LogOut, Home, FolderOpen, User, X, Shield, BarChart3, Users, CheckSquare, ListTodo } from 'lucide-react';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [];

  if (user?.role === 'Admin') {
    menuItems.push(
      { icon: <BarChart3 size={20} />, label: 'Overview', path: '/admin' },
      { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
      { icon: <FolderOpen size={20} />, label: 'Projects', path: '/admin/projects' },
      { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/admin/tasks' },
      { icon: <User size={20} />, label: 'Profile', path: '/profile' }
    );
  } else {
    menuItems.push(
      { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
      { icon: <ListTodo size={20} />, label: 'Tasks', path: '/tasks' },
      { icon: <FolderOpen size={20} />, label: 'Projects', path: '/projects' },
      { icon: <User size={20} />, label: 'Profile', path: '/profile' }
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-gray-900 text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl transition-transform flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative z-30`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <p className="text-gray-400 text-xs mt-1">Team Collaboration</p>
        </div>

        {user && (
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-400">Welcome back</p>
                <p className="font-semibold truncate text-sm">{user.name}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-gray-700 text-gray-200'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition font-semibold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
