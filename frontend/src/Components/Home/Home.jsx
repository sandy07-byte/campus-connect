import React, { useEffect, useRef, useState } from "react";
import "./Home.css";

// Placeholder images from local assets
import bg1 from "../../assets/bg1.jpg";
import bg2 from "../../assets/bg2.jpg";
import bg3 from "../../assets/bg3.jpg";
import bg4 from "../../assets/bg4.jpg";

const heroImages = [bg1, bg2, bg3, bg4];

const leaders = [
  {
    img: bg1,
    title: "Principal's Message",
    name: "S. Raghav, Principal",
    msg: "At ZPHS, we foster a culture of excellence and empathy. Our goal is to empower students with knowledge, discipline, and character.",
  },
  {
    img: bg2,
    title: "Director's Message",
    name: "M. Kavya, Director",
    msg: "Education is transformation. We ensure that every learner experiences growth through academics, arts, and athletics.",
  },
  {
    img: bg3,
    title: "Senior Staff's Message",
    name: "A. Varun, Senior Staff",
    msg: "Our staff is dedicated to creating a safe, inclusive environment where curiosity thrives and potential becomes achievement.",
  },
];

const achievements = [
  { img: bg1, desc: "District level Science Olympiad – Gold Medal", student: "Bhavani" },
  { img: bg2, desc: "State Chess Championship – Runner Up", student: "Arjun" },
  { img: bg3, desc: "Essay Writing Competition – 1st Prize", student: "Priya" },
  { img: bg4, desc: "Athletics 100m – Gold Medal", student: "Rahul" },
  { img: bg2, desc: "Art & Craft Exhibition – Best Exhibit", student: "Ayesha" },
  { img: bg3, desc: "Math Quiz – Team Champion", student: "Neeraj" },
];

const events = [
  { 
    img: bg2, 
    title: "Science Fair", 
    desc: "Showcasing innovation and creativity in STEM fields", 
    date: "Oct 15, 2025",
    type: "Academic",
    icon: "🔬"
  },
  { 
    img: bg3, 
    title: "Cultural Day", 
    desc: "Celebrate talents through music, dance, and drama", 
    date: "Nov 02, 2025",
    type: "Cultural",
    icon: "🎭"
  },
  { 
    img: bg4, 
    title: "Sports Meet", 
    desc: "Track & field competitions and team sports", 
    date: "Dec 10, 2025",
    type: "Sports",
    icon: "🏃‍♂️"
  },
  { 
    img: bg1, 
    title: "Parent-Teacher Meet", 
    desc: "Progress review and academic discussions", 
    date: "Jan 12, 2026",
    type: "Academic",
    icon: "👨‍👩‍👧‍👦"
  },
  { 
    img: bg2, 
    title: "Annual Day", 
    desc: "Awards ceremony and cultural performances", 
    date: "Feb 08, 2026",
    type: "Cultural",
    icon: "🏆"
  },
  { 
    img: bg3, 
    title: "Admissions Open", 
    desc: "New academic year enrollment begins", 
    date: "Mar 01, 2026",
    type: "Administrative",
    icon: "📝"
  },
];

const seniors = [
  {
    img: bg4,
    message:
      "ZPHS shaped my curiosity and built my confidence. Teachers encouraged exploration beyond textbooks.",
    name: "Sravani, Class of 2022",
  },
  {
    img: bg2,
    message:
      "The supportive environment helped me grow into a better leader and learner.",
    name: "Rahul, Class of 2021",
  },
  {
    img: bg1,
    message:
      "From academics to sports, I discovered my strengths and made lifelong friends.",
    name: "Ayesha, Class of 2020",
  },
];

