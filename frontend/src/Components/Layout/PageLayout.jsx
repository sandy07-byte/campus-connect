import React from "react";
import "./PageLayout.css";
import hero from "../../assets/bg1.jpg";

export default function PageLayout({ title, quote, description, rightSlot = null, children }) {
  return (
    <main className="page-layout">
      <div className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${hero})` }} />

      <div className="container header-grid">
        <div className="header-left">
          <h2>{title}</h2>
          {quote && <blockquote>{quote}</blockquote>}
          {description && <p className="desc">{description}</p>}
        </div>
        {rightSlot && <div className="header-right">{rightSlot}</div>}
      </div>

      <div className="container card-row">
        <div className="info-card">
          <div className="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 14 6 14s6-9.5 6-14c0-3.314-2.686-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" fill="#111"/></svg>
          </div>
          <div>
            <div className="label">Location</div>
            <div>ZPHS, Kolkonda, Devaruppula</div>
          </div>
        </div>
        <div className="info-card">
          <div className="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79a15.464 15.464 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V21a1 1 0 01-1 1C10.85 22 2 13.15 2 2a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" fill="#111"/></svg>
          </div>
          <div>
            <div className="label">Phone</div>
            <div>+91 98765 43210</div>
          </div>
        </div>
        <div className="info-card">
          <div className="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#111"/></svg>
          </div>
          <div>
            <div className="label">Email</div>
            <div>zphs.kolkonda@example.edu</div>
          </div>
        </div>
      </div>

      <div className="container section-body">{children}</div>

      <footer className="page-footer">
        <div className="container footer-cards">
          <div className="info-card">
            <div className="label">Location</div>
            <div>ZPHS, Kolkonda, Devaruppula</div>
          </div>
          <div className="info-card">
            <div className="label">Contact</div>
            <div>+91 98765 43210</div>
          </div>
          <div className="info-card">
            <div className="label">Email</div>
            <div>zphs.kolkonda@example.edu</div>
          </div>
        </div>
        <div className="copyright center">© {new Date().getFullYear()} ZPHS. All rights reserved.</div>
      </footer>
    </main>
  );
}
