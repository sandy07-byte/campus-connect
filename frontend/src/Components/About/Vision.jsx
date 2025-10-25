import React from "react";
import AboutBanner from './AboutBanner';
import './Vision.css';

export default function Vision() {
  return (
    <div className="vision-page">
      <AboutBanner pageName="Vision & Mission" />
      
      <div className="content-container">
        <div className="vision-content">
          <div className="mv-grid">
            <article className="mv-card vision-card">
              <div className="card-icon">🎯</div>
              <h3>Our Vision</h3>
              <p>
                To inspire every learner to achieve their fullest potential through supportive teaching,
                modern facilities, and a culture of excellence. We envision a future where every student
                becomes a confident, capable, and compassionate individual ready to contribute to society.
              </p>
            </article>
            
            <article className="mv-card mission-card">
              <div className="card-icon">🚀</div>
              <h3>Our Mission</h3>
              <p>
                To provide inclusive, high-quality education that nurtures curiosity, character, and competence,
                empowering students to become responsible citizens and lifelong learners. We are committed
                to creating an environment where learning thrives and dreams take flight.
              </p>
            </article>
          </div>
          
          <div className="values-section">
            <h2>Our Core Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon">💡</div>
                <h4>Excellence</h4>
                <p>Striving for the highest standards in everything we do</p>
              </div>
              <div className="value-item">
                <div className="value-icon">🤝</div>
                <h4>Integrity</h4>
                <p>Maintaining honesty and strong moral principles</p>
              </div>
              <div className="value-item">
                <div className="value-icon">🌟</div>
                <h4>Innovation</h4>
                <p>Embracing new ideas and creative solutions</p>
              </div>
              <div className="value-item">
                <div className="value-icon">❤️</div>
                <h4>Compassion</h4>
                <p>Caring for others and showing empathy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
