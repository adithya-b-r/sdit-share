'use client';

import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteFile } from '../appwrite/config';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function FileActions({ documentId, fileId }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    if (!password || password.trim() === "") {
      toast.error("Please enter a password");
      return;
    }

    const date = new Date();
    // Re-implemented to check strictly against string forms to avoid 0===0 if input is empty.
    const expectedDynamicPass = String(date.getHours() * date.getMinutes());
    const expectedEnvPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

    if (password === expectedDynamicPass || password === expectedEnvPass) {
      setIsDeleting(true);
      try {
        const res = await deleteFile(documentId, fileId);
        if (!res.success) {
          toast.warn(res.error);
          setIsDeleting(false);
        } else {
          toast.success("Deleted Successfully!");
          setIsOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 500);
        }
      } catch (error) {
        toast.error("An error occurred while deleting the file");
        setIsDeleting(false);
      }
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Delete File"
        className="p-2 text-slate-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl shadow-slate-300/40 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-500 dark:text-red-400 transition-colors">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white transition-colors">Delete File?</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-500 dark:text-white/60 mb-4 transition-colors">
                This action cannot be undone. Enter admin password to confirm.
              </p>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/20 transition-all mb-4"
                onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 dark:bg-red-600/90 dark:hover:bg-red-500 rounded-lg shadow-md shadow-red-200 dark:shadow-[0_0_15px_rgba(239,68,68,0.2)] dark:hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
