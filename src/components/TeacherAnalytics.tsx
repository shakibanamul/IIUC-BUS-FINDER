import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Users, Clock, MapPin, Calendar, 
  AlertTriangle, CheckCircle, Bus, Route, Filter, Download,
  Eye, Edit, Plus, Bell, MessageSquare, Zap, Target,
  PieChart, Activity, Settings, RefreshCw
} from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';
import { User } from '../lib/supabase';

interface TeacherAnalyticsProps {
  schedules: BusSchedule[];
  students: User[];
}

const TeacherAnalytics: React.FC<TeacherAnalyticsProps> = ({ schedules, students }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedules' | 'students' | 'analytics'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalSchedules = schedules.length;
    const regularSchedules = schedules.filter(s => s.scheduleType === 'Regular').length;
    const fridaySchedules = schedules.filter(s => s.scheduleType === 'Friday').length;
    
    const maleStudents = students.filter(s => s.gender === 'Male').length;
    const femaleStudents = students.filter(s => s.gender === 'Female').length;
    
    const morningSchedules = schedules.filter(s => {
      const hour = parseInt(s.time.split(':')[0]);
      return hour >= 6 && hour <= 10;
    }).length;
    
    const afternoonSchedules = schedules.filter(s => {
      const hour = parseInt(s.time.split(':')[0]);
      return hour >= 11 && hour <= 18;
    }).length;

    // Route analysis
    const routeFrequency = schedules.reduce((acc, schedule) => {
      const key = schedule.startingPoint;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topRoutes = Object.entries(routeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Gender distribution in schedules
    const maleSchedules = schedules.filter(s => s.gender === 'Male').length;
    const femaleSchedules = schedules.filter(s => s.gender === 'Female').length;
    const generalSchedules = schedules.filter(s => !s.gender).length;

    return {
      totalSchedules,
      regularSchedules,
      fridaySchedules,
      maleStudents,
      femaleStudents,
      morningSchedules,
      afternoonSchedules,
      topRoutes,
      maleSchedules,
      femaleSchedules,
      generalSchedules
    };
  }, [schedules, students]);

  // Quick actions for teachers
  const quickActions = [
    {
      title: 'Add New Schedule',
      description: 'Create a new bus schedule',
      icon: Plus,
      color: 'blue',
      action: () => console.log('Add schedule')
    },
    {
      title: 'Send Announcement',
      description: 'Notify students about changes',
      icon: Bell,
      color: 'orange',
      action: () => console.log('Send announcement')
    },
    {
      title: 'View Feedback',
      description: 'Check student feedback',
      icon: MessageSquare,
      color: 'green',
      action: () => console.log('View feedback')
    },
    {
      title: 'Generate Report',
      description: 'Export analytics data',
      icon: Download,
      color: 'purple',
      action: () => console.log('Generate report')
    }
  ];

  // Schedule optimization suggestions
  const optimizationSuggestions = [
    {
      type: 'warning',
      title: 'Peak Hour Congestion',
      description: 'Consider adding more buses between 7:00-8:00 AM',
      impact: 'High',
      icon: AlertTriangle
    },
    {
      type: 'success',
      title: 'Efficient Friday Schedule',
      description: 'Friday AC bus utilization is optimal',
      impact: 'Medium',
      icon: CheckCircle
    },
    {
      type: 'info',
      title: 'Route Optimization',
      description: 'BOT route has highest demand - consider frequency increase',
      impact: 'Medium',
      icon: Route
    }
  ];

  const filteredStudents = useMemo(() => {
    if (filterGender === 'all') return students;
    return students.filter(s => s.gender.toLowerCase() === filterGender);
  }, [students, filterGender]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Smart Analytics & Management</h3>
              <p className="text-emerald-100 text-sm">Comprehensive insights and schedule optimization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white/50"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'schedules', label: 'Schedule Management', icon: Calendar },
          { id: 'students', label: 'Student Analytics', icon: Users },
          { id: 'analytics', label: 'Performance', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
              activeTab === tab.id
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Schedules</p>
                    <p className="text-2xl font-bold text-blue-900">{analytics.totalSchedules}</p>
                  </div>
                  <Bus className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 text-sm font-medium">Total Students</p>
                    <p className="text-2xl font-bold text-emerald-900">{students.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Morning Routes</p>
                    <p className="text-2xl font-bold text-orange-900">{analytics.morningSchedules}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Friday Special</p>
                    <p className="text-2xl font-bold text-purple-900">{analytics.fridaySchedules}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Quick Actions</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`p-4 rounded-xl border-2 border-dashed transition-all hover:scale-105 hover:shadow-lg ${
                      action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                      action.color === 'orange' ? 'border-orange-300 hover:border-orange-500 hover:bg-orange-50' :
                      action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                      'border-purple-300 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    <action.icon className={`h-8 w-8 mx-auto mb-2 ${
                      action.color === 'blue' ? 'text-blue-500' :
                      action.color === 'orange' ? 'text-orange-500' :
                      action.color === 'green' ? 'text-green-500' :
                      'text-purple-500'
                    }`} />
                    <h5 className="font-semibold text-gray-900 text-sm">{action.title}</h5>
                    <p className="text-gray-600 text-xs mt-1">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Optimization Suggestions */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-red-500" />
                <span>Smart Recommendations</span>
              </h4>
              <div className="space-y-3">
                {optimizationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-l-4 ${
                      suggestion.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      suggestion.type === 'success' ? 'bg-green-50 border-green-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <suggestion.icon className={`h-5 w-5 mt-0.5 ${
                        suggestion.type === 'warning' ? 'text-yellow-600' :
                        suggestion.type === 'success' ? 'text-green-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900">{suggestion.title}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            suggestion.impact === 'High' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {suggestion.impact} Impact
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Management Tab */}
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900">Schedule Management</h4>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Schedule</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Schedule Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-4">Schedule Distribution</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Regular Schedules</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(analytics.regularSchedules / analytics.totalSchedules) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{analytics.regularSchedules}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Friday Schedules</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(analytics.fridaySchedules / analytics.totalSchedules) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{analytics.fridaySchedules}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-4">Top Routes</h5>
                <div className="space-y-2">
                  {analytics.topRoutes.map(([route, count], index) => (
                    <div key={route} className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">{route}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...analytics.topRoutes.map(([,c]) => c))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-6 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Schedules */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h5 className="font-semibold text-gray-900 mb-4">Recent Schedule Changes</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Added new BOT route</p>
                      <p className="text-sm text-gray-600">7:30 AM - For female students</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Updated Friday AC schedule</p>
                      <p className="text-sm text-gray-600">Modified teacher timings</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Analytics Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900">Student Analytics</h4>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Students</option>
                <option value="male">Male Students</option>
                <option value="female">Female Students</option>
              </select>
            </div>

            {/* Student Distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Male Students</p>
                    <p className="text-2xl font-bold text-blue-900">{analytics.maleStudents}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-600 text-sm font-medium">Female Students</p>
                    <p className="text-2xl font-bold text-pink-900">{analytics.femaleStudents}</p>
                  </div>
                  <Users className="h-8 w-8 text-pink-500" />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Active</p>
                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h5 className="font-semibold text-gray-900">Student Directory ({filteredStudents.length})</h5>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        student.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.university_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.gender === 'Male' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {student.gender}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900">Performance Analytics</h4>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  <span>Schedule Efficiency</span>
                </h5>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Morning Peak Utilization</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Afternoon Coverage</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Friday Special Efficiency</span>
                      <span className="font-medium">91%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Usage Trends</span>
                </h5>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Peak Usage Time</span>
                    <span className="font-semibold text-blue-600">7:00 - 8:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Most Popular Route</span>
                    <span className="font-semibold text-blue-600">BOT → IIUC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Wait Time</span>
                    <span className="font-semibold text-blue-600">12 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Student Satisfaction</span>
                    <span className="font-semibold text-green-600">4.2/5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h5 className="font-semibold text-gray-900 mb-4">Detailed Performance Report</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">94%</div>
                  <div className="text-sm text-gray-600">On-time Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-gray-600">Daily Passengers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">15.2</div>
                  <div className="text-sm text-gray-600">Avg Trip Duration (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">98.5%</div>
                  <div className="text-sm text-gray-600">Service Reliability</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAnalytics;