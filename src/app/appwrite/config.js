import { Client, Databases, Storage, ID, Query } from "appwrite";

export const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID,
  uploadedFilesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_UPLOADED_FILES_COLLECTION_ID,
};

// Polyfill localStorage for SSR/Node environment
if (typeof window === 'undefined') {
  if (!global.localStorage || typeof global.localStorage.getItem !== 'function') {
    global.localStorage = {
      getItem: (key) => null,
      setItem: (key, value) => { },
      removeItem: (key) => { },
      clear: () => { },
      length: 0,
      key: (index) => null,
    };
  }
}

// Helper to get Appwrite client instance securely
const getClient = () => {
  const client = new Client();

  client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

  return client;
};

// Initialize services lazily
const getDatabases = () => new Databases(getClient());
const getStorage = () => new Storage(getClient());

export const uploadFile = async (file, fileName) => {
  try {
    const databases = getDatabases();
    const storage = getStorage();

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
    const databases = getDatabases();
    const response = await databases.listDocuments(
      config.databaseId,
      config.uploadedFilesCollectionId
    );

    // console.log(response);
    return { success: true, data: response.documents };
  } catch (err) {
    return { success: false, error: `File Fetch Error: ${err}` };
  }
};

export const deleteFile = async (documentId, fileId) => {
  try {
    const storage = getStorage();
    const databases = getDatabases();

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

export const checkFileNameExists = async (fileName) => {
  try {
    const databases = getDatabases();
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
