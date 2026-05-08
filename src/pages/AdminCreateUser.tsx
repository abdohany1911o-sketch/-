import { useState } from 'react';
import { ArrowRight, UserPlus, GraduationCap } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function AdminCreateUser({ onBack }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@eximq.com")) {
      setError("يجب أن ينتهي البريد بـ @eximq.com");
      return;
    }

    setError('');
    setLoading(true);
    setSuccess(false);

    const users = JSON.parse(localStorage.getItem('eximq_users') || '[]');

    const exists = users.find((u: any) => u.email === email);

    if (exists) {
      setError('البريد مستخدم بالفعل');
      setLoading(false);
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      college,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    localStorage.setItem('eximq_users', JSON.stringify(users));

    setSuccess(true);

    setEmail('');
    setPassword('');
    setName('');
    setCollege('');
    setRole('user');

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowRight size={20} />
          </button>

          <UserPlus className="text-blue-600" size={20} />

          <div>
            <h2 className="text-xl font-bold">إضافة مستخدم</h2>
          </div>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">تم إنشاء المستخدم</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border" />

          <input placeholder="الإيميل" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border" />

          <input placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border" />

          <input placeholder="الكلية" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full p-2 border" />

          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full p-2 border">
            <option value="user">مستخدم</option>
            <option value="admin">مدير</option>
          </select>

          <button disabled={loading} className="w-full bg-blue-600 text-white p-2">
            إنشاء
          </button>

        </form>

      </div>
    </div>
  );
}