function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [leaderIndex, setLeaderIndex] = useState(0);
  const [seniorIndex, setSeniorIndex] = useState(0);

  const achRef = useRef(null);
  const evtRef = useRef(null);

  // Hero auto-slideshow
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((p) => (p + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Leadership auto-slide
  useEffect(() => {
    const id = setInterval(() => {
      setLeaderIndex((p) => (p + 1) % leaders.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Seniors auto-slide
  useEffect(() => {
    const id = setInterval(() => {
      setSeniorIndex((p) => (p + 1) % seniors.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const scrollContainer = (ref, dir) => {
    if (!ref.current) return;
    const w = ref.current.clientWidth;
    ref.current.scrollBy({ left: dir === "next" ? w : -w, behavior: "smooth" });
  };

  return (
    <div className="home-page">
      {/* 1. Home Page (Hero) */}
      <section
        id="home"
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${heroImages[heroIndex]})`,
        }}
      >
        <div className="container hero-content">
          <div className="hero-left">
            <h1>Welcome to School</h1>
            <p className="hero-desc">
               Zilla Parishad High School (ZPHS) in our village is dedicated to
          providing quality education for students from all backgrounds. Our
          mission is to create a nurturing learning environment that supports
          academic excellence, cultural development, and personal growth.
            </p>
            <div className="hero-lists">
              <ul className="hero-list">
                <li>Experienced and caring faculty</li>
                <li>STEM labs and digital classrooms</li>
                <li>Sports, arts, and cultural programs</li>
              </ul>
              <ul className="hero-list">
                <li>Safe and inclusive campus</li>
                <li>Scholarships and support</li>
                <li>Community outreach initiatives</li>
              </ul>
            </div>
            <div className="hero-location">
              <div className="location-img" aria-label="School location image">
                {/* Simple map-like SVG placeholder */}
                <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0%" stopColor="#93c5fd" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="120" height="80" fill="url(#g)" rx="8"/>
                  <circle cx="90" cy="30" r="6" fill="#ef4444" />
                  <path d="M10 50 C30 30, 60 30, 110 50" stroke="#1f2937" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="location-info">
                <div className="addr">
                  <strong>Address:</strong> ZPHS, Kolkonda, Devaruppula, Telangana
                </div>
                <div className="email">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#374151"/>
                  </svg>
                  <span>zphs.kolkonda@example.edu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Vision & Mission */}
      <section id="vision-mission" className="vm-section">
        <div className="container vm-container">
          <div className="vm-card">
            <h3>Our Vision</h3>
            <p>
              Our vision is to transform every child in our village into a confident, responsible, and knowledgeable citizen. We aspire to create a learning space where curiosity, creativity, and critical thinking are encouraged and celebrated. ZPHS envisions an environment where every student, regardless of background, receives equal opportunity to learn and grow. We strive to develop socially conscious, compassionate individuals who will contribute positively to the nation’s progress.
            </p>
          </div>
          <div className="vm-card">
            <h3>Our Mission</h3>
            <p>
            Our mission is to provide quality education that blends academic excellence with moral and cultural values. We are committed to nurturing each student’s talents by providing personalized guidance and modern teaching practices. Through community involvement and strong faculty support, we aim to prepare students for both higher education and life challenges. We seek to instill discipline, teamwork, and a lifelong love for learning in every child who passes through our doors.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Leadership Messages */}
      <section id="leadership" className="leadership-section">
        <div className="container">
          <div className="leadership-header">
            <h2>Leadership Messages</h2>
            <div className="carousel-controls">
              <button className="btn" onClick={() => setLeaderIndex((p) => (p - 1 + leaders.length) % leaders.length)}>&larr;</button>
              <button className="btn" onClick={() => setLeaderIndex((p) => (p + 1) % leaders.length)}>&rarr;</button>
            </div>
          </div>
          <div className="leadership-viewport">
            <div className="leadership-track" style={{ transform: `translateX(-${leaderIndex * 100}%)` }}>
              {leaders.map((l, i) => (
                <article className="leader-card" key={i}>
                  <img className="leader-avatar" src={l.img} alt={l.name} />
                  <h4>{l.title}</h4>
                  <p className="leader-name">{l.name}</p>
                  <p className="leader-msg">{l.msg}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Achievements & Rewards */}
      <section id="achievements" className="ach-section">
        <div className="container">
          <div className="ach-header">
            <h2>🏆 Achievements & Rewards</h2>
            <div className="carousel-controls">
              <button className="btn" onClick={() => scrollContainer(achRef, "prev")}>&larr;</button>
              <button className="btn" onClick={() => scrollContainer(achRef, "next")}>&rarr;</button>
            </div>
          </div>
          <div className="ach-list three-per-view" ref={achRef}>
            {achievements.map((a, i) => (
              <article className="ach-card" key={i}>
                <img src={a.img} alt={a.student} />
                <div className="ach-body">
                  <p className="ach-desc">{a.desc}</p>
                  <div className="ach-student">{a.student}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Upcoming Events */}
      <section id="events" className="events-section">
        <div className="container">
          <div className="events-header">
            <h2>🎉 Upcoming Events</h2>
            <div className="carousel-controls">
              <button className="btn" onClick={() => scrollContainer(evtRef, "prev")}>&larr;</button>
              <button className="btn" onClick={() => scrollContainer(evtRef, "next")}>&rarr;</button>
            </div>
          </div>
          <div className="events-list three-per-view" ref={evtRef}>
            {events.map((e, idx) => (
              <article className="event-card" key={idx}>
                <div className="event-image-container">
                  <img src={e.img} alt={e.title} />
                  <div className="event-type-badge">{e.type}</div>
                  <div className="event-icon">{e.icon}</div>
                </div>
                <div className="event-body">
                  <h4>{e.title}</h4>
                  <p className="event-desc">{e.desc}</p>
                  <div className="event-footer">
                    <span className="event-date">📅 {e.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Senior Students’ Messages */}
      <section id="seniors" className="seniors-section">
        <div className="container">
          <div className="seniors-header">
            <h2>Senior Students’ Messages</h2>
            <div className="carousel-controls">
              <button className="btn" onClick={() => setSeniorIndex((p) => (p - 1 + seniors.length) % seniors.length)}>&larr;</button>
              <button className="btn" onClick={() => setSeniorIndex((p) => (p + 1) % seniors.length)}>&rarr;</button>
            </div>
          </div>
          <div className="seniors-viewport">
            <div className="seniors-track" style={{ transform: `translateX(-${seniorIndex * 100}%)` }}>
              {seniors.map((s, idx) => (
                <article className="senior-card" key={idx}>
                  <img src={s.img} alt={s.name} className="senior-img" />
                  <div className="senior-text">
                    <p className="quote">“{s.message}”</p>
                    <p className="senior-name">— {s.name}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="footer" id="footer">
        <div className="container footer-grid">
          <div>
            <h4>ZPHS</h4>
            <p>Building bright futures through quality education.</p>
          </div>
          <div>
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#vision-mission">Vision & Mission</a></li>
              <li><a href="#leadership">Leadership</a></li>
              <li><a href="#achievements">Achievements</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#seniors">Seniors</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul className="contact-list">
              <li>ZPHS, Kolkonda, Devaruppula</li>
              <li>Email: zphs.kolkonda@example.edu</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} ZPHS. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default Home;
