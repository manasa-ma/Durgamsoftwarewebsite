import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Building,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Eye,
  Trash2,
  X,
  Check,
  Upload,
  Plus,
  Tag,
  DollarSign,
  LayoutGrid,
  List,
  ExternalLink,
  ChevronRight,
  User,
  CreditCard,
  Briefcase,
  Camera,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getRegisteredUsers } from '../../utils/authStorage';

const DEPARTMENTS = [
  'All Departments',
  'Software Engineer',
  'HR',
  'Sales',
  'Hardware & POS Support',
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'On Leave', label: 'On Leave' },
  { value: 'Probation', label: 'Probation' },
  { value: 'Inactive', label: 'Inactive' },
];

const SUGGESTED_COLUMNS = [
  'Blood Group',
  'Aadhaar / National ID',
  'Alternate Phone',
  'PAN Card',
  'LinkedIn Profile',
  'Highest Qualification',
  'Previous Experience',
  'Primary Skillset',
];

export const AdminEmployeesPage = () => {
  const { getAuthHeaders } = useAdminAuth();

  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    onLeave: 0,
    probation: 0,
    departmentsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals state
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Add / Edit Employee
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    department: 'Software Engineer',
    designation: '',
    phone: '',
    joiningDate: '',
    employmentType: 'Full-time / Permanent',
    reportingManager: 'Venu Durgam (Technical Director)',
    location: 'Cherlapalli',
    workShift: '9:00 AM - 6:00 PM',
    currentAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: 'Family',
    bloodGroup: 'B+',
    dateOfBirth: '',
    gender: 'Not Specified',
    status: 'Active',
    salary: '₹ 8,50,000 / annum',
    photo: null,
    customColumns: [],
    skills: [],
  });

  // New Custom Column Inline Input inside Profile View Modal
  const [newColLabel, setNewColLabel] = useState('');
  const [newColValue, setNewColValue] = useState('');
  const [isAddingColInline, setIsAddingColInline] = useState(false);

  const fileInputRef = useRef(null);

  // Show Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch Employees List
  const fetchEmployees = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else if (!employees.length) setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedDepartment && selectedDepartment !== 'All Departments') {
        params.append('department', selectedDepartment);
      }
      if (selectedStatus && selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      const res = await fetch(`/api/admin/employees?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setEmployees(data.employees || []);
        if (data.stats) setStats(data.stats);

        // If viewing an employee, update its view reference
        if (viewingEmployee) {
          const fresh = data.employees.find((e) => e.id === viewingEmployee.id);
          if (fresh) setViewingEmployee(fresh);
        }
      } else {
        setError(data.message || 'Failed to load employee directory.');
      }
    } catch {
      // Fallback to local registered users
      const localUsers = getRegisteredUsers();
      setEmployees(localUsers);
      setStats({
        total: localUsers.length,
        active: localUsers.length,
        inactive: 0,
        onLeave: 0,
        probation: 0,
        departmentsCount: new Set(localUsers.map((u) => u.department)).size,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch & Polling
  useEffect(() => {
    fetchEmployees();
    const interval = setInterval(() => fetchEmployees(false), 15000);
    return () => clearInterval(interval);
  }, [searchTerm, selectedDepartment, selectedStatus]);

  // Handle Open Create Modal
  const handleOpenCreateModal = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      department: 'Software Engineer',
      designation: 'Software Development Engineer',
      phone: '+91 98800 12345',
      joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      employmentType: 'Full-time / Permanent',
      reportingManager: 'Venu Durgam (Technical Director)',
      location: 'Cherlapalli',
      workShift: '9:00 AM - 6:00 PM',
      currentAddress: 'Cherlapalli, Telangana 500051',
      emergencyContactName: 'Primary Contact',
      emergencyContactPhone: '+91 98800 54321',
      emergencyContactRelation: 'Family',
      bloodGroup: 'B+',
      dateOfBirth: '15 Jul 1997',
      gender: 'Male',
      status: 'Active',
      salary: '₹ 8,50,000 / annum',
      photo: null,
      customColumns: [
        { id: 'col-1', label: 'Aadhaar / National ID', value: '•••• •••• 9812' },
        { id: 'col-2', label: 'PAN Card', value: 'ABCPS••••K' },
      ],
      skills: ['React.js', 'TypeScript', 'Tailwind CSS'],
    });
    setIsFormModalOpen(true);
  };

  // Handle Form Submit (Create New Employee)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Please enter employee name.');
    if (!formData.email.trim()) return alert('Please enter employee email.');
    if (!formData.designation.trim()) return alert('Please enter designation.');

    setIsSubmitting(true);
    try {
      const url = '/api/admin/employees';
      const method = 'POST';

      const payload = {
        ...formData,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation,
        },
      };

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`Employee "${formData.name}" added successfully!`);
        setIsFormModalOpen(false);
        fetchEmployees();
      } else {
        alert(data.message || 'Operation failed. Please try again.');
      }
    } catch {
      alert('Network error while saving employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Employee
  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/employees/${deletingEmployee.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`Employee "${deletingEmployee.name}" deleted.`);
        setDeletingEmployee(null);
        if (viewingEmployee?.id === deletingEmployee.id) {
          setViewingEmployee(null);
        }
        fetchEmployees();
      } else {
        alert(data.message || 'Failed to delete employee.');
      }
    } catch {
      alert('Network error while deleting employee.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Photo Upload in Form
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, photo: event.target?.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add Custom Column in Form
  const handleAddCustomColumnInForm = (label = '', value = '') => {
    const newCol = {
      id: `col-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      label: label.trim() || 'Custom Field',
      value: value.trim() || '',
    };
    setFormData((prev) => ({
      ...prev,
      customColumns: [...(prev.customColumns || []), newCol],
    }));
  };

  // Remove Custom Column in Form
  const handleRemoveCustomColumnInForm = (colId) => {
    setFormData((prev) => ({
      ...prev,
      customColumns: (prev.customColumns || []).filter((c) => c.id !== colId),
    }));
  };

  // Update Custom Column in Form
  const handleUpdateCustomColumnInForm = (colId, key, val) => {
    setFormData((prev) => ({
      ...prev,
      customColumns: (prev.customColumns || []).map((c) =>
        c.id === colId ? { ...c, [key]: val } : c
      ),
    }));
  };

  // Inline Add Custom Column from Profile Details Modal
  const handleSaveInlineColumnInProfile = async () => {
    if (!newColLabel.trim() || !newColValue.trim()) {
      alert('Please provide both column name and value.');
      return;
    }

    const newCol = {
      id: `col-${Date.now()}`,
      label: newColLabel.trim(),
      value: newColValue.trim(),
    };

    const updatedCols = [...(viewingEmployee.customColumns || []), newCol];

    try {
      const res = await fetch(`/api/admin/employees/${viewingEmployee.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ customColumns: updatedCols }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setViewingEmployee(data.employee);
        setNewColLabel('');
        setNewColValue('');
        setIsAddingColInline(false);
        showToast(`Column "${newCol.label}" added to ${viewingEmployee.name}'s profile.`);
        fetchEmployees();
      } else {
        alert(data.message || 'Failed to add column.');
      }
    } catch {
      alert('Network error while adding column.');
    }
  };

  // Inline Delete Custom Column from Profile Details Modal
  const handleDeleteInlineColumnInProfile = async (colId) => {
    if (!window.confirm('Are you sure you want to remove this column?')) return;
    const updatedCols = (viewingEmployee.customColumns || []).filter((c) => c.id !== colId);

    try {
      const res = await fetch(`/api/admin/employees/${viewingEmployee.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ customColumns: updatedCols }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setViewingEmployee(data.employee);
        showToast('Column removed from profile.');
        fetchEmployees();
      }
    } catch {
      alert('Network error removing column.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#071525] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/40 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP HEADER & KPI METRICS                               */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-[#C74E23] text-xs font-bold uppercase tracking-wider border border-orange-500/20">
              Workforce Directory
            </span>
            <span className="text-slate-400 text-xs">CEO & Admin Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Employee Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Monitor complete employee profiles, onboard new team members, and administer corporate staff records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchEmployees(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
            title="Refresh directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Employee Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Employees
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.total}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Headcount</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Staff
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {stats.active}
            </span>
            <span className="text-[11px] text-emerald-600/80 font-medium">Verified Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              On Leave / Probation
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {(stats.onLeave || 0) + (stats.probation || 0)}
            </span>
            <span className="text-[11px] text-amber-600/80 font-medium">
              {stats.onLeave || 0} on leave, {stats.probation || 0} probation
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Departments
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">
              {stats.departmentsCount || 4}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Functional units</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SEARCH & FILTER TOOLBAR                                */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name, ID, email, or designation..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/10 text-slate-900 transition-all font-medium"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Department Select */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#C74E23] cursor-pointer shadow-2xs"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#C74E23] cursor-pointer shadow-2xs"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button if active */}
          {(searchTerm || selectedDepartment !== 'All Departments' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('All Departments');
                setSelectedStatus('all');
              }}
              className="text-xs text-[#C74E23] hover:underline font-bold px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. EMPLOYEES DIRECTORY (GRID & TABLE)                     */}
      {/* ======================================================== */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-[#C74E23] animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading corporate employee directory...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <p className="font-bold">{error}</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#C74E23] flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No employees match your search criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, changing the department filter, or click Add Employee to onboard a new staff member.
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add New Employee</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Avatar, Name, Status */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center font-black text-sm shrink-0 overflow-hidden border border-slate-200 shadow-2xs">
                      {emp.photo ? (
                        <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{emp.name ? emp.name.charAt(0) : 'E'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-[#C74E23] transition-colors line-clamp-1">
                        {emp.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">{emp.designation}</p>
                      <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">
                        {emp.id}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      emp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : emp.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : emp.status === 'Probation'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        emp.status === 'Active'
                          ? 'bg-emerald-500 animate-pulse'
                          : emp.status === 'On Leave'
                            ? 'bg-amber-500'
                            : emp.status === 'Probation'
                              ? 'bg-blue-500'
                              : 'bg-slate-400'
                      }`}
                    />
                    <span>{emp.status}</span>
                  </span>
                </div>

                {/* Key Details List */}
                <div className="py-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 font-medium">Department</span>
                    <span className="font-bold text-[#C74E23] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200/60 text-[11px]">
                      {emp.department}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 font-medium">Work Email</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]" title={emp.email}>
                      {emp.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 font-medium">Phone</span>
                    <span className="font-semibold text-slate-800">{emp.phone || '--'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 font-medium">Location</span>
                    <span className="font-medium text-slate-700">{emp.location || 'Cherlapalli'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 font-medium">Joined On</span>
                    <span className="font-medium text-slate-700">{emp.joiningDate || '--'}</span>
                  </div>

                  {emp.customColumns && emp.customColumns.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Custom:</span>
                      {emp.customColumns.slice(0, 2).map((col) => (
                        <span
                          key={col.id}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium truncate max-w-[150px]"
                          title={`${col.label}: ${col.value}`}
                        >
                          {col.label}: {col.value}
                        </span>
                      ))}
                      {emp.customColumns.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-bold">
                          +{emp.customColumns.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setViewingEmployee(emp)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200/80 shadow-2xs"
                  title="View full executive profile"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingEmployee(emp)}
                  className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  title="Delete employee"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Role & Department</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Location & Shift</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Employee Avatar & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-slate-200 shadow-2xs">
                          {emp.photo ? (
                            <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{emp.name ? emp.name.charAt(0) : 'E'}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-[#C74E23] transition-colors">
                            {emp.name}
                          </p>
                          <span className="font-mono text-[10px] text-slate-400 font-bold block">
                            {emp.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Designation & Department */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{emp.designation}</p>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#C74E23] border border-orange-200 mt-0.5">
                        {emp.department}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <p className="text-slate-800 font-medium truncate max-w-[200px]" title={emp.email}>
                        {emp.email}
                      </p>
                      <p className="text-slate-400 text-[11px]">{emp.phone || '--'}</p>
                    </td>

                    {/* Location & Shift */}
                    <td className="py-3.5 px-4">
                      <p className="text-slate-800 font-semibold">{emp.location || 'Cherlapalli'}</p>
                      <p className="text-slate-400 text-[11px]">{emp.workShift || '9:00 AM - 6:00 PM'}</p>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{emp.joiningDate || '--'}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : emp.status === 'On Leave'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : emp.status === 'Probation'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'Active'
                              ? 'bg-emerald-500 animate-pulse'
                              : emp.status === 'On Leave'
                                ? 'bg-amber-500'
                                : emp.status === 'Probation'
                                  ? 'bg-blue-500'
                                  : 'bg-slate-400'
                          }`}
                        />
                        <span>{emp.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                          title="View full executive profile"
                        >
                          <Eye className="w-4 h-4 text-[#C74E23]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingEmployee(emp)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          title="Delete employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: VIEW FULL PROFILE DETAILS                       */}
      {/* (Mirrors and surfaces everything from "My Profile")       */}
      {/* ======================================================== */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#071525] via-[#0B1F3A] to-[#142845] p-6 text-white flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-black shrink-0 overflow-hidden shadow-inner backdrop-blur-xs">
                  {viewingEmployee.photo ? (
                    <img src={viewingEmployee.photo} alt={viewingEmployee.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{viewingEmployee.name ? viewingEmployee.name.charAt(0) : 'E'}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {viewingEmployee.department}
                    </span>
                    <span className="font-mono text-xs text-slate-300 font-bold bg-white/10 px-2 py-0.5 rounded-md">
                      {viewingEmployee.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {viewingEmployee.status}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{viewingEmployee.name}</h2>
                  <p className="text-xs sm:text-sm text-slate-300">{viewingEmployee.designation}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingEmployee(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable Profile Cards */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm flex-1">
              {/* Section 1: Employment & Compensation Details */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#C74E23]" />
                  <span>Employment & Work Schedule</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Date of Joining</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.joiningDate || '15 Jan 2023'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Employment Type</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.employmentType || 'Full-time / Permanent'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Work Shift</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.workShift || '9:00 AM - 6:00 PM'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Work Location</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.location || 'Cherlapalli'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Reporting Manager</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.reportingManager || 'Venu Durgam (Technical Director)'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Annual Compensation (CTC)</span>
                    <span className="font-bold text-[#C74E23]">{viewingEmployee.salary || '₹ 8,50,000 / annum'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Residence Details */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#C74E23]" />
                  <span>Contact Information & Address</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Work Email</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.email}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Primary Phone</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-400 block font-medium">Residential Address</span>
                    <span className="font-bold text-slate-800">
                      {viewingEmployee.currentAddress || 'Cherlapalli, Telangana 500051'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Emergency Contact Details */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Emergency Contact (Next of Kin)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Contact Person</span>
                    <span className="font-bold text-slate-800">
                      {viewingEmployee.emergencyContact?.name || viewingEmployee.emergencyContactName || 'Primary Contact'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Relationship</span>
                    <span className="font-bold text-slate-800">
                      {viewingEmployee.emergencyContact?.relation || viewingEmployee.emergencyContactRelation || 'Family'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Emergency Phone</span>
                    <span className="font-bold text-slate-800">
                      {viewingEmployee.emergencyContact?.phone || viewingEmployee.emergencyContactPhone || '+91 98765 11223'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Personal & Statutory Info */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#C74E23]" />
                  <span>Personal & Statutory Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Blood Group</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.bloodGroup || 'B+'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Date of Birth</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.dateOfBirth || '14 Aug 1996'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Gender</span>
                    <span className="font-bold text-slate-800">{viewingEmployee.gender || 'Not Specified'}</span>
                  </div>
                  {viewingEmployee.bankDetails && (
                    <>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Bank Name</span>
                        <span className="font-bold text-slate-800">{viewingEmployee.bankDetails.bankName || 'HDFC Bank Ltd.'}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Account Number</span>
                        <span className="font-mono font-bold text-slate-800">{viewingEmployee.bankDetails.accountNumber || '•••• 4892'}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">IFSC Code</span>
                        <span className="font-mono font-bold text-slate-800">{viewingEmployee.bankDetails.ifscCode || 'HDFC0001842'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section 5: Custom Profile Columns (From "My Profile") */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#C74E23]" />
                    <span>Custom Profile Columns (Employee Defined)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingColInline(!isAddingColInline)}
                    className="text-xs font-bold text-[#C74E23] hover:text-[#B83E15] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingColInline ? 'Cancel' : 'Add Column'}</span>
                  </button>
                </div>

                {/* Inline Add Column Form */}
                {isAddingColInline && (
                  <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-2.5 animate-in fade-in duration-150">
                    <span className="text-xs font-bold text-slate-800 block">Add New Custom Field to this Profile:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newColLabel}
                        onChange={(e) => setNewColLabel(e.target.value)}
                        placeholder="Column Name (e.g. LinkedIn, Blood Group)"
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:border-[#C74E23]"
                      />
                      <input
                        type="text"
                        value={newColValue}
                        onChange={(e) => setNewColValue(e.target.value)}
                        placeholder="Column Value"
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:border-[#C74E23]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveInlineColumnInProfile}
                        className="px-3 py-1 rounded-lg bg-[#C74E23] text-white text-xs font-bold hover:bg-[#B83E15] cursor-pointer"
                      >
                        Save Column
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingColInline(false)}
                        className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Columns List */}
                {viewingEmployee.customColumns && viewingEmployee.customColumns.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {viewingEmployee.customColumns.map((col) => (
                      <div
                        key={col.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between group"
                      >
                        <div className="overflow-hidden">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                            {col.label}
                          </span>
                          <span className="font-bold text-slate-800 text-xs truncate block" title={col.value}>
                            {col.value}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteInlineColumnInProfile(col.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-opacity cursor-pointer shrink-0"
                          title="Delete column"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No custom columns added to this profile yet.</p>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const emp = viewingEmployee;
                  setViewingEmployee(null);
                  setDeletingEmployee(emp);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 transition-colors cursor-pointer"
              >
                Delete Employee
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingEmployee(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: ADD / EDIT EMPLOYEE FORM                        */}
      {/* ======================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Form Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 text-[#C74E23]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Onboard New Employee
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fill in the employee details to create their profile and credentials
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Photo Upload Header */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-16 h-16 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center text-xl font-bold shrink-0 overflow-hidden border border-slate-200">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>{formData.name ? formData.name.charAt(0) : 'E'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 block">Profile Photo (Optional)</span>
                  <p className="text-[11px] text-slate-500 mb-2">Upload PNG, JPG, or WEBP under 5MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#C74E23]" />
                      <span>{formData.photo ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>
                    {formData.photo && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, photo: null }))}
                        className="px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 1. Basic Identity */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>1. Identity & Role</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john.doe@durgamsoft.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800 bg-white"
                    >
                      {DEPARTMENTS.filter((d) => d !== 'All Departments').map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Designation / Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Employee ID (Optional - Auto-generated)
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="e.g. DS-SE-2026-101"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Employment Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800 bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Probation">Probation</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Employment & Compensation */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>2. Employment & Compensation</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Date of Joining
                    </label>
                    <input
                      type="text"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      placeholder="e.g. 15 Jan 2023"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Annual Salary (CTC)
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="e.g. ₹ 12,00,000 / annum"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Work Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Cherlapalli"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Work Shift
                    </label>
                    <input
                      type="text"
                      value={formData.workShift}
                      onChange={(e) => setFormData({ ...formData, workShift: e.target.value })}
                      placeholder="e.g. 9:00 AM - 6:00 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Employment Type
                    </label>
                    <input
                      type="text"
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      placeholder="e.g. Full-time / Permanent"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Reporting Manager
                    </label>
                    <input
                      type="text"
                      value={formData.reportingManager}
                      onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                      placeholder="e.g. Venu Durgam (Technical Director)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Contact & Emergency Details */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>3. Contact & Residence</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      value={formData.currentAddress}
                      onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                      placeholder="e.g. Cherlapalli, Telangana 500051"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Emergency Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g. Sunita Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="e.g. +91 98765 11223"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Custom Profile Columns */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#C74E23]" />
                    <span>4. Custom Profile Columns (Visible in Employee Profile)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleAddCustomColumnInForm()}
                    className="text-xs font-bold text-[#C74E23] hover:text-[#B83E15] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Column</span>
                  </button>
                </div>

                {/* Suggestions Quick Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Add:</span>
                  {SUGGESTED_COLUMNS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleAddCustomColumnInForm(item, '')}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-[#C74E23] text-slate-600 text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      + {item}
                    </button>
                  ))}
                </div>

                {/* Columns Rows */}
                {formData.customColumns && formData.customColumns.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {formData.customColumns.map((col) => (
                      <div key={col.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={col.label}
                          onChange={(e) => handleUpdateCustomColumnInForm(col.id, 'label', e.target.value)}
                          placeholder="Column Name (e.g. PAN Card)"
                          className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                        />
                        <input
                          type="text"
                          value={col.value}
                          onChange={(e) => handleUpdateCustomColumnInForm(col.id, 'value', e.target.value)}
                          placeholder="Column Value"
                          className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomColumnInForm(col.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                          title="Remove column"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No custom columns added yet.</p>
                )}
              </div>

              {/* Form Buttons Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Employee Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL: DELETE EMPLOYEE CONFIRMATION                    */}
      {/* ======================================================== */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Delete Employee Record?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <strong className="text-slate-900">{deletingEmployee.name}</strong> ({deletingEmployee.id}) from the company directory? This action cannot be undone.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>
                <span className="text-slate-400 font-medium">Department:</span>{' '}
                <span className="font-bold text-slate-800">{deletingEmployee.department}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Designation:</span>{' '}
                <span className="font-bold text-slate-800">{deletingEmployee.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Email:</span>{' '}
                <span className="font-bold text-slate-800">{deletingEmployee.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingEmployee(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeesPage;
