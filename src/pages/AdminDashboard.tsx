import { useState, useEffect } from 'react';
import logo from "../assets/logo.png";
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, Trash2, FileText, GraduationCap,
  Clock, Search, LogOut, BookOpen, Plus, XCircle
} from 'lucide-react';
import type { User, Booking } from '../types';

interface AdminDashboardProps {
  onCreateUser: () => void;
}

export default function AdminDashboard({ onCreateUser }: AdminDashboardProps) {
  const { currentUser, logout, getUsers, deleteUser } = useAuth();
  const { bookings, deleteBooking, getBookingCounts } = useBookings();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'bookings' | 'users'>('bookings');
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => { setCounts(getBookingCounts()); }, [bookings, getBookingCounts]);

  const users = getUsers().filter((u: User) => u.role === 'user');
  const filteredBookings = bookings.filter((b: Booking) => {
    const matchDate = filterDate ? b.bookingDate === filterDate : true;
    const matchSearch = search ? (b.userName.includes(search) || b.college.includes(search)) : true;
    return matchDate && matchSearch;
  });

  const stats = {
    total: bookings.length,
    today: bookings.filter((b: Booking) => b.bookingDate === new Date().toISOString().split('T')[0]).length,
    fullDays: Object.values(counts).filter((c: number) => c >= 10).length,
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const fullDays = Object.entries(counts).filter(([_, c]) => c >= 10).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Eximq</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">{currentUser?.college}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700 text-sm">{currentUser?.name}</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">مدير</span>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
        {/* Mobile */}
        <div className="sm:hidden bg-blue-50 border-t border-blue-100 px-4 py-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">{currentUser?.college}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-700 text-sm">{currentUser?.name}</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mr-auto">مدير</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الحجوزات</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">حجوزات اليوم</p>
              <p className="text-3xl font-bold text-gray-800">{stats.today}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">أيام ملئة</p>
              <p className="text-3xl font-bold text-gray-800">{stats.fullDays}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('bookings')} className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${tab==='bookings'?'bg-blue-600 text-white shadow-md':'bg-white text-gray-600 hover:bg-gray-50'}`}>الحجوزات</button>
          <button onClick={() => setTab('users')} className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${tab==='users'?'bg-blue-600 text-white shadow-md':'bg-white text-gray-600 hover:bg-gray-50'}`}>المستخدمين</button>
          <button onClick={onCreateUser} className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all bg-green-600 text-white hover:bg-green-700 shadow-md flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" />
            إضافة مستخدم
          </button>
        </div>

        {/* Full days */}
        {fullDays.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <h3 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              أيام ملئة (كاملة)
            </h3>
            <div className="flex flex-wrap gap-2">
              {fullDays.map(([date, c]) => (
                <span key={date} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm">{date} ({c})</span>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tab==='bookings'?'البحث في الحجوزات...':'البحث في المستخدمين...'} className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {tab === 'bookings' && (
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            )}
          </div>
        </div>

        {/* Bookings */}
        {tab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">المستخدم</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الكلية</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">تاريخ الامتحان</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">تاريخ الحجز</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الوقت</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-gray-400 py-12">لا توجد حجوزات</td></tr>
                  ) : filteredBookings.map((b: Booking) => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-xs">{b.userName.charAt(0)}</span>
                          </div>
                          <span className="text-gray-800 font-medium text-sm">{b.userName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs">
                          <GraduationCap className="w-3 h-3" />{b.college}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{b.examDate}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{b.bookingDate}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{b.time}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => { if(confirm('حذف الحجز؟')) deleteBooking(b.id); }} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الاسم</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">البريد</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الكلية</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الحجوزات</th>
                    <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-gray-400 py-12">لا يوجد مستخدمين</td></tr>
                  ) : users.map((user: User) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-medium text-xs">{user.name.charAt(0)}</span>
                          </div>
                          <span className="text-gray-800 font-medium text-sm">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs">
                          <GraduationCap className="w-3 h-3" />{user.college}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{bookings.filter((b: Booking) => b.userId === user.id).length}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => { if(confirm('حذف المستخدم وجميع حجوزاته؟')) deleteUser(user.id); }} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
