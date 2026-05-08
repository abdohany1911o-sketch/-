import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

import {
  Calendar,
  Trash2,
  FileText,
  GraduationCap,
  Clock,
  Search,
  LogOut,
  BookOpen
} from 'lucide-react';

import type { User, Booking } from '../types';

interface AdminDashboardProps {
  onCreateUser: () => void;
}

export default function AdminDashboard({ onCreateUser }: AdminDashboardProps) {

  const { currentUser, logout, getUsers, deleteUser } = useAuth();
  const { bookings, deleteBooking, getBookingCounts } = useBookings();

  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<'bookings' | 'users'>('bookings');
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});

  // تحميل المستخدمين
  useEffect(() => {
    const load = async () => {
      const data = await getUsers();
      setUsers(data.filter(u => u.role === 'user'));
    };
    load();
  }, [getUsers]);

  // تحديث الإحصائيات
  useEffect(() => {
    setCounts(getBookingCounts());
  }, [bookings, getBookingCounts]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredBookings = bookings.filter(b => {
    const matchDate = filterDate ? b.bookingDate === filterDate : true;
    const matchSearch =
      search
        ? (b.userName?.includes(search) || b.college?.includes(search))
        : true;

    return matchDate && matchSearch;
  });

  const stats = {
    total: bookings.length,
    today: bookings.filter(b =>
      b.bookingDate === new Date().toISOString().split('T')[0]
    ).length,
    fullDays: Object.values(counts).filter(c => c >= 10).length
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold">Eximq</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{currentUser?.name}</span>
            <button onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          </div>

        </div>
      </header>

      {/* STATS */}
      <main className="max-w-6xl mx-auto px-4 py-6">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">إجمالي الحجوزات</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">حجوزات اليوم</p>
            <p className="text-3xl font-bold">{stats.today}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">أيام ممتلئة</p>
            <p className="text-3xl font-bold">{stats.fullDays}</p>
          </div>

        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-4">
          <button onClick={() => setTab('bookings')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            الحجوزات
          </button>

          <button onClick={() => setTab('users')} className="px-4 py-2 bg-gray-200 rounded-lg">
            المستخدمين
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex gap-3 mb-4">
          <input
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th>الاسم</th>
                  <th>الكلية</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                  <th>حذف</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => (
                  <tr key={b.id} className="border-b">
                    <td>{b.userName}</td>
                    <td>{b.college}</td>
                    <td>{b.bookingDate}</td>
                    <td>{b.time}</td>
                    <td>
                      <button onClick={() => deleteBooking(b.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="bg-white rounded-xl shadow p-4">
            {users.map(u => (
              <div key={u.id} className="flex justify-between border-b py-2">
                <div>
                  <p>{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <button onClick={() => deleteUser(u.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}