'use client';

import { Download, Eye, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteFile, fetchFiles } from '../appwrite/config';
import { toast, ToastContainer } from 'react-toastify';

type UploadedFile = {
  $id: string;
  id: string;
  fileName: string;
  fileURL: string;
  timeStamp: string;
};


export default function ViewFiles() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const visibility = true;

  useEffect(() => {
    const getFiles = async () => {
      const res = await fetchFiles();
      if (res.success && res.data) {
        setFiles(res.data.map(({ $id, id, fileName, fileURL, timeStamp }) => ({
          $id,
          id,
          fileName,
          fileURL,
          timeStamp,
        })).reverse());
      } else {
        console.error(res.error);
      }
    };

    getFiles();
  }, []);


  const delete_file = async (documentId: string, fileId: string) => {
    const res = await deleteFile(documentId, fileId);
    if (!res.success) {
      toast.warn(res.error);
    } else {
      setFiles((prev) => prev.filter((file) => file.$id !== documentId));
      toast.success("Deleted Successfully!");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 py-10 px-4">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          📂 Uploaded Files
        </h1>

        {visibility ? (

          <div className="flex flex-col gap-4">
            {files.map((file) => (
              <div key={file.$id} className="bg-white shadow-md rounded-lg px-4 py-3 flex justify-between items-center hover:shadow-lg transition">

                <span className="font-medium text-gray-800 text-wrap break-all">{file.fileName}</span>

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

                  <a
                    href={file.fileURL}
                    download
                    className="hover:text-blue-800"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </a>

                  <button
                    onClick={() => delete_file(file.$id, file.id)}
                    title="Share"
                    className="hover:text-blue-800"
                  >
                    <Trash className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h1 className='text-center text-red-500 text-2xl font-semibold my-16'>Services are currently being disabled!</h1>
        )}
      </div>
    </div>
  );
}
