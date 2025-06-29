import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, BusScheduleDB, Feedback, Complaint } from '../lib/supabase';
import { 
  GraduationCap, LogOut, Loader2, Search, Filter, Calendar, Clock, 
  MapPin, Bus, MessageSquare, AlertTriangle, Send, Star, CheckCircle,
  User, Mail, Phone, Edit, Save, X, Plus, FileText, TrendingUp,
  Navigation, Route, Users, Bell, Settings, Heart, Target
} from 'lucide-react';
import BusCard from '../components/BusCard';
import { BusSchedule } from '../types/BusSchedule';

const StudentDashboard: React.FC = () => {
  const { userProfile, signOut, updateProfile } = useAuth();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'friday'>('all');
  const [activeTab, setActiveTab] = useState<'schedules' | 'feedback' | 'complaints' | 'profile'>('schedules');
  
  // Feedback form
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  
  // Complaint form
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    category: 'other' as 'delay' | 'safety' | 'driver_behavior' | 'bus_condition' | 'route_issue' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    bus_route: '',
    incident_time: ''
  });
  const [complaintLoading, setComplaintLoading] = useState(false);
  
  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userProfile?.name || '',
    mobile: userProfile?.mobile || '',
    university_id: userProfile?.university_id || ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name,
        mobile: userProfile.mobile,
        university_id: userProfile.university_id
      });
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch schedules appropriate for student's gender
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('bus_schedules')
        .select('*')
        .or(`gender.is.null,gender.eq.${userProfile?.gender}`)
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

      // Fetch student's feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', userProfile?.id)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
      } else {
        setFeedback(feedbackData || []);
      }

      // Fetch student's complaints
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', userProfile?.id)
        .order('created_at', { ascending: false });

      if (complaintsError) {
        console.error('Error fetching complaints:', complaintsError);
      } else {
        setComplaints(complaintsData || []);
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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setFeedbackLoading(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          user_id: userProfile?.id,
          message: feedbackMessage
        }]);

      if (error) {
        console.error('Error submitting feedback:', error);
      } else {
        setFeedbackMessage('');
        setFeedbackSuccess('Thank you for your feedback! We appreciate your input.');
        fetchData(); // Refresh feedback list
        setTimeout(() => setFeedbackSuccess(''), 5000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.title.trim() || !complaintForm.description.trim()) return;

    setComplaintLoading(true);
    try {
      const { error } = await supabase
        .from('complaints')
        .insert([{
          user_id: userProfile?.id,
          title: complaintForm.title,
          description: complaintForm.description,
          category: complaintForm.category,
          priority: complaintForm.priority,
          bus_route: complaintForm.bus_route || null,
          incident_time: complaintForm.incident_time || null
        }]);

      if (error) {
        console.error('Error submitting complaint:', error);
      } else {
        setComplaintForm({
          title: '',
          description: '',
          category: 'other',
          priority: 'medium',
          bus_route: '',
          incident_time: ''
        });
        setShowComplaintForm(false);
        fetchData(); // Refresh complaints list
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setComplaintLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await updateProfile({
        name: profileForm.name,
        mobile: profileForm.mobile,
        university_id: profileForm.university_id
      });

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
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
                  <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                  <p className="text-sm text-gray-600">Your personalized IIUC bus portal</p>
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {userProfile?.name}!</h2>
              <p className="text-blue-100">
                {userProfile?.gender} Student • {userProfile?.university_id}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Bus className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{filteredSchedules.length}</div>
              <div className="text-xs text-blue-100">Available Routes</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <MessageSquare className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{feedback.length}</div>
              <div className="text-xs text-blue-100">Feedback Sent</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">{complaints.length}</div>
              <div className="text-xs text-blue-100">Complaints</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Star className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-bold">4.2</div>
              <div className="text-xs text-blue-100">Service Rating</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('schedules')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'schedules'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Bus className="h-5 w-5" />
              <span>My Schedules</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {filteredSchedules.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'feedback'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Feedback</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {feedback.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'complaints'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Complaints</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {complaints.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
          </div>

          <div className="p-6">
            {/* My Schedules Tab */}
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
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

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                {/* Submit Feedback Form */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Share Your Feedback</span>
                  </h3>
                  
                  {feedbackSuccess && (
                    <div className="mb-4 bg-green-100 border border-green-300 rounded-lg p-3 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-700 text-sm">{feedbackSuccess}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <textarea
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Tell us about your experience with IIUC bus services..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 resize-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={feedbackLoading || !feedbackMessage.trim()}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      {feedbackLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>Submit Feedback</span>
                    </button>
                  </form>
                </div>

                {/* Previous Feedback */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Your Previous Feedback</h4>
                  {feedback.length > 0 ? (
                    <div className="space-y-4">
                      {feedback.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-gray-500">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No feedback submitted yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Complaints Tab */}
            {activeTab === 'complaints' && (
              <div className="space-y-6">
                {/* Submit Complaint Button */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Your Complaints</h3>
                  <button
                    onClick={() => setShowComplaintForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Complaint</span>
                  </button>
                </div>

                {/* Complaint Form Modal */}
                {showComplaintForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-gray-900">Submit Complaint</h3>
                          <button
                            onClick={() => setShowComplaintForm(false)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <form onSubmit={handleComplaintSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Title *
                            </label>
                            <input
                              type="text"
                              value={complaintForm.title}
                              onChange={(e) => setComplaintForm({...complaintForm, title: e.target.value})}
                              placeholder="Brief description of the issue"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Category *
                            </label>
                            <select
                              value={complaintForm.category}
                              onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value as any})}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                              required
                            >
                              <option value="delay">Bus Delay</option>
                              <option value="safety">Safety Concern</option>
                              <option value="driver_behavior">Driver Behavior</option>
                              <option value="bus_condition">Bus Condition</option>
                              <option value="route_issue">Route Issue</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Priority
                            </label>
                            <select
                              value={complaintForm.priority}
                              onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value as any})}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Description *
                            </label>
                            <textarea
                              value={complaintForm.description}
                              onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                              placeholder="Detailed description of the issue..."
                              rows={4}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Bus Route (Optional)
                            </label>
                            <input
                              type="text"
                              value={complaintForm.bus_route}
                              onChange={(e) => setComplaintForm({...complaintForm, bus_route: e.target.value})}
                              placeholder="e.g., BOT to IIUC"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Incident Time (Optional)
                            </label>
                            <input
                              type="text"
                              value={complaintForm.incident_time}
                              onChange={(e) => setComplaintForm({...complaintForm, incident_time: e.target.value})}
                              placeholder="e.g., Today 7:30 AM"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                            />
                          </div>
                          
                          <div className="flex space-x-3 pt-4">
                            <button
                              type="button"
                              onClick={() => setShowComplaintForm(false)}
                              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={complaintLoading}
                              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                            >
                              {complaintLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                              <span>Submit</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* Complaints List */}
                {complaints.length > 0 ? (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <div key={complaint.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(complaint.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {complaint.status.replace('_', ' ')}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              complaint.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {complaint.priority}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{complaint.description}</p>
                        {complaint.bus_route && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Route:</strong> {complaint.bus_route}
                          </p>
                        )}
                        {complaint.incident_time && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Time:</strong> {complaint.incident_time}
                          </p>
                        )}
                        {complaint.admin_response && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Admin Response:</p>
                            <p className="text-sm text-blue-800">{complaint.admin_response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No complaints submitted</h4>
                    <p className="text-gray-500 mb-4">Submit a complaint if you experience any issues.</p>
                    <button
                      onClick={() => setShowComplaintForm(true)}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      Submit First Complaint
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-500 rounded-full p-4">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">Profile Information</h3>
                        <p className="text-blue-700">Manage your account details</p>
                      </div>
                    </div>
                    
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-2">
                          University ID
                        </label>
                        <input
                          type="text"
                          value={profileForm.university_id}
                          onChange={(e) => setProfileForm({...profileForm, university_id: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-2">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={profileForm.mobile}
                          onChange={(e) => setProfileForm({...profileForm, mobile: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            Full Name
                          </label>
                          <p className="text-blue-800">{userProfile?.name}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            Email Address
                          </label>
                          <p className="text-blue-800 flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{userProfile?.email}</span>
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            University ID
                          </label>
                          <p className="text-blue-800">{userProfile?.university_id}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            Mobile Number
                          </label>
                          <p className="text-blue-800 flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{userProfile?.mobile}</span>
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            Gender
                          </label>
                          <p className="text-blue-800">{userProfile?.gender}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            Account Type
                          </label>
                          <p className="text-blue-800 capitalize">{userProfile?.role}</p>
                        </div>
                      </div>
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

export default StudentDashboard;