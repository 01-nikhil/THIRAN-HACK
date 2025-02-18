import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  History,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/receivers/dashboard' },
  { id: 'new-request', icon: PlusCircle, label: 'New Request', path: '/receivers/new-request' },
  { id: 'pre-request', icon: Clock, label: 'Pre Requests', path: '/receivers/pre-request' },
  { id: 'history', icon: History, label: 'Special Events', path: '/receivers/special-event' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', path: '/receivers/help' },
];

const ReceiverSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-green-00 border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">Oru Soru</h1>
        <p className="text-sm text-gray-500">Receiver Dashboard</p>
      </div>

      <nav className="flex-1">
        {navigation.map(({ id, icon: Icon, label, path }) => (
          <Link
            key={id}
            to={path}
            className={`w-full flex items-center px-6 py-3 text-left ${
              location.pathname === path
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/logout"
          className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default ReceiverSidebar;