import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Camera,
  MapPin,
  Trash2,
  CheckCircle2,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { authenticateUser } from '../../utils/authStorage';
import { GpsMapCameraModal } from '../../components/employee/GpsMapCameraModal';
import durgamSoftLogo from '../../assets/logos/durgamsoft-logo.webp';

export const EmployeeLoginPage = () => {
  const { login: employeeLogin, isAuthenticated, employeeUser } = useEmployeeAuth();
  const { loginWithUser: adminLoginWithUser } = useAdminAuth();
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
      localStorage.removeItem('durgam_remember_employee');
      localStorage.removeItem('durgam_remember_admin');
    } catch {
      // silent
    }
  }, []);

  // Optional GPS Map Camera Photo State
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);

  // Set document title and noindex meta tag for internal portal
  useEffect(() => {
    document.title = 'Login | Durgam Soft';
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
    setSuccessNotice('');

    if (!email.trim() || !password) {
      setErrorMessage('Invalid email or password');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate quick natural network turnaround
      await new Promise((resolve) => setTimeout(resolve, 300));

      const authRes = authenticateUser({
        email: email.trim(),
        password,
      });

      if (!authRes.success) {
        setErrorMessage('Invalid email or password');
        setIsSubmitting(false);
        return;
      }

      const user = authRes.user;

      // Role-based routing: CEO -> Admin Dashboard; Employees -> Employee Dashboard
      if (user.role === 'CEO') {
        adminLoginWithUser(user);
        navigate('/admin/dashboard', { replace: true });
      } else {
        const empRes = await employeeLogin({
          email: user.email,
          password: user.password,
          name: user.name || user.username,
          department: user.department || user.role,
          loginPhoto: capturedPhoto,
          loginLocation: locationData,
        });

        if (empRes.success) {
          const from = location.state?.from?.pathname || '/employee/dashboard';
          navigate(from, { replace: true });
        } else {
          setErrorMessage(empRes.error || 'Invalid email or password');
        }
      }
    } catch {
      setErrorMessage('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-slate-800 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      {/* Background Soft Glows */}
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
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Durgam Soft Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto my-auto animate-in fade-in zoom-in-98 duration-200 py-2">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.07)] p-6 sm:p-8 md:p-9 transition-all">
          {/* Logo & Headline Lockup */}
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
              Portal Login
            </span>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              Enter your work email and password to access your dashboard.
            </p>
          </div>

          {/* Registration Success Alert */}
          {successNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="font-semibold">{successNotice}</div>
            </div>
          )}

          {/* Active Session Notification if already authenticated */}
          {isAuthenticated && employeeUser && (
            <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold">Active session:</span> {employeeUser.name} ({employeeUser.department})
              </div>
              <Link
                to="/employee/dashboard"
                className="inline-flex items-center gap-1 font-bold text-[#C74E23] hover:underline shrink-0"
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
              <label htmlFor="login-email" className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="off"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Please contact HR or your system administrator to reset your password.')
                  }
                  className="text-xs text-[#C74E23] hover:text-[#B83E15] font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Optional GPS Attendance Photo (GPS Map Camera) */}
            <div className="p-3 rounded-2xl bg-orange-50/30 border border-orange-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-orange-100 text-[#C74E23]">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block">
                      GPS Attendance Camera <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </span>
                  </div>
                </div>
                {capturedPhoto && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ✓ Photo Ready
                  </span>
                )}
              </div>

              {!capturedPhoto ? (
                <button
                  type="button"
                  onClick={() => setIsGpsModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-[#C74E23]/40 hover:border-[#C74E23] bg-white hover:bg-orange-50/60 text-[#C74E23] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs group"
                >
                  <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Attach Selfie with GPS Camera</span>
                </button>
              ) : (
                <div className="flex items-center justify-between gap-2 pt-1 text-xs bg-white p-2 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={capturedPhoto}
                      alt="Selfie Preview"
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-700 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C74E23] shrink-0" />
                        <span className="truncate">{locationData?.address || 'Cherlapalli'}</span>
                      </p>
                      <span className="text-[10px] text-emerald-600 font-semibold">GPS Watermarked</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsGpsModalOpen(true)}
                      className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                    >
                      Retake
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedPhoto(null);
                        setLocationData(null);
                      }}
                      className="p-1 rounded-md text-red-500 hover:bg-red-50 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-[#0B1F3A] hover:bg-[#071525] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.99] group"
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
                to="/signup"
                className="font-bold text-[#C74E23] hover:text-[#B83E15] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up / Create Account</span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Copy */}
      <div className="relative z-10 w-full max-w-lg mx-auto text-center pt-3 text-[11px] text-slate-400">
        © {new Date().getFullYear()} Durgam Soft Pvt. Ltd. Confidential & Proprietary.
      </div>

      {/* GPS Map Camera Modal */}
      <GpsMapCameraModal
        isOpen={isGpsModalOpen}
        onClose={() => setIsGpsModalOpen(false)}
        onCapture={(photoUrl, loc) => {
          setCapturedPhoto(photoUrl);
          setLocationData(loc);
        }}
      />
    </div>
  );
};

export default EmployeeLoginPage;
