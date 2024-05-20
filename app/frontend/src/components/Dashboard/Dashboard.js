import React, { useState, useEffect } from 'react';
import FileUpload from '../FileUpload/FileUpload';
import FileList from '../FileUpload/FileList';

function Dashboard() {
  const [files, setFiles] = useState([]);
  const userId = 1; // Replace with actual user ID from authentication

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/file/files/${userId}`);
        const result = await response.json();
        if (result.success) {
          setFiles(result.files);
        } else {
          alert(result.message);
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    };
    fetchFiles();
  }, [userId]);

  const handleFileUpload = (file) => {
    setFiles([...files, file]);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <FileUpload onFileUpload={handleFileUpload} userId={userId} />
      <FileList files={files} />
    </div>
  );
}

export default Dashboard;
