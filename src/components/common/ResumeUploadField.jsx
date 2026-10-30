import React, { useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const ResumeUploadField = ({
  file,
  onFileSelect,
  error,
  setError,
  required = true,
  maxSizeMB = 10,
  label = 'Upload Resume *',
  helperText = 'Supported formats: PDF, DOC, DOCX (Max 10MB)',
  id = 'resume-upload',
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const allowedExtensions = ['.pdf', '.doc', '.docx'];

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      if (setError) {
        setError('Please upload a valid PDF or Word document (.pdf, .doc, .docx)');
      }
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      if (setError) {
        setError(`File size (${formatFileSize(selectedFile.size)}) exceeds the ${maxSizeMB}MB limit`);
      }
      return;
    }

    if (setError) setError('');
    onFileSelect(selectedFile);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      validateAndSetFile(dropped);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
    if (setError) setError('');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider cursor-pointer"
        >
          {label}
        </label>
        {required && (
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Required
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleInputChange}
        className="hidden"
      />

      {file ? (
        /* Selected File Card */
        <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-300/80 bg-emerald-50/50 flex items-center justify-between gap-3 transition-all shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                  {file.name}
                </span>
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Ready</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {formatFileSize(file.size)} &bull; Click to change
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-slate-600 hover:text-black px-2.5 py-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove resume file"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-5 sm:p-6 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer group shadow-2xs ${
            isDragging
              ? 'border-[#C74E23] bg-orange-50/60 scale-[1.01]'
              : error
              ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
              : 'border-stone-200/90 hover:border-[#C74E23] bg-stone-50/40 hover:bg-orange-50/25'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-orange-100/70 border border-orange-200/60 text-[#C74E23] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#C74E23] group-hover:text-white transition-all shadow-2xs">
            <Upload className="w-5 h-5 stroke-[2.2]" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#C74E23] transition-colors">
            Click to upload resume <span className="font-normal text-slate-500">or drag &amp; drop</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {helperText}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
