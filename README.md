# SDIT Share

## About

SDIT Share is a simple and secure platform for students and faculty of Shree Devi Institute of Technology to upload and share files. I created this project to solve the problem of easily sharing files within the college community. The application is built with Next.js, TypeScript, and Appwrite for the backend, providing a seamless and efficient file-sharing experience.

## Features

  * **File Upload:** Easily upload files up to 50MB.
  * **Custom File Names:** Assign custom names to your uploaded files for better organization.
  * **View and Download:** Browse a list of all uploaded files and download them with a single click.
  * **Secure Deletion:** Password-protected deletion to prevent unauthorized removal of files.
  * **Toast Notifications:** User-friendly notifications for successful uploads, warnings, and errors.

## Technologies Used

  * **Frontend:**
      * Next.js
      * React
      * TypeScript
      * Tailwind CSS
  * **Backend:**
      * Appwrite (for file storage and database)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js and npm (or yarn/pnpm/bun) installed.
  * An Appwrite instance set up.

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/adithya-b-r/sdit-share.git
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Appwrite configuration details:
    ```env
    NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
    NEXT_PUBLIC_APPWRITE_STORAGE_ID=your_storage_id
    NEXT_PUBLIC_APPWRITE_UPLOADED_FILES_COLLECTION_ID=your_collection_id
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
