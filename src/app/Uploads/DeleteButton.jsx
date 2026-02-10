'use client';

import { Trash } from 'lucide-react';
import { useTransition } from 'react';
import { deleteFileAction } from './actions';
import { toast } from 'react-toastify';

export default function DeleteButton({ documentId, fileId }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const date = new Date();
    const pass = date.getHours() * date.getMinutes();
    const userPassword = prompt("Password:");

    if (userPassword === null) return;

    const formData = new FormData();
    formData.append('documentId', documentId);
    formData.append('fileId', fileId);
    formData.append('password', userPassword);

    startTransition(async () => {
      const result = await deleteFileAction(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title="Delete"
      className={`hover:text-blue-800 ${isPending ? 'opacity-50' : ''}`}
    >
      <Trash className="w-5 h-5 text-red-500" />
    </button>
  );
}
