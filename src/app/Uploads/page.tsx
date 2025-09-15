import { Download, Eye, Trash } from 'lucide-react';
import { fetchFiles } from '../appwrite/config';
import FileActions from '../Uploads/FileActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type UploadedFile = {
  $id: string;
  id: string;
  fileName: string;
  fileURL: string;
  timeStamp: string;
};

export default async function ViewFiles() {
  const visibility = true;
  let files: UploadedFile[] = [];
  let error: string | null = null;

  try {
    const res = await fetchFiles();
    if (res.success && res.data) {
      files = res.data.map(({ $id, id, fileName, fileURL, timeStamp }) => ({
        $id,
        id,
        fileName,
        fileURL,
        timeStamp,
      })).reverse();
    } else {
      error = res.error || 'Failed to fetch files';
    }
  } catch (err) {
    error = 'An error occurred while fetching files';
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          📂 Uploaded Files
        </h1>

        {visibility ? (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Error: {error}
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              {files.map((file) => (
                <div key={file.$id} className="bg-white shadow-md rounded-lg px-4 py-3 flex justify-between items-center hover:shadow-lg transition">
                  <span className="font-medium text-gray-800 text-wrap break-all">
                    {file.fileName}
                  </span>

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

                    <FileActions documentId={file.$id} fileId={file.id} />
                  </div>
                </div>
              ))}
              
              {files.length === 0 && !error && (
                <div className="text-center text-gray-500 py-8">
                  No files uploaded yet.
                </div>
              )}
            </div>
          </>
        ) : (
          <h1 className='text-center text-red-500 text-2xl font-semibold my-16'>
            Services are currently being disabled!
          </h1>
        )}
      </div>
    </div>
  );
}