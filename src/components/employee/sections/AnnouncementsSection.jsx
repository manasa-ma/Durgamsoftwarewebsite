import React, { useState } from 'react';
import {
  Calendar,
  Bell,
  CheckCircle2,
  Check,
  Pin,
  RefreshCw,
  Building,
  User,
} from 'lucide-react';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';

export const AnnouncementsSection = () => {
  const {
    announcements,
    announcementsLoading,
    readAnnouncementIds,
    markAnnouncementAsRead,
    markAllAnnouncementsAsRead,
    refreshAnnouncements,
    unreadAnnouncementsCount,
  } = useEmployeeAuth();

  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread' | 'urgent'

  const filteredAnnouncements = announcements.filter((ann) => {
    const isUnread = !readAnnouncementIds.includes(ann.id);
    if (filterTab === 'unread') return isUnread;
    if (filterTab === 'urgent') return ann.priority === 'Urgent' || ann.priority === 'High';
    return true;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Urgent Notice
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            High Priority
          </span>
        );
      case 'Info':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Information
          </span>
        );
      case 'Normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Notice
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A]">Company Announcements</h2>
            {unreadAnnouncementsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500 text-white animate-pulse">
                {unreadAnnouncementsCount} NEW
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Official executive notices, policies, and operational updates from Durgam Soft management
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={refreshAnnouncements}
            disabled={announcementsLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh announcements"
          >
            <RefreshCw className={`w-4 h-4 ${announcementsLoading ? 'animate-spin' : ''}`} />
          </button>

          {unreadAnnouncementsCount > 0 && (
            <button
              type="button"
              onClick={markAllAnnouncementsAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-[#C74E23] border border-orange-200 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filterTab === 'all'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({announcements.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('unread')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'unread'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Unread</span>
          {unreadAnnouncementsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('urgent')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filterTab === 'urgent'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Urgent & High
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No announcements found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {filterTab === 'unread'
                ? "You've read all the latest company updates!"
                : 'There are no active notices for this filter.'}
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isUnread = !readAnnouncementIds.includes(ann.id);

            return (
              <div
                key={ann.id}
                className={`bg-white rounded-2xl border p-6 shadow-2xs space-y-3 transition-all ${
                  isUnread
                    ? 'border-orange-300 bg-orange-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ann.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <Pin className="w-3 h-3 text-amber-600" />
                        Pinned
                      </span>
                    )}
                    {getPriorityBadge(ann.priority)}
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {ann.category}
                    </span>
                    {ann.targetDepartment && ann.targetDepartment !== 'All Departments' && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {ann.targetDepartment}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {ann.date}
                    </span>

                    {/* Mark as read / Read toggle */}
                    {isUnread ? (
                      <button
                        type="button"
                        onClick={() => markAnnouncementAsRead(ann.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer shadow-2xs"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Read
                      </span>
                    )}
                  </div>
                </div>

                {/* Announcement Title */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-black text-[#0B1F3A] leading-snug">
                    {ann.title}
                  </h3>
                  {isUnread && (
                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-black uppercase">
                      New
                    </span>
                  )}
                </div>

                {/* Summary (if present) */}
                {ann.summary && ann.summary !== ann.content && (
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {ann.summary}
                  </p>
                )}

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>

                {/* Footer / Author */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Posted by: <strong className="text-slate-700">{ann.author || 'Venu Durgam (Managing Director)'}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Internal Notice • Durgam Soft HQ
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AnnouncementsSection;
