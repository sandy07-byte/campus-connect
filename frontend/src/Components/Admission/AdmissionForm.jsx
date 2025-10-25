import React, { useState } from 'react';
import './AdmissionForm.css';

export default function AdmissionForm() {
  const [form, setForm] = useState({ 
    name: '', 
    parent_number: '', 
    email: '', 
    class: '', 
    address: '' 
  });
  const [ok, setOk] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setErrMsg('');
    try {
      const response = await fetch('http://localhost:4000/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
      
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Failed to submit application (${response.status})`);
      }
      
      setOk(true);
      setForm({ name: '', parent_number: '', email: '', class: '', address: '' });
    } catch (error) {
      console.error('Submission error:', error);
      setErrMsg(error.message);
      setOk(false);
    } finally { 
      setLoading(false); 
    }
  };

  const fieldConfig = [
    { key: 'name', label: 'Student Full Name', type: 'text', placeholder: 'Enter student\'s full name' },
    { key: 'parent_number', label: 'Parent/Guardian Contact Number', type: 'tel', placeholder: 'Enter parent\'s phone number' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email address' },
    { key: 'class', label: 'Class Applying For', type: 'text', placeholder: 'e.g., Grade 1, Grade 2, etc.' },
    { key: 'address', label: 'Residential Address', type: 'textarea', placeholder: 'Enter complete residential address' }
  ];

  return (
    <div className="admission-page">
      <div className="admission-container">
        <div className="admission-header">
          <h1 className="admission-title">Admission Application</h1>
          <p className="admission-subtitle">Join Delhi Public School Hyderabad - Excellence in Education</p>
        </div>
        
        <div className="admission-form-container">
          <form className="admission-form" onSubmit={submit}>
            <div className="form-section">
              <h3 className="section-title">Student Information</h3>
              <div className="form-grid">
                {fieldConfig.map((field) => (
                  <div className={`form-field ${field.key === 'address' ? 'full-width' : ''}`} key={field.key}>
                    <label className="field-label">
                      {field.label}
                      <span className="required">*</span>
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="form-textarea"
                        value={form[field.key]}
                        onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                        placeholder={field.placeholder}
                        required
                        rows={4}
                      />
                    ) : (
                      <input
                        className="form-input"
                        type={field.type}
                        value={form[field.key]}
                        onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                        placeholder={field.placeholder}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button 
                className={`submit-btn ${loading ? 'loading' : ''}`} 
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">📝</span>
                    Submit Application
                  </>
                )}
              </button>
            </div>

            {ok === true && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <div>
                  <h4>Application Submitted Successfully!</h4>
                  <p>Thank you for your interest. We will contact you soon regarding the admission process.</p>
                </div>
              </div>
            )}
            
            {ok === false && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                <div>
                  <h4>Submission Failed</h4>
                  <p>{errMsg || 'Please try again or contact our admissions office for assistance.'}</p>
                </div>
              </div>
            )}
          </form>

          <div className="admission-info">
            <h3>Admission Process</h3>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Submit Application</h4>
                  <p>Fill out the admission form with accurate information</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Document Verification</h4>
                  <p>Submit required documents for verification</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Assessment & Interview</h4>
                  <p>Student assessment and parent interview</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Admission Confirmation</h4>
                  <p>Receive admission confirmation and fee details</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


