export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  college: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  college: string;
  examDate: string;
  bookingDate: string;
  time: string;
  createdAt: string;
}

export interface BookingFormData {
  userId: string;
  userName: string;
  college: string;
  examDate: string;
  time: string;
}
