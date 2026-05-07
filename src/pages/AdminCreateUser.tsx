import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, UserPlus, GraduationCap } from 'lucide-react';

interface Props { onBack: () => void; }

export default function AdminCreateUser({ onBack }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState<'user'|'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    const result = register({ email, password, name, role, college });
    if (result) {
      setSuccess(true);
      setEmail(''); setPassword(''); setName(''); setCollege(''); setRole('user');
    } else {
      setError('البريد الإلكتروني مستخدم مسبقاً');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowRight className="text-gray-600" size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserPlus className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">إضافة مستخدم جديد</h2>
            <p className="text-sm text-gray-500">المدير يكتب الكلية للمستخدم</p>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">تم إنشاء المستخدم بنجاح!</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="أدخل اسم المستخدم" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="أدخل البريد" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="أدخل كلمة المرور" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الكلية</label>
            <div className="relative">
              <GraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="أدخل اسم الكلية" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الدور</label>
            <select value={role} onChange={(e) => setRole(e.target.value as 'user'|'admin')} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
              <option value="user">مستخدم</option>
              <option value="admin">مدير</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-5 h-5" />}
            إنشاء الحساب
          </button>
        </form>
      </div>
    </div>
  );
}
