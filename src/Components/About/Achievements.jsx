import React, { useRef } from "react";
import PageLayout from "../Layout/PageLayout";
import bg1 from "../../assets/bg1.jpg";
import bg2 from "../../assets/bg2.jpg";
import bg3 from "../../assets/bg3.jpg";
import bg4 from "../../assets/bg4.jpg";

const items = [
  { img: bg1, title: "Science Olympiad", desc: "Gold medal at district.", student: "Bhavani" },
  { img: bg2, title: "Chess Championship", desc: "State runner-up.", student: "Arjun" },
  { img: bg3, title: "Essay Contest", desc: "State first prize.", student: "Priya" },
  { img: bg4, title: "Athletics 100m", desc: "District gold.", student: "Rahul" },
  { img: bg2, title: "Art Exhibit", desc: "Best exhibit award.", student: "Ayesha" },
  { img: bg3, title: "Math Quiz", desc: "Team champion.", student: "Neeraj" },
  { img: bg1, title: "Code Fest", desc: "Hackathon top 3.", student: "Ishaan" },
  { img: bg4, title: "Debate", desc: "Inter-school winner.", student: "Sanvi" },
  { img: bg3, title: "Science Fair", desc: "Innovation award.", student: "Kiran" },
];

export default function Achievements() {
  const ref = useRef(null);

  const scrollRow = (dir) => {
    if (!ref.current) return;
    const w = ref.current.clientWidth;
    ref.current.scrollBy({ left: dir === 'next' ? w : -w, behavior: 'smooth' });
  };

  return (
    <PageLayout
      title="Achievements & Rewards"
      quote="Celebrating excellence and hard work."
      description="Our students have achieved accolades across academics, sports, and co-curricular activities."
    >
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'12px 0'}}>
        <div></div>
        <div>
          <button className="btn" onClick={() => scrollRow('prev')}>&larr;</button>
          <button className="btn" onClick={() => scrollRow('next')} style={{marginLeft:8}}>&rarr;</button>
        </div>
      </div>
      <div className="card-carousel three-per" ref={ref} style={{display:'grid', gridAutoFlow:'column', gridAutoColumns:'calc((100% - 24px) / 3)', gap:12, overflowX:'auto', scrollSnapType:'x mandatory', paddingBottom:8}}>
        {items.map((a, i) => (
          <article className="ach-card" key={i} style={{scrollSnapAlign:'start', border:'1px solid #e5e7eb', background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 6px 20px rgba(0,0,0,.04)'}}>
            <img src={a.img} alt={a.title} style={{width:'100%', height:160, objectFit:'cover'}} />
            <div className="ach-body" style={{padding:12}}>
              <h4 style={{margin:'0 0 6px'}}>{a.title}</h4>
              <p style={{margin:'0 0 8px', color:'#374151'}}>{a.desc}</p>
              <div className="ach-student" style={{fontSize:13, color:'#6b7280'}}>{a.student}</div>
            </div>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}
