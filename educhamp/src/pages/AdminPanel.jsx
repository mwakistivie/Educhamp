import React, { useState } from 'react';
import { useAuth, UserButton } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function AdminPanel({ user }) {
  const { getToken } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/results/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUploadStatus(`Success: ${response.data.successCount} results uploaded`);
      setFile(null);
      
      if (response.data.errors.length > 0) {
        console.log('Errors:', response.data.errors);
      }
    } catch (err) {
      setUploadStatus(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="dashboard-header">
        <h1>Admin Panel - {user?.firstName}</h1>
        <UserButton />
      </header>

      <main className="admin-content">
        <section className="upload-section">
          <h2>Upload Student Results</h2>
          <p className="info-text">
            Upload an Excel file with columns: studentId, subject, score, maxScore, examType
          </p>

          <form onSubmit={handleUpload} className="upload-form">
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <span className="file-name">
                {file ? file.name : 'Choose Excel file...'}
              </span>
            </div>

            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Results'}
            </button>
          </form>

          {uploadStatus && (
            <div className={`status-message ${uploadStatus.includes('Success') ? 'success' : 'error'}`}>
              {uploadStatus}
            </div>
          )}
        </section>

        <section className="template-section">
          <h3>Excel Template Format</h3>
          <table className="template-table">
            <thead>
              <tr>
                <th>studentId</th>
                <th>subject</th>
                <th>score</th>
                <th>maxScore</th>
                <th>examType</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>STU001</td>
                <td>Mathematics</td>
                <td>85</td>
                <td>100</td>
                <td>Mid-term</td>
              </tr>
              <tr>
                <td>STU002</td>
                <td>English</td>
                <td>92</td>
                <td>100</td>
                <td>Mid-term</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
