import React from 'react'
import AboutBanner from './AboutBanner'
import './History.css'

function History() {
  return (
    <div className="history-page">
      <AboutBanner pageName="History" />
      
      <div className="content-container">
        <div className="history-content">
          <h2>Our Journey Through Time</h2>
          <p>
            Delhi Public School Hyderabad has been a beacon of educational excellence since its establishment. 
            Our rich history is built on the foundation of providing quality education that shapes young minds 
            and prepares them for the challenges of tomorrow.
          </p>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">1995</div>
              <div className="timeline-content">
                <h3>Foundation</h3>
                <p>Delhi Public School Hyderabad was established with a vision to provide world-class education.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-year">2000</div>
              <div className="timeline-content">
                <h3>Expansion</h3>
                <p>Added new facilities and expanded our curriculum to include more subjects and activities.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-year">2010</div>
              <div className="timeline-content">
                <h3>Digital Transformation</h3>
                <p>Introduced modern technology and digital learning methods to enhance education.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <div className="timeline-content">
                <h3>Excellence Recognition</h3>
                <p>Achieved recognition as one of the top educational institutions in Hyderabad.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default History