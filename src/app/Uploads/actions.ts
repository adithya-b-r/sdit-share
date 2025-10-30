'use server';

import { revalidatePath } from 'next/cache';
import { deleteFile } from '../appwrite/config';

export async function deleteFileAction(formData: FormData) {
  const documentId = formData.get('documentId') as string;
  const fileId = formData.get('fileId') as string;
  const userPassword = Number(formData.get('password'));

  const date = new Date();
  const correctPassword = date.getHours() * date.getMinutes();

  if (userPassword !== correctPassword) {
    return { success: false, error: 'Invalid password!' };
  }

  try {
    const res = await deleteFile(documentId, fileId);
    if (res.success) {
      revalidatePath('/files');
      return { success: true, message: 'File deleted successfully!' };
    } else {
      return { success: false, error: res.error };
    }
  } catch (error) {
    return { success: false, error: 'An error occurred while deleting the file' };
  }
}
