'use client';

import { Download, Share2, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchFiles } from '../appwrite/config';

const demoFiles = [
  {
    id: 1,
    name: 'Assignment1.pdf',
    url: 'https://example.com/file1.pdf',
  },
  {
    id: 2,
    name: 'Notes_JS_Basics.pdf',
    url: 'https://example.com/file2.pdf',
  },
  {
    id: 3,
    name: 'Project_Code.zip',
    url: 'https://example.com/file3.zip',
  },
];

type UploadedFile = {
  $id: string;
  fileName: string;
  fileURL: string;
  timeStamp: string;
};

export default function ViewFiles() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const getFiles = async () => {
      const res = await fetchFiles();

      if (res.success && res.data) {
        setFiles(res.data.map(({ $id, fileName, fileURL, timeStamp }) => ({ $id, fileName, fileURL, timeStamp })));
      } else {
        console.error(res.error);
      }
    }

    getFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          📂 Uploaded Files
        </h1>

        <div className="flex flex-col gap-4">
          {files.map((file) => (
            <div key={file.$id} className="bg-white shadow-md rounded-lg px-4 py-3 flex justify-between items-center hover:shadow-lg transition">

              <span className="font-medium text-gray-800">{file.fileName}</span>

              <div className="flex gap-4 items-center text-blue-600">
                <a
                  href={file.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800"
                  title="View"
                >
                  <Eye className="w-5 h-5" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(file.fileURL);
                    alert('Link copied to clipboard!');
                  }}
                  title="Share"
                  className="hover:text-blue-800"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <a
                  href={file.fileURL}
                  download
                  className="hover:text-blue-800"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}