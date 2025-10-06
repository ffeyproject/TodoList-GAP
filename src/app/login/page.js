"use client";

import "./login.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔹 Redirect jika sudah login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/");
  }, [router]);

  // 🔹 Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/custom-login", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  // 🔹 Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("Password tidak sama");
      return;
    }
    try {
      const res = await api.post("/custom-register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Register gagal");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className={`login-card-header ${isRegister ? "register" : ""}`}>
          <h2 className="mb-1">
            {isRegister ? "Buat Akun" : "Selamat Datang"}
          </h2>
          <p className="mb-0">
            {isRegister
              ? "Daftarkan dirimu sekarang"
              : "Login untuk mengakses dashboard"}
          </p>
        </div>

        {/* Body */}
        <div className="login-card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          {!isRegister ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
              </div>
              <button className="btn-login" type="submit">
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Nama</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Konfirmasi Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Ulangi password"
                  required
                />
              </div>
              <button className="btn-register" type="submit">
                Register
              </button>
            </form>
          )}

          <hr />
          <div className="text-center">
            {!isRegister ? (
              <p className="mb-0">
                Belum punya akun?{" "}
                <button
                  type="button"
                  className="btn btn-link fw-bold"
                  onClick={() => setIsRegister(true)}
                >
                  Register
                </button>
              </p>
            ) : (
              <p className="mb-0">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  className="btn btn-link fw-bold"
                  onClick={() => setIsRegister(false)}
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
