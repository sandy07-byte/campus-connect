import React, { useState } from 'react';
import './ContactUs.css';

const userTypes = [
  'Parent',
  'Student', 
  'Teacher',
  'Visitor',
  'Other'
];

export default function ContactUs() {
  const [form, setForm] = useState({
    fullName: '',
    userType: '',
    phoneNumber: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSuccess(true);
      setForm({ fullName: '', userType: '', phoneNumber: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  if (success) {
    return (
      <div className="contact-page">
        <div className="contact-container">
          <div className="success-message">
            <h2>✅ Message Sent Successfully!</h2>
            <p>Thank you for contacting Delhi Public School Hyderabad. We'll get back to you soon.</p>
            <button onClick={() => setSuccess(false)} className="btn-primary">
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Get in touch with Delhi Public School Hyderabad</p>
        </div>
        
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({...form, fullName: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="userType">You are a... *</label>
                <select
                  id="userType"
                  value={form.userType}
                  onChange={(e) => setForm({...form, userType: e.target.value})}
                  required
                >
                  <option value="">Select your role</option>
                  {userTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({...form, phoneNumber: e.target.value})}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email ID *</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Enter your Message *</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  placeholder="Type your message here..."
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-text">
                  <strong>Address:</strong><br />
                  Survey No 74, Khajaguda Village,<br />
                  Chitrapuri Colony Post,<br />
                  Hyderabad, Telangana – 500104
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-text">
                  <strong>Phone:</strong><br />
                  040 2980 6765 /66
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-text">
                  <strong>Office email:</strong><br />
                  info@dpshyderabad.com
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🎓</div>
                <div className="contact-text">
                  <strong>Admissions:</strong><br />
                  admissions@dpshyderabad.com
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🚌</div>
                <div className="contact-text">
                  <strong>Transport:</strong><br />
                  transport@dpshyderabad.com
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">💼</div>
                <div className="contact-text">
                  <strong>Recruitment:</strong><br />
                  recruit@dpshyderabad.com
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🌐</div>
                <div className="contact-text">
                  <strong>Website:</strong><br />
                  www.dpshyderabad.in
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="map-section">
              <h3>Find Us</h3>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.123456789!2d78.456789!3d17.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDA3JzI0LjQiTiA3OMKwMjcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Delhi Public School Hyderabad Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
