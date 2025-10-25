import React from 'react'
import AboutBanner from './AboutBanner'
import bg2 from "../../assets/bg2.jpg"
import './Message.css'

function Message() {
  return (
    <div className="message-page">
      <AboutBanner pageName="Director's Message" />
      
      <div className="content-container">
        <div className="message-content">
          <div className="message-layout">
            <div className="message-text">
              <h2>From the Director's Desk</h2>
              <blockquote className="director-quote">
                "Education is transformation, and every child deserves the best."
              </blockquote>
              <p>
                We are committed to creating opportunities that encourage curiosity, collaboration, and excellence. 
                Through inclusive practices and modern pedagogy, we ensure that every learner progresses with 
                confidence and compassion.
              </p>
              <p>
                Our focus is to build a nurturing environment where students are inspired to learn, lead, and 
                serve with integrity. At Delhi Public School Hyderabad, we believe that education goes beyond 
                textbooks and classrooms - it's about shaping character, building confidence, and preparing 
                students for the challenges of tomorrow.
              </p>
              <div className="signature">
                <div className="signature-name">Dr. Rajesh Kumar</div>
                <div className="signature-title">Director, Delhi Public School Hyderabad</div>
              </div>
            </div>
            
            <div className="message-image">
              <img src={bg2} alt="Director" />
              <div className="image-overlay">
                <div className="overlay-text">
                  <h3>Dr. Rajesh Kumar</h3>
                  <p>Director & Secretary</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="vision-statement">
            <h3>Our Vision Statement</h3>
            <div className="vision-grid">
              <div className="vision-item">
                <div className="vision-icon">🎯</div>
                <h4>Excellence</h4>
                <p>Striving for the highest standards in education and character development</p>
              </div>
              <div className="vision-item">
                <div className="vision-icon">🤝</div>
                <h4>Inclusivity</h4>
                <p>Creating an environment where every student feels valued and supported</p>
              </div>
              <div className="vision-item">
                <div className="vision-icon">🌟</div>
                <h4>Innovation</h4>
                <p>Embracing modern teaching methods and technology for better learning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message