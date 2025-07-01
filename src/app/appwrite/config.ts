import { Client, Databases, Storage, ID, Query } from "appwrite";

export const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
  uploadedFilesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_UPLOADED_FILES_COLLECTION_ID!,
};

const client = new Client();

client
 .setEndpoint(config.endpoint)
 .setProject(config.projectId);

const databases = new Databases(client);
const storage = new Storage(client);

export const uploadFile = async (file: File, fileName: string) => {
  try {
    const existingFiles = await databases.listDocuments(
      config.databaseId,
      config.uploadedFilesCollectionId,
      [Query.equal("fileName", fileName)]
    );

    if (existingFiles.documents.length > 0) {
      return {
        success: false,
        error: `A file with the name "${fileName}" already exists. Please choose a different name or delete the existing file first.`,
      };
    }

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
        timeStamp: uploaded.$createdAt,
      }
    );

    return { success: true, response };
  } catch (err) {
    console.error("File Upload Error: " + err);
    return { success: false, error: `File Upload Error: ${err}` };
  }
};

export const fetchFiles = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.uploadedFilesCollectionId
    );

    console.log(response);
    return { success: true, data: response.documents };
  } catch (err) {
    return { success: false, error: `File Fetch Error: ${err}` };
  }
};

export const deleteFile = async (documentId: string, fileId: string) => {
  try {
    await storage.deleteFile(config.storageId, fileId);

    await databases.deleteDocument(
      config.databaseId,
      config.uploadedFilesCollectionId,
      documentId
    );

    return { success: true };
  } catch (err) {
    return { success: false, error: `File Delete Error: ${err}` };
  }
};

export const checkFileNameExists = async (fileName: string) => {
  try {
    const existingFiles = await databases.listDocuments(
      config.databaseId,
      config.uploadedFilesCollectionId,
      [Query.equal("fileName", fileName)]
    );

    return {
      success: true,
      exists: existingFiles.documents.length > 0,
      count: existingFiles.documents.length,
    };
  } catch (err) {
    return { success: false, error: `Check Error: ${err}` };
  }
};