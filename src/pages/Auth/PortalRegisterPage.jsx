import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { registerUser, EMPLOYEE_ROLES } from '../../utils/authStorage';
import durgamSoftLogo from '../../assets/logos/durgamsoft-logo.webp';

export const PortalRegisterPage = ({ defaultRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect whether this is the Admin signup or Employee signup
  const isAdmin = Boolean(
    defaultRole === 'CEO' ||
    location.pathname.includes('admin') ||
    location.state?.isAdmin
  );

  // If Admin page, role is strictly 'CEO'. If Employee page, role defaults to first employee role
  const initialRole = isAdmin
    ? 'CEO'
    : defaultRole && defaultRole !== 'CEO'
      ? defaultRole
      : location.state?.role || EMPLOYEE_ROLES[0];

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set document title and noindex meta tag
  useEffect(() => {
    document.title = isAdmin
      ? 'Admin Registration | Durgam Soft'
      : 'Employee Registration | Durgam Soft';
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    const originalContent = robotsMeta.getAttribute('content');
    robotsMeta.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (originalContent) {
        robotsMeta.setAttribute('content', originalContent);
      } else {
        robotsMeta.removeAttribute('content');
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username or full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a secure password.');
      return;
    }
    const targetRole = isAdmin ? 'CEO' : role;
    if (!targetRole) {
      setErrorMessage('Please select a department / role.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate natural registration turnaround
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        role: targetRole,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to create account. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Account created successfully! Redirecting to login page...');

      // Redirect to login page after brief success notification (without pre-filling email)
      setTimeout(() => {
        const targetLoginPath = targetRole === 'CEO' ? '/admin/login' : '/employee/login';
        navigate(targetLoginPath, {
          replace: true,
          state: {
            justRegistered: true,
          },
        });
      }, 1000);
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Determine login link destination based on current route or selected role
  const loginDestination = isAdmin ? '/admin/login' : '/employee/login';

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-slate-800 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-slate-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-50/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex items-center justify-between pb-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C74E23]" />
          <span>{isAdmin ? 'Admin Portal Registration' : 'Employee Portal Registration'}</span>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto my-auto animate-in fade-in zoom-in-98 duration-200 py-2">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.07)] p-6 sm:p-8 md:p-9 transition-all">
          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={durgamSoftLogo}
              alt="Durgam Soft Logo"
              className="w-14 h-14 object-contain mb-3 drop-shadow-sm"
            />
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight uppercase leading-tight">
              Durgam Soft
            </h1>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C74E23] mt-1">
              {isAdmin ? 'Admin Registration' : 'Employee Registration'}
            </span>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              {isAdmin
                ? 'Sign up with your credentials to create an Executive / Admin account.'
                : 'Sign up with your credentials to access your employee workspace.'}
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="font-semibold">{successMessage}</div>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Sign Up / Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Username Field */}
            <div>
              <label
                htmlFor="register-username"
                className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Rahul Sharma or Username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium"
                />
              </div>
            </div>

            {/* 2. Email Field */}
            <div>
              <label
                htmlFor="register-email"
                className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@durgamsoft.com or your email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium"
                />
              </div>
            </div>

            {/* 3. Password Field */}
            <div>
              <label
                htmlFor="register-password"
                className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium"
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

            {/* 4. Dropdown Field: Visible ONLY for employee registration without CEO option */}
            {!isAdmin && (
              <div>
                <label
                  htmlFor="register-role"
                  className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5"
                >
                  Select Role / Designation
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="register-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-semibold appearance-none cursor-pointer"
                  >
                    {EMPLOYEE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-1">
                  {role} role will have access to the employee dashboard upon login.
                </p>
              </div>
            )}

            {/* 5. Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || Boolean(successMessage)}
                className="w-full py-3 px-6 rounded-xl bg-[#0B1F3A] hover:bg-[#071525] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.99] group"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {isAdmin ? 'Submit & Create Admin Account' : 'Submit & Create Employee Account'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Already have an account? Login Redirect Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link
                to={loginDestination}
                className="font-bold text-[#C74E23] hover:text-[#B83E15] hover:underline transition-colors"
              >
                Login here
              </Link>
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
              <Link to="/employee/login" className="hover:underline">
                Employee Login
              </Link>
              <span>•</span>
              <Link to="/admin/login" className="hover:underline">
                Admin / CEO Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Copy */}
      <div className="relative z-10 w-full max-w-lg mx-auto text-center pt-3 text-[11px] text-slate-400">
        © {new Date().getFullYear()} Durgam Soft Pvt. Ltd. Confidential & Proprietary.
      </div>
    </div>
  );
};

export default PortalRegisterPage;
