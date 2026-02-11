'use client';

import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteFile } from '../appwrite/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

export default function FileActions({ documentId, fileId }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const date = new Date();
    const pass = date.getHours() * date.getMinutes();
    const upass = Number(password);

    if (pass === upass) {
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
      toast.error("Incorrect password!");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Delete File"
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f2140]/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl shadow-slate-300/40 w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-[#0f2140]">Delete File?</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-500 mb-4">
                This action cannot be undone. Enter admin password to confirm.
              </p>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0f2140] placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all mb-4"
                onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-[#0f2140] hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" theme="colored" autoClose={3000} />
    </>
  );
}
