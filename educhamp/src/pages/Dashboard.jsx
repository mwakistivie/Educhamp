import React, { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard({ user }) {
  const { getToken } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/results/parent/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(response.data);
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupByStudent = () => {
    const grouped = {};
    results.forEach(result => {
      const studentName = result.student?.name || 'Unknown';
      if (!grouped[studentName]) grouped[studentName] = [];
      grouped[studentName].push(result);
    });
    return grouped;
  };

  if (loading) return <div className="loading">Loading results...</div>;

  const groupedResults = groupByStudent();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.firstName}</h1>
        <div className="user-info">
          <span>{user?.emailAddresses?.[0]?.emailAddress}</span>
          <UserButton />
        </div>
      </header>

      <main className="dashboard-content">
        {Object.keys(groupedResults).length === 0 ? (
          <p className="no-results">No results available yet</p>
        ) : (
          Object.entries(groupedResults).map(([studentName, studentResults]) => (
            <div key={studentName} className="student-card">
              <h2>{studentName}</h2>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Exam Type</th>
                  </tr>
                </thead>
                <tbody>
                  {studentResults.map((result) => (
                    <tr key={result._id}>
                      <td>{result.subject}</td>
                      <td>{result.score}/{result.maxScore}</td>
                      <td>{result.percentage.toFixed(1)}%</td>
                      <td className={`grade-${result.grade}`}>{result.grade}</td>
                      <td>{result.examType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
