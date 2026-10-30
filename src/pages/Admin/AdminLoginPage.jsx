import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  UserPlus,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { authenticateUser } from '../../utils/authStorage';
import durgamSoftLogo from '../../assets/logos/durgamsoft-logo.webp';
import { COMPANY_NAME } from '../../utils/constants';

export const AdminLoginPage = () => {
  const { login: adminLogin, loginWithUser: adminLoginWithUser, isAuthenticated } = useAdminAuth();
  const { loginWithUser: employeeLoginWithUser } = useEmployeeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState(() => {
    return location.state?.justRegistered
      ? 'Account created successfully! Please enter your email and password to login.'
      : '';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear any legacy saved remember keys
  useEffect(() => {
    try {
      localStorage.removeItem('durgam_remember_admin');
    } catch {
      // silent
    }
  }, []);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Set document title and noindex
  useEffect(() => {
    document.title = 'Admin / CEO Login | Durgam Soft';
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Invalid email or password');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Attempt server admin authentication to receive valid JWT token
      const res = await adminLogin(cleanEmail, password);

      if (res.success) {
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
        return;
      }

      // 2. Check if a registered employee attempted to login on the admin page -> route to employee workspace
      const authRes = authenticateUser({
        email: cleanEmail,
        password,
      });

      if (authRes.success && authRes.user && authRes.user.role !== 'CEO') {
        await employeeLoginWithUser(authRes.user);
        navigate('/employee/dashboard', { replace: true });
        return;
      }

      setErrorMessage(res.error || 'Invalid email or password');
    } catch {
      setErrorMessage('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-slate-800 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      {/* Soft Ambient Background Elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-100/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <div className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Executive Portal</span>
        </div>
      </div>

      {/* Main Centered Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto animate-in fade-in zoom-in-98 duration-200">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] p-7 sm:p-9 md:p-10 transition-all">
          {/* Official Durgam Soft Logo Lockup */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={durgamSoftLogo}
              alt={COMPANY_NAME}
              className="w-14 h-14 object-contain drop-shadow-xs mb-3"
            />
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-tight">
              Durgam Soft
            </h1>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EA580C] mt-1">
              Admin & Executive Portal
            </span>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              Enter your email and password to log in.
            </p>
          </div>

          {/* Registration Success Banner */}
          {successNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="font-semibold">{successNotice}</div>
            </div>
          )}

          {/* Error Message Alert: "Invalid email or password" */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{errorMessage}</div>
            </div>
          )}

          {/* Login Form: Exactly 2 fields (Email and Password) with Login Button */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* Field 1: Email */}
            <div>
              <label htmlFor="admin-email" className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="off"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#EA580C] focus:bg-white focus:ring-2 focus:ring-[#EA580C]/15 transition-all font-medium"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Please contact your super administrator to reset your administrative password.')
                  }
                  className="text-xs text-[#EA580C] hover:text-[#C74E23] font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#EA580C] focus:bg-white focus:ring-2 focus:ring-[#EA580C]/15 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-[#EA580C] hover:bg-[#C74E23] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.99] group"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Don't have an account? Sign Up Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/admin/signup"
                className="font-bold text-[#EA580C] hover:text-[#C74E23] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up / Create Account</span>
              </Link>
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
              <Link to="/employee/login" className="hover:underline">
                Employee Portal Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center pt-4 text-[11px] text-slate-400">
        © {new Date().getFullYear()} Durgam Soft Pvt. Ltd. All rights reserved.
      </div>
    </div>
  );
};

export default AdminLoginPage;
