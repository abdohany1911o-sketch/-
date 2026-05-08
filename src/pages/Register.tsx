import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  UserPlus
} from "lucide-react";

import {
  useAuth
} from "../context/AuthContext";

export default function Register() {

  const navigate =
    useNavigate();

  const { register } =
    useAuth();

  const [name, setName] =
    useState("");

  const [college, setCollege] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");

      setLoading(true);

      const success =
        await register({

          name,

          college,

          email,

          password,

          role: "user"
        });

      if (success) {

        alert(
          "تم إنشاء الحساب بنجاح"
        );

        navigate("/");

      } else {

        setError(
          "البريد مستخدم بالفعل"
        );
      }

      setLoading(false);
    };

  return (

    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4"
      dir="rtl"
    >

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="text-center mb-8">

            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">

              إنشاء حساب

            </h1>

            <p className="text-gray-500">

              نظام حجز مواعيد رفع الامتحانات

            </p>

          </div>

          {error && (

            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">

              {error}

            </div>

          )}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            <input
              type="text"
              placeholder="الاسم"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              required
            />

            <input
              type="text"
              placeholder="الكلية"
              value={college}
              onChange={(e) =>
                setCollege(
                  e.target.value
                )
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              required
            />

            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              required
            />

            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >

              <UserPlus className="w-5 h-5" />

              {
                loading
                  ? "جاري الإنشاء..."
                  : "إنشاء الحساب"
              }

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}