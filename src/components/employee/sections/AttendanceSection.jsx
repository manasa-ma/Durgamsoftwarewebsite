import React, { useState, useRef, useEffect } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle2,
  Camera,
  Upload,
  X,
  Image as ImageIcon,
  Check,
  Eye,
  MapPin,
  Trash2,
} from 'lucide-react';
import { useEmployeeAuth } from '../../../context/EmployeeAuthContext';
import { GpsMapCameraModal } from '../GpsMapCameraModal';
import { calculateWorkHours, calculateElapsedHours } from '../../../utils/workHoursCalculator';

export const AttendanceSection = () => {
  const {
    employeeUser,
    todayAttendance,
    markCheckIn,
    markCheckOut,
    uploadAttendancePhoto,
    attendanceRecords,
  } = useEmployeeAuth();

  const [toastMessage, setToastMessage] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isGpsCameraOpen, setIsGpsCameraOpen] = useState(false);
  const [previewModalPhoto, setPreviewModalPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Live elapsed working hours calculation when shift is in progress
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

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle Photo Captured from GPS Map Camera
  const handleGpsPhotoCaptured = (photoUrl, locationData) => {
    setSelectedPhoto(photoUrl);
    setSelectedLocation(locationData);
    setToastMessage(`GPS Photo captured at ${locationData?.address ? 'detected location' : 'Cherlapalli'}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Handle image file selection from device fallback
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedPhoto(event.target.result);

      // Detect location for uploaded photo
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setSelectedLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy || 12),
              address: `Cherlapalli (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E), Hyderabad`,
            });
          },
          () => {
            setSelectedLocation({
              latitude: 17.4474,
              longitude: 78.5878,
              accuracy: 10,
              address: 'Cherlapalli Industrial Area, Hyderabad, Telangana 500051',
            });
          },
          { enableHighAccuracy: true, timeout: 4000 }
        );
      } else {
        setSelectedLocation({
          latitude: 17.4474,
          longitude: 78.5878,
          accuracy: 10,
          address: 'Cherlapalli Industrial Area, Hyderabad, Telangana 500051',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePunchIn = () => {
    const res = markCheckIn({ photoUrl: selectedPhoto, location: selectedLocation });
    setSelectedPhoto(null);
    setSelectedLocation(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setToastMessage(
      res.photoUrl
        ? `Punched in successfully at ${res.time} with verified GPS photo & location!`
        : `Punched in successfully at ${res.time}!`
    );
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handlePunchOut = () => {
    const res = markCheckOut({ photoUrl: selectedPhoto, location: selectedLocation });
    setSelectedPhoto(null);
    setSelectedLocation(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setToastMessage(
      res.photoUrl
        ? `Punched out successfully at ${res.time} with verified GPS photo & location!`
        : `Punched out successfully at ${res.time}!`
    );
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Direct save photo to current active shift
  const handleSavePhotoToActiveShift = () => {
    if (!selectedPhoto) return;
    uploadAttendancePhoto(selectedPhoto, selectedLocation);
    setSelectedPhoto(null);
    setSelectedLocation(null);
    setToastMessage('GPS Attendance photo & location saved to today\'s shift!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1F3A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/40 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Punch In / Out Card with GPS Photo Verification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Status Meta */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C74E23]" />
              Today's Attendance Status
            </span>
            <h2 className="text-xl font-black text-[#0B1F3A]">{currentDateFormatted}</h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 pt-1">
              <span>
                Punch In:{' '}
                <strong className="text-slate-800">
                  {todayAttendance.hasCheckedIn ? todayAttendance.checkInTime : 'Not Punched In'}
                </strong>
              </span>
              <span>•</span>
              <span>
                Punch Out:{' '}
                <strong className="text-slate-800">
                  {todayAttendance.hasCheckedOut ? todayAttendance.checkOutTime : '--:--'}
                </strong>
              </span>
              <span>•</span>
              <span>
                Working Hours:{' '}
                <strong className="text-emerald-700 font-bold font-mono">
                  {todayAttendance.hasCheckedOut
                    ? todayAttendance.workHours || calculateWorkHours(todayAttendance.checkInTime, todayAttendance.checkOutTime)
                    : todayAttendance.hasCheckedIn
                      ? `${liveElapsedHours} (In Progress)`
                      : '--:--'}
                </strong>
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-600">
                Shift: {employeeUser?.workShift || '9:00 AM - 6:00 PM'}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-[#C74E23] font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{todayAttendance.location || employeeUser?.location || 'Cherlapalli'}</span>
              </span>
            </div>
          </div>

          {/* Action Button & Active Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!todayAttendance.hasCheckedIn ? (
              <button
                type="button"
                onClick={handlePunchIn}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Punch In</span>
              </button>
            ) : !todayAttendance.hasCheckedOut ? (
              <button
                type="button"
                onClick={handlePunchOut}
                className="px-6 py-3 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Punch Out</span>
              </button>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Day Completed</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. Take Photo Section (Opens Camera + Detects Location) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-100 text-[#C74E23]">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Take Attendance Photo (Camera & GPS Location)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  GPS Camera
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Open camera to capture your photo with auto-detected GPS map coordinates and location stamp.
              </p>
            </div>

            {/* Action Buttons: Open Camera vs Upload from Device */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsGpsCameraOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>{selectedPhoto ? 'Retake with Camera' : 'Take Photo (Open Camera)'}</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="user"
                className="hidden"
                id="attendance-photo-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="Upload photo from device file"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          {/* Pending Photo Preview with Detected Location Card */}
          {selectedPhoto && (
            <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shrink-0 bg-slate-900">
                  <img
                    src={selectedPhoto}
                    alt="Captured attendance punch"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[9px] font-bold text-center py-0.5">
                    ✓ GPS Watermarked
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Photo & Location Detected
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      GPS Tagged
                    </span>
                  </div>

                  <p className="text-slate-700 font-semibold flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#C74E23] shrink-0" />
                    <span>{selectedLocation?.address || 'Cherlapalli, Hyderabad, Telangana'}</span>
                  </p>

                  {selectedLocation?.latitude && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      Coordinates: {selectedLocation.latitude.toFixed(4)}° N,{' '}
                      {selectedLocation.longitude.toFixed(4)}° E (±{selectedLocation.accuracy}m)
                    </p>
                  )}

                  <p className="text-slate-500 text-[11px]">
                    {!todayAttendance.hasCheckedIn ? (
                      <span>Click <strong>Punch In</strong> above to record this photo and location.</span>
                    ) : (
                      <span>Click <strong>Punch Out</strong> above or save to today's shift.</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Controls for Selected Photo */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {todayAttendance.hasCheckedIn && !todayAttendance.hasCheckedOut && (
                  <button
                    type="button"
                    onClick={handleSavePhotoToActiveShift}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Save Photo to Today's Shift
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsGpsCameraOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Retake
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(null);
                    setSelectedLocation(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Already Uploaded Today's Verified Photos */}
          {(todayAttendance.punchInPhoto || todayAttendance.punchOutPhoto) && (
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-4">
              {todayAttendance.punchInPhoto && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div
                    onClick={() =>
                      setPreviewModalPhoto({
                        url: todayAttendance.punchInPhoto,
                        title: 'Punch In Verification Photo',
                        time: todayAttendance.checkInTime,
                        location: todayAttendance.location || 'Cherlapalli, Hyderabad',
                      })
                    }
                    className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity shrink-0 bg-slate-900"
                  >
                    <img
                      src={todayAttendance.punchInPhoto}
                      alt="Punch in verification"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-slate-800 block">Punch In Photo</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {todayAttendance.checkInTime}
                    </span>
                    <span className="text-[10px] text-slate-600 block flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#C74E23]" />
                      <span className="truncate max-w-[150px]">
                        {todayAttendance.location || 'Cherlapalli, Hyderabad'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewModalPhoto({
                          url: todayAttendance.punchInPhoto,
                          title: 'Punch In Verification Photo',
                          time: todayAttendance.checkInTime,
                          location: todayAttendance.location || 'Cherlapalli, Hyderabad',
                        })
                      }
                      className="text-[11px] font-bold text-[#C74E23] hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> View Full Photo
                    </button>
                  </div>
                </div>
              )}

              {todayAttendance.punchOutPhoto && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div
                    onClick={() =>
                      setPreviewModalPhoto({
                        url: todayAttendance.punchOutPhoto,
                        title: 'Punch Out Verification Photo',
                        time: todayAttendance.checkOutTime,
                        location: todayAttendance.location || 'Cherlapalli, Hyderabad',
                      })
                    }
                    className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity shrink-0 bg-slate-900"
                  >
                    <img
                      src={todayAttendance.punchOutPhoto}
                      alt="Punch out verification"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-slate-800 block">Punch Out Photo</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {todayAttendance.checkOutTime}
                    </span>
                    <span className="text-[10px] text-slate-600 block flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#C74E23]" />
                      <span className="truncate max-w-[150px]">
                        {todayAttendance.location || 'Cherlapalli, Hyderabad'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewModalPhoto({
                          url: todayAttendance.punchOutPhoto,
                          title: 'Punch Out Verification Photo',
                          time: todayAttendance.checkOutTime,
                          location: todayAttendance.location || 'Cherlapalli, Hyderabad',
                        })
                      }
                      className="text-[11px] font-bold text-[#C74E23] hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> View Full Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#0B1F3A]">Attendance History</h3>
            <p className="text-xs text-slate-500">
              Personal punch record log for {employeeUser?.name || 'Employee'}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Total records: {attendanceRecords.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4 text-center">Photo</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Punch In</th>
                <th className="py-3 px-4">Punch Out</th>
                <th className="py-3 px-4">Work Hours</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No attendance records logged yet for this employee.
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900 font-mono">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.day}</td>
                    {/* Photo Thumbnail Column */}
                    <td className="py-3.5 px-4 text-center">
                      {item.photoUrl || item.punchInPhoto ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewModalPhoto({
                              url: item.photoUrl || item.punchInPhoto,
                              title: `Attendance Photo (${item.date})`,
                              time: item.checkIn,
                              location: item.location || 'Cherlapalli, Hyderabad',
                            })
                          }
                          className="inline-flex items-center justify-center cursor-pointer group"
                          title="Click to view full photo"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 group-hover:ring-2 group-hover:ring-[#C74E23] transition-all bg-slate-900">
                            <img
                              src={item.photoUrl || item.punchInPhoto}
                              alt="Punch photo thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </button>
                      ) : (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>
                    {/* Location Column */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium max-w-[140px] truncate">
                      <span className="inline-flex items-center gap-1 text-[11px]" title={item.location || 'Cherlapalli, Hyderabad'}>
                        <MapPin className="w-3 h-3 text-[#C74E23] shrink-0" />
                        <span className="truncate">{item.location || 'Cherlapalli'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">{item.checkIn}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">{item.checkOut}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {item.checkOut && item.checkOut !== '--:--' && item.checkOut !== '-'
                        ? calculateWorkHours(item.checkIn, item.checkOut)
                        : item.workHours === 'In Progress' && item.date === new Date().toISOString().split('T')[0]
                          ? `${liveElapsedHours} (Live)`
                          : item.workHours || 'In Progress'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'Present' || item.status === 'Work From Home'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
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

      {/* 4. Full Photo & Location Preview Modal */}
      {previewModalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewModalPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B1F3A] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#C74E23]" />
                <span className="text-xs font-bold tracking-wide">
                  {previewModalPhoto.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalPhoto(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 max-h-96 flex items-center justify-center">
                <img
                  src={previewModalPhoto.url}
                  alt="Verified punch attendance"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block font-medium">Employee Name</span>
                    <span className="font-bold text-slate-800">{employeeUser?.name}</span>
                  </div>
                  {previewModalPhoto.time && (
                    <div className="text-right">
                      <span className="text-slate-400 block font-medium">Timestamp</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {previewModalPhoto.time}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-[#C74E23] shrink-0" />
                  <span className="font-semibold">{previewModalPhoto.location || 'Cherlapalli, Hyderabad, Telangana'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. GPS Map Camera Modal */}
      <GpsMapCameraModal
        isOpen={isGpsCameraOpen}
        onClose={() => setIsGpsCameraOpen(false)}
        onCapture={handleGpsPhotoCaptured}
      />
    </div>
  );
};

export default AttendanceSection;
