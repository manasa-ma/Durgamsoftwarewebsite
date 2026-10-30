import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Users,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building,
  Home,
  AlertCircle,
  X,
  Camera,
  Image as ImageIcon,
  Eye,
  Check,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { calculateWorkHours } from '../../utils/workHoursCalculator';
import { getSharedAttendance, calculateAttendanceSummary } from '../../utils/sharedStorage';

const DEPARTMENTS = [
  'All Departments',
  'Software Engineer',
  'HR',
  'Sales',
  'Hardware & POS Support',
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Present', label: 'Present' },
  { value: 'Late', label: 'Late' },
  { value: 'Half Day', label: 'Half Day' },
  { value: 'Work From Home', label: 'Work From Home' },
  { value: 'Absent', label: 'Absent' },
];

export const AdminAttendancePage = () => {
  const { getAuthHeaders } = useAdminAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalToday: 0,
    present: 0,
    late: 0,
    halfDay: 0,
    wfh: 0,
    absent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Photo viewer modal state
  const [viewingPhoto, setViewingPhoto] = useState(null); // { url, type: 'Punch In' | 'Punch Out', record }

  const fetchAttendance = (silent = false) => {
    if (!silent) setLoading(true);
    setError('');

    try {
      const allRecords = getSharedAttendance();

      let filtered = allRecords;

      // Filter by date
      if (selectedDate && selectedDate !== 'all') {
        filtered = filtered.filter((r) => r.date === selectedDate);
      }

      // Filter by department
      if (selectedDepartment && selectedDepartment !== 'All Departments') {
        filtered = filtered.filter(
          (r) => r.department && r.department.toLowerCase().includes(selectedDepartment.toLowerCase())
        );
      }

      // Filter by status
      if (selectedStatus && selectedStatus !== 'all') {
        filtered = filtered.filter(
          (r) => r.status && r.status.toLowerCase() === selectedStatus.toLowerCase()
        );
      }

      // Filter by search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            (r.employeeName && r.employeeName.toLowerCase().includes(term)) ||
            (r.employeeId && r.employeeId.toLowerCase().includes(term)) ||
            (r.location && r.location.toLowerCase().includes(term)) ||
            (r.department && r.department.toLowerCase().includes(term))
        );
      }

      setRecords(filtered);

      const calculatedSummary = calculateAttendanceSummary(allRecords, todayStr);
      setSummary(calculatedSummary);
    } catch (err) {
      console.warn('Error reading attendance from local storage:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();

    const onUpdate = () => fetchAttendance(true);
    window.addEventListener('durgam_attendance_updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    const interval = setInterval(() => fetchAttendance(true), 3000);

    return () => {
      window.removeEventListener('durgam_attendance_updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
      clearInterval(interval);
    };
  }, [selectedDate, selectedDepartment, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAttendance();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Present
          </span>
        );
      case 'Late':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Late
          </span>
        );
      case 'Half Day':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Half Day
          </span>
        );
      case 'Work From Home':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Home className="w-3 h-3 text-blue-500" />
            WFH
          </span>
        );
      case 'Absent':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Absent
          </span>
        );
    }
  };

  // Count photos captured today
  const verifiedPhotosCount = records.filter(
    (r) => r.punchInPhoto || r.punchOutPhoto
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              CEO Monitoring Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">
            Employee Attendance & Photo Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time biometric and selfie check-ins, punch-out times, and daily shift attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchAttendance()}
            disabled={loading}
            className="p-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors shadow-2xs cursor-pointer flex items-center gap-2 text-xs font-bold"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Live Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards for Selected Date */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Logged Today</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-[#0B1F3A]">
            {summary.totalToday}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Total active check-ins</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-200/80 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>On Time</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {summary.present}
          </div>
          <p className="text-[10px] text-emerald-600/80 mt-1">Punctual (&le; 09:30 AM)</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200/80 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Late Check-in</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">
            {summary.late}
          </div>
          <p className="text-[10px] text-amber-600/80 mt-1">After 09:30 AM</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-purple-200/80 shadow-2xs bg-purple-50/20">
          <div className="flex items-center justify-between text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Half Day</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">
            {summary.halfDay}
          </div>
          <p className="text-[10px] text-purple-600/80 mt-1">4-hour shift</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-blue-200/80 shadow-2xs bg-blue-50/20">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Remote (WFH)</span>
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">
            {summary.wfh}
          </div>
          <p className="text-[10px] text-blue-600/80 mt-1">Approved remote</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-orange-200 shadow-2xs bg-orange-50/30 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#C74E23] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Photo Verified</span>
            <Camera className="w-4 h-4 text-[#C74E23]" />
          </div>
          <div className="text-2xl font-black text-[#C74E23]">
            {verifiedPhotosCount}
          </div>
          <p className="text-[10px] text-orange-600/80 mt-1">With live selfie</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Date Selector & Department Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:border-[#C74E23]"
            />
            {selectedDate !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedDate('all')}
                className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
              >
                All Dates
              </button>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-[#C74E23]"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-[#C74E23]"
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name or ID..."
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#C74E23] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                fetchAttendance();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchAttendance()}
            className="text-xs font-bold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Attendance Log Table with Photo Verifications */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-black text-[#0B1F3A]">Attendance Logs & Photo Verifications</h3>
            <p className="text-xs text-slate-500">
              Showing {records.length} record{records.length === 1 ? '' : 's'}
              {selectedDate !== 'all' ? ` for ${selectedDate}` : ''} • Updates automatically as staff punch in
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Office Timing: 09:00 AM - 06:00 PM (Cherlapalli HQ)
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#C74E23] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Loading attendance data...</p>
            </div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 p-6">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No attendance records found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No check-in logs match the selected date or search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-5">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Date & Day</th>
                  <th className="py-3.5 px-4">Punch In</th>
                  <th className="py-3.5 px-4">Punch In Photo</th>
                  <th className="py-3.5 px-4">Punch Out</th>
                  <th className="py-3.5 px-4">Punch Out Photo</th>
                  <th className="py-3.5 px-4">Total Hours</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {records.map((item) => {
                  const hasInPhoto = Boolean(item.punchInPhoto);
                  const hasOutPhoto = Boolean(item.punchOutPhoto);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Employee info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 text-orange-400 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {item.employeeName?.charAt(0) || 'E'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                              {item.employeeName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {item.employeeId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {item.department}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-700 block font-semibold">{item.date}</span>
                        <span className="text-[10px] text-slate-400">{item.day}</span>
                      </td>

                      {/* Check In Time */}
                      <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                        {item.checkIn}
                      </td>

                      {/* Punch In Photo Thumbnail */}
                      <td className="py-3.5 px-4">
                        {hasInPhoto ? (
                          <button
                            type="button"
                            onClick={() =>
                              setViewingPhoto({
                                url: item.punchInPhoto,
                                type: 'Punch In Verification',
                                record: item,
                              })
                            }
                            className="group relative flex items-center gap-1.5 p-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
                            title="Click to view full Punch In photo"
                          >
                            <img
                              src={item.punchInPhoto}
                              alt="Punch In Photo"
                              className="w-8 h-8 rounded-lg object-cover border border-emerald-300 shrink-0"
                            />
                            <span className="text-[10px] font-bold text-emerald-800 hidden md:inline pr-1">
                              View
                            </span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            No photo
                          </span>
                        )}
                      </td>

                      {/* Check Out Time */}
                      <td className="py-3.5 px-4 font-bold text-slate-600 font-mono">
                        {item.checkOut}
                      </td>

                      {/* Punch Out Photo Thumbnail */}
                      <td className="py-3.5 px-4">
                        {hasOutPhoto ? (
                          <button
                            type="button"
                            onClick={() =>
                              setViewingPhoto({
                                url: item.punchOutPhoto,
                                type: 'Punch Out Verification',
                                record: item,
                              })
                            }
                            className="group relative flex items-center gap-1.5 p-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer"
                            title="Click to view full Punch Out photo"
                          >
                            <img
                              src={item.punchOutPhoto}
                              alt="Punch Out Photo"
                              className="w-8 h-8 rounded-lg object-cover border border-blue-300 shrink-0"
                            />
                            <span className="text-[10px] font-bold text-blue-800 hidden md:inline pr-1">
                              View
                            </span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            {item.checkOut === '--:--' ? 'Shift active' : 'No photo'}
                          </span>
                        )}
                      </td>

                      {/* Total Work Hours */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            item.workHours === 'In Progress'
                              ? 'bg-orange-50 text-[#C74E23]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.checkOut && item.checkOut !== '--:--' && item.checkOut !== '-'
                            ? calculateWorkHours(item.checkIn, item.checkOut)
                            : item.workHours || 'In Progress'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-right">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Photo Preview Modal for CEO */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setViewingPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0B1F3A] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-orange-400 flex items-center justify-center font-bold text-base">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black">
                    {viewingPhoto.type} Photo
                  </h3>
                  <p className="text-xs text-slate-300">
                    {viewingPhoto.record.employeeName} • {viewingPhoto.record.department}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingPhoto(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo View Box */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex items-center justify-center max-h-[380px]">
                <img
                  src={viewingPhoto.url}
                  alt="Verified punch attendance capture"
                  className="w-full h-full object-contain max-h-[380px]"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Verified Capture</span>
                </div>
              </div>

              {/* Attendance Details Strip */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Employee ID
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {viewingPhoto.record.employeeId}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Date & Punch Time
                  </span>
                  <span className="font-bold text-slate-900">
                    {viewingPhoto.record.date} at{' '}
                    {viewingPhoto.type.includes('In')
                      ? viewingPhoto.record.checkIn
                      : viewingPhoto.record.checkOut}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setViewingPhoto(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142845] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendancePage;
