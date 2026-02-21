'use client';

import { UploadCloud, FileUp, FolderOpen, FolderUp, Loader2, X, FileText, Check, AlertCircle, Files } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { uploadFile } from './appwrite/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DarkVeil from '../components/DarkVeil';

export default function Home() {
  // Each entry: { id, file, customName, status: 'pending' | 'uploading' | 'done' | 'error', errorMsg? }
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const idCounter = useRef(0);

  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const generateId = () => {
    idCounter.current += 1;
    return `file-${Date.now()}-${idCounter.current}`;
  };

  const addFiles = useCallback((fileList) => {
    const newEntries = [];
    for (const f of fileList) {
      if (f.size <= 3 * 1024 * 1024 * 1024) {
        newEntries.push({
          id: generateId(),
          file: f,
          customName: f.name.includes('.') ? f.name.substring(0, f.name.lastIndexOf('.')) : f.name,
          status: 'pending',
          progress: 0,
        });
      } else {
        toast.warn(`"${f.name}" exceeds 3GB and was skipped.`);
      }
    }
    if (newEntries.length > 0) {
      setFiles((prev) => [...prev, ...newEntries]);
    }
  }, []);

  // --- File input handlers ---
  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleFolderChange = (e) => {
    if (e.target.files?.length) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  // --- Drag and drop ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Recursively read directory entries from drag-and-drop
  const readEntryRecursive = (entry) => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((f) => resolve([f]));
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const allFiles = [];
        const readBatch = () => {
          reader.readEntries(async (entries) => {
            if (entries.length === 0) {
              resolve(allFiles);
              return;
            }
            for (const e of entries) {
              const nested = await readEntryRecursive(e);
              allFiles.push(...nested);
            }
            readBatch(); // directories may return entries in batches
          });
        };
        readBatch();
      } else {
        resolve([]);
      }
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const collectedFiles = [];
      const promises = [];

      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry?.();
        if (entry) {
          promises.push(readEntryRecursive(entry));
        } else if (items[i].kind === 'file') {
          const f = items[i].getAsFile();
          if (f) collectedFiles.push(f);
        }
      }

      const results = await Promise.all(promises);
      for (const arr of results) {
        collectedFiles.push(...arr);
      }

      if (collectedFiles.length > 0) {
        addFiles(collectedFiles);
      }
    }
  };

  // --- File list management ---
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const updateCustomName = (id, name) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, customName: name } : f)));
  };

  // --- Upload ---
  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) {
      toast.warn('No files to upload');
      return;
    }

    const hasEmptyName = pendingFiles.some((f) => !f.customName.trim());
    if (hasEmptyName) {
      toast.warn('Please enter a name for all files');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const entry of pendingFiles) {
      // Mark as uploading
      setFiles((prev) =>
        prev.map((f) => (f.id === entry.id ? { ...f, status: 'uploading' } : f))
      );

      try {
        const response = await uploadFile(entry.file, entry.customName, (progress) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? {
                  ...f,
                  progress: progress.progress,
                  uploadedSize: (progress.progress / 100) * f.file.size,
                }
                : f
            )
          );
        });
        if (response?.success) {
          setFiles((prev) =>
            prev.map((f) => (f.id === entry.id ? { ...f, status: 'done', progress: 100 } : f))
          );
          successCount++;
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, status: 'error', errorMsg: response?.error || 'Upload failed', progress: 0 }
                : f
            )
          );
          failCount++;
        }
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === entry.id ? { ...f, status: 'error', errorMsg: 'Unexpected error' } : f
          )
        );
        failCount++;
      }
    }

    setUploading(false);

    if (successCount > 0 && failCount === 0) {
      toast.success(`${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully!`);
      // Remove completed files after a brief delay
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.status !== 'done'));
      }, 1500);
    } else if (successCount > 0 && failCount > 0) {
      toast.info(`${successCount} uploaded, ${failCount} failed.`);
    } else {
      toast.error(`All ${failCount} file${failCount > 1 ? 's' : ''} failed to upload.`);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const pendingCount = files.filter((f) => f.status === 'pending' || f.status === 'error').length;

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* DarkVeil Animated Background */}
      <div className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
          resolutionScale={1}
        />
      </div>

      <ToastContainer position='top-center' theme="colored" hideProgressBar autoClose={3000} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">

        {/* Main Card */}
        <div className="w-full max-w-lg bg-violet-600/20 backdrop-blur-xl rounded-2xl border-2 border-inset border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)] p-8 flex flex-col gap-7 animate-in fade-in zoom-in-95 duration-700 ease-out">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-orange-500/15 text-orange-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-orange-500/25 mb-2">
              <UploadCloud className="w-3 h-3" />
              Share Files
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Upload Files
            </h1>
            <p className="text-white text-sm">
              Upload files or entire folders to share. Max 3GB per file.
            </p>
          </div>

          {/* Hidden file inputs */}
          <input
            type="file"
            accept="*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
          <input
            type="file"
            ref={folderInputRef}
            onChange={handleFolderChange}
            hidden
            // @ts-ignore
            webkitdirectory=""
            directory=""
            mozdirectory=""
          />

          {/* Upload Zone */}
          {files.length === 0 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                  group w-full relative
                  border-2 border-dashed rounded-xl p-8
                  flex flex-col items-center justify-center gap-5
                  transition-all duration-300 ease-in-out
                  ${isDragOver
                  ? 'border-blue-400 bg-blue-500/15 scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                  : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
                }
              `}
            >
              <div className={`p-3.5 rounded-full transition-all duration-300 ${isDragOver ? 'bg-blue-500/20 text-blue-400 scale-110' : 'bg-white/10 text-blue-400/80'}`}>
                <UploadCloud className="w-7 h-7" />
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-white/80">
                  Drag & drop files or folders here
                </p>
                <p className="text-xs text-white/30">
                  Or use the buttons below to browse
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex text-white items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-400 bg-blue-500/15 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 active:scale-95"
                >
                  <Files className="w-4 h-4 group-hover:animate-bounce" />
                  Choose Files
                </button>
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className="text-slate-200 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-400 bg-orange-500/15 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 hover:scale-105 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-300 active:scale-95"
                >
                  <FolderUp className="w-4 h-4 group-hover:animate-bounce" />
                  Choose Folder
                </button>
              </div>
            </div>
          ) : (
            /* File List */
            <div className="space-y-3">
              {/* List header */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">
                  {files.length} file{files.length !== 1 ? 's' : ''} queued
                </p>
                <div className="flex items-center gap-2">
                  {!uploading && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
                      >
                        + Files
                      </button>
                      <button
                        onClick={() => folderInputRef.current?.click()}
                        className="text-xs font-medium text-orange-400 hover:text-orange-300 px-2 py-1 rounded hover:bg-orange-500/10 transition-colors"
                      >
                        + Folder
                      </button>
                      <button
                        onClick={clearAll}
                        className="text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                      >
                        Clear All
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Drop zone for adding more */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`max-h-64 overflow-y-auto space-y-2 rounded-xl p-1 transition-colors ${isDragOver ? 'bg-blue-500/10' : ''}`}
              >
                {files.map((entry) => (
                  <div
                    key={entry.id}
                    className={`rounded-lg p-3 flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${entry.status === 'done'
                      ? 'bg-emerald-500/10 border border-emerald-500/25'
                      : entry.status === 'error'
                        ? 'bg-red-500/10 border border-red-500/25'
                        : entry.status === 'uploading'
                          ? 'bg-blue-500/10 border border-blue-500/25'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                  >
                    {/* Status icon */}
                    <div className="flex-shrink-0">
                      {entry.status === 'uploading' ? (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      ) : entry.status === 'done' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : entry.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {entry.status === 'pending' || entry.status === 'error' ? (
                          <input
                            type="text"
                            value={entry.customName}
                            onChange={(e) => updateCustomName(entry.id, e.target.value)}
                            className="flex-1 min-w-0 bg-transparent text-sm text-white border-b border-white/15 focus:border-blue-400 focus:outline-none py-0.5 transition-colors"
                            placeholder="File name"
                          />
                        ) : (
                          <p className="text-sm text-white truncate">{entry.customName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-white/30 truncate" title={entry.file.name}>
                          {entry.file.name}
                        </p>
                        <span className="text-[10px] text-white/20">•</span>
                        <p className="text-[10px] text-white/30 flex-shrink-0">
                          {formatSize(entry.file.size)}
                        </p>
                      </div>
                      {entry.status === 'uploading' && (
                        <div className="mt-2 space-y-1">
                          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-400 h-1.5 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${entry.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-white/50">
                            <span>{Math.round(entry.progress)}%</span>
                            <span>
                              {formatSize(entry.uploadedSize || 0)} / {formatSize(entry.file.size)}
                            </span>
                          </div>
                        </div>
                      )}
                      {entry.status === 'error' && entry.errorMsg && (
                        <p className="text-[10px] text-red-400 mt-0.5 truncate" title={entry.errorMsg}>
                          {entry.errorMsg}
                        </p>
                      )}
                    </div>

                    {/* Remove button */}
                    {(entry.status === 'pending' || entry.status === 'error' || entry.status === 'done') && !uploading && (
                      <button
                        onClick={() => removeFile(entry.id)}
                        className="flex-shrink-0 p-1 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-5">
            <div className="pt-2 space-y-3">
              <button
                disabled={uploading || pendingCount === 0}
                onClick={handleUpload}
                className={`
                      w-full flex justify-center items-center gap-2 
                      font-semibold text-white py-3 rounded-xl
                      transition-all duration-300 active:scale-[0.98]
                      ${uploading || pendingCount === 0
                    ? 'bg-blue-500/20 cursor-not-allowed text-white/40'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.02]'
                  }
                  `}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4" />
                    <span>
                      {pendingCount > 0
                        ? `Upload ${pendingCount} File${pendingCount > 1 ? 's' : ''}`
                        : 'Upload Files'}
                    </span>
                  </>
                )}
              </button>

              <div className="flex w-full items-center justify-center">
                <a
                  href="/Uploads"
                  className="w-full flex items-center justify-center text-sm font-semibold text-orange-400/80 hover:text-orange-300 flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-orange-500/15 transition-all duration-300 hover:scale-[1.02]"
                >
                  <FolderOpen className="w-4 h-4" />
                  View All Files
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full mb-2 text-white text-sm font-medium text-center">
          &copy; {new Date().getFullYear()} SDIT Share. Maximum file size: 3GB.
        </div>
      </div>
    </div>
  );
}
