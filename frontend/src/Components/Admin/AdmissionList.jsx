import React, { useState, useEffect } from 'react';

function AdmissionList() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch admissions');
      }
      
      const data = await response.json();
      setAdmissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admission Applications</h2>
      <p>Total applications: {admissions.length}</p>
      
      <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
        {admissions.map((admission, index) => (
          <div key={admission._id || index} style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '16px',
            background: '#fff'
          }}>
            <h3 style={{ margin: '0 0 8px 0' }}>{admission.name}</h3>
            <p style={{ margin: '4px 0', color: '#6b7280' }}>
              <strong>Email:</strong> {admission.email}
            </p>
            <p style={{ margin: '4px 0', color: '#6b7280' }}>
              <strong>Parent Contact:</strong> {admission.parent_number}
            </p>
            <p style={{ margin: '4px 0', color: '#6b7280' }}>
              <strong>Class:</strong> {admission.class}
            </p>
            <p style={{ margin: '4px 0', color: '#6b7280' }}>
              <strong>Address:</strong> {admission.address}
            </p>
            <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>
              <strong>Submitted:</strong> {new Date(admission.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      
      {admissions.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '40px' }}>
          No admission applications found.
        </p>
      )}
    </div>
  );
}

export default AdmissionList;

