import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const VALIDATED_KEY = 'pw_reset_validated_v1';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState('validating'); // validating, form, error, success
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState({});

  const mountedRef = useRef(true);

  useEffect(() => {
    // set meta referrer (tetap seperti kode awalmu)
    document.head.querySelector('meta[name="referrer"]')?.remove();
    const metaReferrer = document.createElement('meta');
    metaReferrer.name = 'referrer';
    metaReferrer.content = 'no-referrer';
    document.head.appendChild(metaReferrer);

    return () => {
      metaReferrer.remove();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    mountedRef.current = true;

    const alreadyValidated = sessionStorage.getItem(VALIDATED_KEY) === '1';
    const token = new URLSearchParams(window.location.search).get('token');

    // Jika sudah ada flag validasi (misal user reload), langsung ke form tanpa memanggil API lagi.
    if (alreadyValidated) {
      // Hapus token dari URL kalau masih ada (tidak memicu rerun)
      if (token) {
        const u = new URL(window.location.href);
        u.searchParams.delete('token');
        window.history.replaceState({}, document.title, u.pathname + u.search);
      }
      setStep('form');
      setMessage('Token sudah tervalidasi sebelumnya.');
      setIsLoading(false);
      return () => controller.abort();
    }

    // Jika token tidak ada -> error
    if (!token) {
      setStep('error');
      setMessage('Token reset password tidak ditemukan di URL.');
      setIsLoading(false);
      return () => controller.abort();
    }

    const validate = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/users/validate-reset-token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
            credentials: 'include', // penting agar Set-Cookie httpOnly diterima
            signal: controller.signal,
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Token tidak valid atau telah kadaluarsa.');
        }

        // Tandai sudah tervalidasi (client-side flag) supaya reload/tombol back tidak memanggil validasi lagi
        sessionStorage.setItem(VALIDATED_KEY, '1');

        // Hapus token dari URL — gunakan replaceState agar tidak trigger re-render effect
        const u = new URL(window.location.href);
        u.searchParams.delete('token');
        window.history.replaceState({}, document.title, u.pathname + u.search);

        if (!mountedRef.current) return;
        setStep('form');
        setMessage(data.message || 'Token valid. Silakan ganti password.');
      } catch (err) {
        if (err.name === 'AbortError') {
          // ignore
          return;
        }
        console.error('Token validation error:', err);
        if (!mountedRef.current) return;
        setStep('error');
        setMessage(err.message || 'Gagal memvalidasi token reset password.');
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    };

    validate();

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
    // Note: dependency array kosong => jalankan sekali pada mount
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.newPassword) errors.newPassword = 'Password baru harus diisi.';
    else if (formData.newPassword.length < 8) errors.newPassword = 'Password minimal 8 karakter.';
    if (!formData.confirmPassword) errors.confirmPassword = 'Konfirmasi password harus diisi.';
    else if (formData.newPassword !== formData.confirmPassword)
      errors.confirmPassword = 'Konfirmasi password tidak sesuai.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // NOTE: tidak perlu mengirim token lagi — server harus membaca cookie httpOnly yang sudah di-set saat validate
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/users/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.ok) {
        // hapus flag validasi karena proses selesai
        sessionStorage.removeItem(VALIDATED_KEY);
        setStep('success');
        setMessage(data.message || 'Password berhasil direset!');
        setTimeout(() => navigate('/'), 3000);
      } else {
        throw new Error(data.message || 'Gagal mereset password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setStep('error');
      setMessage(err.message || 'Terjadi kesalahan saat mereset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'new') setShowPassword(s => !s);
    else setShowConfirmPassword(s => !s);
  };

  // UI sama seperti sebelumnya — saya ringkas supaya fokus pada logic
  if (step === 'validating') return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="loading-spinner"></div>
        <h2>Memvalidasi Token</h2>
        <p>Mohon tunggu sebentar...</p>
      </div>
    </div>
  );

  if (step === 'error') return (
    <div className="reset-password-container">
      <div className="reset-password-card error">
        <div className="error-icon">❌</div>
        <h2>Reset Password Gagal</h2>
        <p className="error-message">{message}</p>
        <button className="back-home-btn" onClick={() => navigate('/')}>Kembali ke Beranda</button>
      </div>
    </div>
  );

  if (step === 'success') return (
    <div className="reset-password-container">
      <div className="reset-password-card success">
        <div className="success-icon">✅</div>
        <h2>Password Berhasil Direset!</h2>
        <p className="success-message">{message}</p>
        <p className="redirect-info">Anda akan diarahkan ke beranda dalam 3 detik...</p>
        <button className="back-home-btn" onClick={() => navigate('/')}>Kembali ke Beranda Sekarang</button>
      </div>
    </div>
  );

  // step === 'form'
  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Password</h2>
        <p className="form-description">Masukkan password baru Anda</p>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">Password Baru</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={formErrors.newPassword ? 'error' : ''}
                placeholder="Masukkan password baru"
                required
              />
              <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('new')} tabIndex="-1">
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
            {formErrors.newPassword && <span className="error-text">{formErrors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={formErrors.confirmPassword ? 'error' : ''}
                placeholder="Konfirmasi password baru"
                required
              />
              <button type="button" className="password-toggle" onClick={() => togglePasswordVisibility('confirm')} tabIndex="-1">
                {showConfirmPassword ? '👁️' : '🔒'}
              </button>
            </div>
            {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Reset Password'}
          </button>
        </form>

        <div className="form-footer">
          <button className="back-link" onClick={() => navigate('/')}>Kembali ke Beranda</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
