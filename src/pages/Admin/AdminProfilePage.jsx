import React, { useState, useEffect, useRef } from 'react';
import {
  Edit2,
  Check,
  X,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
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
  Briefcase,
  Award,
  Building,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminProfilePage = () => {
  const { adminUser, updateProfile } = useAdminAuth();
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
    currentAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    customColumns: [],
  });

  // Keep form data in sync with current CEO / Admin user
  useEffect(() => {
    if (adminUser) {
      setFormData({
        name: adminUser.name || 'Venu Durgam',
        email: adminUser.email || 'ceo@durgamsoft.com',
        phone: adminUser.phone || '+91 98800 12345',
        joiningDate: adminUser.joiningDate || '01 Jan 2020',
        location: adminUser.location || 'Cherlapalli, Hyderabad',
        currentAddress: adminUser.currentAddress || 'Cherlapalli, Hyderabad, Telangana 500051',
        emergencyContactName: adminUser.emergencyContact?.name || 'Executive Office',
        emergencyContactPhone: adminUser.emergencyContact?.phone || '+91 98800 54321',
        customColumns: Array.isArray(adminUser.customColumns) ? adminUser.customColumns : [],
      });
    }
  }, [adminUser, isEditing]);

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
      joiningDate: formData.joiningDate.trim() || '01 Jan 2020',
      location: formData.location.trim() || 'Cherlapalli, Hyderabad',
      currentAddress: formData.currentAddress.trim(),
      emergencyContact: {
        ...adminUser?.emergencyContact,
        name: formData.emergencyContactName.trim(),
        phone: formData.emergencyContactPhone.trim(),
      },
      customColumns: formData.customColumns,
    });

    setIsEditing(false);
    setSuccessToast('CEO profile updated successfully!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Suggested column names for CEO
  const SUGGESTED_COLUMNS = [
    'Director ID (DIN)',
    'Passport Number',
    'LinkedIn Profile',
    'Tax ID / PAN',
    'Qualification',
    'Alternate Emergency Phone',
    'Direct Line Extension',
    'Aadhaar / National ID',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
          <h2 className="text-2xl font-black text-[#0B1F3A] tracking-tight">CEO Profile</h2>
          <p className="text-xs text-slate-500">
            {isEditing
              ? 'Update your executive contact, location, and credentials'
              : 'View and manage your executive profile, official photograph, and custom fields'}
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
              {adminUser?.photo ? (
                <img
                  src={adminUser.photo}
                  alt={adminUser?.name || 'CEO Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{adminUser?.name ? adminUser.name.charAt(0) : 'V'}</span>
              )}

              {/* Hover Overlay Button to trigger upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                title="Upload Profile Photo"
              >
                <Camera className="w-5 h-5 mb-0.5 text-orange-400" />
                <span>{adminUser?.photo ? 'Change' : 'Upload'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-[#0B1F3A]">
                  {adminUser?.name || 'Venu Durgam'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-[#C74E23] border border-orange-200">
                  {adminUser?.department || 'Executive Leadership'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  CEO
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {adminUser?.designation || 'Managing Director & CEO'}
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
                  <span>{adminUser?.photo ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {adminUser?.photo && (
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

          <div className="flex flex-col sm:items-end gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Executive Director
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Staff ID: {adminUser?.id || 'DS-CEO-001'}
            </span>
          </div>
        </div>

        {/* Form Mode vs View Mode */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold flex items-center gap-1">
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
                <label className="text-slate-600 font-bold flex items-center gap-1">
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
                <label className="text-slate-600 font-bold flex items-center gap-1">
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

              {/* Date of Appointment / Joining */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>Appointment / Foundation Date</span>
                </label>
                <input
                  type="text"
                  value={formData.joiningDate}
                  onChange={(e) => handleChange('joiningDate', e.target.value)}
                  placeholder="e.g. 01 Jan 2020"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Work Location / Headquarters */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C74E23]" />
                  <span>Headquarters Location</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/15 text-xs sm:text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Residential / Corporate Office Address */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Corporate Office / Address</span>
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
                <label className="text-slate-600 font-bold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Key Executive / Emergency Contact</span>
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
                <label className="text-slate-600 font-bold flex items-center gap-1">
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
                  <span>Executive Governance</span>
                </span>
                <span>
                  Role ({adminUser?.role || 'CEO'}) & Department ({adminUser?.department || 'Executive Leadership'}) are secured under Corporate Charter.
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
                <span className="font-bold text-slate-800 text-sm">{adminUser?.name || 'Venu Durgam'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Corporate Department</span>
                <span className="font-bold text-slate-800 text-sm">{adminUser?.department || 'Executive Leadership'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Executive Designation</span>
                <span className="font-bold text-slate-800 text-sm">{adminUser?.designation || 'Managing Director & CEO'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Work Email</span>
                <span className="font-bold text-slate-800 text-sm truncate block">
                  {adminUser?.email || 'ceo@durgamsoft.com'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Direct Phone</span>
                <span className="font-bold text-slate-800 text-sm">
                  {adminUser?.phone || '+91 98800 12345'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Headquarters Location</span>
                <span className="font-bold text-slate-800 text-sm">
                  {adminUser?.location || 'Cherlapalli, Hyderabad'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Foundation / Appointment Date</span>
                <span className="font-bold text-slate-800 text-sm">
                  {adminUser?.joiningDate || '01 Jan 2020'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Corporate Address</span>
                <span className="font-bold text-slate-800 text-sm">
                  {adminUser?.currentAddress || 'Cherlapalli, Hyderabad, Telangana 500051'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Emergency / Office Contact</span>
                <span className="font-bold text-slate-800 text-sm">
                  {adminUser?.emergencyContact?.name || 'Executive Office'} ({adminUser?.emergencyContact?.phone || '+91 98800 54321'})
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Governance Access</span>
                <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Full System & Board Authority
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-medium block mb-1">Entity Registration</span>
                <span className="font-bold text-slate-800 text-sm">Durgam Soft Solutions Pvt. Ltd.</span>
              </div>
            </div>

            {/* Custom Profile Columns in View Mode */}
            {formData.customColumns && formData.customColumns.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C74E23]" />
                    <span>Custom Profile Columns ({formData.customColumns.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddColumnModal(true)}
                    className="text-xs font-bold text-[#C74E23] hover:text-[#B83E15] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Column</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.customColumns.map((col) => (
                    <div
                      key={col.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 relative group flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-slate-400 font-medium text-xs block mb-1 truncate">
                          {col.label}
                        </span>
                        <span className="font-bold text-slate-800 text-sm break-all">
                          {col.value}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(col.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 cursor-pointer shrink-0"
                        title={`Delete ${col.label}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Executive Domains / Competencies */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#C74E23]" />
                <span>Executive Focus & Strategic Domains</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Enterprise Software Architecture',
                  'Billmaster ERP & POS Systems',
                  'Strategic B2B Growth',
                  'Corporate Governance',
                  'Full-Stack System Engineering',
                  'Product Innovation',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-[#C74E23] font-bold text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Corporate Authority Information Box */}
      <div className="p-5 rounded-2xl bg-[#0B1F3A] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-orange-400" />
            <h4 className="text-sm font-bold">Durgam Soft Executive Directorship</h4>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            You are operating with Super-Administrator and Managing Director privileges across all modules, including Attendance, Leave Approvals, Job Listings, and Team Rosters.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADD CUSTOM COLUMN MODAL                                  */}
      {/* ======================================================== */}
      {showAddColumnModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 text-[#C74E23]">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0B1F3A]">
                    Add Custom Profile Column
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add custom fields to your CEO profile
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddColumnModal(false);
                  setColumnError('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {columnError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{columnError}</span>
              </div>
            )}

            <form onSubmit={handleAddColumnSubmit} className="mt-4 space-y-4">
              {/* Column Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Column Name / Field Title *
                </label>
                <input
                  type="text"
                  value={newColumnLabel}
                  onChange={(e) => setNewColumnLabel(e.target.value)}
                  placeholder="e.g. Director ID (DIN), Passport, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                  Suggested Fields:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_COLUMNS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setNewColumnLabel(suggestion)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-orange-50 hover:text-[#C74E23] text-slate-700 transition-colors cursor-pointer"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column Value */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Field Value / Details *
                </label>
                <input
                  type="text"
                  value={newColumnValue}
                  onChange={(e) => setNewColumnValue(e.target.value)}
                  placeholder="e.g. 08927461 or Details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#C74E23] text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddColumnModal(false);
                    setColumnError('');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column to Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfilePage;
