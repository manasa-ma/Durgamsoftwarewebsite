import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';

export const LeaveRequestsSection = ({ onOpenApplyModal }) => {
  const { leaveBalances, leaveRequests } = useEmployeeAuth();

  return (
    <div className="space-y-6">
      {/* 1. Header with Apply Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0B1F3A]">Leave Requests</h2>
          <p className="text-xs text-slate-500">Apply for time off and track approval status</p>
        </div>

        <button
          type="button"
          onClick={onOpenApplyModal}
          className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#071525] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-orange-400" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* 2. Leave Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Accrued (10 Months)
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {leaveBalances.paid?.accrued ?? 10}{' '}
            <span className="text-xs font-normal text-slate-400">/ {leaveBalances.paid?.total ?? 12} Days Annual</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">1 paid leave per month</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Leaves Taken
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {leaveBalances.paid?.used ?? 0}{' '}
            <span className="text-xs font-normal text-slate-400">Days Used</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Approved leaves this year</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Available Balance
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {leaveBalances.paid?.available ?? 10}{' '}
            <span className="text-xs font-normal text-slate-400">Days Available</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ready to apply</p>
        </div>
      </div>

      {/* 3. Leave Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-black text-[#0B1F3A]">My Leave History</h3>
          <p className="text-xs text-slate-500">Status of your submitted leave applications</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-5">Leave Type</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaveRequests.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {item.leaveType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {item.fromDate} to {item.toDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.daysCount} {item.daysCount === 1 ? 'day' : 'days'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      <p className="truncate">{item.reason}</p>
                      {item.managerRemarks && (
                        <p className={`text-[10px] mt-0.5 truncate font-semibold ${
                          item.status === 'Approved'
                            ? 'text-emerald-700'
                            : item.status === 'Rejected'
                              ? 'text-red-700'
                              : 'text-slate-400'
                        }`}>
                          Manager: {item.managerRemarks}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestsSection;
