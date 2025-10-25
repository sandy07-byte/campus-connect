import React, { useRef } from "react";
import "./School.css";

import hero from "../../assets/bg1.jpg";
import bg1 from "../../assets/bg1.jpg";
import bg2 from "../../assets/bg2.jpg";
import bg3 from "../../assets/bg3.jpg";
import bg4 from "../../assets/bg4.jpg";

const achievements = [
  { img: bg1, title: "Science Olympiad", desc: "Gold medal at district level.", student: "Bhavani" },
  { img: bg2, title: "Chess Championship", desc: "State runner-up in chess.", student: "Arjun" },
  { img: bg3, title: "Essay Contest", desc: "Won first prize at state.", student: "Priya" },
  { img: bg4, title: "Athletics 100m", desc: "Gold in district meet.", student: "Rahul" },
  { img: bg2, title: "Art Exhibit", desc: "Best exhibit award.", student: "Ayesha" },
  { img: bg3, title: "Math Quiz", desc: "Team champion.", student: "Neeraj" },
  { img: bg1, title: "Code Fest", desc: "Hackathon top 3.", student: "Ishaan" },
  { img: bg4, title: "Debate", desc: "Inter-school winner.", student: "Sanvi" },
  { img: bg3, title: "Science Fair", desc: "Innovation award.", student: "Kiran" },
];

const committee = [
  { name: "S. Anitha", desig: "Chairperson" },
  { name: "R. Mohan", desig: "Vice Chairperson" },
  { name: "L. Nidhi", desig: "Secretary" },
  { name: "V. Sanjay", desig: "Treasurer" },
  { name: "P. Keerthi", desig: "Member" },
  { name: "A. Ramesh", desig: "Member" },
  { name: "K. Teja", desig: "Member" },
  { name: "G. Swathi", desig: "Member" },
  { name: "T. Mahesh", desig: "Member" },
  { name: "N. Kavitha", desig: "Member" },
];

export default function School() {
  const achRef = useRef(null);

  const scrollRow = (ref, dir) => {
    if (!ref.current) return;
    const w = ref.current.clientWidth;
    ref.current.scrollBy({ left: dir === "next" ? w : -w, behavior: "smooth" });
  };

  return (
    <main className="school-page">
      {/* 2. Our School Section */}
      <section id="our-school" className="section">
        <div className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${hero})` }} />
        <div className="container our-grid">
          <div className="our-left">
            <h2>ZPHS, Kolkonda</h2>
            <blockquote>Education for all, excellence for each.</blockquote>
            <p>
              Zilla Parishad High School (ZPHS) serves our community with quality
              education, values, and opportunities across academics, sports, and culture.
              We strive to build confident, compassionate, and capable citizens.
            </p>
          </div>
          <div className="our-right" />
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
        <div className="container local-footer">
          <div className="copyright">© {new Date().getFullYear()} ZPHS. All rights reserved.</div>
          <div className="card-row small">
            <div className="info-card"><div className="label">Location</div><div>ZPHS, Kolkonda, Devaruppula</div></div>
            <div className="info-card"><div className="label">Contact</div><div>+91 98765 43210</div></div>
            <div className="info-card"><div className="label">Email</div><div>zphs.kolkonda@example.edu</div></div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section id="mission-vision" className="section">
        <div className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${hero})` }} />
        <div className="container mv-grid">
          <article className="mv-card">
            <h3>Mission</h3>
            <p>
              To provide inclusive, high-quality education that nurtures curiosity,
              character, and competence, empowering students to become responsible
              citizens and lifelong learners.
            </p>
          </article>
          <article className="mv-card">
            <h3>Vision</h3>
            <p>
              To inspire every learner to achieve their fullest potential through
              supportive teaching, modern facilities, and a culture of excellence.
            </p>
          </article>
        </div>
      </section>

      {/* 4. Achievements */}
      <section id="achievements" className="section">
        <div className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${hero})` }} />
        <div className="container">
          <div className="section-header">
            <h2>Achievements</h2>
            <div className="controls">
              <button className="btn" onClick={() => scrollRow(achRef, "prev")}>&larr;</button>
              <button className="btn" onClick={() => scrollRow(achRef, "next")}>&rarr;</button>
            </div>
          </div>
          <div className="card-carousel three-per" ref={achRef}>
            {achievements.map((a, i) => (
              <article className="ach-card" key={i}>
                <img src={a.img} alt={a.title} />
                <div className="ach-body">
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                  <div className="ach-student">{a.student}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Secretary / Director Message */}
      <section id="director-message" className="section">
        <div className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${hero})` }} />
        <div className="container dir-grid">
          <div className="dir-left">
            <h2>Secretary / Director Message</h2>
            <p>
              Our commitment is to foster an environment where every child feels valued, challenged,
              and supported. We believe in holistic education that balances academics with arts,
              sports, and character development.
            </p>
          </div>
          <div className="dir-right">
            <img className="dir-photo" src={bg2} alt="Director" />
          </div>
        </div>
      </section>

      {/* 6. Management Committee */}
      <section id="management" className="section">
        <div className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${hero})` }} />
        <div className="container">
          <h2>Management Committee</h2>
          <div className="table-wrap">
            <table className="committee">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                {committee.map((c, i) => (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{c.desig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Footer Section */}
      <footer id="footer" className="page-footer">
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
