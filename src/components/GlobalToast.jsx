"use client";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

export default function GlobalToast() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-center"
      theme={theme === 'dark' ? 'dark' : 'light'}
      autoClose={3000}
      hideProgressBar
      style={{ zIndex: 99999 }}
    />
  );
}
