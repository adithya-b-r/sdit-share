'use client';

import { UploadCloud, FileUp, FolderOpen } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadFile } from './appwrite/config';
import { toast, ToastContainer } from 'react-toastify';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 50 * 1024 * 1024) {
      setFile(selectedFile);
      setCustomName(`${selectedFile.name}`.split('.')[0]);
    } else {
      toast.warn('File must be under 50MB');
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warn('Please select a file');
      return;
    }

    if (!customName.trim()) {
      toast.warn('Please enter a custom name');
      return;
    }

    setUploading(true);
    console.log('Uploading:', file.name);
    console.log('Custom name:', customName);

    const response = await uploadFile(file, customName);

    if (response) {
      if (response.success) {
        toast.success(`File "${file.name}" uploaded as "${customName}"`);
      } else {
        toast.warn(response.error);
      }

      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center relative">
      <ToastContainer position='top-center'/>
      <div className="bg-white md:w-full max-w-xl w-[94%] my-auto rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-800">SDIT SHARE</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and share files up to 50MB</p>
        </div>

        <input
          type="file"
          accept="*"
          ref={fileInputRef}
          onChange={handleChange}
          hidden
        />

        {/* Below div will trigger file upload */}
        <div
          onClick={triggerFileInput}
          className="cursor-pointer w-full border-2 border-dashed border-blue-300 rounded-xl p-6 text-center flex flex-col items-center gap-3 bg-blue-50 hover:bg-blue-100 transition"
        >
          <FileUp className="w-10 h-10 text-blue-600" />
          <p className="text-gray-600 font-medium">Choose a file to upload</p>
          {file && (
            <p className="text-sm text-gray-700 mt-2">
              <strong>Selected:</strong> {file.name}
            </p>
          )}
        </div>

        <div className="w-full">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Custom File Name
          </label>
          <input
            type="text"
            placeholder="Optional"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          disabled={uploading ? true : false}
          onClick={handleUpload}
          className={`w-full flex justify-center items-center gap-2 ${uploading ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3 px-6 rounded-full  transition`}
        >
          <UploadCloud className="w-5 h-5" />
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        <a
          href="/Uploads"
          className="text-sm font-medium text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
        >
          <FolderOpen className="w-4 h-4" />
          View All Uploaded Files
        </a>
      </div>
    </div>
  );
}
