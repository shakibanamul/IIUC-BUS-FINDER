import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, User, BusScheduleDB, Feedback, Notice } from '../lib/supabase';
import { 
  Shield, Users, Bus, MessageSquare, Bell, LogOut, Loader2, 
  Plus, Edit, Trash2, Search, Filter, Save, X, Eye 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'schedules' | 'feedback' | 'notices'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<BusScheduleDB[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch schedules
      const { data: schedulesData } = await supabase
        .from('bus_schedules')
        .select('*')
        .order('time', { ascending: true });
      
      // Fetch feedback with user info
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select(`
          *,
          user:users(name, university_id, email)
        `)
        .order('created_at', { ascending: false });
      
      // Fetch notices
      const { data: noticesData } = await supabase
        .from('notices')
        .select('*')
        .order('published_at', { ascending: false });

      setUsers(usersData || []);
      setSchedules(schedulesData || []);
      setFeedback(feedbackData || []);
      setNotices(noticesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (!error) {
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      const { error } = await supabase
        .from('bus_schedules')
        .delete()
        .eq('id', scheduleId);
      
      if (!error) {
        setSchedules(schedules.filter(s => s.id !== scheduleId));
      }
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', noticeId);
      
      if (!error) {
        setNotices(notices.filter(n => n.id !== noticeId));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.university_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchedules = schedules.filter(schedule =>
    schedule.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.starting_point.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedback = feedback.filter(item =>
    item.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img src="/iiuc.png" alt="IIUC" className="h-10 w-10" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">IIUC Bus System Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{userProfile?.name}</p>
                <p className="text-sm text-gray-600">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Control Panel</h2>
              <p className="text-purple-100">Manage users, schedules, and system settings</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{users.length}</div>
              <div className="text-xs text-purple-100">Total Users</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Bus className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{schedules.length}</div>
              <div className="text-xs text-purple-100">Bus Schedules</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <MessageSquare className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{feedback.length}</div>
              <div className="text-xs text-purple-100">Feedback</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Bell className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{notices.length}</div>
              <div className="text-xs text-purple-100">Notices</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { id: 'users', label: 'Users', icon: Users },
              { id: 'schedules', label: 'Bus Schedules', icon: Bus },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare },
              { id: 'notices', label: 'Notices', icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">User Management</h3>
                  <span className="text-sm text-gray-600">{filteredUsers.length} users</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Gender</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.university_id}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">{user.gender}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingItem(user)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Schedules Tab */}
            {activeTab === 'schedules' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Schedule Management</h3>
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-600">{filteredSchedules.length} schedules</span>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Schedule</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredSchedules.map((schedule) => (
                    <div key={schedule.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{schedule.time}</h4>
                          <p className="text-sm text-gray-600">{schedule.starting_point} → {schedule.end_point}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem(schedule)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{schedule.route}</p>
                      <div className="flex flex-wrap gap-2">
                        {schedule.gender && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {schedule.gender}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {schedule.schedule_type}
                        </span>
                        {schedule.bus_type && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {schedule.bus_type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">User Feedback</h3>
                  <span className="text-sm text-gray-600">{filteredFeedback.length} feedback items</span>
                </div>
                
                <div className="space-y-4">
                  {filteredFeedback.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.user?.name}</h4>
                          <p className="text-sm text-gray-600">{item.user?.university_id} • {item.user?.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notices Tab */}
            {activeTab === 'notices' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Notice Management</h3>
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-600">{filteredNotices.length} notices</span>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Notice</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredNotices.map((notice) => (
                    <div key={notice.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{notice.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <span className="text-xs text-gray-500">
                            {new Date(notice.published_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => setEditingItem(notice)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;