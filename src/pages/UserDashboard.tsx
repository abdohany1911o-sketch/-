import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import CalendarBooking from './CalendarBooking';
import {
  Calendar, LogOut, GraduationCap, Clock,
  CheckCircle, Trash2, BookOpen, Plus, KeyRound, Eye, EyeOff
} from 'lucide-react';
import type { Booking } from '../types';

const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','12:00','12:30','13:00','13:30',
  
];

export default function UserDashboard() {
  const { currentUser, logout, updatePassword } = useAuth();
  const { bookings, deleteBooking } = useBookings();
  const navigate = useNavigate();

  const [step, setStep] = useState<'form' | 'calendar'>('form');
  const [showForm, setShowForm] = useState(false);
  const [examDate, setExamDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const userBookings = bookings.filter((b: Booking) => b.userId === currentUser?.id);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdError('جميع الحقول مطلوبة');
      return;
    }
    if (oldPassword !== currentUser?.password) {
      setPwdError('كلمة المرور الحالية غير صحيحة');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('كلمتا المرور الجديدة غير متطابقتين');
      return;
    }
    if (newPassword.length < 4) {
      setPwdError('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
      return;
    }
    const result = updatePassword(currentUser!.id, newPassword);
    if (result) {
      setPwdSuccess('تم تغيير كلمة المرور بنجاح');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowChangePassword(false), 1500);
    } else {
      setPwdError('حدث خطأ أثناء تغيير كلمة المرور');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!examDate) { setError('اختر تاريخ الامتحان'); return; }
    if (!time) { setError('اختر الوقت'); return; }
    setStep('calendar');
  };

  const handleBookingDone = () => {
    setStep('form');
    setShowForm(false);
    setExamDate('');
    setTime('');
  };

  if (step === 'calendar' && examDate && time) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">Eximq</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium text-sm">{currentUser?.college}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700 text-sm">{currentUser?.name}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">مستخدم</span>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </header>
        <main className="py-6">
          <CalendarBooking
            examDate={examDate}
            time={time}
            userId={currentUser!.id}
            userName={currentUser!.name}
            college={currentUser!.college}
            onConfirm={handleBookingDone}
            onBack={() => setStep('form')}
          />
        </main>
      </div>
    );
  }

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
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">مستخدم</span>
            </div>
            <button onClick={() => setShowChangePassword(true)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="تغيير كلمة المرور">
              <KeyRound className="w-5 h-5 text-blue-600" />
            </button>
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
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-auto">مستخدم</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الحجوزات</p>
              <p className="text-3xl font-bold text-gray-800">{userBookings.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">القادمة</p>
              <p className="text-3xl font-bold text-gray-800">{userBookings.filter((b: Booking) => new Date(b.examDate) >= new Date()).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المنتهية</p>
              <p className="text-3xl font-bold text-gray-800">{userBookings.filter((b: Booking) => new Date(b.examDate) < new Date()).length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Change Password */}
        {showChangePassword && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                تغيير كلمة المرور
              </h3>
              <button onClick={() => setShowChangePassword(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {pwdError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{pwdError}</div>}
            {pwdSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{pwdSuccess}</div>}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الحالية</label>
                <div className="relative">
                  <input type={showOld ? 'text' : 'password'} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="أدخل كلمة المرور الحالية" required />
                  <button type="button" onClick={() => setShowOld(!showOld)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الجديدة</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="أدخل كلمة المرور الجديدة" required />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تأكيد كلمة المرور الجديدة</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="أعد إدخال كلمة المرور الجديدة" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md">
                <KeyRound className="w-5 h-5" />
                حفظ التغيير
              </button>
            </form>
          </div>
        )}

        {/* Booking Form - Step 1 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">حجوزاتي</h2>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md">
              {showForm ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'إلغاء' : 'حجز موعد'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-4">حجز موعد جديد - الخطوة 1</h3>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
              <form onSubmit={handleSaveForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ الامتحان</label>
                  <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الوقت</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                    <option value="">اختر الوقت</option>
                    {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-800"><span className="font-semibold">الاسم:</span> {currentUser?.name}</p>
                  <p className="text-sm text-blue-800"><span className="font-semibold">الكلية:</span> {currentUser?.college}</p>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md">
                  <Calendar className="w-5 h-5" />
                  حفظ واختر موعد الحجز
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">تاريخ الامتحان</th>
                  <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">تاريخ الحجز</th>
                  <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الوقت</th>
                  <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الكلية</th>
                  <th className="text-right text-gray-500 font-medium py-3 px-4 text-sm">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {userBookings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-12">لا توجد حجوزات</td></tr>
                ) : userBookings.map((b: Booking) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-800 font-medium text-sm">{b.examDate}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{b.bookingDate}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{b.time}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs">
                        <GraduationCap className="w-3 h-3" />{b.college}
                      </span>
                    </td>
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
      </main>
    </div>
  );
}
