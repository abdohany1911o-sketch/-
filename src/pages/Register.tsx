import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("تم إنشاء الحساب بنجاح");
    } catch (error) {
      alert("حصل خطأ في إنشاء الحساب");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>إنشاء حساب</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleRegister}>
        إنشاء حساب
      </button>
    </div>
  );
}