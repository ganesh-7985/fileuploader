import React, { useState, useRef } from 'react';
import axios from 'axios';

const AuthFileUpload = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fileInputRef = useRef(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const res = await axios.post(`https://fileuploader-82dq.onrender.com/api/auth/${endpoint}`, { email, password });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      alert(`Successfully ${isLogin ? 'logged in' : 'registered'}!`);
    } catch (error) {
      console.error(`Error ${isLogin ? 'logging in' : 'registering'} user:`, error);
      alert(`Failed to ${isLogin ? 'log in' : 'register'}. Please try again.`);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileType(selectedFile.type);

    if (selectedFile.type.startsWith('image/')) {
      const imagePreview = URL.createObjectURL(selectedFile);
      setPreview(imagePreview);
    } else if (selectedFile.type.startsWith('video/')) {
      const videoPreview = URL.createObjectURL(selectedFile);
      setPreview(videoPreview);
    } else if (selectedFile.type === 'application/pdf') {
      const pdfPreview = URL.createObjectURL(selectedFile);
      setPreview(pdfPreview);
    } else {
      setPreview(null);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://fileuploader-82dq.onrender.com/api/files/upload', formData);
      setUploadedFile(res.data);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setFile(null);
    setPreview(null);
    setUploadedFile(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderPreview = () => {
    if (!preview) return null;

    if (fileType.startsWith('image/')) {
      return <img src={preview} alt="Preview" className="mt-4 mx-auto max-w-full h-auto rounded-lg shadow-md" />;
    } else if (fileType.startsWith('video/')) {
      return (
        <video controls className="mt-4 mx-auto max-w-full rounded-lg shadow-md">
          <source src={preview} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <embed
          src={preview}
          type="application/pdf"
          className="mt-4 mx-auto w-full h-[500px] rounded-lg shadow-md"
        />
      );
    }
    return null;
  };

  const renderAuthForm = () => (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form className="space-y-6" onSubmit={handleAuth}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLogin ? 'Sign in' : 'Register'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or {isLogin ? 'register' : 'login'}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50"
          >
            {isLogin ? 'Create new account' : 'Sign in to existing account'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderFileUploadForm = () => (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">File Upload</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      <form className="space-y-6" onSubmit={handleFileUpload}>
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
            File upload
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept="image/*,video/*,application/pdf"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, PDF up to 10MB</p>
            </div>
          </div>
        </div>
        {renderPreview()}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload
          </button>
        </div>
      </form>
      {uploadedFile && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <p className="text-green-700">File uploaded successfully: {uploadedFile.filePath}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isAuthenticated ? 'File Upload' : (isLogin ? 'Sign in to your account' : 'Create a new account')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {isAuthenticated ? renderFileUploadForm() : renderAuthForm()}
      </div>
    </div>
  );
};

export default AuthFileUpload;