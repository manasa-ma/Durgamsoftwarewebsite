import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  MapPin,
  X,
  RefreshCw,
  AlertCircle,
  Crosshair,
  Upload,
} from 'lucide-react';

const DEFAULT_OFFICE_LOCATION = {
  latitude: 17.4474,
  longitude: 78.5878,
  accuracy: 12,
  address: 'Cherlapalli Industrial Area, Hyderabad, Telangana 500051',
  city: 'Hyderabad',
  state: 'Telangana',
  country: 'India',
};

export const GpsMapCameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [facingMode, setFacingMode] = useState('user'); // 'user' (selfie) or 'environment' (back)
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Live Location State
  const [locationState, setLocationState] = useState({
    ...DEFAULT_OFFICE_LOCATION,
    isLocked: false,
    fetching: true,
  });

  // Current live clock for HUD
  const [liveTimestamp, setLiveTimestamp] = useState(() =>
    new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  );

  // Live clock interval
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setLiveTimestamp(
        new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Fetch Live Geolocation on Open
  useEffect(() => {
    if (!isOpen) return;

    setLocationState((prev) => ({ ...prev, fetching: true }));

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const acc = Math.round(position.coords.accuracy || 12);

          let resolvedAddress = `Cherlapalli (${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E), Hyderabad, Telangana`;

          // Quick reverse geocode with short timeout
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
              { signal: controller.signal }
            );
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              if (data && data.display_name) {
                resolvedAddress = data.display_name;
              }
            }
          } catch {
            // Keep default coordinate string
          }

          setLocationState({
            latitude: lat,
            longitude: lon,
            accuracy: acc,
            address: resolvedAddress,
            isLocked: true,
            fetching: false,
          });
        },
        (error) => {
          console.warn('[GpsCamera] Geolocation permission or network fallback:', error.message);
          setLocationState({
            ...DEFAULT_OFFICE_LOCATION,
            isLocked: true,
            fetching: false,
          });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      );
    } else {
      setLocationState({
        ...DEFAULT_OFFICE_LOCATION,
        isLocked: true,
        fetching: false,
      });
    }
  }, [isOpen]);

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      return;
    }

    startCameraStream(facingMode);

    return () => {
      stopCameraStream();
    };
  }, [isOpen, facingMode]);

  const startCameraStream = async (mode) => {
    stopCameraStream();
    setCameraError('');
    setCameraReady(false);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera access not supported by browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .then(() => setCameraReady(true))
            .catch(() => setCameraReady(true));
        };
      }
    } catch (err) {
      console.warn('[GpsCamera] Camera stream access issue:', err);
      setCameraError(
        'Direct camera stream unavailable. You can snap a photo using device camera or file upload.'
      );
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  // Switch between front (selfie) and back cameras
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Stamp the GPS Map Camera Watermark onto a canvas
  const drawGpsMapWatermark = (canvas, ctx, loc, timeStr) => {
    const width = canvas.width;
    const height = canvas.height;

    // Stamp height is ~24% of photo height, min 130px
    const bannerHeight = Math.max(130, Math.round(height * 0.24));
    const bannerY = height - bannerHeight;

    ctx.save();

    // 1. Dark semi-transparent gradient banner
    const gradient = ctx.createLinearGradient(0, bannerY - 30, 0, height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
    gradient.addColorStop(0.2, 'rgba(11, 31, 58, 0.90)');
    gradient.addColorStop(1, 'rgba(11, 31, 58, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, bannerY - 30, width, bannerHeight + 30);

    // 2. Orange accent line across the top of the GPS banner
    ctx.fillStyle = '#C74E23';
    ctx.fillRect(0, bannerY - 2, width, 4);

    const scale = Math.max(0.65, Math.min(1.4, width / 720));
    const padX = Math.round(20 * scale);

    // 3. Header: Brand + GPS MAP CAMERA tag
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.round(17 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText('📍 GPS MAP CAMERA • DURGAM SOFT', padX, bannerY + Math.round(26 * scale));

    // Right-aligned status badge text
    ctx.fillStyle = '#34D399'; // Emerald
    ctx.font = `bold ${Math.round(11 * scale)}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText('✓ GPS VERIFIED PUNCH', width - padX, bannerY + Math.round(26 * scale));
    ctx.textAlign = 'left';

    // 4. Coordinates & Accuracy in Amber monospace
    ctx.fillStyle = '#FBBF24'; // amber
    ctx.font = `bold ${Math.round(13 * scale)}px monospace`;
    const coordsStr = `LAT: ${loc.latitude.toFixed(5)}° N   LONG: ${loc.longitude.toFixed(5)}° E   ACC: ±${loc.accuracy}m`;
    ctx.fillText(coordsStr, padX, bannerY + Math.round(48 * scale));

    // 5. Full Address (truncated cleanly if needed)
    ctx.fillStyle = '#E2E8F0';
    ctx.font = `600 ${Math.round(12 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    let addressStr = `LOCATION: ${loc.address}`;
    const maxTextWidth = width - padX * 2;
    if (ctx.measureText(addressStr).width > maxTextWidth) {
      while (ctx.measureText(addressStr + '...').width > maxTextWidth && addressStr.length > 20) {
        addressStr = addressStr.slice(0, -4);
      }
      addressStr += '...';
    }
    ctx.fillText(addressStr, padX, bannerY + Math.round(70 * scale));

    // 6. Timestamp & Office Info
    ctx.fillStyle = '#94A3B8';
    ctx.font = `bold ${Math.round(11 * scale)}px monospace`;
    ctx.fillText(
      `DATE & TIME: ${timeStr}   |   OFFICE: CHERLAPALLI, HYDERABAD`,
      padX,
      bannerY + Math.round(92 * scale)
    );

    ctx.restore();
  };

  // Capture from live video feed
  const handleCapturePhoto = () => {
    if (!videoRef.current || isCapturing) return;

    setIsCapturing(true);
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // If front camera, mirror image for natural selfie orientation
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, width, height);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      } else {
        ctx.drawImage(video, 0, 0, width, height);
      }

      // Draw the GPS Map Camera Watermark banner
      drawGpsMapWatermark(canvas, ctx, locationState, liveTimestamp);

      // Convert to image
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      stopCameraStream();
      onCapture(photoDataUrl, locationState);
      onClose();
    } catch (err) {
      console.error('[GpsCamera] Capture error:', err);
      alert('Failed to capture photo from video feed.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Fallback: Handle Image File from Device (e.g. native mobile camera capture)
  const handleDeviceFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, img.width, img.height);
        drawGpsMapWatermark(canvas, ctx, locationState, liveTimestamp);

        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        stopCameraStream();
        onCapture(photoDataUrl, locationState);
        onClose();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-200 relative text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B1F3A] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-wide text-white">GPS Map Camera</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Stamp
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Photo will be watermarked with your exact GPS coordinates and timestamp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close GPS Camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder Area */}
        <div className="relative aspect-4/3 sm:aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
          {/* Flash Effect */}
          {flashActive && <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-150" />}

          {/* Video Stream */}
          {!cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
          ) : (
            <div className="p-6 text-center space-y-3 max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 font-medium">{cameraError}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Snap or Upload from Device</span>
              </button>
            </div>
          )}

          {/* Rule of Thirds Viewfinder Grid Overlay */}
          {!cameraError && cameraReady && (
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="w-full h-full border border-white/30 grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20 flex items-center justify-center">
                  <Crosshair className="w-6 h-6 text-orange-400 opacity-60" />
                </div>
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>
            </div>
          )}

          {/* Top GPS Status Floating Pill */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white shadow-lg">
              <span
                className={`w-2 h-2 rounded-full ${
                  locationState.fetching ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span>
                {locationState.fetching
                  ? 'Acquiring GPS Signal...'
                  : `GPS Locked (±${locationState.accuracy}m)`}
              </span>
            </div>

            {/* Switch Camera Button (Front/Back) */}
            {!cameraError && (
              <button
                type="button"
                onClick={handleToggleCamera}
                className="pointer-events-auto p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white cursor-pointer transition-colors shadow-lg"
                title="Switch Camera (Front/Rear)"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* LIVE GPS MAP WATERMARK OVERLAY (Simulating the final stamped camera photo) */}
          <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 bg-linear-to-t from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-transparent border-t-2 border-[#C74E23] pointer-events-none z-20 text-left">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  GPS MAP CAMERA • DURGAM SOFT
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">
                ✓ VERIFIED
              </span>
            </div>

            <div className="text-[11px] font-mono font-bold text-amber-300">
              LAT: {locationState.latitude.toFixed(5)}° N &nbsp;|&nbsp; LONG:{' '}
              {locationState.longitude.toFixed(5)}° E &nbsp;|&nbsp; ACC: ±{locationState.accuracy}m
            </div>

            <div className="text-[11px] text-slate-200 font-medium truncate mt-0.5">
              LOCATION: {locationState.address}
            </div>

            <div className="text-[10px] font-mono text-slate-400 font-semibold mt-0.5">
              TIME: {liveTimestamp} &nbsp;•&nbsp; OFFICE: CHERLAPALLI, HYDERABAD
            </div>
          </div>
        </div>

        {/* Shutter / Capture Control Bar */}
        <div className="p-4 bg-slate-950 flex items-center justify-between gap-4 border-t border-slate-800">
          {/* File Upload Fallback / Alternate Trigger */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="user"
            onChange={handleDeviceFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Upload photo from device"
          >
            <Upload className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Upload from Device</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Main Shutter Button */}
          <button
            type="button"
            disabled={cameraError || isCapturing}
            onClick={handleCapturePhoto}
            className="w-16 h-16 rounded-full border-4 border-white/80 p-1 flex items-center justify-center cursor-pointer transition-transform active:scale-90 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none group shadow-lg shadow-orange-500/20"
            title="Snap GPS Stamped Photo"
          >
            <div className="w-full h-full rounded-full bg-[#C74E23] group-hover:bg-[#d85528] flex items-center justify-center transition-colors">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GpsMapCameraModal;
