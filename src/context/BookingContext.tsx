import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Booking } from '../types';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  deleteBooking: (id: string) => void;
  getBookingCounts: () => Record<string, number>;
  getUserBookings: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('eximq_bookings');
    if (saved) setBookings(JSON.parse(saved));
  }, []);

  const addBooking = (data: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = { ...data, id: `bk-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...bookings, newBooking];
    setBookings(updated);
    localStorage.setItem('eximq_bookings', JSON.stringify(updated));
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('eximq_bookings', JSON.stringify(updated));
  };

  const getBookingCounts = () => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => { counts[b.bookingDate] = (counts[b.bookingDate] || 0) + 1; });
    return counts;
  };

  const getUserBookings = (userId: string) => bookings.filter(b => b.userId === userId);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, deleteBooking, getBookingCounts, getUserBookings }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBookings must be used within BookingProvider');
  return context;
}
