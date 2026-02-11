import { Download, Eye, FileText, FileUp, Calendar, Search, ArrowLeft } from 'lucide-react';
import { fetchFiles } from '../appwrite/config';
import FileActions from '../Uploads/FileActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ViewFiles() {
  const visibility = true;
  let files = [];
  let error = null;

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

  const getFileIconColor = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return 'text-red-500 bg-red-50 border-red-200';
      case 'png': case 'jpg': case 'jpeg': case 'gif': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'xls': case 'xlsx': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'doc': case 'docx': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'zip': case 'rar': return 'text-orange-500 bg-orange-50 border-orange-200';
      default: return 'text-blue-500 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Dashboard Header */}
        <div className="bg-[#0f2140] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-[#0f2140]/10">
          <div className="flex items-center gap-4">
            <a href="/" className="p-2 text-blue-200/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Back to Upload">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Dashboard
              </h1>
              <p className="text-blue-200/50 text-sm mt-0.5">
                {files.length} file{files.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
          </div>

          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-200/40 group-focus-within:text-blue-300 transition-colors" />
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder:text-blue-200/40 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all w-full sm:w-64"
            />
          </div>
        </div>

        {visibility ? (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                <span>Error: {error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {files.map((file) => {
                const iconStyle = getFileIconColor(file.fileName);

                return (
                  <div
                    key={file.$id}
                    className="group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 overflow-hidden">
                      <div className={`p-2.5 rounded-lg border ${iconStyle} transition-colors flex-shrink-0`}>
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#0f2140] text-sm sm:text-base truncate pr-2" title={file.fileName}>
                          {file.fileName}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {file.timeStamp
                              ? new Date(file.timeStamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                              : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <a
                        href={file.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </a>

                      <a
                        href={file.fileURL}
                        download
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                      <FileActions documentId={file.$id} fileId={file.id} />
                    </div>
                  </div>
                );
              })}

              {files.length === 0 && !error && (
                <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-xl">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 text-orange-500 mb-4">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0f2140]">No files yet</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Upload your first file to get started.</p>
                  <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md shadow-blue-200 transition-colors">
                    <FileUp className="w-4 h-4" />
                    Upload File
                  </a>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <h1 className='text-lg font-semibold text-[#0f2140]'>
              Service Unavailable
            </h1>
            <p className="text-sm text-slate-500">
              File services are currently disabled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
