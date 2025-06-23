'use client';

import { UploadCloud, FileUp, FolderOpen, Pencil } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 50 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert('File must be under 50MB');
      e.target.value = '';
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    if (!customName.trim()) {
      alert('Please enter a custom name');
      return;
    }

    console.log('Uploading:', file.name);
    console.log('Custom name:', customName);

    alert(`File "${file.name}" uploaded as "${customName}"`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center relative">

      <div className="bg-white w-full max-w-xl my-auto rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-800">SDIT SHARE</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and share files up to 50MB</p>
        </div>

        <div className="w-full border-2 border-dashed border-blue-300 rounded-xl p-6 text-center flex flex-col items-center gap-3 bg-blue-50">
          <FileUp className="w-10 h-10 text-blue-600" />
          <p className="text-gray-600 font-medium">Choose a file to upload</p>

          <input
            type="file"
            accept=".pdf,.txt,.zip,.jpg,.png,.js,.py"
            onChange={handleChange}
            className="file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 mt-2"
          />

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
          onClick={handleUpload}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition"
        >
          <UploadCloud className="w-5 h-5" />
          Upload
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