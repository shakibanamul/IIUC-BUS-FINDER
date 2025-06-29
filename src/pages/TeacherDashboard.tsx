import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, BusScheduleDB, User } from '../lib/supabase';
import { Bus, Users, GraduationCap, LogOut, Loader2, Search, Filter, Calendar, Clock, MapPin, BarChart3 } from 'lucide-react';
import BusCard from '../components/BusCard';
import TeacherAnalytics from '../components/TeacherAnalytics';
import { BusSchedule } from '../types/BusSchedule';

const TeacherDashboard: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'friday'>('all');
  const [activeTab, setActiveTab] = useState<'analytics' | 'schedules' | 'students'>('analytics');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all schedules (teachers can see all)
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('bus_schedules')
        .select('*')
        .order('time', { ascending: true });

      if (schedulesError) {
        console.error('Error fetching schedules:', schedulesError);
      } else {
        const convertedSchedules: BusSchedule[] = schedulesData.map(schedule => ({
          id: schedule.id,
          time: schedule.time,
          startingPoint: schedule.starting_point,
          route: schedule.route,
          endPoint: schedule.end_point,
          direction: schedule.direction as any,
          gender: schedule.gender as any,
          busType: schedule.bus_type,
          remarks: schedule.remarks,
          description: schedule.description,
          scheduleType: schedule.schedule_type as any,
        }));
        
        setSchedules(convertedSchedules);
      }

      // Fetch students data
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .order('name', { ascending: true });

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      } else {
        setStudents(studentsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = searchTerm === '' || 
      schedule.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.startingPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.endPoint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'regular' && schedule.scheduleType === 'Regular') ||
      (filterType === 'friday' && schedule.scheduleType === 'Friday');

    return matchesSearch && matchesFilter;
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.university_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

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
                  <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                  <p className="text-sm text-gray-600">IIUC Bus Schedule Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{userProfile?.name}</p>
                <p className="text-sm text-gray-600">{userProfile?.university_id}</p>
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
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome, {userProfile?.name}!</h2>
              <p className="text-green-100">
                Teacher/Staff • {userProfile?.university_id}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Bus className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{schedules.length}</div>
              <div className="text-xs text-green-100">Total Schedules</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{students.length}</div>
              <div className="text-xs text-green-100">Students</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{schedules.filter(s => s.scheduleType === 'Friday').length}</div>
              <div className="text-xs text-green-100">Friday Schedules</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">24/7</div>
              <div className="text-xs text-green-100">Access</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Smart Analytics</span>
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2 py-1 rounded-full">
                AI
              </span>
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'schedules'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Bus className="h-5 w-5" />
              <span>All Schedules</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {schedules.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'students'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Students</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {students.length}
              </span>
            </button>
          </div>

          <div className="p-6">
            {/* Smart Analytics Tab */}
            {activeTab === 'analytics' && (
              <TeacherAnalytics schedules={schedules} students={students} />
            )}

            {/* All Schedules Tab */}
            {activeTab === 'schedules' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search schedules..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="all">All Schedules</option>
                      <option value="regular">Regular Only</option>
                      <option value="friday">Friday Only</option>
                    </select>
                  </div>
                </div>

                {filteredSchedules.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredSchedules.map((schedule) => (
                      <BusCard key={schedule.id} schedule={schedule} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No schedules found</h4>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          student.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                        }`}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.university_id}</p>
                          <p className="text-xs text-gray-500">{student.gender} • {student.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No students found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;