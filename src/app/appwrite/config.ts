import { timeStamp } from 'console';
import { Client, Query, Databases, Storage, ID } from "appwrite";

export const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
  uploadedFilesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_UPLOADED_FILES_COLLECTION_ID!,
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const databases = new Databases(client);
const storage = new Storage(client);

export const uploadFile = async (file: File, fileName: string) => {
  try{
    const uploaded = await storage.createFile(
      config.storageId,
      ID.unique(),
      file
    );

    const fileId = uploaded.$id;
    const fileURL = storage.getFileView(config.storageId, fileId);

    const response = await databases.createDocument(
      config.databaseId,
      config.uploadedFilesCollectionId,
      ID.unique(),
      {
        id: fileId,
        fileName: fileName,
        fileURL,
        timeStamp: uploaded.$createdAt
      }
    );

    return {success: true, response};
  }catch(err){
    console.error("File Upload Error: "+err);
    return {success: false, error: `File Upload Error: ${err}`};
  }
};