import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CalendarDays, CheckCircle, ArrowRight } from 'lucide-react';
import { useBookings } from '../context/BookingContext';

interface Props {
  examDate: string;
  time: string;
  userId: string;
  userName: string;
  college: string;
  onConfirm: (bookingDate: string) => void;
  onBack: () => void;
}

const MAX_PER_DAY = 10;

export default function CalendarBooking({ examDate, time, userId, userName, college, onConfirm, onBack }: Props) {
  const { getBookingCounts, addBooking } = useBookings();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { setCounts(getBookingCounts()); }, []);

  // Max booking date = examDate - 2 days (48 hours before)
  const exam = new Date(examDate);
  const maxBookingDate = new Date(exam);
  maxBookingDate.setDate(maxBookingDate.getDate() - 2);
  const maxDateStr = maxBookingDate.toISOString().split('T')[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDay.getDay();
    const days: { date: number; fullDate: string; isCurrentMonth: boolean }[] = [];

    const prevLast = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevLast - i);
      days.push({ date: prevLast - i, fullDate: d.toISOString().split('T')[0], isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: i, fullDate: d.toISOString().split('T')[0], isCurrentMonth: true });
    }
    const rem = 42 - days.length;
    for (let i = 1; i <= rem; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: i, fullDate: d.toISOString().split('T')[0], isCurrentMonth: false });
    }
    return days;
  }, [currentMonth]);

  const isAvailable = (dateStr: string) => {
    if (!dateStr) return false;
    const count = counts[dateStr] || 0;
    return dateStr >= todayStr && dateStr <= maxDateStr && count < MAX_PER_DAY;
  };

  const getStatus = (dateStr: string) => {
    const count = counts[dateStr] || 0;
    if (count >= MAX_PER_DAY) return 'full';
    if (count >= 7) return 'almost';
    if (count > 0) return 'some';
    return 'empty';
  };

  const handleConfirm = () => {
    if (!selectedDate) return;
    setLoading(true);
    addBooking({
      userId,
      userName,
      college,
      examDate,
      bookingDate: selectedDate,
      time,
    });
    setDone(true);
    setLoading(false);
  };

  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const dayNames = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

  if (done) {
    return (
      <div className="max-w-lg mx-auto p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الحجز بنجاح!</h2>
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-right space-y-1">
            <p className="text-blue-800 text-sm"><span className="font-semibold">تاريخ الامتحان:</span> {examDate}</p>
            <p className="text-blue-800 text-sm"><span className="font-semibold">تاريخ الحجز:</span> {selectedDate}</p>
            <p className="text-blue-800 text-sm"><span className="font-semibold">الوقت:</span> {time}</p>
            <p className="text-blue-800 text-sm"><span className="font-semibold">الكلية:</span> {college}</p>
          </div>
          <button onClick={() => onConfirm(selectedDate!)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">
            موافق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowRight className="text-gray-600" size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <CalendarDays className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">اختيار موعد الحجز</h2>
            <p className="text-sm text-gray-500">اختر يوماً قبل الامتحان بـ 48 ساعة على الأقل</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100 space-y-1">
          <p className="text-sm text-blue-800"><span className="font-semibold">تاريخ الامتحان:</span> {examDate}</p>
          <p className="text-sm text-blue-800"><span className="font-semibold">الوقت:</span> {time}</p>
          <p className="text-sm text-blue-800"><span className="font-semibold">آخر موعد للحجز:</span> {maxDateStr}</p>
        </div>

        {/* Calendar header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-bold text-gray-800">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>)}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const available = isAvailable(day.fullDate);
            const status = getStatus(day.fullDate);
            const selected = selectedDate === day.fullDate;
            let cls = '';
            if (!day.isCurrentMonth) cls = 'text-gray-300';
            else if (selected) cls = 'bg-blue-600 text-white shadow-md';
            else if (!available) {
              if (day.fullDate > maxDateStr) cls = 'bg-red-50 text-red-300 cursor-not-allowed';
              else if ((counts[day.fullDate] || 0) >= MAX_PER_DAY) cls = 'bg-red-100 text-red-500 cursor-not-allowed';
              else cls = 'bg-gray-100 text-gray-400 cursor-not-allowed';
            } else if (status === 'almost') cls = 'bg-amber-50 text-amber-700 hover:bg-amber-100';
            else if (status === 'some') cls = 'bg-blue-50 text-blue-700 hover:bg-blue-100';
            else cls = 'hover:bg-blue-50 text-gray-700';

            return (
              <button
                key={idx}
                onClick={() => available && day.isCurrentMonth && setSelectedDate(day.fullDate)}
                disabled={!available || !day.isCurrentMonth}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all ${cls}`}
              >
                <span>{day.date}</span>
                {day.isCurrentMonth && available && status !== 'empty' && (
                  <span className="text-[10px] mt-0.5">{counts[day.fullDate] || 0}/10</span>
                )}
                {day.isCurrentMonth && !available && (counts[day.fullDate] || 0) >= MAX_PER_DAY && (
                  <span className="text-[10px] mt-0.5 text-red-500">ملئ</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 flex-wrap">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-50 border border-blue-200" /><span>متاح</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-50 border border-amber-200" /><span>تقريباً ملئ</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-200" /><span>ملئ (10)</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-50 border border-red-100" /><span>مغلق</span></div>
        </div>

        {selectedDate && (
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-3">
              الموعد المختار: <span className="font-bold text-blue-600">{selectedDate}</span>
            </p>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              تأكيد الحجز
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
