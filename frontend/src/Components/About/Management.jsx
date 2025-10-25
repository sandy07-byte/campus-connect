import React from "react";
import AboutBanner from './AboutBanner';
import './Management.css';

const committeeMembers = [
  { name: "S. Anitha", designation: "Chairperson", department: "Leadership", experience: "15+ years" },
  { name: "R. Mohan", designation: "Vice Chairperson", department: "Administration", experience: "12+ years" },
  { name: "L. Nidhi", designation: "Secretary", department: "Academic Affairs", experience: "10+ years" },
  { name: "V. Sanjay", designation: "Treasurer", department: "Finance", experience: "8+ years" },
  { name: "P. Keerthi", designation: "Member", department: "Student Affairs", experience: "6+ years" },
  { name: "A. Ramesh", designation: "Member", department: "Infrastructure", experience: "7+ years" },
  { name: "K. Teja", designation: "Member", department: "Curriculum", experience: "9+ years" },
  { name: "G. Swathi", designation: "Member", department: "Technology", experience: "5+ years" },
  { name: "T. Mahesh", designation: "Member", department: "Sports", experience: "11+ years" },
  { name: "N. Kavitha", designation: "Member", department: "Cultural Activities", experience: "8+ years" },
];

export default function Management() {
  return (
    <div className="management-page">
      <AboutBanner pageName="Management Committee" />
      
      <div className="content-container">
        <div className="management-content">
          <div className="committee-header">
            <h2>Our Leadership Team</h2>
            <p>
              Our management committee consists of passionate educators and leaders committed to student success. 
              Each member brings unique expertise and dedication to guide our school towards excellence.
            </p>
          </div>

          <div className="committee-grid">
            {committeeMembers.map((member, index) => (
              <div key={index} className="member-card">
                <div className="member-avatar">
                  <div className="avatar-circle">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <div className="member-designation">{member.designation}</div>
                  <div className="member-department">{member.department}</div>
                  <div className="member-experience">{member.experience}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="committee-stats">
            <h3>Committee Overview</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-number">10</div>
                <div className="stat-label">Committee Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-number">8+</div>
                <div className="stat-label">Average Experience</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-number">100%</div>
                <div className="stat-label">Commitment</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">5</div>
                <div className="stat-label">Departments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
