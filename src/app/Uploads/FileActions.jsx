'use client';

import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteFile } from '../appwrite/config';
import { toast, ToastContainer } from 'react-toastify';

export default function FileActions({ documentId, fileId }) {
  const router = useRouter();

  const delete_file = async () => {
    const date = new Date();
    const pass = date.getHours() * date.getMinutes();

    //console.log(pass);

    const upass = Number(prompt("Password: "));

    if (pass === upass) {
      try {
        const res = await deleteFile(documentId, fileId);
        if (!res.success) {
          toast.warn(res.error);
        } else {
          toast.success("Deleted Successfully!");

          setTimeout(() => {
            router.refresh();
          }, 500);
        }
      } catch (error) {
        toast.error("An error occurred while deleting the file");
      }
    } else {
      toast.warn("Invalid password!");
    }
  };

  return (
    <>
      <button
        onClick={delete_file}
        title="Delete"
        className="hover:text-blue-800"
      >
        <Trash className="w-5 h-5 text-red-500" />
      </button>
      <ToastContainer />
    </>
  );
}
