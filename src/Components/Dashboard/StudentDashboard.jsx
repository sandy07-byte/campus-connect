import React, { useEffect, useMemo, useState } from 'react';
import DashboardNavbar from '../common/DashboardNavbar';
import Sidebar from '../common/Sidebar';
import DashboardCard from '../common/DashboardCard';
import Table from '../common/Table';
import './StudentDashboard.css';
import { useAuth } from '../../context/AuthContext';

const sidebarItems = [
  { key: 'admission', label: 'Admission' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'student', label: 'Student' },
  { key: 'academic', label: 'Academic' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'elearning', label: 'Elearning' },
  { key: 'shared', label: 'Shared' },
  { key: 'reports', label: 'Reports' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses] = useState(['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science']);
  const [holidays] = useState([
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-03-14', name: 'Holi' },
    { date: '2025-08-15', name: 'Independence Day' },
  ]);
  const timetable = useMemo(() => ([
    { day: 'Mon',  p1: 'Math', p2: 'Physics', p3: 'Chem', p4: 'CS', p5: 'English' },
    { day: 'Tue',  p1: 'English', p2: 'CS', p3: 'Math', p4: 'Chem', p5: 'Physics' },
    { day: 'Wed',  p1: 'Physics', p2: 'Math', p3: 'CS', p4: 'English', p5: 'Chem' },
    { day: 'Thu',  p1: 'CS', p2: 'Chem', p3: 'English', p4: 'Physics', p5: 'Math' },
    { day: 'Fri',  p1: 'Chem', p2: 'English', p3: 'Physics', p4: 'Math', p5: 'CS' },
  ]), []);

  const ttColumns = [
    { key: 'day', header: 'Day' },
    { key: 'p1', header: '9-10' },
    { key: 'p2', header: '10-11' },
    { key: 'p3', header: '11-12' },
    { key: 'p4', header: '1-2' },
    { key: 'p5', header: '2-3' },
  ];

  const { token } = useAuth();
  const [fb, setFb] = useState({ title:'', message:'', rating:3 });
  const [fbOk, setFbOk] = useState(null);
  const submitFb = async (e) => {
    e.preventDefault();
    setFbOk(null);
    try {
      const res = await fetch('/api/feedback', { method:'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(fb) });
      if (!res.ok) throw new Error('Failed');
      setFb({ title:'', message:'', rating:3 });
      setFbOk(true);
    } catch { setFbOk(false); }
  };

  return (
    <div className="cc-layout">
      <DashboardNavbar />
      <div className="cc-main">
        <Sidebar items={sidebarItems} />
        <div className="cc-content">
          <div className="cc-grid">
            <DashboardCard title="Attendance" subtitle="View" />
            <DashboardCard title="Mid Marks" subtitle="Latest" />
            <DashboardCard title="Results" subtitle="Overall" />
            <DashboardCard title="Mentoring" subtitle="Notes" />
          </div>

          <div className="cc-section">
            <h3>My Courses</h3>
            <div className="cc-chips">
              {courses.map((c) => (
                <span key={c} className="cc-chip">{c}</span>
              ))}
            </div>
          </div>

          <div className="cc-two-cols">
            <div className="cc-section">
              <h3>Holidays</h3>
              <ul className="cc-list">
                {holidays.map(h => (
                  <li key={h.date}><span>{h.name}</span><span>{h.date}</span></li>
                ))}
              </ul>
            </div>
            <div className="cc-section">
              <h3>Timetable</h3>
              <Table columns={ttColumns} data={timetable} />
            </div>
          </div>

          <div className="cc-section">
            <h3>Feedback</h3>
            <form onSubmit={submitFb} className="auth-form" style={{maxWidth:640}}>
              <div className="auth-field">
                <label>Title</label>
                <input value={fb.title} onChange={(e)=>setFb({...fb, title:e.target.value})} required />
              </div>
              <div className="auth-field">
                <label>Message</label>
                <textarea value={fb.message} onChange={(e)=>setFb({...fb, message:e.target.value})} required />
              </div>
              <div className="auth-field">
                <label>Rating (1-5)</label>
                <input type="number" min={1} max={5} value={fb.rating} onChange={(e)=>setFb({...fb, rating:Number(e.target.value)})} />
              </div>
              <button className="auth-primary">Submit Feedback</button>
              {fbOk === true && <div style={{color:'green', marginTop:8}}>Sent</div>}
              {fbOk === false && <div style={{color:'crimson', marginTop:8}}>Failed</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


