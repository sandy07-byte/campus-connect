import React, { useEffect, useState } from 'react';
import DashboardNavbar from '../common/DashboardNavbar';
import Sidebar from '../common/Sidebar';
import DashboardCard from '../common/DashboardCard';
import Table from '../common/Table';
import '../Dashboard/StudentDashboard.css';
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

export default function TeacherDashboard() {
  const { apiFetch } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    (async () => {
      try { setFeedback(await apiFetch('/feedback')); } catch {}
      try { setAdmissions(await apiFetch('/admissions')); } catch {}
    })();
  }, [apiFetch]);

  return (
    <div className="cc-layout">
      <DashboardNavbar />
      <div className="cc-main">
        <Sidebar items={sidebarItems} />
        <div className="cc-content">
          <div className="cc-grid">
            <DashboardCard title="Admissions" subtitle={`${admissions.length} applicants`} />
            <DashboardCard title="Feedback" subtitle={`${feedback.length} messages`} />
            <DashboardCard title="Performance" subtitle="Recent results" />
            <DashboardCard title="Notices" subtitle="2 new" />
          </div>

          <div className="cc-two-cols">
            <div className="cc-section">
              <h3>Recent Admissions</h3>
              <Table columns={[
                { key:'name', header:'Name' },
                { key:'class', header:'Class' },
                { key:'parent_number', header:'Parent Number' },
              ]} data={admissions.slice(0,8)} />
            </div>
            <div className="cc-section">
              <h3>Student Feedback</h3>
              <Table columns={[
                { key:'student_name', header:'Student' },
                { key:'title', header:'Title' },
                { key:'rating', header:'Rating' },
              ]} data={feedback.slice(0,8)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


