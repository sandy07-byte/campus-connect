import React from "react";
import PageLayout from "../Layout/PageLayout";

export default function Vision() {
  return (
    <PageLayout
      title="Vision & Mission"
      quote="Inspiring excellence, empowering futures."
      description="Our commitment is to nurture every student's potential through quality education, values, and modern learning practices."
    >
      <div className="mv-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <article className="mv-card" style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:18}}>
          <h3>Vision</h3>
          <p>
            To inspire every learner to achieve their fullest potential through supportive teaching,
            modern facilities, and a culture of excellence.
          </p>
        </article>
        <article className="mv-card" style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:18}}>
          <h3>Mission</h3>
          <p>
            To provide inclusive, high-quality education that nurtures curiosity, character, and competence,
            empowering students to become responsible citizens and lifelong learners.
          </p>
        </article>
      </div>
    </PageLayout>
  );
}
