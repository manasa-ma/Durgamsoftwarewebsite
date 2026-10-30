import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  User,
  LogIn,
  LogOut,
  Bell,
  Megaphone,
  Pin,
  ArrowRight,
  X,
} from 'lucide-react';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';
import durgamSoftLogo from '../../../assets/logos/durgamsoft-logo.webp';
import { calculateWorkHours, calculateElapsedHours } from '../../../utils/workHoursCalculator';

export const DashboardOverview = ({ onNavigateTab, onOpenLeaveModal }) => {
  const {
    employeeUser,
    todayAttendance,
    markCheckIn,
    markCheckOut,
    leaveBalances,
    announcements,
    readAnnouncementIds,
    markAnnouncementAsRead,
    unreadAnnouncementsCount,
  } = useEmployeeAuth();

  const totalLeaveAvailable = leaveBalances.paid?.available ?? 8;
  const accruedLeaves = leaveBalances.paid?.accrued ?? 10;
  const usedLeaves = leaveBalances.paid?.used ?? 2;

  // Live elapsed working hours calculation
  const [liveElapsedHours, setLiveElapsedHours] = useState(() =>
    calculateElapsedHours(todayAttendance.checkInTime)
  );

  useEffect(() => {
    if (!todayAttendance.hasCheckedIn || todayAttendance.hasCheckedOut) return;
    setLiveElapsedHours(calculateElapsedHours(todayAttendance.checkInTime));
    const interval = setInterval(() => {
      setLiveElapsedHours(calculateElapsedHours(todayAttendance.checkInTime));
    }, 30000);
    return () => clearInterval(interval);
  }, [todayAttendance.hasCheckedIn, todayAttendance.hasCheckedOut, todayAttendance.checkInTime]);

  // Find the top unread announcement (if any) to display in the live notification banner
  const unreadAnnouncement = announcements.find((a) => !readAnnouncementIds.includes(a.id));

  return (
    <div className="space-y-6">
      {/* 0. Urgent / New Announcement Notification Banner */}
      {unreadAnnouncement && (
        <div className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          unreadAnnouncement.priority === 'Urgent'
            ? 'bg-red-50 border-red-200 text-red-900'
            : unreadAnnouncement.priority === 'High'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-orange-50/80 border-orange-200 text-slate-900'
        }`}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              unreadAnnouncement.priority === 'Urgent'
                ? 'bg-red-500 text-white animate-bounce'
                : unreadAnnouncement.priority === 'High'
                  ? 'bg-amber-500 text-white'
                  : 'bg-[#C74E23] text-white'
            }`}>
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  unreadAnnouncement.priority === 'Urgent'
                    ? 'bg-red-200 text-red-800'
                    : unreadAnnouncement.priority === 'High'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-orange-200 text-orange-950'
                }`}>
                  {unreadAnnouncement.priority || 'Notice'}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {unreadAnnouncement.category} • {unreadAnnouncement.date}
                </span>
                <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  NEW
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
                {unreadAnnouncement.title}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                {unreadAnnouncement.summary || unreadAnnouncement.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => {
                markAnnouncementAsRead(unreadAnnouncement.id);
                onNavigateTab('announcements');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142845] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>Read Notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => markAnnouncementAsRead(unreadAnnouncement.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Simple Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50/60 border border-orange-100 p-2 flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={durgamSoftLogo}
                alt="Durgam Soft Logo"
                className="w-full h-full object-contain drop-shadow-xs"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A]">
                Welcome, {employeeUser?.name || 'Employee'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {employeeUser?.department} • ID: <span className="font-mono font-semibold">{employeeUser?.id}</span> • {employeeUser?.email}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-[#C74E23] border border-orange-200">
            {employeeUser?.department}
          </span>
        </div>
      </div>

      {/* 2. Key Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attendance Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Attendance
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#C74E23]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-lg font-black text-slate-900">
                {todayAttendance.hasCheckedIn
                  ? todayAttendance.hasCheckedOut
                    ? `Punch Out: ${todayAttendance.checkOutTime}`
                    : `Punch In: ${todayAttendance.checkInTime}`
                  : 'Not Punched In'}
              </div>
              {todayAttendance.hasCheckedIn && todayAttendance.punchInPhoto && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Photo Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {todayAttendance.hasCheckedOut
                ? `Punched out at ${todayAttendance.checkOutTime} • Total: ${todayAttendance.workHours || calculateWorkHours(todayAttendance.checkInTime, todayAttendance.checkOutTime)}`
                : todayAttendance.hasCheckedIn
                  ? `Shift in progress • ${liveElapsedHours} worked`
                  : 'Click below to punch in'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {!todayAttendance.hasCheckedIn ? (
              <button
                type="button"
                onClick={markCheckIn}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" /> Punch In
              </button>
            ) : !todayAttendance.hasCheckedOut ? (
              <button
                type="button"
                onClick={markCheckOut}
                className="text-xs font-bold text-[#C74E23] hover:text-[#B83E15] flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Punch Out
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600">Day Completed</span>
            )}
            <button
              type="button"
              onClick={() => onNavigateTab('attendance')}
              className="text-xs text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
            >
              History →
            </button>
          </div>
        </div>

        {/* Leave Balances Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paid Leave Balance
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900">
              {totalLeaveAvailable} Days Available
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Policy: 1 leave/month • {accruedLeaves} days accrued (10 months) • {usedLeaves} used
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenLeaveModal}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              Apply Leave
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('leaves')}
              className="text-xs text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
            >
              View Requests →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Simple Employee Details & Announcements Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-[#C74E23]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Employee Details
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Full Name</span>
              <span className="font-bold text-slate-800">{employeeUser?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Employee ID</span>
              <span className="font-bold text-slate-800 font-mono">{employeeUser?.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Department</span>
              <span className="font-bold text-slate-800">{employeeUser?.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Designation</span>
              <span className="font-bold text-slate-800">{employeeUser?.designation}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Work Email</span>
              <span className="font-bold text-slate-800 truncate block">{employeeUser?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Work Location</span>
              <span className="font-bold text-slate-800">{employeeUser?.location || 'Cherlapalli'}</span>
            </div>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C74E23]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Company Announcements
              </h2>
              {unreadAnnouncementsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white">
                  {unreadAnnouncementsCount} NEW
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('announcements')}
              className="text-xs font-bold text-[#C74E23] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => {
              const isUnread = !readAnnouncementIds.includes(ann.id);
              return (
                <div
                  key={ann.id}
                  onClick={() => {
                    markAnnouncementAsRead(ann.id);
                    onNavigateTab('announcements');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isUnread
                      ? 'bg-orange-50/40 border-orange-200 hover:border-orange-400'
                      : 'bg-slate-50/70 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-700">{ann.category}</span>
                      {ann.isPinned && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                      {ann.priority === 'Urgent' && (
                        <span className="px-1.5 py-0.2 rounded-md bg-red-100 text-red-700 text-[10px] font-bold">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{ann.date}</span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Unread" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 hover:text-[#C74E23]">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {ann.summary || ann.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
