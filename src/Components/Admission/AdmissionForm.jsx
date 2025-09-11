import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdmissionForm.css';

export default function AdmissionForm() {
  const { apiFetch } = useAuth();
  const [form, setForm] = useState({ name:'', parent_number:'', email:'', class:'', address:'' });
  const [ok, setOk] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    try {
      await apiFetch('/admissions', { method:'POST', body: JSON.stringify(form) });
      setOk(true);
      setForm({ name:'', parent_number:'', email:'', class:'', address:'' });
    } catch {
      setOk(false);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-modal">
        <h2 className="auth-title">Admission Form</h2>
        <form className="auth-form" onSubmit={submit}>
          {['name','parent_number','email','class','address'].map((k) => (
            <div className="auth-field" key={k}>
              <label>{k.replace('_',' ').replace(/^\w/, c=>c.toUpperCase())}</label>
              {k !== 'address' ? (
                <input value={form[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})} required />
              ) : (
                <textarea value={form[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})} required />
              )}
            </div>
          ))}
          <button className="auth-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          {ok === true && <div style={{color:'green', marginTop:8}}>Submitted</div>}
          {ok === false && <div style={{color:'crimson', marginTop:8}}>Submission failed</div>}
        </form>
      </div>
    </div>
  );
}


