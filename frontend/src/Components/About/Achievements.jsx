import React, { useRef } from "react";
import AboutBanner from './AboutBanner';
import bg1 from "../../assets/bg1.jpg";
import bg2 from "../../assets/bg2.jpg";
import bg3 from "../../assets/bg3.jpg";
import bg4 from "../../assets/bg4.jpg";
import './Achievements.css';

const items = [
  { img: bg1, title: "Science Olympiad", desc: "Gold medal at district level", student: "Bhavani", year: "2024" },
  { img: bg2, title: "Chess Championship", desc: "State runner-up position", student: "Arjun", year: "2024" },
  { img: bg3, title: "Essay Contest", desc: "State first prize winner", student: "Priya", year: "2024" },
  { img: bg4, title: "Athletics 100m", desc: "District gold medalist", student: "Rahul", year: "2024" },
  { img: bg2, title: "Art Exhibit", desc: "Best exhibit award", student: "Ayesha", year: "2023" },
  { img: bg3, title: "Math Quiz", desc: "Team champion", student: "Neeraj", year: "2023" },
  { img: bg1, title: "Code Fest", desc: "Hackathon top 3", student: "Ishaan", year: "2023" },
  { img: bg4, title: "Debate", desc: "Inter-school winner", student: "Sanvi", year: "2023" },
  { img: bg3, title: "Science Fair", desc: "Innovation award", student: "Kiran", year: "2022" },
];

export default function Achievements() {
  const ref = useRef(null);

  const scrollRow = (dir) => {
    if (!ref.current) return;
    const w = ref.current.clientWidth;
    ref.current.scrollBy({ left: dir === 'next' ? w : -w, behavior: 'smooth' });
  };

  return (
    <div className="achievements-page">
      <AboutBanner pageName="Achievements & Rewards" />
      
      <div className="content-container">
        <div className="achievements-content">
          <div className="achievements-header">
            <h2>Celebrating Excellence</h2>
            <p>
              Our students have achieved remarkable accolades across academics, sports, and co-curricular activities. 
              These achievements reflect our commitment to nurturing talent and fostering excellence.
            </p>
          </div>

          <div className="carousel-controls">
            <button className="carousel-btn" onClick={() => scrollRow('prev')}>
              ← Previous
            </button>
            <button className="carousel-btn" onClick={() => scrollRow('next')}>
              Next →
            </button>
          </div>

          <div className="achievements-carousel" ref={ref}>
            {items.map((a, i) => (
              <article className="achievement-card" key={i}>
                <div className="card-image">
                  <img src={a.img} alt={a.title} />
                  <div className="year-badge">{a.year}</div>
                </div>
                <div className="card-content">
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                  <div className="student-name">🏆 {a.student}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="stats-section">
            <h3>Our Achievement Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Awards Won</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25+</div>
                <div className="stat-label">Competitions</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Years Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
