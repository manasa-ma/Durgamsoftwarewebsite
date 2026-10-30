import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmployeeLayout from '../../components/employee/EmployeeLayout';
import DashboardOverview from '../../components/employee/sections/DashboardOverview';
import AttendanceSection from '../../components/employee/sections/AttendanceSection';
import LeaveRequestsSection from '../../components/employee/sections/LeaveRequestsSection';
import MyProfileSection from '../../components/employee/sections/MyProfileSection';
import AnnouncementsSection from '../../components/employee/sections/AnnouncementsSection';
import ApplyLeaveModal from '../../components/employee/ApplyLeaveModal';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';

export const EmployeeDashboardPage = () => {
  const { employeeUser } = useEmployeeAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state synced with URL search params (e.g. ?tab=attendance)
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Modals state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    document.title = `${employeeUser?.name ? employeeUser.name + ' | ' : ''}Employee Dashboard | Durgam Soft`;
  }, [employeeUser]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'dashboard' ? {} : { tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <EmployeeLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
      {activeTab === 'dashboard' && (
        <DashboardOverview
          onNavigateTab={handleSelectTab}
          onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
        />
      )}

      {activeTab === 'attendance' && <AttendanceSection />}

      {activeTab === 'leaves' && (
        <LeaveRequestsSection onOpenApplyModal={() => setIsLeaveModalOpen(true)} />
      )}

      {activeTab === 'profile' && <MyProfileSection />}

      {activeTab === 'announcements' && <AnnouncementsSection />}

      {/* Apply Leave Modal */}
      {isLeaveModalOpen && (
        <ApplyLeaveModal
          onClose={() => setIsLeaveModalOpen(false)}
          onSuccess={() => {
            // Can switch to leaves tab if not already on it
            setActiveTab('leaves');
            setSearchParams({ tab: 'leaves' });
          }}
        />
      )}
    </EmployeeLayout>
  );
};

export default EmployeeDashboardPage;
