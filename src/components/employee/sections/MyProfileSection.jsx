import React, { useState, useEffect, useRef } from 'react';
import {
  Edit2,
  Check,
  X,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  Calendar,
  Upload,
  Camera,
  Trash2,
  PlusCircle,
  Plus,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';

export const MyProfileSection = () => {
  const { employeeUser, updateProfile } = useEmployeeAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Add Column Modal State
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [newColumnValue, setNewColumnValue] = useState('');
  const [columnError, setColumnError] = useState('');

  // Editable form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    joiningDate: '',
    location: '',
    workShift: '',
    currentAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    customColumns: [],
  });

  // Keep form data in sync with current user
  useEffect(() => {
    if (employeeUser) {
      setFormData({
        name: employeeUser.name || '',
        email: employeeUser.email || '',
        phone: employeeUser.phone || '+91 98765 43210',
        joiningDate: employeeUser.joiningDate || '15 Jan 2023',
        location: employeeUser.location || 'Cherlapalli',
        workShift: employeeUser.workShift || '9:00 AM - 6:00 PM',
        currentAddress: employeeUser.currentAddress || 'Cherlapalli, Telangana 500051',
        emergencyContactName: employeeUser.emergencyContact?.name || 'Primary Contact',
        emergencyContactPhone: employeeUser.emergencyContact?.phone || '+91 98765 11223',
        customColumns: Array.isArray(employeeUser.customColumns) ? employeeUser.customColumns : [],
      });
    }
  }, [employeeUser, isEditing]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        updateProfile({ photo: base64Url });
        setSuccessToast('Profile photo updated successfully!');
        setTimeout(() => setSuccessToast(''), 3000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Remove Photo
  const handleRemovePhoto = () => {
    updateProfile({ photo: null });
    setSuccessToast('Profile photo removed.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Add Column Handler
  const handleAddColumnSubmit = (e) => {
    e.preventDefault();
    setColumnError('');

    if (!newColumnLabel.trim()) {
      setColumnError('Please provide a column name.');
      return;
    }
    if (!newColumnValue.trim()) {
      setColumnError('Please provide a value for this column.');
      return;
    }

    const newCol = {
      id: `col-${Date.now()}`,
      label: newColumnLabel.trim(),
      value: newColumnValue.trim(),
    };

    const updatedCols = [...(formData.customColumns || []), newCol];
    setFormData((prev) => ({ ...prev, customColumns: updatedCols }));
    updateProfile({ customColumns: updatedCols });

    setNewColumnLabel('');
    setNewColumnValue('');
    setShowAddColumnModal(false);
    setSuccessToast(`Column "${newCol.label}" added to profile!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Delete Column Handler
  const handleDeleteColumn = (colId) => {
    const updatedCols = (formData.customColumns || []).filter((c) => c.id !== colId);
    setFormData((prev) => ({ ...prev, customColumns: updatedCols }));
    updateProfile({ customColumns: updatedCols });
    setSuccessToast('Column removed from profile.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Update Custom Column in Form Edit Mode
  const handleCustomColumnValueChange = (colId, newValue) => {
    setFormData((prev) => ({
      ...prev,
      customColumns: (prev.customColumns || []).map((col) =>
        col.id === colId ? { ...col, value: newValue } : col
      ),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      alert('Please enter a valid work email.');
      return;
    }

    updateProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      joiningDate: formData.joiningDate.trim() || '15 Jan 2023',
      location: formData.location.trim() || 'Cherlapalli',
      workShift: formData.workShift.trim() || '9:00 AM - 6:00 PM',
      currentAddress: formData.currentAddress.trim(),
      emergencyContact: {
        ...employeeUser?.emergencyContact,
        name: formData.emergencyContactName.trim(),
        phone: formData.emergencyContactPhone.trim(),
      },
      customColumns: formData.customColumns,
    });

    setIsEditing(false);
    setSuccessToast('Profile updated successfully!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Suggested column names for user quick selection
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

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1F3A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/40 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Header with Edit Profile & Add Column Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0B1F3A]">My Profile</h2>
          <p className="text-xs text-slate-500">
            {isEditing
              ? 'Update your personal and contact details'
              : 'View and manage your employee profile, photo, and custom fields'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Add Column Button */}
          <button
            type="button"
            onClick={() => setShowAddColumnModal(true)}
            className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#C74E23] border border-orange-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C74E23]" />
            <span>Add Column</span>
          </button>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#071525] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        {/* User Badge Top with Photo Upload Option */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            {/* Avatar / Photo Container */}
            <div className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-xs shrink-0 overflow-hidden border-2 border-slate-200">
              {employeeUser?.photo ? (
                <img
                  src={employeeUser.photo}
                  alt={employeeUser?.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{employeeUser?.name ? employeeUser.name.charAt(0) : 'E'}</span>
              )}

              {/* Hover Overlay Button to trigger upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                title="Upload Profile Photo"
              >
                <Camera className="w-5 h-5 mb-0.5 text-orange-400" />
                <span>{employeeUser?.photo ? 'Change' : 'Upload'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-[#0B1F3A]">
                  {employeeUser?.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-[#C74E23] border border-orange-200">
                  {employeeUser?.department}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {employeeUser?.designation}
              </p>

              {/* Photo Upload Actions */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>{employeeUser?.photo ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {employeeUser?.photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active Status
            </span>
          </div>
        </div>

        {/* Form Mode vs View Mode */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                  required
                />
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>Work Email *</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Date of Joining */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>Date of Joining</span>
                </label>
                <input
                  type="text"
                  value={formData.joiningDate}
                  onChange={(e) => handleChange('joiningDate', e.target.value)}
                  placeholder="e.g. 15 Jan 2023"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Work Location */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>Work Location</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Work Shift */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>Work Shift</span>
                </label>
                <input
                  type="text"
                  value={formData.workShift}
                  onChange={(e) => handleChange('workShift', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Residential Address */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Residential Address</span>
                </label>
                <input
                  type="text"
                  value={formData.currentAddress}
                  onChange={(e) => handleChange('currentAddress', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Emergency Contact Name */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Emergency Contact Name</span>
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Emergency Contact Phone */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Emergency Contact Phone</span>
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* System Managed Fields */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                <span className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>System Managed</span>
                </span>
                <span>
                  Department ({employeeUser?.department}) & Designation ({employeeUser?.designation}) are managed by HR Administration.
                </span>
              </div>
            </div>

            {/* Custom Columns Edit Section */}
            {formData.customColumns && formData.customColumns.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C74E23]" />
                    <span>Custom Profile Columns</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddColumnModal(true)}
                    className="text-xs font-bold text-[#C74E23] hover:text-[#B83E15] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.customColumns.map((col) => (
                    <div key={col.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-600 truncate">
                          {col.label}
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(col.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete column"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={col.value}
                        onChange={(e) => handleCustomColumnValueChange(col.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                        placeholder="Value..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Full Name</span>
                <span className="font-bold text-slate-800 text-sm">{employeeUser?.name}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Department</span>
                <span className="font-bold text-slate-800 text-sm">{employeeUser?.department}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Designation</span>
                <span className="font-bold text-slate-800 text-sm">{employeeUser?.designation}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Work Email</span>
                <span className="font-bold text-slate-800 text-sm truncate block">
                  {employeeUser?.email}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Phone Number</span>
                <span className="font-bold text-slate-800 text-sm">
                  {employeeUser?.phone || '+91 98765 43210'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Work Location</span>
                <span className="font-bold text-slate-800 text-sm">
                  {employeeUser?.location || 'Cherlapalli'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Work Shift</span>
                <span className="font-bold text-slate-800 text-sm">
                  {employeeUser?.workShift || '9:00 AM - 6:00 PM'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Date of Joining</span>
                <span className="font-bold text-slate-800 text-sm">
                  {employeeUser?.joiningDate || '15 Jan 2023'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Employment Type</span>
                <span className="font-bold text-slate-800 text-sm">
                  {employeeUser?.employmentType || 'Full-time / Permanent'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Reporting Manager</span>
                <span className="font-bold text-slate-800 text-sm">
                  {employeeUser?.reportingManager || 'Venu Durgam'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Residential Address</span>
                <span className="font-bold text-slate-800 text-sm truncate block">
                  {employeeUser?.currentAddress || 'Cherlapalli, Telangana 500051'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Emergency Contact</span>
                <span className="font-bold text-slate-800 text-sm">
                  {employeeUser?.emergencyContact?.name || 'Primary Contact'} (
                  {employeeUser?.emergencyContact?.phone || '+91 98765 11223'})
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Account Status</span>
                <span className="font-bold text-emerald-600 text-sm">Active</span>
              </div>

              {/* Dynamic Custom Columns rendered in grid */}
              {formData.customColumns && formData.customColumns.length > 0 && formData.customColumns.map((col) => (
                <div
                  key={col.id}
                  className="p-3.5 rounded-xl bg-orange-50/40 border border-orange-200/70 relative group transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-500 font-bold block truncate pr-2">
                      {col.label}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-[#C74E23]">
                        Custom
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(col.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity cursor-pointer rounded"
                        title={`Delete ${col.label}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-sm truncate block">
                    {col.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Add Column button in view mode */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAddColumnModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#C74E23] bg-slate-50/50 hover:bg-orange-50/50 text-slate-600 hover:text-[#C74E23] text-xs font-bold transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#C74E23]" />
                <span>Add Another Column / Detail</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ADD COLUMN MODAL                                         */}
      {/* ========================================================= */}
      {showAddColumnModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setShowAddColumnModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full my-auto overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0B1F3A] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#F97316]">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide">Add Profile Column</h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Add a custom detail or attribute to your profile
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddColumnModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddColumnSubmit} className="p-6 space-y-4">
              {columnError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{columnError}</span>
                </div>
              )}

              {/* Suggestions Chips */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                  Popular Suggestions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_COLUMNS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNewColumnLabel(sug)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer border ${
                        newColumnLabel === sug
                          ? 'bg-[#C74E23] text-white border-[#C74E23]'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column Name */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Column Name / Title *
                </label>
                <input
                  type="text"
                  value={newColumnLabel}
                  onChange={(e) => setNewColumnLabel(e.target.value)}
                  placeholder="e.g. Blood Group, Aadhaar Number, LinkedIn..."
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium"
                />
              </div>

              {/* Column Value */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Column Value *
                </label>
                <input
                  type="text"
                  value={newColumnValue}
                  onChange={(e) => setNewColumnValue(e.target.value)}
                  placeholder="e.g. B+, 1234-5678-9012, https://..."
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#C74E23] focus:bg-white focus:ring-2 focus:ring-[#C74E23]/15 transition-all font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddColumnModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfileSection;
